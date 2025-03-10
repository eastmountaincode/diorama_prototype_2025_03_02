import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { joystickInputAtom } from '../atoms/gameState';

const MAX_JOYSTICK_DISTANCE = 35;
const JOYSTICK_SIZE = 120;
const NUB_SIZE = 50;
const JOYSTICK_RIGHT_MARGIN = -40;
const JOYSTICK_BOTTOM_MARGIN = -5;
const UPDATE_INTERVAL = 16; // ~60 FPS

const Joystick: React.FC = () => {
    const [, setJoystickInput] = useAtom(joystickInputAtom);

    const [joystickBasePos, setJoystickBasePos] = useState({
        x: window.innerWidth - JOYSTICK_SIZE - JOYSTICK_RIGHT_MARGIN,
        y: window.innerHeight - JOYSTICK_SIZE - JOYSTICK_BOTTOM_MARGIN,
    });

    const [nubOffset, setNubOffset] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const moveInterval = useRef<number | null>(null);
    const lastInput = useRef({ x: 0, y: 0 });
    const inputToggle = useRef(false); // Force state updates

    useEffect(() => {
        const updateJoystickPosition = () => {
            setJoystickBasePos({
                x: window.innerWidth - JOYSTICK_SIZE - JOYSTICK_RIGHT_MARGIN,
                y: window.innerHeight - JOYSTICK_SIZE - JOYSTICK_BOTTOM_MARGIN,
            });
            setNubOffset({ x: 0, y: 0 });
            setJoystickInput({ x: 0, y: 0 });
        };

        window.addEventListener('resize', updateJoystickPosition);
        return () => window.removeEventListener('resize', updateJoystickPosition);
    }, [setJoystickInput]);

    const updateMovement = () => {
        if (lastInput.current.x !== 0 || lastInput.current.y !== 0) {
            inputToggle.current = !inputToggle.current; // Force React to detect changes
            setJoystickInput({ x: lastInput.current.x + (inputToggle.current ? 0.001 : -0.001), y: lastInput.current.y });
        }
    };

    const startJoystick = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        if (moveInterval.current) clearInterval(moveInterval.current);
        moveInterval.current = window.setInterval(updateMovement, UPDATE_INTERVAL);
    };

    const moveJoystick = (e: TouchEvent | MouseEvent) => {
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
    };

    const stopJoystick = () => {
        isDragging.current = false;
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
        setNubOffset({ x: 0, y: 0 });
        setJoystickInput({ x: 0, y: 0 });
        lastInput.current = { x: 0, y: 0 };
    };

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
    }, []);

    return (
        <div className='select-none'>
            <div
                className="absolute bg-gray-700 opacity-50 rounded-full z-50"
                style={{
                    width: `${JOYSTICK_SIZE}px`,
                    height: `${JOYSTICK_SIZE}px`,
                    left: `${joystickBasePos.x}px`,
                    top: `${joystickBasePos.y}px`,
                    transform: 'translate(-50%, -50%)',
                    position: 'fixed',
                }}
            />

            <div
                className="absolute bg-gray-900 rounded-full shadow-lg transition-transform duration-75 ease-out select-none"
                style={{
                    width: `${NUB_SIZE}px`,
                    height: `${NUB_SIZE}px`,
                    left: `${joystickBasePos.x + nubOffset.x}px`,
                    top: `${joystickBasePos.y + nubOffset.y}px`,
                    transform: 'translate(-50%, -50%)',
                    position: 'fixed',
                }}
            />

            <div
                className="absolute bottom-2 right-2 w-40 h-40 bg-transparent z-50"
                onMouseDown={startJoystick}
                onTouchStart={startJoystick}
                style={{ pointerEvents: "all" }}
            />
        </div>
    );
};

export default Joystick;
