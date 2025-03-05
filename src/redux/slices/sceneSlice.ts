import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define available scenes
export type SceneType = 'scene1' | 'scene2' | 'cutscene' | 'menu';

// Initial state
interface SceneState {
    currentScene: SceneType;
}

const initialState: SceneState = {
    currentScene: 'scene1', // Default scene
};

// Create the slice
const sceneSlice = createSlice({
    name: 'scene',
    initialState,
    reducers: {
        changeScene: (state, action: PayloadAction<SceneType>) => {
            state.currentScene = action.payload;
        }
    }
});

// Export actions
export const { changeScene } = sceneSlice.actions;

// Export reducer
export default sceneSlice.reducer;
