import { atom } from "jotai";

export const PROGRESS_BAR_MAX_TIME = 10;

export const currentSceneAtom = atom('sceneBlank')
export const cameraPositionAtom = atom({ x: 0, y: 0, zoom: 1 });
export const mousePositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0})
export const characterMovingDirectionAtom = atom<'up' | 'down' | 'left' | 'right' | 'upRight' | 'downRight' | 'upLeft' | 'downLeft' | 'idle'>('idle');

export const joystickInputAtom = atom({ x: 0, y: 0 })

// Atom to track if character is near the campfire
export const campfireProximityAtom = atom<boolean>(false);

// Atom to track the exact distance to the campfire (for debugging)
export const campfireDistanceAtom = atom<number>(0);

// Cool thing state
export const coolThingDistanceAtom = atom<number>(0);
export const coolThingProximityAtom = atom<boolean>(false);

// Cool thing progress state
export const coolThingProgressAtom = atom(0);

// Timer state atom
export const timerStateAtom = atom({
    timeRemaining: PROGRESS_BAR_MAX_TIME,
    isTimerExpired: false,
});

// Announcement state atom
export const announcementAtom = atom({
    show: false,
    type: 'none', // 'none', 'timeUp', 'achievement', etc.
    message: '',
});

