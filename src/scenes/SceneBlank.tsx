import React from 'react';
import { sceneConfig } from './sceneConfig';
import Campfire from '../components/Campfire';
import CoolThing from '../components/CoolThing';


const SceneBlank: React.FC = () => {
    // Get dimensions and scale factor from sceneConfig
    const { width, height, scaleFactor = 1.0 } = sceneConfig.sceneBlank;
    
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
                    minWidth: `${scaledWidth}px`, // Add fixed minimum width
                    minHeight: `${scaledHeight}px` // Add fixed minimum height
                }}
            >
                {/* Background image */}
                <img
                    src="assets/bg/bg_blank_t.png"
                    alt="Blank Scene Background"
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
                
                {/* Campfire Component */}
                <Campfire />
                
                {/* CoolThing Component (invisible, handles audio) */}
                <CoolThing />
            </div>
        </div>
    );
};

export default SceneBlank; 