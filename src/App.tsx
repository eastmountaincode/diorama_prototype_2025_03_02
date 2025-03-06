import { useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';
import GameSpace from './components/GameSpace';
import StartGameModal_01 from './components/modals/StartGameModal_01';

function App() {
  // Set to true while in development, TODO adjust this in prod !
  const [gameStarted, setGameStarted] = useState(true);

  return (
    <Provider store={store}>
      {/* h-screen sets the height to 100vh */}
      <div className="w-full flex flex-col bg-gray-200">
        <div className="flex-1 overflow-hidden">
          {gameStarted ? (
            <GameSpace />
          ) : (
            <StartGameModal_01 onStartGame={() => setGameStarted(true)} />
          )}
        </div>
      </div>
    </Provider>
  );
}

export default App;
