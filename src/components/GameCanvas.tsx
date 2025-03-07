import React, { useRef } from 'react';
import SceneManager from '../logic/SceneManager';
import ZoomControls from './ZoomControls';
import CameraController from '../logic/CameraController';
import { useAtom } from 'jotai';
import { cameraPositionAtom } from '../atoms/gameState';

const GameCanvas: React.FC = () => {
    const [cameraPos] = useAtom(cameraPositionAtom);
    const gameCanvasRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={gameCanvasRef}
            className="w-full h-full relative border-red-500 border-4"
            style={{
                '--camera-x': `${cameraPos.x}px`,
                '--camera-y': `${cameraPos.y}px`,
            } as React.CSSProperties}
        >
            <CameraController>
                <SceneManager canvasRef={gameCanvasRef} />
            </CameraController>

            <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-blue-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
                {/* Character Icon Placeholder */}
            </div>
            
            <ZoomControls />
        </div>
    );
};

export default GameCanvas;
