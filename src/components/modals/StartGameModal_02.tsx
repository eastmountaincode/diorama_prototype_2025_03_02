import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { characterMovingDirectionAtom, joystickInputAtom } from '../../atoms/gameState';
import Character from '../../components/Character';
import Joystick from '../../components/Joystick';

// ✅ Explicitly define allowed movement values
type MovementDirection = "up" | "down" | "left" | "right" | "upRight" | "downRight" | "upLeft" | "downLeft" | "idle";

const StartGameModal_02: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
    const [, setCharacterMovingDirection] = useAtom(characterMovingDirectionAtom);
    const [joystickInput] = useAtom(joystickInputAtom);
    const activeKeys = useState(new Set<string>())[0]; // ✅ Keep track of pressed keys

    const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({
        w: false,
        a: false,
        s: false,
        d: false
    });

    useEffect(() => {
        const updateDirection = () => {
            const isW = activeKeys.has('w');
            const isA = activeKeys.has('a');
            const isS = activeKeys.has('s');
            const isD = activeKeys.has('d');

            let direction: MovementDirection = "idle";

            if (isW && isD) direction = "upRight";
            else if (isW && isA) direction = "upLeft";
            else if (isS && isD) direction = "downRight";
            else if (isS && isA) direction = "downLeft";
            else if (isW) direction = "up";
            else if (isA) direction = "left";
            else if (isS) direction = "down";
            else if (isD) direction = "right";

            setCharacterMovingDirection(direction);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                activeKeys.add(key);
                setPressedKeys(prev => ({ ...prev, [key]: true }));
                updateDirection();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            activeKeys.delete(key);
            setPressedKeys(prev => ({ ...prev, [key]: false }));
            updateDirection();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setCharacterMovingDirection, activeKeys]);

    // ✅ Joystick Input Effect
    useEffect(() => {
        if (joystickInput.x !== 0 || joystickInput.y !== 0) {
            const angle = Math.atan2(joystickInput.y, joystickInput.x);
            let direction: MovementDirection = "idle";

            if (angle >= -Math.PI / 8 && angle < Math.PI / 8) direction = "right";
            else if (angle >= Math.PI / 8 && angle < 3 * Math.PI / 8) direction = "downRight";
            else if (angle >= 3 * Math.PI / 8 && angle < 5 * Math.PI / 8) direction = "down";
            else if (angle >= 5 * Math.PI / 8 && angle < 7 * Math.PI / 8) direction = "downLeft";
            else if (angle >= 7 * Math.PI / 8 || angle < -7 * Math.PI / 8) direction = "left";
            else if (angle >= -7 * Math.PI / 8 && angle < -5 * Math.PI / 8) direction = "upLeft";
            else if (angle >= -5 * Math.PI / 8 && angle < -3 * Math.PI / 8) direction = "up";
            else if (angle >= -3 * Math.PI / 8 && angle < -Math.PI / 8) direction = "upRight";

            setCharacterMovingDirection(direction);
        }
    }, [joystickInput, setCharacterMovingDirection]);

    const getKeyClass = (key: string) => {
        return pressedKeys[key] 
            ? "text-white bg-gray-600 rounded p-1 text-center font-mono font-bold shadow-inner border-2 border-gray-500 transition-all duration-150 transform scale-105"
            : "text-white bg-gray-800 rounded p-1 text-center font-mono border-2 border-gray-700 shadow-md transition-all duration-150";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full border-2 border-gray-600 relative">
                {/* ✅ Movement Instructions */}
                <div className="bg-gray-800 p-3 rounded-md mb-5 border border-gray-700 text-center">
                    <p className="text-gray-300 font-mono text-sm">
                        &gt; USE <span className="text-white font-bold">W A S D</span> OR THE <span className="text-white font-bold">JOYSTICK</span> TO MOVE
                    </p>
                    <p className="text-gray-400 font-mono text-xs mt-1">
                        &gt; TRY PRESSING A KEY OR MOVING THE JOYSTICK
                    </p>
                </div>

                {/* ✅ WASD Key Layout */}
                <div className="bg-gray-800 p-3 rounded-md mb-5 border border-gray-700">
                    <p className="text-gray-300 text-center font-mono text-sm mb-2">
                        &gt; MOVEMENT CONTROLS:
                    </p>
                    <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-2">
                        <div className="text-center"></div>
                        <div className={getKeyClass('w')}>W</div>
                        <div className="text-center"></div>
                        <div className={getKeyClass('a')}>A</div>
                        <div className={getKeyClass('s')}>S</div>
                        <div className={getKeyClass('d')}>D</div>
                    </div>
                    <p className="text-gray-400 text-center font-mono text-xs">
                        &gt; PRESS KEYS TO TEST
                    </p>
                </div>

                {/* ✅ Render the Character */}
                <div className="flex justify-center mb-4">
                    <Character />
                </div>

                {/* ✅ Render the Joystick */}
                <div className="fixed bottom-4 right-4 z-70">
                    <Joystick />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={(e) => {
                            // Disable the button to prevent multiple clicks
                            const button = e.currentTarget as HTMLButtonElement;
                            button.disabled = true;
                            
                            // Make sure the button comes back up after being pressed
                            button.style.transform = '';
                            button.style.boxShadow = '0 4px 0 #2D3748, 0 5px 5px rgba(0, 0, 0, 0.3)';
                            
                            // Wait half a second before proceeding
                            setTimeout(() => {
                                onStartGame();
                            }, 500);
                        }}
                        className="bg-gray-700 text-white font-mono py-3 px-8 rounded-lg 
                        transition-transform duration-100 cursor-pointer 
                        border-2 border-gray-600
                        relative overflow-hidden
                        embossed-button"
                        style={{
                            boxShadow: '0 4px 0 #2D3748, 0 5px 5px rgba(0, 0, 0, 0.3)',
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'translateY(3px)';
                            e.currentTarget.style.boxShadow = '0 1px 0 #2D3748, 0 2px 3px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseUp={(e) => {
                            // Only reset if not disabled
                            if (!(e.currentTarget as HTMLButtonElement).disabled) {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 4px 0 #2D3748, 0 5px 5px rgba(0, 0, 0, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            // Only reset if not disabled
                            if (!(e.currentTarget as HTMLButtonElement).disabled) {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 4px 0 #2D3748, 0 5px 5px rgba(0, 0, 0, 0.3)';
                            }
                        }}
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white to-transparent opacity-10"></span>
                        <span className="relative z-10">&gt;&gt; LAUNCH SEQUENCE &lt;&lt;</span>
                    </button>
                </div>

                <p className="text-gray-500 text-center mt-4 text-xs font-mono">
                    [C:\] v1.0.2 // MEMORY LOADED // AWAITING INPUT...
                </p>
            </div>
        </div>
    );
};

export default StartGameModal_02;
