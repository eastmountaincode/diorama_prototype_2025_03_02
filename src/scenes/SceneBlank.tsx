import React from 'react';
import { sceneConfig } from './sceneConfig';
import Campfire from '../components/Campfire';
import CoolThing from '../components/CoolThing';
//import { useSetAtom } from 'jotai';
//import { campfireProximityAtom } from '../atoms/gameState';

// Cool thing configuration (GIF) - position is now relative to the center of the scene
const COOL_THING = {
    src: 'assets/objects/cool_thing.gif',
    width: 150, // Adjust based on actual image size
    height: 150, // Adjust based on actual image size
    position: {
        x: 570, // Position relative to center (positive = right, negative = left)
        y: 180, // Position relative to center (positive = down, negative = up)
    }
};

const SceneBlank: React.FC = () => {
    // Get dimensions and scale factor from sceneConfig
    const { width, height, scaleFactor = 1.0 } = sceneConfig.sceneBlank;
    
    // Calculate scaled dimensions
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;
    
    // Calculate center-to-corner offset
    const centerToCornerX = width / 2;
    const centerToCornerY = height / 2;
    
    // Calculate absolute position for cool thing (relative to top-left)
    const coolThingAbsoluteX = centerToCornerX + COOL_THING.position.x;
    const coolThingAbsoluteY = centerToCornerY + COOL_THING.position.y;
    

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
                
                {/* Cool Thing Visual (GIF) */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: `${COOL_THING.width * scaleFactor}px`,
                        height: `${COOL_THING.height * scaleFactor}px`,
                        left: `${coolThingAbsoluteX * scaleFactor}px`,
                        top: `${coolThingAbsoluteY * scaleFactor}px`,
                        transform: 'translate(-50%, -50%)', // Center the image at the position point
                    }}
                >
                    <img
                        src={COOL_THING.src}
                        alt="Cool Thing"
                        className="w-full h-full object-contain"
                        style={{ userSelect: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SceneBlank; 