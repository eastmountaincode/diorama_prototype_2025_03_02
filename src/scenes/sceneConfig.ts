export interface SceneConfig {
    name: string;
    hasCharacter: boolean;
    width: number;
    height: number;
    scaleFactor?: number; // Optional scale factor for rendering
    startPosition?: { x: number; y: number }; // Optional starting position for the character
}

export const sceneConfig: Record<string, SceneConfig> = {
    scene1: {
        name: "Beach Scene",
        hasCharacter: true,
        width: 957,
        height: 951,
        scaleFactor: 1.0,
        startPosition: { x: 0, y: 0 }, // Center of the scene
    },
    scene2: {
        name: "Desert Scene",
        hasCharacter: true,
        width: 1500,
        height: 1283,
        scaleFactor: 1.0,
        startPosition: { x: 0, y: 0 }, // Center of the scene
    },
    scene3: {
        name: "Computer Diorama",
        hasCharacter: true,
        width: 3778,
        height: 3930,
        scaleFactor: 0.4, // Already scaled down in SceneThree
        startPosition: { x: 0, y: 0 }, // Center of the scene
    },
    sceneBlank: {
        name: "Blank Scene",
        hasCharacter: true,
        width: 2360,
        height: 1640,
        scaleFactor: 0.6, 
        startPosition: { x: 370, y: -200 }
    },
};
