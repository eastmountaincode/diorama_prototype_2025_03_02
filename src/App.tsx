import { useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';
import GameSpace from './components/GameSpace';
import StartGameModal_01 from './components/modals/StartGameModal_01';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <Provider store={store}>
      {/* h-screen sets the height to 100vh */}
      <div className="h-screen flex flex-col items-center justify-center bg-gray-200">
        <h3 className="text-center truncate font-bold mb-4 text-gray-800 w-full max-w-md">
          prototype_env_scrolling_2025_03_04
        </h3>

        {gameStarted ? (
          <GameSpace />
        ) : (
          <StartGameModal_01 onStartGame={() => setGameStarted(true)} />
        )}
      </div>
    </Provider>
  );
}

export default App;
