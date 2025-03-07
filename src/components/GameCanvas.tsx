import React from 'react';
import SceneManager from '../logic/SceneManager';
import ZoomControls from './ZoomControls';
import CameraController from '../logic/CameraController';
import { useAtom } from 'jotai';
import { cameraPositionAtom } from '../atoms/gameState';

const GameCanvas: React.FC = () => {
    const [cameraPos] = useAtom(cameraPositionAtom);

    return (
        <div className="w-full h-full relative border-red-500 border-4 "style={{
            '--camera-x': `${cameraPos.x}px`,
            '--camera-y': `${cameraPos.y}px`,
        } as React.CSSProperties}>
            <CameraController>
                <SceneManager />
            </CameraController>
            
            {/* ZoomControls positioned absolutely to top-right */}
            <ZoomControls />
        </div>
    );
};

export default GameCanvas;
