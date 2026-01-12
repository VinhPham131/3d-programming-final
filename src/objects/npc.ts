import { scene } from '../core/scene';
import { camera } from '../core/camera';
import * as THREE from 'three';
import { playNPCChaseSound } from '../audio/audioManager';

let npc: THREE.Object3D | null = null;
let npcAnimation: { time: number, baseY: number } | null = null;

function createNPC() {
    const npcGroup = new THREE.Group();

    const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.0, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9,
        metalness: 0.2,
        emissive: 0x330000,
        emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    npcGroup.add(body);

    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.9,
        emissive: 0x1a0000,
        emissiveIntensity: 0.2
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    npcGroup.add(head);

    const eyeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5, 
        roughness: 0.3,
        metalness: 0.1
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.08, 1.25, 0.18);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.08, 1.25, 0.18);
    head.add(rightEye);

    const leftEyeLight = new THREE.PointLight(0xff0000, 1, 5);
    leftEyeLight.position.copy(leftEye.position);
    head.add(leftEyeLight);

    const rightEyeLight = new THREE.PointLight(0xff0000, 1, 5);
    rightEyeLight.position.copy(rightEye.position);
    head.add(rightEyeLight);

    const mouthGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.02);
    const mouthMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x220000,
        emissiveIntensity: 0.5
    });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.05, 0.2);
    head.add(mouth);

    const hornGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const hornMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a0000,
        roughness: 0.7,
        emissive: 0x330000,
        emissiveIntensity: 0.4
    });

    const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
    leftHorn.position.set(-0.15, 1.45, 0);
    leftHorn.rotation.z = -0.3;
    npcGroup.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
    rightHorn.position.set(0.15, 1.45, 0);
    rightHorn.rotation.z = 0.3;
    npcGroup.add(rightHorn);

    const auraGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.y = 0.8;
    npcGroup.add(aura);
    npcGroup.userData.aura = aura;

    npcGroup.name = 'npc';
    npcGroup.position.set(0, 0, 0);

    scene.add(npcGroup);
    return npcGroup;
}

export function updateNPC(delta: number) {
    if (!npc) return;

    const npcPos = npc.position;
    const playerPos = camera.position;

    // Calculate direction to player
    const direction = new THREE.Vector3();
    direction.subVectors(playerPos, npcPos);
    direction.y = 0; // Keep on ground level

    const distance = direction.length();

    const captureDistance = 0.8;
    if (distance < 3 && distance > captureDistance) {
        playNPCChaseSound();
    }

    if (distance > captureDistance) {
        direction.normalize();
        const speed = 1.8;
        const moveDistance = speed * delta;

        direction.multiplyScalar(moveDistance);
        npcPos.add(direction);
        npcPos.y = 0.5;

        const lookAtPos = new THREE.Vector3(playerPos.x, npcPos.y, playerPos.z);
        npc.lookAt(lookAtPos);

        console.log(`NPC chasing: distance=${distance.toFixed(2)}, speed=${speed}, moving...`);
    } else {
        const lookAtPos = new THREE.Vector3(playerPos.x, npcPos.y, playerPos.z);
        npc.lookAt(lookAtPos);
    }

    if (!npcAnimation) {
        npcAnimation = { time: 0, baseY: 0.5 };
    }
    npcAnimation.time += delta * 2;
    npc.position.y = npcAnimation.baseY + Math.sin(npcAnimation.time) * 0.08;

    if (npc.userData.aura) {
        npc.userData.aura.rotation.y += delta * 2;
        const pulseScale = 1 + Math.sin(npcAnimation.time * 3) * 0.2;
        npc.userData.aura.scale.set(pulseScale, pulseScale, pulseScale);
        npc.userData.aura.material.opacity = 0.1 + Math.sin(npcAnimation.time * 4) * 0.05;
    }
}

export function spawnNPC(startPosition : THREE.Vector3) {
    if (npc) {
        scene.remove(npc);
        npc = null;
    }

    npc = createNPC();
    npc.position.set(startPosition.x, 0.5, startPosition.z);
    npcAnimation = { time: Math.random() * Math.PI * 2, baseY: 0.5 };

    return npc;
}

export function removeNPC() {
    if (npc) {
        scene.remove(npc);
        npc = null;
        npcAnimation = null;
    }
}

export function getNPC() {
    return npc;
}

