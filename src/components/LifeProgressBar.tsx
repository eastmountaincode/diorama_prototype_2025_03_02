import React, { useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { campfireProximityAtom, timerStateAtom } from '../atoms/gameState';
import { PROGRESS_BAR_MAX_TIME } from '../atoms/gameState';

// Constants for the circular progress bar
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
    // Use the shared timer state atom
    const [timerState, setTimerState] = useAtom(timerStateAtom);
    const timerRef = useRef<number | null>(null);
    
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
            setTimerState(prev => {
                // Calculate new time remaining
                let newTimeRemaining;
                
                // If near campfire, refill the timer instead of decreasing it
                if (isNearCampfireRef.current) {
                    // Increase time but cap at max
                    newTimeRemaining = Math.min(prev.timeRemaining + (REFILL_RATE * 0.1), PROGRESS_BAR_MAX_TIME);
                } else {
                    // Normal decrease when not near campfire
                    newTimeRemaining = Math.max(prev.timeRemaining - 0.1, 0); // Decrease by 0.1 seconds but don't go below 0
                }
                
                // Check if timer just expired
                const isNewlyExpired = prev.timeRemaining > 0 && newTimeRemaining <= 0;
                
                return {
                    timeRemaining: newTimeRemaining,
                    isTimerExpired: isNewlyExpired || (prev.isTimerExpired && newTimeRemaining <= 0)
                };
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

    // Handle timer expiration callback
    useEffect(() => {
        if (timerState.isTimerExpired) {
            // Call the optional callback if provided
            if (onTimeUp) {
                onTimeUp();
            }
            
            // Reset the timer after a delay
            setTimeout(() => {
                setTimerState({
                    timeRemaining: PROGRESS_BAR_MAX_TIME,
                    isTimerExpired: false
                });
            }, 1000); // 1 second delay before restarting
        }
    }, [timerState.isTimerExpired, onTimeUp, setTimerState]);

    // Calculate progress for the circular progress bar
    const progressPercentage = timerState.timeRemaining / PROGRESS_BAR_MAX_TIME;
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