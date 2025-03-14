import React from 'react';
import CoolThingVisual from './CoolThingVisual';
import CoolThingProximityHandler from './CoolThingProximityHandler';
import CoolThingAudioHandler from './CoolThingAudioHandler';
import CoolThingProgressBar from './CoolThingProgressBar';

// Cool thing configuration - position is relative to the center of the scene
export const COOL_THING_CONFIG = {
    position: {
        x: 335.79, // Position relative to center of scene (matching the GIF position)
        y: 108.36, // Position relative to center of scene (matching the GIF position)
    }
};

const CoolThing: React.FC = () => {
    // Assume scaleFactor, centerToCornerX, and centerToCornerY are available in this context
    const scaleFactor = 1.0; // Example value, replace with actual
    const centerToCornerX = 0; // Example value, replace with actual
    const centerToCornerY = 0; // Example value, replace with actual
    
    return (
        <>
            {/* Cool Thing Progress Bar */}
            <CoolThingProgressBar />
            {/* Cool Thing Visual */}
            <CoolThingVisual 
                scaleFactor={scaleFactor} 
                centerToCornerX={centerToCornerX} 
                centerToCornerY={centerToCornerY} 
            />
            {/* Cool Thing Proximity Handler */}
            <CoolThingProximityHandler 
                coolThingPosition={COOL_THING_CONFIG.position} 
            />
            {/* Cool Thing Audio Handler */}
            <CoolThingAudioHandler />
        </>
    );
};

export default CoolThing; 