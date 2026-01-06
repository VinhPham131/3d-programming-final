import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { camera } from '../core/camera';
import * as THREE from 'three';

export const controls = new PointerLockControls(camera, document.body);

const instructions = document.getElementById('instructions');
const startOverlay = document.getElementById('startOverlay');
let firstClick = true;

document.addEventListener('click', () => {
    if (!controls.isLocked) {
        controls.lock();
        console.log('[fpsControls] Requesting pointer lock');

        // Hide start overlay on first click
        if (firstClick && startOverlay) {
            startOverlay.classList.add('hidden');
            setTimeout(() => {
                startOverlay.style.display = 'none';
            }, 500);
            firstClick = false;
        }
    }
});

controls.addEventListener('lock', () => {
    console.log('[fpsControls] Pointer locked ✅');
    if (instructions) {
        instructions.style.opacity = '0.3';
    }
});

controls.addEventListener('unlock', () => {
    console.log('[fpsControls] Pointer unlocked');
    if (instructions) {
        instructions.style.opacity = '1';
    }
});

const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

const PLAYER_HEIGHT = 1.6;

document.addEventListener('keydown', (event) => {
    if (event.code.startsWith('Arrow')) event.preventDefault(); 
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveState.forward = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveState.backward = true;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveState.left = true;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveState.right = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code.startsWith('Arrow')) event.preventDefault();
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveState.forward = false;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveState.backward = false;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveState.left = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveState.right = false;
            break;
    }
});

export function updateControls(delta : any) {
    if (!controls.isLocked) return;

    const direction = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();

    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    if (moveState.forward) {
        direction.add(cameraDirection);
    }
    if (moveState.backward) {
        direction.sub(cameraDirection);
    }
    if (moveState.left) {
        direction.add(new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), cameraDirection));
    }
    if (moveState.right) {
        direction.sub(new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), cameraDirection));
    }
    camera.position.y = PLAYER_HEIGHT;
    camera.position.y = PLAYER_HEIGHT;
}

