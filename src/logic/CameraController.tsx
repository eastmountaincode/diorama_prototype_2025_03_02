import React, { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cameraPositionAtom, characterMovingDirectionAtom, joystickInputAtom } from '../atoms/gameState';
import KeyboardInputHandler from './KeyboardInputHandler';

const MOVE_SPEED = 3.0;

const CameraController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [, setCameraPos] = useAtom(cameraPositionAtom);
    const [, setCharacterMovingDirection] = useAtom(characterMovingDirectionAtom);
    const [joystickInput] = useAtom(joystickInputAtom);

    /** Snaps an angle to the nearest 45-degree increment */
    const snapToCardinalOrDiagonal = (x: number, y: number) => {
        // Calculate the angle in radians
        const angle = Math.atan2(y, x);
        
        // Convert to degrees and normalize to 0-360
        let degrees = angle * (180 / Math.PI);
        if (degrees < 0) degrees += 360;
        
        // Snap to the nearest 45-degree increment (0, 45, 90, 135, 180, 225, 270, 315)
        const snappedDegrees = Math.round(degrees / 45) * 45;
        
        // Convert back to radians
        const snappedRadians = snappedDegrees * (Math.PI / 180);
        
        // Return the snapped normalized coordinates
        return {
            x: Math.cos(snappedRadians),
            y: Math.sin(snappedRadians)
        };
    };

    /** Moves the camera based on input */
    const moveCamera = useCallback((x: number, y: number) => {
        const distance = Math.sqrt(x ** 2 + y ** 2);
        if (distance < 5) return;

        // Get normalized input
        let normalizedX = x / distance;
        let normalizedY = y / distance;

        // Snap to cardinal or diagonal direction
        const snapped = snapToCardinalOrDiagonal(normalizedX, normalizedY);
        normalizedX = snapped.x;
        normalizedY = snapped.y;

        // Move camera based on snapped direction
        setCameraPos(prev => ({
            x: prev.x - normalizedX * MOVE_SPEED,
            y: prev.y - normalizedY * MOVE_SPEED,
            zoom: prev.zoom
        }));

        // Set character direction based on the snapped angle
        // Using the exact 45-degree increments to determine direction
        // Note: The angle is from the joystick input, which is inverted for camera movement
        // So we need to adjust the direction mapping accordingly
        
        // For clarity: 
        // - Right = 0 degrees
        // - Down = 90 degrees
        // - Left = 180 degrees
        // - Up = 270 degrees
        
        switch (Math.round(Math.atan2(normalizedY, normalizedX) * (180 / Math.PI) / 45) * 45) {
            case 0: // Right
                setCharacterMovingDirection('right');
                break;
            case 45: // Down-Right
                setCharacterMovingDirection('downRight');
                break;
            case 90: // Down
                setCharacterMovingDirection('down');
                break;
            case 135: // Down-Left
                setCharacterMovingDirection('downLeft');
                break;
            case -180:
            case 180: // Left
                setCharacterMovingDirection('left');
                break;
            case -135: // Up-Left
                setCharacterMovingDirection('upLeft');
                break;
            case -90: // Up
                setCharacterMovingDirection('up');
                break;
            case -45: // Up-Right
                setCharacterMovingDirection('upRight');
                break;
            default:
                // This shouldn't happen with our snapping, but just in case
                if (Math.abs(normalizedX) > Math.abs(normalizedY)) {
                    setCharacterMovingDirection(normalizedX > 0 ? 'right' : 'left');
                } else {
                    setCharacterMovingDirection(normalizedY > 0 ? 'down' : 'up');
                }
        }
    }, [setCameraPos, setCharacterMovingDirection]);

    /** Stops camera movement */
    const stopMoving = useCallback(() => {
        // setCharacterMovingDirection('idle');
    }, [setCharacterMovingDirection]);

    // React to joystick movement
    useEffect(() => {
        if (joystickInput.x !== 0 || joystickInput.y !== 0) {
            moveCamera(joystickInput.x, joystickInput.y);
        } else {
            stopMoving();
        }
    }, [joystickInput, moveCamera, stopMoving]);

    return (
        <div className="w-full h-full relative overflow-hidden">
            <KeyboardInputHandler onMove={moveCamera} onStop={stopMoving} />

            <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(var(--camera-x, 0px), var(--camera-y, 0px))` }}>
                {children}
            </div>
        </div>
    );
};

export default CameraController;
