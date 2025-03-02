import React, { useRef, useEffect } from 'react';

interface PianoProps {
    // Any props we might need
}

const Piano: React.FC<PianoProps> = () => {
    // Audio context and effect nodes
    const audioContextRef = useRef<AudioContext | null>(null);
    const reverbNodeRef = useRef<ConvolverNode | null>(null);
    // Track active oscillators for each key
    const oscillatorsRef = useRef<{
        [key: string]: {
            oscillator: OscillatorNode;
            gainNode: GainNode;
            additionalOscillators?: OscillatorNode[];
        }
    }>({});
    const isMouseDownRef = useRef<boolean>(false);

    // Initialize audio context and effects
    useEffect(() => {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const context = audioContextRef.current;

        // Create reverb
        createReverb(context).then(reverbNode => {
            reverbNodeRef.current = reverbNode;
        });

        // Add global mouse up handler to catch all mouse up events
        const handleGlobalMouseUp = () => {
            // Stop all playing notes
            isMouseDownRef.current = false;
            stopAllNotes();
        };

        // Add event listener
        document.addEventListener('mouseup', handleGlobalMouseUp);

        // Cleanup
        return () => {
            // Stop any playing notes
            stopAllNotes();

            // Remove event listener
            document.removeEventListener('mouseup', handleGlobalMouseUp);

            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Stop all playing notes
    const stopAllNotes = () => {
        Object.keys(oscillatorsRef.current).forEach(note => {
            stopNote(note);
        });
    };

    // Create reverb effect
    const createReverb = async (context: AudioContext): Promise<ConvolverNode> => {
        const reverbNode = context.createConvolver();

        // Simple impulse response for reverb (can be replaced with a real IR)
        const sampleRate = context.sampleRate;
        const length = sampleRate * 2; // 2 seconds reverb
        const impulseResponse = context.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulseResponse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Exponential decay
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }

        reverbNode.buffer = impulseResponse;
        return reverbNode;
    };

    // Function to start playing a note
    const startNote = (frequency: number, note: string) => {
        if (!audioContextRef.current) return;

        console.log(`Starting note: ${note} (${frequency}Hz)`);

        const context = audioContextRef.current;

        // Stop any existing oscillator for this note
        stopNote(note);

        // Add slight detuning for funky effect
        const detuneAmount = 30; // cents (100 cents = 1 semitone)
        const randomDetune = (Math.random() * detuneAmount * 2) - detuneAmount;

        // Create multiple oscillators for a richer funky sound
        const oscillator1 = context.createOscillator();
        const oscillator2 = context.createOscillator();
        const oscillator3 = context.createOscillator();

        // Set different waveforms for a funky sound
        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';
        oscillator3.type = 'sawtooth';

        // Set frequencies with slightly different detuning
        oscillator1.frequency.setValueAtTime(frequency, context.currentTime);
        oscillator1.detune.setValueAtTime(randomDetune, context.currentTime);

        oscillator2.frequency.setValueAtTime(frequency, context.currentTime);
        oscillator2.detune.setValueAtTime(randomDetune - 7, context.currentTime);

        oscillator3.frequency.setValueAtTime(frequency / 2, context.currentTime); // One octave lower
        oscillator3.detune.setValueAtTime(randomDetune + 5, context.currentTime);

        // Create gain nodes for each oscillator
        const mainGain = context.createGain();
        const gain1 = context.createGain();
        const gain2 = context.createGain();
        const gain3 = context.createGain();

        // Set volume levels
        gain1.gain.value = 0.2;  // Was 0.5
        gain2.gain.value = 0.06; // Was 0.15
        gain3.gain.value = 0.1;  // Was 0.25

        // Attack - quick ramp up
        mainGain.gain.setValueAtTime(0, context.currentTime);
        mainGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);

        // Connect oscillators to their gain nodes
        oscillator1.connect(gain1);
        oscillator2.connect(gain2);
        oscillator3.connect(gain3);

        // Connect all gains to the main gain
        gain1.connect(mainGain);
        gain2.connect(mainGain);
        gain3.connect(mainGain);

        // Connect to reverb or output
        if (reverbNodeRef.current) {
            // Split the signal - some dry, some wet
            const dryGain = context.createGain();
            dryGain.gain.value = 0.5; 

            const wetGain = context.createGain();
            wetGain.gain.value = 0.5; 

            mainGain.connect(dryGain);
            dryGain.connect(context.destination);

            mainGain.connect(wetGain);
            wetGain.connect(reverbNodeRef.current);
            reverbNodeRef.current.connect(context.destination);
        } else {
            mainGain.connect(context.destination);
        }

        // Start oscillators
        oscillator1.start();
        oscillator2.start();
        oscillator3.start();

        // Store reference to oscillators and gain node
        oscillatorsRef.current[note] = {
            oscillator: oscillator1, // We'll just use the first one for stopping
            gainNode: mainGain
        };

        // Add custom property to store other oscillators for cleanup
        oscillatorsRef.current[note].additionalOscillators = [oscillator2, oscillator3];
    };

    // Function to stop playing a note
    const stopNote = (note: string) => {
        const noteData = oscillatorsRef.current[note];
        if (noteData) {
            const { oscillator, gainNode, additionalOscillators = [] } = noteData as any;

            // Release envelope - shorter fade out for responsiveness
            if (audioContextRef.current) {
                const now = audioContextRef.current.currentTime;
                // Gradual decay over 0.5 seconds
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

                // Stop oscillators after fade out
                setTimeout(() => {
                    try {
                        oscillator.stop();
                        // Stop additional oscillators
                        additionalOscillators.forEach((osc: OscillatorNode) => {
                            try { osc.stop(); } catch (e) { /* ignore */ }
                        });
                    } catch (e) {
                        // Ignore errors if oscillator is already stopped
                    }
                    delete oscillatorsRef.current[note];
                }, 500);
            }
        }
    };

    // Piano key definitions (frequency in Hz)
    const whiteKeys = [
        { note: 'C', frequency: 261.63 },
        { note: 'D', frequency: 293.66 },
        { note: 'E', frequency: 329.63 },
        { note: 'F', frequency: 349.23 },
        { note: 'G', frequency: 392.00 },
        { note: 'A', frequency: 440.00 },
        { note: 'B', frequency: 493.88 },
    ];

    // Adjusted black key positions (moved slightly to the left)
    const blackKeys = [
        { note: 'C#', frequency: 277.18, left: '10%' },  // Was 12%
        { note: 'D#', frequency: 311.13, left: '24%' },  // Was 26%
        { note: 'F#', frequency: 369.99, left: '53%' },  // Was 55%
        { note: 'G#', frequency: 415.30, left: '67%' },  // Was 69%
        { note: 'A#', frequency: 466.16, left: '81%' },  // Was 83%
    ];

    return (
        <div className="piano-container relative" style={{ height: '70px', width: '100%' }}>
            {/* White keys */}
            <div className="white-keys flex h-full">
                {whiteKeys.map((key) => (
                    <div
                        key={key.note}
                        className="white-key relative bg-white border border-gray-300 flex-1 cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                        style={{ height: '100%', borderRadius: '0 0 3px 3px' }}
                        onMouseDown={(e) => {
                            e.preventDefault(); // Prevent text selection
                            isMouseDownRef.current = true;
                            stopAllNotes(); // Stop any previously playing notes
                            startNote(key.frequency, key.note);
                        }}
                        onMouseEnter={() => {
                            if (isMouseDownRef.current) {
                                stopAllNotes(); // Stop any previously playing notes
                                startNote(key.frequency, key.note);
                            }
                        }}
                        onMouseUp={() => {
                            isMouseDownRef.current = false;
                            stopAllNotes();
                        }}
                        onMouseLeave={() => {
                            // Don't reset isMouseDown here, just stop this note
                            stopNote(key.note);
                        }}
                        onTouchStart={() => {
                            stopAllNotes();
                            startNote(key.frequency, key.note);
                        }}
                        onTouchEnd={() => stopAllNotes()}
                    />
                ))}
            </div>

            {/* Black keys rendered directly */}
            {blackKeys.map((key) => (
                <div
                    key={key.note}
                    className="black-key absolute top-0 bg-black cursor-pointer hover:bg-gray-800 active:bg-gray-700"
                    style={{
                        left: key.left,
                        width: '8%',
                        height: '60%',
                        borderRadius: '0 0 2px 2px'
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault(); // Prevent text selection
                        isMouseDownRef.current = true;
                        stopAllNotes(); // Stop any previously playing notes
                        startNote(key.frequency, key.note);
                    }}
                    onMouseEnter={() => {
                        if (isMouseDownRef.current) {
                            stopAllNotes(); // Stop any previously playing notes
                            startNote(key.frequency, key.note);
                        }
                    }}
                    onMouseUp={() => {
                        isMouseDownRef.current = false;
                        stopAllNotes();
                    }}
                    onMouseLeave={() => {
                        // Don't reset isMouseDown here, just stop this note
                        stopNote(key.note);
                    }}
                    onTouchStart={() => {
                        stopAllNotes();
                        startNote(key.frequency, key.note);
                    }}
                    onTouchEnd={() => stopAllNotes()}
                />
            ))}
        </div>
    );
};

export default Piano;