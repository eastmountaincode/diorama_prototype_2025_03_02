import React, { useState, useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { cameraPositionAtom, currentSceneAtom, campfireProximityAtom } from '../atoms/gameState';
import { sceneConfig } from '../scenes/sceneConfig';

// Constants for the circular progress bar
const PROGRESS_BAR_MAX_TIME = 12; // 10 seconds
const CIRCLE_SIZE = 60; // Size of the circle in pixels
const CIRCLE_STROKE_WIDTH = 6; // Width of the progress stroke
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2; // Radius of the circle
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // Circumference of the circle

// Rate at which the progress bar refills when near campfire (seconds per second)
const REFILL_RATE = 5; // Refill 5 seconds worth of time per second

interface LifeProgressBarProps {
    onTimeUp?: () => void; // Optional callback for when time runs out
}

const LifeProgressBar: React.FC<LifeProgressBarProps> = ({ onTimeUp }) => {
    // Progress bar state - start at exactly the max time
    const [timeRemaining, setTimeRemaining] = useState(PROGRESS_BAR_MAX_TIME);
    const timerRef = useRef<number | null>(null);
    const [shouldResetPosition, setShouldResetPosition] = useState(false);
    
    // Get atoms for resetting position
    const [, setCameraPos] = useAtom(cameraPositionAtom);
    const [currentScene] = useAtom(currentSceneAtom);
    
    // Get campfire proximity atom
    const isNearCampfire = useAtomValue(campfireProximityAtom);
    
    // Store the current campfire proximity in a ref so we can access it in the timer
    const isNearCampfireRef = useRef(isNearCampfire);
    
    // Update the ref whenever isNearCampfire changes
    useEffect(() => {
        isNearCampfireRef.current = isNearCampfire;
    }, [isNearCampfire]);

    // Function to start/restart the timer
    const startTimer = () => {
        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Start a new timer
        timerRef.current = window.setInterval(() => {
            setTimeRemaining(prev => {
                // If near campfire, refill the timer instead of decreasing it
                if (isNearCampfireRef.current) {
                    // Increase time but cap at max
                    const newTime = Math.min(prev + (REFILL_RATE * 0.1), PROGRESS_BAR_MAX_TIME);
                    return newTime;
                } else {
                    // Normal decrease when not near campfire
                    const newTime = prev - 0.1; // Decrease by 0.1 seconds
                    
                    // If time is up, handle restart
                    if (newTime <= 0) {
                        handleTimeUp();
                        return 0;
                    }
                    
                    return newTime;
                }
            });
        }, 100); // Update every 100ms for smoother animation
    };

    // Initialize the timer once on mount
    useEffect(() => {
        // Start the timer
        startTimer();
        
        // Cleanup timer on unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []); // Only run once on mount

    // Effect to handle camera position reset
    useEffect(() => {
        if (shouldResetPosition) {
            // Reset to starting position in current scene
            const currentSceneConfig = sceneConfig[currentScene];
            if (currentSceneConfig && 'startPosition' in currentSceneConfig) {
                const startPos = currentSceneConfig.startPosition as { x: number; y: number };
                // Reset camera to the scene's starting position
                setCameraPos(prevPos => ({
                    x: startPos.x,
                    y: startPos.y,
                    zoom: prevPos.zoom // Keep the current zoom level
                }));
            }
            
            // Reset the flag
            setShouldResetPosition(false);
        }
    }, [shouldResetPosition, currentScene, setCameraPos]);

    // Handle what happens when time runs out
    const handleTimeUp = () => {
        // Clear the interval
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        
        // Set flag to reset position in the effect
        setShouldResetPosition(true);
        
        // Call the optional callback if provided
        if (onTimeUp) {
            onTimeUp();
        }
        
        // Reset the timer and restart after a short delay
        setTimeout(() => {
            setTimeRemaining(PROGRESS_BAR_MAX_TIME);
            startTimer();
        }, 1000); // 1 second delay before restarting
    };

    // Calculate progress for the circular progress bar
    const progressPercentage = timeRemaining / PROGRESS_BAR_MAX_TIME;
    const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progressPercentage);
    
    // Determine the color based on the percentage and campfire proximity
    const getProgressColor = () => {
        if (isNearCampfire) return "#10B981"; // Green when near campfire (refilling)
        if (progressPercentage > 0.5) return "#3B82F6"; // Blue (>50%)
        if (progressPercentage > 0.25) return "#FBBF24"; // Yellow (25-50%)
        return "#EF4444"; // Red (≤25%)
    };

    return (
        <div className="select-none">
            <svg 
                width={CIRCLE_SIZE} 
                height={CIRCLE_SIZE} 
                viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
                className="transform -rotate-90" // Rotate so progress starts from the top
            >
                {/* Background circle */}
                <circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={CIRCLE_RADIUS}
                    fill="transparent"
                    stroke="#374151" // bg-gray-700
                    strokeWidth={CIRCLE_STROKE_WIDTH}
                    className="opacity-70"
                />
                
                {/* Progress circle */}
                <circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={CIRCLE_RADIUS}
                    fill="transparent"
                    stroke={getProgressColor()}
                    strokeWidth={CIRCLE_STROKE_WIDTH}
                    strokeDasharray={CIRCLE_CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-linear"
                />
            </svg>
            
        </div>
    );
};

export default LifeProgressBar; 