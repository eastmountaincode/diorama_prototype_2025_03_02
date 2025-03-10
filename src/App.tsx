import { useState } from 'react';
import './App.css';
import GameSpace from './components/GameSpace';
import StartGameModal_02 from './components/modals/StartGameModal_02';

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    return (

        <div className="w-full flex flex-col bg-gray-200" style={{ height: '100dvh' }}>
            <div className="flex-1 overflow-hidden">
                {gameStarted ? (
                    <GameSpace />
                ) : (
                    <StartGameModal_02 onStartGame={() => setGameStarted(true)} />
                )}
            </div>
        </div>
    );
}

export default App;
