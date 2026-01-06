import { scene } from './core/scene';
import { camera } from './core/camera';
import { renderer } from './core/renderer';
import './core/lights';
import { updateControls } from './controls/fpsControls';
import { puzzleState } from './constants/constants';
import { createRoom, createWorldGrid, getStartPosition, getTotalRooms } from './core/roomManager';
import { door, animateDoor, setupDoor } from './objects/door';

import * as THREE from 'three';

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

try { 
  (window as any).currentRoomId = puzzleState.currentRoom;
  createWorldGrid(3, 2, 1.0);
  createRoom(puzzleState.currentRoom);
  setupDoor(puzzleState.currentRoom);
  
  const startPos = getStartPosition(puzzleState.currentRoom);
  camera.position.set(startPos.x, startPos.y, startPos.z);
} catch (err) {
  console.error('Initialization error:', err);
}

const clock = new THREE.Clock();
const gameStartTime = performance.now();
let roomCompleted = false;
let doorOpened = false;
let lastTime = performance.now();

function transitionToNextRoom() {
  if (puzzleState.currentRoom >= getTotalRooms()) {
    // CHIẾN THẮNG! Hoàn thành tất cả phòng
    puzzleState.gameOver = true;
    puzzleState.gameStarted = false;

    const totalTime = Math.floor((performance.now() - gameStartTime) / 1000);

    console.log(`🎉 VICTORY! Completed ${getTotalRooms()} rooms in ${totalTime}s`);
    return;
  }

  (window as any).currentRoomId = puzzleState.currentRoom;

  createRoom(puzzleState.currentRoom);
  setupDoor(puzzleState.currentRoom);

  const startPos = getStartPosition(puzzleState.currentRoom);
  camera.position.set(startPos.x, startPos.y, startPos.z);

  roomCompleted = false;
  doorOpened = false;

  lastTime = performance.now();
}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();

  if (puzzleState.hasKey && puzzleState.keysCollected >= puzzleState.keysRequired && door.userData.isOpen && !doorOpened) {
    doorOpened = true;
    console.log('Door opened! doorOpened =', doorOpened);
  }
  
  updateControls(delta);
  animateDoor(delta);
  renderer.render(scene, camera);
}

animate();

function restartGame() {
  console.log('Restarting game...');
}

(window as any).restartGame = restartGame;
