export interface SceneConfig {
    name: string;
    hasCharacter: boolean;
    width: number;
    height: number;
}

export const sceneConfig: Record<string, SceneConfig> = {
    scene1: {
        name: "Beach Scene",
        hasCharacter: true,
        width: 957,
        height: 951,
    },
    scene2: {
        name: "Desert Scene",
        hasCharacter: true,
        width: 1500,
        height: 1283,
    },
    scene3: {
        name: "Computer Diorama",
        hasCharacter: true,
        width: 3778,
        height: 3930,
    },
};
