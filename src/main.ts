import { scene } from './core/scene';
import { camera } from './core/camera';
import { renderer } from './core/renderer';
import './core/lights';
import { updateControls } from './controls/fpsControls';
import { puzzleState, puzzleTypes } from './constants/constant';
import { createFurniture } from './objects/furniture';
import { createRoom, createWorldGrid, getRoomConfig, getStartPosition, getTotalRooms } from './core/roomManager';
import { updateHUD, showMessage, showGameOver, hideGameOver, showVictory, hideVictory } from './hud/hud';
import { initAudio, playBackgroundMusic, playVictorySound, playGameOverSound} from './audio/audioManager';
import { updateNearbyObjects } from './interaction/raycaster';
import { createKeys, animateKeys } from './objects/keyManager';
import { spawnNPC, updateNPC, removeNPC } from './objects/npc';
import { door, animateDoor, setupDoor } from './objects/door';
import {createColorPuzzle, createNumberPuzzle, createPatternPuzzle, createHiddenObjectsPuzzle, updatePuzzle, cleanupPuzzle} from './puzzle/puzzleManager';
import { resetRound, nextRoom } from './puzzle/puzzleState';

import * as THREE from 'three';

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('error', (e) => {
  console.error('Runtime error', e.error || e.message || e);
  try { showMessage('Runtime error: ' + (e.error ? e.error.message : e.message), 8000); } catch (err) { console.error(err); }
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection', e.reason);
  try { showMessage('Unhandled rejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason), 8000); } catch (err) { console.error(err); }
});

window.addEventListener('doorEntered', () => {
  if (!puzzleState.gameOver && !roomCompleted) {
    roomCompleted = true;
    console.log('Door entered event received! Transitioning...');
    setTimeout(() => {
      transitionToNextRoom();
    }, 500);
  }
});

window.addEventListener('puzzleSolved', () => {
  console.log('Puzzle solved! Spawning key...');
  createKeys();
});

if (puzzleState.currentRoom >= 3) {
  const startPos = getStartPosition(puzzleState.currentRoom);
  const npcStartPos = {
    x: startPos.x + 6,
    z: startPos.z + 6
  };
  spawnNPC(npcStartPos as THREE.Vector3);
}

try { 
  (window as any).currentRoomId = puzzleState.currentRoom;
  createWorldGrid(3, 2, 1.0);
  createRoom(puzzleState.currentRoom);
  setupDoor(puzzleState.currentRoom);
  createFurniture(puzzleState.currentRoom);
  initPuzzleForRoom(puzzleState.currentRoom);
  resetRound();
  
  const startPos = getStartPosition(puzzleState.currentRoom);
  camera.position.set(startPos.x, startPos.y, startPos.z);
  initAudio(camera);
  playBackgroundMusic();
} catch (err : any) {
  console.error('Initialization error:', err);
  showMessage('Initialization error: ' + (err && err.message ? err.message : String(err)), 10000);

}

const clock = new THREE.Clock();
const gameStartTime = performance.now();
let roomCompleted = false;
let doorOpened = false;
let lastTime = performance.now();

function initPuzzleForRoom(roomNumber: number) {
  cleanupPuzzle();

  const puzzleType = puzzleTypes[roomNumber] || puzzleTypes[((roomNumber - 1) % 6) + 1];
  puzzleState.puzzleType = puzzleType;

  switch (puzzleType) {
    case 'color':
      createColorPuzzle(roomNumber);
      break;
    case 'number':
      createNumberPuzzle(roomNumber);
      break;
    case 'pattern':
      createPatternPuzzle(roomNumber);
      break;
    case 'hidden':
      createHiddenObjectsPuzzle(roomNumber);
      break;
    default:
      createColorPuzzle(roomNumber);
  }
}

function transitionToNextRoom() {
  if (puzzleState.currentRoom >= getTotalRooms()) {
    puzzleState.gameOver = true;
    puzzleState.gameStarted = false;

    removeNPC();

    const totalTime = Math.floor((performance.now() - gameStartTime) / 1000);

    playVictorySound();

    showVictory({
      totalTime: totalTime,
      totalRooms: getTotalRooms()
    });
    return;
  }

  nextRoom();
  (window as any).currentRoomId = puzzleState.currentRoom;

  createRoom(puzzleState.currentRoom);
  setupDoor(puzzleState.currentRoom);
  createFurniture(puzzleState.currentRoom);

  const startPos = getStartPosition(puzzleState.currentRoom);
  camera.position.set(startPos.x, startPos.y, startPos.z);

  showMessage('A companion joins you!', 2000);

  initPuzzleForRoom(puzzleState.currentRoom);

  if (puzzleState.currentRoom >= 3) {
    const npcStartPos = {
      x: startPos.x + 6,
      z: startPos.z + 6
    };
    spawnNPC(npcStartPos as THREE.Vector3);
    showMessage('A companion joins you!', 2000);
  } else {
    removeNPC();
  }

  roomCompleted = false;
  doorOpened = false;

  lastTime = performance.now();
  const roomConfig = getRoomConfig(puzzleState.currentRoom);
  showMessage(`${roomConfig.name} - Solve the puzzle!`, 3000);

}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  const currentTime = performance.now();

  if (puzzleState.hasKey && puzzleState.keysCollected >= puzzleState.keysRequired && door.userData.isOpen && !doorOpened) {
    doorOpened = true;
    const roomConfig = getRoomConfig(puzzleState.currentRoom);
    showMessage(`${roomConfig.name} completed! Walk through the door to next room!`, 3000);
    console.log('Door opened! doorOpened =', doorOpened);
  }

  if (puzzleState.gameStarted && !puzzleState.gameOver && !roomCompleted) {
    if (currentTime - lastTime >= 1000) {
      puzzleState.timeRemaining--;
      lastTime = currentTime;

      if (puzzleState.timeRemaining <= 0) {
        puzzleState.timeRemaining = 0;
        puzzleState.gameOver = true;
        puzzleState.gameStarted = false;
        playGameOverSound();
        showGameOver("Time's up! You ran out of time.");
      }
    }
  }

  if (puzzleState.currentRoom >= 3) {
    updateNPC(delta);
  }

  animateKeys(elapsed);
  updateControls(delta);
  animateDoor(delta);
  updateHUD();
  updateNearbyObjects();
  updatePuzzle(delta);
  renderer.render(scene, camera);
}

animate();

function restartGame() {
  console.log('Restarting game...');
  cleanupPuzzle();

  puzzleState.currentRoom = 1;
  puzzleState.currentRound = 1;
  resetRound();
  (window as any).currentRoomId = puzzleState.currentRoom;

  createRoom(puzzleState.currentRoom);
  setupDoor(puzzleState.currentRoom);
  createFurniture(puzzleState.currentRoom);

  initPuzzleForRoom(puzzleState.currentRoom);
  const startPos = getStartPosition(puzzleState.currentRoom);
  camera.position.set(startPos.x, startPos.y, startPos.z);

  removeNPC();
  if (puzzleState.currentRoom >= 3) {
    const npcStartPos = { x: startPos.x + 6, z: startPos.z + 6 };
    spawnNPC(npcStartPos as THREE.Vector3);
  }

  puzzleState.gameOver = false;
  puzzleState.gameStarted = true;
  roomCompleted = false;
  doorOpened = false;
  lastTime = performance.now();

  hideGameOver();
  hideVictory();

  showMessage('Game restarted. Good luck!', 2000);
}

(window as any).restartGame = restartGame;

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyR' && puzzleState.gameOver) {
    restartGame();
  }
});