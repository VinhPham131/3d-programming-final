import { scene } from './scene';
import * as THREE from 'three';
import { roomConfigs } from './room';
import { ROOM_SIZE, ROOM_HEIGHT } from '../constants/constant';
import { RoomOrigin } from '../interface/interface';

const roomOrigins: { [key: number]: RoomOrigin } = {}; 

let currentRoomObjects: {
    room: THREE.Mesh | null;
    floor: THREE.Mesh | null;
    ceiling: THREE.Mesh | null;
    carpet: THREE.Mesh | null;
    furniture: THREE.Object3D[];
    doorFrame: THREE.Object3D | null;
} = {
    room: null,
    floor: null,
    ceiling: null,
    carpet: null,
    furniture: [],
    doorFrame: null
};

export function getRoomConfig(roomId : number) {
    return roomConfigs.find(config => config.id === roomId) || roomConfigs[0];
}


export function createRoom(roomId : number) {
    // Remove old room objects
    clearRoom();

    const config = getRoomConfig(roomId);
    const origin = getRoomOrigin(roomId);

    // Create room walls with better material
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: config.wallColor,
        side: THREE.BackSide,
        roughness: 0.7,
        metalness: 0.1
    });
    const room = new THREE.Mesh(
        new THREE.BoxGeometry(ROOM_SIZE, ROOM_HEIGHT, ROOM_SIZE),
        wallMaterial
    );
    room.name = 'room';
    room.receiveShadow = true;
    room.position.set(origin.x, 0, origin.z);
    scene.add(room);

    // Create floor with pattern-like material
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: config.floorColor,
        roughness: 0.8,
        metalness: 0.05
    });
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE),
        floorMaterial
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.position.x = origin.x;
    floor.position.z = origin.z;
    floor.name = 'floor';
    floor.receiveShadow = true;
    scene.add(floor);

    // Create ceiling
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE),
        new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.9,
            metalness: 0.05
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = ROOM_HEIGHT;
    ceiling.position.x = origin.x;
    ceiling.position.z = origin.z;
    ceiling.name = 'ceiling';
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    currentRoomObjects.ceiling = ceiling;

    // Create carpet (decorative) - larger for bigger room
    const carpetSize = 6;
    const carpet = new THREE.Mesh(
        new THREE.PlaneGeometry(carpetSize, carpetSize),
        new THREE.MeshStandardMaterial({
            color: config.wallColor,
            roughness: 0.9,
            metalness: 0.0,
            emissive: config.wallColor,
            emissiveIntensity: 0.1
        })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.01;
    carpet.position.x = origin.x;
    carpet.position.z = origin.z;
    carpet.name = 'carpet';
    carpet.receiveShadow = true;
    scene.add(carpet);
    currentRoomObjects.carpet = carpet;

    return config;
}

export function clearRoom() {
    if (currentRoomObjects.room) {
        scene.remove(currentRoomObjects.room);
        currentRoomObjects.room = null;
    }
    if (currentRoomObjects.floor) {
        scene.remove(currentRoomObjects.floor);
        currentRoomObjects.floor = null;
    }
    if (currentRoomObjects.ceiling) {
        scene.remove(currentRoomObjects.ceiling);
        currentRoomObjects.ceiling = null;
    }
    if (currentRoomObjects.carpet) {
        scene.remove(currentRoomObjects.carpet);
        currentRoomObjects.carpet = null;
    }
    currentRoomObjects.furniture.forEach(obj => {
        scene.remove(obj);
    });
    currentRoomObjects.furniture = [];
    if (currentRoomObjects.doorFrame) {
        scene.remove(currentRoomObjects.doorFrame);
        currentRoomObjects.doorFrame = null;
    }
}

export function getFurnitureConfig(roomId: number) {
    const config = getRoomConfig(roomId);
    return config.furniture || [];
}

export function getDoorPosition(roomId: number) {
    const config = getRoomConfig(roomId);
    return config.doorPosition;
}

export function getDoorWorldPosition(roomId: number) {
    const local = getDoorPosition(roomId);
    const origin = getRoomOrigin(roomId);
    return { x: local.x + origin.x, z: local.z + origin.z };
}

export function getRoomSize() {
    return ROOM_SIZE;
}

export function createWorldGrid(columns = 1, rows = 1, spacing = 1.0) {
    const totalWidth = columns * ROOM_SIZE + Math.max(0, columns - 1) * spacing;
    const totalDepth = rows * ROOM_SIZE + Math.max(0, rows - 1) * spacing;
    const startX = -totalWidth / 2 + ROOM_SIZE / 2;
    const startZ = -totalDepth / 2 + ROOM_SIZE / 2;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (idx >= roomConfigs.length) break;
            const cfg = roomConfigs[idx];
            const x = startX + c * (ROOM_SIZE + spacing);
            const z = startZ + r * (ROOM_SIZE + spacing);
            roomOrigins[cfg.id] = { x, z };
            idx++;
        }
    }
}

export function getRoomOrigin(roomId: number): RoomOrigin {
    return roomOrigins[roomId] || { x: 0, z: 0 };
}

export function getTotalRooms() {
    return roomConfigs.length;
}

export function getStartPosition(roomId: number) {
    const config = getRoomConfig(roomId);
    const localDoor = config.doorPosition;
    const origin = getRoomOrigin(roomId);
    const startX = origin.x + (-localDoor.x * 0.4);
    const startZ = origin.z + (-localDoor.z * 0.4);
    return { x: startX, y: 1.6, z: startZ };
}