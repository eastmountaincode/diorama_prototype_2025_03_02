import React from 'react';
import SceneManager from '../logic/SceneManager';
import ZoomControls from './ZoomControls';

const GameCanvas: React.FC = () => {
    return (
        <div className="w-full h-full relative overflow-hidden">
            <SceneManager />
            
            {/* ZoomControls positioned absolutely to top-right */}
            <ZoomControls />
        </div>
    );
};

export default GameCanvas;
