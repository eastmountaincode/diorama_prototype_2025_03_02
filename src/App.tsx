import { useState } from 'react';
import './App.css';
import Diorama from './components/Diorama/Diorama';
import StartGameModal_01 from './components/modals/StartGameModal_01';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-center text-2xl font-bold my-4 text-gray-800">
        Diorama_prototype_2025_03_02
      </h1>
      
      {gameStarted ? (
        <Diorama />
      ) : (
        <StartGameModal_01 onStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default App;