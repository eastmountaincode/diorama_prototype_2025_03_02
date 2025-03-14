import React, { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { coolThingDistanceAtom, coolThingProximityAtom } from '../atoms/gameState';

// Audio configuration
const MAX_VOLUME = 0.4; // Maximum volume when closest to the cool thing
const PROXIMITY_THRESHOLD = 250; // Distance threshold for proximity

const CoolThingAudioHandler: React.FC = () => {
    // Get proximity state and distance from atoms
    const isNearby = useAtomValue(coolThingProximityAtom);
    const distance = useAtomValue(coolThingDistanceAtom);
    
    // Web Audio API refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    
    // Audio state tracking
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const lastVolumeRef = useRef(0);
    const pauseTimeoutRef = useRef<number | null>(null);
    
    // Initialize Web Audio API
    useEffect(() => {
        // Function to set up audio - will be called on first user interaction
        const setupAudio = () => {
            if (audioContextRef.current) return; // Already initialized
            
            try {
                // Create audio context
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const context = new AudioContext();
                audioContextRef.current = context;
                
                // Create audio element
                const audioElement = new Audio();
                audioElement.src = 'assets/sounds/xtal.mp3';
                audioElement.loop = true;
                audioElement.crossOrigin = 'anonymous';
                // Preload the audio
                audioElement.preload = 'auto';
                audioElementRef.current = audioElement;
                
                // Create source node
                const sourceNode = context.createMediaElementSource(audioElement);
                sourceNodeRef.current = sourceNode;
                
                // Create gain node for volume control
                const gainNode = context.createGain();
                gainNode.gain.value = 0; // Start with no volume
                gainNodeRef.current = gainNode;
                
                // Connect nodes: source -> gain -> destination
                sourceNode.connect(gainNode);
                gainNode.connect(context.destination);
                
                // Mark as initialized
                setAudioInitialized(true);
                //console.log('Audio system initialized successfully');
                
                // Load the audio but don't play yet
                audioElement.load();
            } catch (err) {
                //console.error('Error initializing Web Audio API:', err);
            }
        };
        
        // Set up event listeners for user interaction
        const handleUserInteraction = () => {
            setupAudio();
            // Remove event listeners after first interaction
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            // Also try to resume the AudioContext if it exists but is suspended
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume().catch(console.error);
            }
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
        
        // Cleanup on unmount
        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            
            // Clear any pending timeouts
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
            
            // Clean up audio resources
            if (audioElementRef.current) {
                audioElementRef.current.pause();
                audioElementRef.current.src = '';
            }
            
            // Disconnect audio nodes
            if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
            if (gainNodeRef.current) gainNodeRef.current.disconnect();
            
            // Close audio context
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
            }
        };
    }, []);

    // Handle audio volume based on proximity
    useEffect(() => {
        if (!audioInitialized || !gainNodeRef.current || !audioContextRef.current) return;

        if (isNearby) {
            // Calculate proximity percentage (0-100%) based on distance
            const proximityPercentage = Math.max(0, 1 - (distance / PROXIMITY_THRESHOLD)) * 100;
            
            // Apply non-linear curve for more natural volume falloff
            // Using a lower power for more gradual fade-in
            const proximityNormalized = proximityPercentage / 100;
            const volumeCurve = Math.pow(proximityNormalized, 2.0) * MAX_VOLUME; // Changed power to 2.0 for more gradual fade-in
            
            // Only update volume if it's changed significantly to reduce processing
            if (Math.abs(volumeCurve - lastVolumeRef.current) > 0.01) {
                
                // Set gain with smooth transition
                gainNodeRef.current.gain.setTargetAtTime(
                    volumeCurve,
                    audioContextRef.current.currentTime,
                    0.3 // Slower transition to reduce stuttering
                );
                
                // Update last values
                lastVolumeRef.current = volumeCurve;
            }
            
            // Clear any pending pause timeout
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
                pauseTimeoutRef.current = null;
            }
            
            // Ensure audio is playing
            if (audioElementRef.current && !isPlaying) {
                // Resume audio context if suspended (iOS requirement)
                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }
                
                // Start playing
                audioElementRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        console.log('Audio playback started');
                    })
                    .catch(err => console.error('Error playing audio:', err));
            }
        } else {
            // If out of range, fade out gradually
            if (gainNodeRef.current && isPlaying) {
                // Fade out very slowly to prevent abrupt changes
                gainNodeRef.current.gain.setTargetAtTime(
                    0,
                    audioContextRef.current.currentTime,
                    0.1
                );
                
                // Update last volume
                lastVolumeRef.current = 0;
                
                // Only pause after a significant delay and if we're still out of range
                // This prevents stuttering when crossing the boundary
                if (!pauseTimeoutRef.current) {
                    pauseTimeoutRef.current = window.setTimeout(() => {
                        if (audioElementRef.current && !isNearby) {
                            audioElementRef.current.pause();
                            setIsPlaying(false);
                            console.log('Audio paused - out of range');
                        }
                        pauseTimeoutRef.current = null;
                    }, 1500); // Longer delay before pausing
                }
            }
        }
    }, [isNearby, distance, audioInitialized, isPlaying]);

    return null;
};

export default CoolThingAudioHandler; 