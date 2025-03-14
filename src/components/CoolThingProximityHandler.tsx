import React, { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cameraPositionAtom, coolThingDistanceAtom, coolThingProximityAtom } from '../atoms/gameState';

// Distance threshold for proximity (in pixels)
const PROXIMITY_THRESHOLD = 250;

interface CoolThingProximityHandlerProps {
    coolThingPosition: { x: number; y: number; };
}

const CoolThingProximityHandler: React.FC<CoolThingProximityHandlerProps> = ({ coolThingPosition }) => {
    // Get camera position from atom
    const cameraPos = useAtomValue(cameraPositionAtom);
    const setCoolThingDistance = useSetAtom(coolThingDistanceAtom);
    const setCoolThingProximity = useSetAtom(coolThingProximityAtom);
    
    // Handle proximity detection
    useEffect(() => {
        // Calculate character position in scene
        const characterSceneX = -cameraPos.x;
        const characterSceneY = -cameraPos.y;
        
        // Calculate cool thing position in scene
        const coolThingSceneX = coolThingPosition.x;
        const coolThingSceneY = coolThingPosition.y;
        
        // Calculate distance
        const dx = characterSceneX - coolThingSceneX;
        const dy = characterSceneY - coolThingSceneY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update distance atom
        setCoolThingDistance(distance);
        
        // Determine proximity based on distance
        const isNearby = distance < PROXIMITY_THRESHOLD;
        setCoolThingProximity(isNearby);
    }, [cameraPos, coolThingPosition, setCoolThingDistance, setCoolThingProximity]);

    return null;
};

export default CoolThingProximityHandler; 