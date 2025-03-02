import React, { useState, useEffect, useRef } from 'react';

interface RadioProps {
    position: { x: number, y: number };
    isPlayerNearby: boolean;
    radioProximityPercentage: number;
    debug?: boolean;
}

const Radio: React.FC<RadioProps> = ({ 
    position, 
    isPlayerNearby,
    radioProximityPercentage,

}) => {
    // Radio state
    const [isOn, setIsOn] = useState(true);
    
    // Web Audio API refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const filterNodeRef = useRef<BiquadFilterNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    
    // Audio element refs
    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const clickAudioRef = useRef<HTMLAudioElement | null>(null);
    
    // Initialize audio elements and Web Audio API
    useEffect(() => {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // Create filter node for muffled effect
        const filterNode = audioContext.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 2000; // Lower value = more muffled
        filterNodeRef.current = filterNode;
        
        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0; // Start with no volume
        gainNodeRef.current = gainNode;
        
        // Connect nodes: source -> filter -> gain -> destination
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create music audio element
        const musicAudio = new Audio('/assets/sounds/ms_jackson.mp3');
        musicAudio.loop = true;
        musicAudio.crossOrigin = 'anonymous';
        musicAudioRef.current = musicAudio;
        
        // Create source node from audio element
        const sourceNode = audioContext.createMediaElementSource(musicAudio);
        sourceNode.connect(filterNode);
        sourceNodeRef.current = sourceNode;
        
        // Create click sound audio element (direct HTML Audio API)
        const clickAudio = new Audio('/assets/sounds/click.mp3');
        clickAudio.volume = 0.3
        clickAudioRef.current = clickAudio;
        
        // Start playing if initially on
        if (isOn) {
            musicAudio.play().catch(err => console.log("Audio playback prevented:", err));
        }
        
        // Cleanup on unmount
        return () => {
            musicAudio.pause();
            musicAudio.src = '';
            clickAudio.pause();
            clickAudio.src = '';
            
            // Disconnect audio nodes
            if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
            if (filterNodeRef.current) filterNodeRef.current.disconnect();
            if (gainNodeRef.current) gainNodeRef.current.disconnect();
            
            // Close audio context
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);
    
    // Handle volume changes based on proximity with non-linear curve
    useEffect(() => {
        if (gainNodeRef.current && filterNodeRef.current) {
            // Normalize proximity (0-100) to volume range (0-0.8)
            // Using cubic easing for gradual falloff at distance
            // Maximum volume is 80% to avoid being too loud
            const proximityNormalized = radioProximityPercentage / 100;
            const volumeCurve = Math.pow(proximityNormalized, 1.5) * 0.2;
            
            // Apply volume
            gainNodeRef.current.gain.setTargetAtTime(volumeCurve, audioContextRef.current?.currentTime || 0, 0.1);
            
            // Dynamic filter frequency based on distance
            // Further away = more muffled (lower frequency)
            const baseFreq = 700; // Very muffled baseline
            const maxFreq = 1200; // Less muffled when close
            const freqRange = maxFreq - baseFreq;
            const filterFreq = baseFreq + (freqRange * proximityNormalized);
            
            filterNodeRef.current.frequency.setTargetAtTime(
                filterFreq, 
                audioContextRef.current?.currentTime || 0, 
                0.1
            );
        }
    }, [radioProximityPercentage]);
    
    // Handle radio toggle with E key
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'e' && isPlayerNearby) {
                // Toggle radio state
                setIsOn(prevState => {
                    const newState = !prevState;
                    
                    // Play click sound
                    if (clickAudioRef.current) {
                        clickAudioRef.current.currentTime = 0;
                        clickAudioRef.current.play().catch(err => console.log("Click sound prevented:", err));
                    }
                    
                    // Play or pause music based on new state
                    if (musicAudioRef.current) {
                        if (newState) {
                            // Resume audio context if suspended
                            if (audioContextRef.current?.state === 'suspended') {
                                audioContextRef.current.resume();
                            }
                            musicAudioRef.current.play().catch(err => console.log("Music playback prevented:", err));
                        } else {
                            musicAudioRef.current.pause();
                        }
                    }
                    
                    return newState;
                });
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlayerNearby]);
    
    return (
        <div
            className={`absolute transition-all duration-300`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                width: '60px', // Width only, height will adjust with aspect ratio
            }}
        >
            <img
                src="/assets/radio.png"
                alt="Radio"
                className={`w-full object-contain`}
                style={{ imageRendering: 'auto' }}
            />

            {/* Interaction hint */}
            {isPlayerNearby && (
                <div 
                    className="absolute left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs whitespace-nowrap z-10" 
                    style={{ top: '-25px' }}
                >
                    Press E to {isOn ? 'turn off' : 'turn on'}
                </div>
            )}
            
        </div>
    );
};

export default Radio;