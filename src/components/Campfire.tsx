import React, { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cameraPositionAtom, campfireDistanceAtom, campfireProximityAtom } from '../atoms/gameState';
import AnimatedObjectSprite from './AnimatedObjectSprite';
import { sceneConfig } from '../scenes/sceneConfig';

// Campfire configuration - position is now relative to the center of the scene
export const CAMPFIRE_CONFIG = {
    src: 'assets/objects/campfire.png',
    frameWidth: 64,
    frameHeight: 128,
    frameCount: 17,
    frameRate: 12,
    scale: 3,
    position: {
        x: -690, // Position relative to center of scene
        y: 100,
    }
};

// Known camera position when character is at the center of the fire
const FIRE_CENTER_CAMERA_POS = {
    x: 411.27,
    y: 159.33
};

// Y-coordinate offset to correct the distance calculation
// This value was determined empirically to make the distance close to 0
// when the character is standing on top of the fire
const Y_OFFSET = 308;

// Distance threshold for proximity (in pixels)
const PROXIMITY_THRESHOLD = 150;

const Campfire: React.FC = () => {
    // Get scene dimensions from sceneConfig
    const { width, height, scaleFactor = 1 } = sceneConfig.sceneBlank;
    
    // Get camera position from atom
    const cameraPos = useAtomValue(cameraPositionAtom);
    const setCampfireDistance = useSetAtom(campfireDistanceAtom);
    const setCampfireProximity = useSetAtom(campfireProximityAtom);
    
    // Calculate center of the scene
    const sceneCenterX = width / 2;
    const sceneCenterY = height / 2;
    
    // Get campfire position (relative to center)
    const campfireRelativeX = CAMPFIRE_CONFIG.position.x;
    const campfireRelativeY = CAMPFIRE_CONFIG.position.y;
    
    // Calculate absolute position (from top-left)
    const campfireAbsoluteX = sceneCenterX + campfireRelativeX;
    const campfireAbsoluteY = sceneCenterY + campfireRelativeY;
    
    useEffect(() => {
        // Calculate distance from current camera position to fire center camera position
        const dx = cameraPos.x - FIRE_CENTER_CAMERA_POS.x;
        const dy = cameraPos.y - FIRE_CENTER_CAMERA_POS.y + Y_OFFSET;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update the distance atom
        setCampfireDistance(distance);
        
        // Update the proximity atom based on the threshold
        const isNearby = distance < PROXIMITY_THRESHOLD;
        setCampfireProximity(isNearby);
        
    }, [cameraPos, setCampfireDistance, setCampfireProximity]);
    
    return (
        <>
            {/* Campfire sprite */}
            <AnimatedObjectSprite
                src={CAMPFIRE_CONFIG.src}
                frameWidth={CAMPFIRE_CONFIG.frameWidth}
                frameHeight={CAMPFIRE_CONFIG.frameHeight}
                frameCount={CAMPFIRE_CONFIG.frameCount}
                frameRate={CAMPFIRE_CONFIG.frameRate}
                scale={CAMPFIRE_CONFIG.scale}
                position={{ x: campfireAbsoluteX, y: campfireAbsoluteY }}
                sceneScaleFactor={scaleFactor}
            />
        </>
    );
};

export default Campfire; 