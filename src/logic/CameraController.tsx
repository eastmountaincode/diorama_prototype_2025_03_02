import React, { useRef, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { cameraPositionAtom, characterMovingDirectionAtom, mousePositionAtom } from '../atoms/gameState';

const MOVE_SPEED = 3.0;
const MOVE_INTERVAL = 16; // ~60fps
//const DIAGONAL_THRESHOLD = 0.3; // ✅ Lower threshold to make diagonals easier to trigger


const CameraController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isHolding = useRef(false);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const moveInterval = useRef<number | null>(null);

    const [, setCameraPos] = useAtom(cameraPositionAtom);
    const [, setMousePos] = useAtom(mousePositionAtom);
    const [, setCharacterMovingDirection] = useAtom(characterMovingDirectionAtom);

    /** Updates mouse position relative to the GameCanvas center */
    const updateMousePos = useCallback((e: MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = clientX - centerX;
        const y = clientY - centerY;

        mousePositionRef.current = { x, y };
        setMousePos({ x, y });
    }, [setMousePos]);

    /** Starts moving the camera in the direction of the mouse */
    const startMoving = () => {
        if (moveInterval.current) clearInterval(moveInterval.current);

        moveInterval.current = window.setInterval(() => {
            const { x, y } = mousePositionRef.current;
            const distance = Math.sqrt(x ** 2 + y ** 2);
            if (distance < 5) return; // Prevents jitter when near the center

            const normalizedX = x / distance;
            const normalizedY = y / distance;

            setCameraPos(prev => ({
                x: prev.x - normalizedX * MOVE_SPEED,
                y: prev.y - normalizedY * MOVE_SPEED,
                zoom: prev.zoom
            }));

            // Set direction based on movement
            const DIAGONAL_THRESHOLD = 0.55; // ✅ Makes diagonals easier to trigger

            if (Math.abs(normalizedX) > Math.abs(normalizedY) * DIAGONAL_THRESHOLD) {
                // Horizontal-dominant movement
                if (normalizedY < -0.35) {
                    setCharacterMovingDirection(normalizedX > 0 ? 'upRight' : 'upLeft');
                } else if (normalizedY > 0.35) {
                    setCharacterMovingDirection(normalizedX > 0 ? 'downRight' : 'downLeft');
                } else {
                    setCharacterMovingDirection(normalizedX > 0 ? 'right' : 'left');
                }
            } else if (Math.abs(normalizedY) > Math.abs(normalizedX) * DIAGONAL_THRESHOLD) {
                // Vertical-dominant movement
                if (normalizedX > 0.35) {
                    setCharacterMovingDirection(normalizedY > 0 ? 'downRight' : 'upRight');
                } else if (normalizedX < -0.35) {
                    setCharacterMovingDirection(normalizedY > 0 ? 'downLeft' : 'upLeft');
                } else {
                    setCharacterMovingDirection(normalizedY > 0 ? 'down' : 'up');
                }
            } else {
                // Default behavior if close to center
                setCharacterMovingDirection(
                    normalizedX > 0
                        ? (normalizedY > 0 ? 'downRight' : 'upRight')
                        : (normalizedY > 0 ? 'downLeft' : 'upLeft')
                );
            }

        }, MOVE_INTERVAL);
    };

    /** Stops camera movement */
    const stopMoving = () => {
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
        //setCharacterMovingDirection('idle'); // Reset to idle when movement stops
    };

    /** Handles mouse/touch down events */
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        isHolding.current = true;
        updateMousePos(e);
        startMoving();
    };

    /** Handles mouse/touch move events */
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        if (isHolding.current) updateMousePos(e);
    };

    /** Handles mouse/touch release events */
    const handlePointerUp = () => {
        isHolding.current = false;
        stopMoving();
    };

    /** Registers event listeners */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('mousedown', handlePointerDown);
        container.addEventListener('mousemove', handlePointerMove);
        container.addEventListener('touchstart', handlePointerDown);
        container.addEventListener('touchmove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchend', handlePointerUp);

        return () => {
            container.removeEventListener('mousedown', handlePointerDown);
            container.removeEventListener('mousemove', handlePointerMove);
            container.removeEventListener('touchstart', handlePointerDown);
            container.removeEventListener('touchmove', handlePointerMove);

            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchend', handlePointerUp);

            stopMoving();
        };
    }, [updateMousePos]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(var(--camera-x, 0px), var(--camera-y, 0px))` }}>
                {children}

            </div>
        </div>
    );
};

export default CameraController;
