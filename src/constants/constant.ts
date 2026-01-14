export const ROOM_SIZE = 16;

export const ROOM_HEIGHT = 5;

export const SAVE_KEY = 'gameSavePoint';


export const puzzleState = {
    hasKey: false,
    currentRound: 1,
    currentRoom: 1,
    keysCollected: 0,
    keysRequired: 1,
    timeRemaining: 90,
    gameStarted: false,
    gameOver: false,
    puzzleSolved: false,
    puzzleType: null as string | null
}                                          

export const MAX_INTERACTION_DISTANCE = 6.0;

export const MAX_RAYCAST_DISTANCE = 8.0;

export const puzzleTypes: { [key: number]: string } = {
    1: 'color',
    2: 'number',
    3: 'pattern',
    4: 'hidden',
    5: 'sound',
    6: 'master',
};