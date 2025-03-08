import React, { useRef, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { mousePositionAtom } from '../atoms/gameState';

interface MouseInputHandlerProps {
    onMove: (x: number, y: number) => void;
    onStop: () => void;
}

const MOVE_INTERVAL = 16; // ~60 FPS

const MouseInputHandler: React.FC<MouseInputHandlerProps> = ({ onMove, onStop }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isHolding = useRef(false);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const moveInterval = useRef<number | null>(null);

    const [, setMousePos] = useAtom(mousePositionAtom);

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

    /** Starts movement loop */
    const startMoving = () => {
        if (moveInterval.current) clearInterval(moveInterval.current);

        moveInterval.current = window.setInterval(() => {
            const { x, y } = mousePositionRef.current;
            onMove(x, y);
        }, MOVE_INTERVAL);
    };

    /** Stops movement */
    const stopMoving = () => {
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
        onStop();
    };

    /** Handles mouse/touch down events */
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        isHolding.current = true;
        updateMousePos(e);
        startMoving();
    };

    /** Handles mouse/touch move events */
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        if (isHolding.current) {
            updateMousePos(e);
        }
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

    return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
};

export default MouseInputHandler;
