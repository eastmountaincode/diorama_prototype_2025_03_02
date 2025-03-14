import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { joystickInputAtom } from '../atoms/gameState';

/** 📌 Joystick Config */
const MAX_JOYSTICK_DISTANCE = 35;
const JOYSTICK_SIZE = 120;
const NUB_SIZE = 50;
const UPDATE_INTERVAL = 16; // ~60 FPS updates

const Joystick: React.FC = () => {
    /** 🔹 Joystick Position & Movement */
    const [, setJoystickInput] = useAtom(joystickInputAtom);
    const [nubOffset, setNubOffset] = useState({ x: 0, y: 0 });

    /** 🔹 Track joystick base position */
    const joystickRef = useRef<HTMLDivElement>(null);
    const [joystickBasePos, setJoystickBasePos] = useState({ x: 0, y: 0 });

    /** 🔹 State to manage active joystick movement */
    const isDragging = useRef(false);
    const moveInterval = useRef<number | null>(null);
    const lastInput = useRef({ x: 0, y: 0 });
    const inputToggle = useRef(false); // Used to force state updates

    /** 📌 Calculate joystick position on mount and resize */
    useEffect(() => {
        const updateJoystickPosition = () => {
            if (joystickRef.current) {
                const rect = joystickRef.current.getBoundingClientRect();
                setJoystickBasePos({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            }
            resetJoystick();
        };

        // Initial position
        updateJoystickPosition();
        
        // Update on resize
        window.addEventListener('resize', updateJoystickPosition);
        return () => window.removeEventListener('resize', updateJoystickPosition);
    }, []);

    /** 🔄 Continuously updates movement while joystick is held */
    const updateMovement = useCallback(() => {
        if (lastInput.current.x !== 0 || lastInput.current.y !== 0) {
            inputToggle.current = !inputToggle.current;
            setJoystickInput({
                x: lastInput.current.x + (inputToggle.current ? 0.001 : -0.001),
                y: lastInput.current.y,
            });
        }
    }, [setJoystickInput]);

    /** 🟢 Start tracking joystick movement */
    const startJoystick = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        if (moveInterval.current) clearInterval(moveInterval.current);
        moveInterval.current = window.setInterval(updateMovement, UPDATE_INTERVAL);
    };

    /** 🔄 Update joystick position based on user input */
    const moveJoystick = useCallback((e: TouchEvent | MouseEvent) => {
        if (!isDragging.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        let dx = clientX - joystickBasePos.x;
        let dy = clientY - joystickBasePos.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        if (distance > MAX_JOYSTICK_DISTANCE) {
            const angle = Math.atan2(dy, dx);
            dx = Math.cos(angle) * MAX_JOYSTICK_DISTANCE;
            dy = Math.sin(angle) * MAX_JOYSTICK_DISTANCE;
        }

        setNubOffset({ x: dx, y: dy });
        lastInput.current = { x: dx, y: dy };
    }, [joystickBasePos]);

    /** 🛑 Stop joystick movement */
    const stopJoystick = useCallback(() => {
        isDragging.current = false;
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
        resetJoystick();
    }, []);

    /** 🔄 Reset joystick to neutral position */
    const resetJoystick = () => {
        setNubOffset({ x: 0, y: 0 });
        setJoystickInput({ x: 0, y: 0 });
        lastInput.current = { x: 0, y: 0 };
    };

    /** 📌 Register global event listeners */
    useEffect(() => {
        window.addEventListener('mousemove', moveJoystick);
        window.addEventListener('mouseup', stopJoystick);
        window.addEventListener('touchmove', moveJoystick);
        window.addEventListener('touchend', stopJoystick);

        return () => {
            window.removeEventListener('mousemove', moveJoystick);
            window.removeEventListener('mouseup', stopJoystick);
            window.removeEventListener('touchmove', moveJoystick);
            window.removeEventListener('touchend', stopJoystick);
        };
    }, [moveJoystick, stopJoystick]);

    return (
        <div className="select-none relative" style={{ width: `${JOYSTICK_SIZE}px`, height: `${JOYSTICK_SIZE}px` }} ref={joystickRef}>
            {/* 🟢 Joystick Base */}
            <div
                className="absolute bg-gray-700 opacity-50 rounded-full"
                style={{
                    width: `${JOYSTICK_SIZE}px`,
                    height: `${JOYSTICK_SIZE}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* 🔵 Joystick Nub */}
            <div
                className="absolute bg-gray-900 rounded-full shadow-lg transition-transform duration-75 ease-out"
                style={{
                    width: `${NUB_SIZE}px`,
                    height: `${NUB_SIZE}px`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${nubOffset.x}px), calc(-50% + ${nubOffset.y}px))`,
                }}
            />

            {/* 🛑 Joystick Touch Area */}
            <div
                className="absolute inset-0 bg-transparent"
                onMouseDown={startJoystick}
                onTouchStart={startJoystick}
                style={{ pointerEvents: 'all' }}
            />
        </div>
    );
};

export default Joystick;
