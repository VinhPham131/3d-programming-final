import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { camera } from '../core/camera';
import * as THREE from 'three';
import { door } from '../objects/door';
import { getRoomOrigin, getRoomSize, getDoorWorldPosition } from '../core/roomManager';
import { puzzleState } from '../constants/constant';
export const controls = new PointerLockControls(camera, document.body);

const instructions = document.getElementById('instructions');
const startOverlay = document.getElementById('startOverlay');
let firstClick = true;

document.addEventListener('click', () => {
    if (!controls.isLocked) {
        controls.lock();
        console.log('[fpsControls] Requesting pointer lock');

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

const moveSpeed = 5;

const PLAYER_RADIUS = 0.3;
const PLAYER_HEIGHT = 1.6;

function checkCollision(newPosition : any) {
    const roomOrigin = getRoomOrigin(puzzleState.currentRoom);
    const roomSize = getRoomSize();
    const roomHalf = roomSize / 2;
    const wallMargin = PLAYER_RADIUS + 0.1;

    const doorPos = getDoorWorldPosition(puzzleState.currentRoom);
    const doorDirection = door.userData.doorDirection;
    const doorOpen = door.userData.isOpen;
    const doorWidth = 1.2;

    let hitWall = false;

    if (newPosition.x < roomOrigin.x - roomHalf + wallMargin) {
        if (!doorOpen || doorDirection !== 'west' ||
            Math.abs(newPosition.z - doorPos.z) > doorWidth / 2) {
            hitWall = true;
        }
    } else if (newPosition.x > roomOrigin.x + roomHalf - wallMargin) {
        if (!doorOpen || doorDirection !== 'east' ||
            Math.abs(newPosition.z - doorPos.z) > doorWidth / 2) {
            hitWall = true;
        }
    }

    if (!hitWall) {
        if (newPosition.z < roomOrigin.z - roomHalf + wallMargin) {
            if (!doorOpen || doorDirection !== 'south' ||
                Math.abs(newPosition.x - doorPos.x) > doorWidth / 2) {
                hitWall = true;
            }
        } else if (newPosition.z > roomOrigin.z + roomHalf - wallMargin) {
            if (!doorOpen || doorDirection !== 'north' ||
                Math.abs(newPosition.x - doorPos.x) > doorWidth / 2) {
                hitWall = true;
            }
        }
    }

    if (hitWall) {
        return true;
    }

    if (newPosition.y < PLAYER_HEIGHT - 0.5 || newPosition.y > PLAYER_HEIGHT + 0.5) {
        return true;
    }

    const playerBox = new THREE.Box3();
    const playerSize = new THREE.Vector3(PLAYER_RADIUS * 2, PLAYER_HEIGHT, PLAYER_RADIUS * 2);
    playerBox.setFromCenterAndSize(newPosition, playerSize);

    if (door && !door.userData.isOpen) {
        const doorBox = new THREE.Box3().setFromObject(door);
        if (playerBox.intersectsBox(doorBox)) {
            return true;
        }
    }

    return false;
}

// Keyboard event listeners
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

    if (puzzleState.gameOver) return;

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

    if (direction.length() > 0) {
        direction.normalize();
        const moveDistance = moveSpeed * delta;
        const newPosition = camera.position.clone().add(direction.multiplyScalar(moveDistance));
        newPosition.y = PLAYER_HEIGHT;

        if (!checkCollision(newPosition)) {
            camera.position.copy(newPosition);
        }
        else {
            const newPosX = camera.position.clone();
            newPosX.x += direction.x * moveDistance;
            newPosX.y = PLAYER_HEIGHT;
            if (!checkCollision(newPosX)) {
                camera.position.x = newPosX.x;
            }

            const newPosZ = camera.position.clone();
            newPosZ.z += direction.z * moveDistance;
            newPosZ.y = PLAYER_HEIGHT;
            if (!checkCollision(newPosZ)) {
                camera.position.z = newPosZ.z;
            }
        }
    }

    camera.position.y = PLAYER_HEIGHT;

    const roomOrigin = getRoomOrigin(puzzleState.currentRoom);
    const roomSize = getRoomSize();
    const roomHalf = roomSize / 2;
    const safeMargin = PLAYER_RADIUS + 0.5;

    if (camera.position.x < roomOrigin.x - roomHalf + safeMargin) {
        camera.position.x = roomOrigin.x - roomHalf + safeMargin;
    } else if (camera.position.x > roomOrigin.x + roomHalf - safeMargin) {
        camera.position.x = roomOrigin.x + roomHalf - safeMargin;
    }

    if (camera.position.z < roomOrigin.z - roomHalf + safeMargin) {
        camera.position.z = roomOrigin.z - roomHalf + safeMargin;
    } else if (camera.position.z > roomOrigin.z + roomHalf - safeMargin) {
        camera.position.z = roomOrigin.z + roomHalf - safeMargin;
    }
}
