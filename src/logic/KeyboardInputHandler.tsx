import React, { useEffect, useCallback, useRef } from 'react';

interface KeyboardInputHandlerProps {
    onMove: (x: number, y: number) => void;
    onStop: () => void;
}

const MOVE_SPEED = 5.0; // Controls how fast the camera moves
const MOVE_INTERVAL = 16; // ~60 FPS for smooth movement

/** 🎮 Key Mapping */
const KEY_BINDINGS: Record<string, { x: number; y: number }> = {
    w: { x: 0, y: -MOVE_SPEED },
    a: { x: -MOVE_SPEED, y: 0 },
    s: { x: 0, y: MOVE_SPEED },
    d: { x: MOVE_SPEED, y: 0 },
};

const KeyboardInputHandler: React.FC<KeyboardInputHandlerProps> = ({ onMove, onStop }) => {
    const activeKeys = useRef(new Set<string>()); // Tracks pressed keys
    const moveInterval = useRef<number | null>(null); // Handles movement updates

    /** 🔄 Updates movement based on active keys */
    const updateMovement = useCallback(() => {
        let totalX = 0, totalY = 0;

        activeKeys.current.forEach((key) => {
            if (KEY_BINDINGS[key]) {
                totalX += KEY_BINDINGS[key].x;
                totalY += KEY_BINDINGS[key].y;
            }
        });

        if (totalX !== 0 || totalY !== 0) {
            onMove(totalX, totalY);
        } else {
            onStop();
        }
    }, [onMove, onStop]);

    /** ▶️ Starts movement loop */
    const startMoving = useCallback(() => {
        if (!moveInterval.current) {
            moveInterval.current = window.setInterval(updateMovement, MOVE_INTERVAL);
        }
    }, [updateMovement]);

    /** ⏹ Stops movement */
    const stopMoving = useCallback(() => {
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
        onStop();
    }, [onStop]);

    /** 🎮 Handles key press */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (KEY_BINDINGS[e.key] && !activeKeys.current.has(e.key)) {
                activeKeys.current.add(e.key);
                startMoving();
            }
        },
        [startMoving]
    );

    /** 🎮 Handles key release */
    const handleKeyUp = useCallback(
        (e: KeyboardEvent) => {
            activeKeys.current.delete(e.key);
            if (activeKeys.current.size === 0) {
                stopMoving();
            }
        },
        [stopMoving]
    );

    /** 📌 Registers event listeners */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            stopMoving(); // Ensures movement stops when unmounted
        };
    }, [handleKeyDown, handleKeyUp, stopMoving]);

    return null; // No UI needed, just input handling
};

export default KeyboardInputHandler;
