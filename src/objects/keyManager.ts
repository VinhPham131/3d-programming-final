import { scene } from '../core/scene';
import * as THREE from 'three';
import { puzzleState } from '../constants/constant';
import { getRoomSize, getRoomOrigin } from '../core/roomManager';

let keys: THREE.Mesh[] = [];
const keyMeshes: THREE.Mesh[] = [];

function createKeyMesh(index : number) {
    const keyGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.08);
    const keyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.7,
        roughness: 0.4,
        emissive: 0xffd700,
        emissiveIntensity: 0.8
    });

    const key = new THREE.Mesh(keyGeometry, keyMaterial);
    key.name = 'key';
    key.userData.keyIndex = index;
    key.userData.originalY = 0;
    key.userData.rotationSpeed = 1.5 + Math.random() * 0.5;
    key.castShadow = true;
    key.receiveShadow = true;
    key.visible = true;

    const glowGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.15);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.6
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.name = 'glow';
    key.add(glow);
    key.userData.glowMaterial = glowMaterial;

    return key;
}

export function createKeys() {
    while (keys.length > 0) {
        const key = keys.pop();
        if (key && key.parent) {
            scene.remove(key);
            if (key.geometry) key.geometry.dispose();
            if (key.material) {
                if (Array.isArray(key.material)) {
                    key.material.forEach(m => m.dispose());
                } else {
                    key.material.dispose();
                }
            }
        }
    }
    keyMeshes.length = 0;

    const roomOrigin = getRoomOrigin(puzzleState.currentRoom);

    const numKeys = Math.max(1, puzzleState.keysRequired || 1);

    const roomSize = getRoomSize();
    const roomHalf = roomSize / 2;

    const keyPositions = [
        { x: -4, y: 1.5, z: -3 },
        { x: 4, y: 1.5, z: 3 }
    ];

    for (let i = 0; i < numKeys; i++) {
        let pos;
        if (i < keyPositions.length) {
            pos = keyPositions[i];
        } else {
            const angle = (i / numKeys) * Math.PI * 2;
            const radius = 4;
            pos = {
                x: Math.cos(angle) * radius,
                y: 1.5,
                z: Math.sin(angle) * radius
            };
        }

        pos.x = Math.max(-roomHalf + 1, Math.min(roomHalf - 1, pos.x));
        pos.z = Math.max(-roomHalf + 1, Math.min(roomHalf - 1, pos.z));

        const key = createKeyMesh(i);
        const worldX = roomOrigin.x + pos.x;
        const worldZ = roomOrigin.z + pos.z;
        key.position.set(worldX, pos.y, worldZ);
        key.userData.originalY = pos.y;
        key.visible = true;
        key.renderOrder = 999;

        scene.add(key);
        keys.push(key);
        keyMeshes.push(key);

        console.log(`[createKeys] Key ${i + 1}/${numKeys} created at (${worldX.toFixed(2)}, ${pos.y.toFixed(2)}, ${worldZ.toFixed(2)})`);
    }

    const keysInScene = scene.children.filter(c => c.name === 'key');
    console.log(`[createKeys] Created ${keys.length} keys, ${keysInScene.length} in scene`);

    if (keys.length !== keysInScene.length) {
        console.error(`[createKeys] WARNING: Key count mismatch! Created: ${keys.length}, In scene: ${keysInScene.length}`);
        // Re-add missing keys
        keys.forEach(key => {
            if (!key.parent) {
                scene.add(key);
                console.log(`[createKeys] Re-added missing key to scene`);
            }
        });
    }
}

export function animateKeys(time : number) {
    keyMeshes.forEach((key, index) => {
        if (key && key.parent) {
            key.visible = true;

            const phase = index * 0.5;
            key.position.y = key.userData.originalY + Math.sin(time * 1.5 + phase) * 0.15;
            key.rotation.y = time * key.userData.rotationSpeed;
            if (key.userData.glowMaterial) {
                key.userData.glowMaterial.opacity = 0.4 + Math.sin(time * 2 + phase) * 0.2;
            }
        }
    });
}

export function removeKey(keyObject: THREE.Mesh) {
    const index = keys.indexOf(keyObject);
    if (index > -1) {
        keys.splice(index, 1);
        keyMeshes.splice(index, 1);
        scene.remove(keyObject);
    }
}

export function clearKeys() {
    while (keys.length > 0) {
        const key = keys.pop();
        if (key && key.parent) {
            scene.remove(key);
            if (key.geometry) key.geometry.dispose();
            if (key.material) {
                if (Array.isArray(key.material)) {
                    key.material.forEach(m => m.dispose());
                } else {
                    key.material.dispose();
                }
            }
        }
    }
    keyMeshes.length = 0;
}

export function getKeys() {
    return keys;
}