import React, { useCallback } from 'react';
import { useAtom } from 'jotai';
import { cameraPositionAtom, characterMovingDirectionAtom } from '../atoms/gameState';
import MouseInputHandler from './MouseInputHandler';

const MOVE_SPEED = 3.0;

const CameraController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [, setCameraPos] = useAtom(cameraPositionAtom);
    const [, setCharacterMovingDirection] = useAtom(characterMovingDirectionAtom);

    /** Moves the camera in a given direction */
    const moveCamera = useCallback((x: number, y: number) => {
        const distance = Math.sqrt(x ** 2 + y ** 2);
        if (distance < 5) return;

        const normalizedX = x / distance;
        const normalizedY = y / distance;

        setCameraPos(prev => ({
            x: prev.x - normalizedX * MOVE_SPEED,
            y: prev.y - normalizedY * MOVE_SPEED,
            zoom: prev.zoom
        }));

        const DIAGONAL_THRESHOLD = 0.55;

        if (Math.abs(normalizedX) > Math.abs(normalizedY) * DIAGONAL_THRESHOLD) {
            if (normalizedY < -0.35) {
                setCharacterMovingDirection(normalizedX > 0 ? 'upRight' : 'upLeft');
            } else if (normalizedY > 0.35) {
                setCharacterMovingDirection(normalizedX > 0 ? 'downRight' : 'downLeft');
            } else {
                setCharacterMovingDirection(normalizedX > 0 ? 'right' : 'left');
            }
        } else {
            if (normalizedX > 0.35) {
                setCharacterMovingDirection(normalizedY > 0 ? 'downRight' : 'upRight');
            } else if (normalizedX < -0.35) {
                setCharacterMovingDirection(normalizedY > 0 ? 'downLeft' : 'upLeft');
            } else {
                setCharacterMovingDirection(normalizedY > 0 ? 'down' : 'up');
            }
        }
    }, [setCameraPos, setCharacterMovingDirection]);

    /** Stops camera movement */
    const stopMoving = useCallback(() => {
    }, [setCharacterMovingDirection]);

    return (
        <div className="w-full h-full relative overflow-hidden">
            <MouseInputHandler onMove={moveCamera} onStop={stopMoving} />

            <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(var(--camera-x, 0px), var(--camera-y, 0px))` }}>
                {children}
            </div>
        </div>
    );
};

export default CameraController;
