import React from 'react';
import { sceneConfig } from './sceneConfig';

const SceneOne: React.FC = () => {
    // Get dimensions and scale factor from sceneConfig
    const { width, height, scaleFactor = 1.0 } = sceneConfig.scene1;
    
    // Calculate scaled dimensions
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    return (
        <div className="h-full flex items-center justify-center select-none">
            <div 
                className="relative" 
                style={{ 
                    width: `${scaledWidth}px`, 
                    height: `${scaledHeight}px`,
                    minWidth: `${scaledWidth}px`,
                    minHeight: `${scaledHeight}px`
                }}
            >
                <img
                    src="assets/bg/beach_bg.png"
                    alt="Scene One Background"
                    className="pointer-events-none"
                    style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                        minWidth: `${scaledWidth}px`,
                        minHeight: `${scaledHeight}px`,
                        userSelect: 'none',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );
};

export default SceneOne;
