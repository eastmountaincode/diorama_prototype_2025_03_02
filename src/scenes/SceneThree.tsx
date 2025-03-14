import React from 'react';
import { sceneConfig } from './sceneConfig';

const SceneThree: React.FC = () => {
    // Get dimensions and scale factor from sceneConfig
    const { width, height, scaleFactor = 1.0 } = sceneConfig.scene3;
    
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
                    src="assets/bg/computer_diorama_sketch_1.png"
                    alt="Scene Three Background"
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

export default SceneThree;
