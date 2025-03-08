import React from 'react';
import SceneManager from '../logic/SceneManager';
import ZoomControls from './ZoomControls';
import CameraController from '../logic/CameraController';
import { useAtom } from 'jotai';
import { cameraPositionAtom } from '../atoms/gameState';

const GameCanvas: React.FC = () => {
    const [cameraPos] = useAtom(cameraPositionAtom);

    return (
        <div
            className="w-full h-full relative border-red-500 border-4 game-canvas overflow-hidden"
            style={{
                '--camera-x': `${cameraPos.x}px`,
                '--camera-y': `${cameraPos.y}px`,
            } as React.CSSProperties}
        >
            {/* ✅ Scaling Container - Ensures SceneManager scales from the center */}
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

            {/* ✅ Character Icon - Always centered on the screen */}
            <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-blue-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg select-none">
                {/* Character Icon Placeholder */}
            </div>

            {/* ✅ Zoom Controls - Positioned in the top-right */}
            <ZoomControls />
        </div>
    );
};

export default GameCanvas;
