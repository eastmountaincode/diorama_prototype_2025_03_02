import { atom } from "jotai";

export const currentSceneAtom = atom('scene1')
export const cameraPositionAtom = atom({ x: 0, y: 0, zoom: 1 });
export const mousePositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0})
