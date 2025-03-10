import React, { useEffect, useState } from 'react';
import SceneManager from '../logic/SceneManager';
import ZoomControls from './ZoomControls';
import CameraController from '../logic/CameraController';
import { useAtomValue } from 'jotai';
import { cameraPositionAtom, currentSceneAtom } from '../atoms/gameState';
import { sceneConfig } from '../scenes/sceneConfig';
import Character from './Character';
import Joystick from './Joystick';

const GameCanvas: React.FC = () => {
    const cameraPos = useAtomValue(cameraPositionAtom);
    const currentScene = useAtomValue(currentSceneAtom);
    const [sceneHasCharacter, setSceneHasCharacter] = useState(false);

    useEffect(() => {
        setSceneHasCharacter(sceneConfig[currentScene]?.hasCharacter || false);
    }, [currentScene]);

    return (
        <div
            className="w-full h-full relative game-canvas overflow-hidden select-none"
            style={{
                '--camera-x': `${cameraPos.x}px`,
                '--camera-y': `${cameraPos.y}px`,
            } as React.CSSProperties}
        >
            {/* Scaling Container - Ensures SceneManager scales from the center */}
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    transform: `scale(${cameraPos.zoom})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.1s ease-out',
                    width: '200%',
                    height: '200%',
                    overflow: 'visible',
                }}
            >
                <CameraController>
                    <SceneManager />
                </CameraController>
            </div>

            {/* Character Icon */}
            {sceneHasCharacter && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Character />
                </div>
            )}

            {/* Zoom Controls */}
            <ZoomControls />

            <Joystick />
        </div>
    );
};

export default GameCanvas;
