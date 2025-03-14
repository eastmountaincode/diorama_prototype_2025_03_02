import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { 
    cameraPositionAtom, 
    currentSceneAtom, 
    timerStateAtom,
    announcementAtom
} from '../atoms/gameState';
import { sceneConfig } from '../scenes/sceneConfig';

/**
 * Consequences component
 * 
 * This component handles game events and their consequences.
 * It doesn't render anything visible but manages game logic and state transitions.
 */
const Consequences: React.FC = () => {
    // Get necessary atoms
    const [, setCameraPos] = useAtom(cameraPositionAtom);
    const [currentScene] = useAtom(currentSceneAtom);
    const [timerState, setTimerState] = useAtom(timerStateAtom);
    const [, setAnnouncement] = useAtom(announcementAtom);
    
    // Handle timer expiration
    useEffect(() => {
        if (timerState.isTimerExpired) {
            console.log('Timer expired! Handling consequences...');
            
            // Show announcement
            setAnnouncement({
                show: true,
                type: 'timeUp',
                message: 'Time\'s up! Returning to start position...'
            });
            
            // Hide announcement after delay
            setTimeout(() => {
                setAnnouncement(prev => ({
                    ...prev,
                    show: false
                }));
            }, 3000);
            
            // Reset position to scene start position
            const currentSceneConfig = sceneConfig[currentScene];
            if (currentSceneConfig && 'startPosition' in currentSceneConfig) {
                const startPos = currentSceneConfig.startPosition as { x: number; y: number };
                
                // Reset camera to the scene's starting position
                setCameraPos(prevPos => ({
                    x: startPos.x,
                    y: startPos.y,
                    zoom: prevPos.zoom // Keep the current zoom level
                }));
                
                console.log('Reset position to:', startPos);
            }
            
            // Reset the timer expired flag after handling consequences
            setTimeout(() => {
                setTimerState(prev => ({
                    ...prev,
                    isTimerExpired: false,
                }));
            }, 0);
        }
    }, [timerState.isTimerExpired, currentScene, setCameraPos, setTimerState, setAnnouncement]);
    
    // This component doesn't render anything visible
    return null;
};

export default Consequences; 