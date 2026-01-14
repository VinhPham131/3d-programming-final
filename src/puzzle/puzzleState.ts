import { puzzleState } from "../constants/constant";
export function resetRound() {
    puzzleState.hasKey = false;
    puzzleState.keysCollected = 0;
    puzzleState.keysRequired = 1;
    puzzleState.timeRemaining = Math.max(60, 90 - puzzleState.currentRound * 5);
    puzzleState.gameOver = false;
    puzzleState.puzzleSolved = false;
}

export function nextRound() {
    puzzleState.currentRound++;
    resetRound();
}

export function nextRoom() {
    puzzleState.currentRoom++;
    puzzleState.currentRound = 1;
    resetRound();
}

export function getCurrentRoomId() {
    return puzzleState.currentRoom;
}