import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { coolThingProximityAtom, announcementAtom, campfireProximityAtom, coolThingProgressAtom, movementEnabledAtom } from '../atoms/gameState';

const CoolThingProgressBar: React.FC = () => {
    const isNearby = useAtomValue(coolThingProximityAtom);
    const [progress, setProgress] = useAtom(coolThingProgressAtom);
    const INCREASE_RATE = 1.0; // Rate at which progress increases
    const DECREASE_RATE = 0.5; // Rate at which progress decreases
    const setAnnouncement = useSetAtom(announcementAtom);
    const [announcementShown, setAnnouncementShown] = useState(false);
    const setCampfireProximity = useSetAtom(campfireProximityAtom);
    const setMovementEnabled = useSetAtom(movementEnabledAtom);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                if (isNearby) {
                    return Math.min(prevProgress + INCREASE_RATE, 100); // Increase progress
                } else {
                    return Math.max(prevProgress - DECREASE_RATE, 0); // Decrease progress
                }
            });
        }, 100); // Adjust the interval time as needed

        return () => clearInterval(interval);
    }, [isNearby]);

    useEffect(() => {
        if (progress === 100 && !announcementShown) {
            setAnnouncement({
                show: true,
                type: 'achievement',
                message: 'Congratulations!'
            });
            setAnnouncementShown(true);
            setCampfireProximity(true);
            setMovementEnabled(false);
            
        }
    }, [progress, announcementShown, setAnnouncement]);

    return (
        <div style={{
            display: 'flex', // Use flexbox for alignment
            alignItems: 'flex-end', // Align items to the bottom
            width: '10px', // Make it vertical by swapping width and height
            height: '100px',
            backgroundColor: '#ccc',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '10px', // Space between the progress bar and the CoolThingVisual
            position: 'absolute', // Allow manual positioning
            top: '455px', 
            left: '1010px' 
        }}>
            <div style={{
                width: '100%',
                height: `${progress}%`, // Use progress state
                backgroundColor: '#4caf50'
            }} />
        </div>
    );
};

export default CoolThingProgressBar; 