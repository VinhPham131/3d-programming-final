import * as THREE from 'three';
import { camera } from '../core/camera';
import { scene } from '../core/scene';
import { addItem } from '../puzzle/inventory';
import { puzzleState } from '../constants/constant';
import { showMessage, clearMessage } from '../hud/hud';
import { openDoor } from '../objects/door';
import { removeKey } from '../objects/keyManager';
import { getRoomConfig } from '../core/roomManager';
import { playKeyPickupSound, playDoorOpenSound } from '../audio/audioManager';
import { MAX_INTERACTION_DISTANCE, MAX_RAYCAST_DISTANCE } from '../constants/constant';

const raycaster = new THREE.Raycaster();
let highlightedObject: THREE.Object3D | null = null;
const originalMaterials = new Map();
let nearbyInteractable: { object: THREE.Object3D, distance: number } | null = null;

function getRaycastTarget() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let intersect of intersects) {
        let target = intersect.object;

        if (target.name === 'answer_board' || target.type === 'SpotLight') {
            continue;
        }

        if (target.name.startsWith('number_text_')) {
            target = target.parent as THREE.Object3D;
        }

        const isInteractable = target.name === 'puzzle_number_button' ||
            target.name === 'puzzle_tile' ||
            target.name === 'puzzle_orb';

        if (isInteractable && intersect.distance <= MAX_RAYCAST_DISTANCE) {
            return { object: target, distance: intersect.distance };
        }
    }

    return null;
}

function highlightObject(object: THREE.Object3D) {
    if (highlightedObject === object) return;

    if (highlightedObject && originalMaterials.has(highlightedObject)) {
        (highlightedObject as THREE.Mesh).material = originalMaterials.get(highlightedObject);
        originalMaterials.delete(highlightedObject);
    }

    highlightedObject = object;
    if (object && object instanceof THREE.Mesh && object.material) {
        originalMaterials.set(object, object.material);
        const highlightMaterial = object.material.clone();
        highlightMaterial.emissive = new THREE.Color(0x444444);
        highlightMaterial.emissiveIntensity = 0.5;
        object.material = highlightMaterial;
    }
}

function removeHighlight() {
    if (highlightedObject && originalMaterials.has(highlightedObject)) {
        (highlightedObject as THREE.Mesh).material = originalMaterials.get(highlightedObject);
        originalMaterials.delete(highlightedObject);
    }
    highlightedObject = null;
}

export function updateNearbyObjects() {
    const raycastTarget = getRaycastTarget();

    if (raycastTarget) {
        highlightObject(raycastTarget.object);
        nearbyInteractable = raycastTarget;

        if (raycastTarget.object.name === 'puzzle_number_button') {
            showMessage(`[E] Press number ${raycastTarget.object.userData.number}`, 0);
        } else if (raycastTarget.object.name === 'puzzle_orb') {
            showMessage(`[E] Touch the colored orb`, 0);
        } else if (raycastTarget.object.name === 'puzzle_tile') {
            showMessage(`[E] Touch the sample tile`, 0);
        }

        return;
    }

    let closestObject: THREE.Object3D | null = null;
    let closestDistance = MAX_INTERACTION_DISTANCE;

    scene.traverse((child) => {
        const isInteractable = child.name === 'key' ||
            child.name === 'door' ||
            child.name === 'chest' ||
            child.name === 'puzzle_hidden_item';

        if (isInteractable) {
            const distance = camera.position.distanceTo(child.position);
            if (distance <= MAX_INTERACTION_DISTANCE && distance < closestDistance) {
                closestObject = child as THREE.Object3D;
                closestDistance = distance;
            }
        }
    });

    if (closestObject) {
        const obj: THREE.Object3D = closestObject;
        highlightObject(obj);
        nearbyInteractable = { object: obj, distance: closestDistance };
        if (obj.name === 'door' && obj.userData.isOpen) {
            showMessage('🚪 [E] ENTER NEXT ROOM', 0);
        } else if (obj.name === 'door' && !obj.userData.isOpen) {
            showMessage('🔒 Door is locked - solve puzzle to open', 0);
        } else if (obj.name === 'key') {
            showMessage('🗝️ [E] PICK UP KEY', 0);
        } else if (obj.name === 'puzzle_hidden_item') {
            showMessage('💎 [E] COLLECT CRYSTAL', 0);
        } else {
            showMessage('[E] Interact', 0);
        }
    } else {
        removeHighlight();
        nearbyInteractable = null;
        clearMessage();
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'e') return;

    if (!nearbyInteractable) {
        return;
    }

    const { object } = nearbyInteractable;


    // Handle key pickup
    if (object.name === 'key') {
        puzzleState.keysCollected++;
        addItem('key');
        removeKey(object as THREE.Mesh);
        playKeyPickupSound();

        if (puzzleState.keysCollected >= puzzleState.keysRequired) {
            puzzleState.hasKey = true;
            showMessage(`Collected enough keys! (${puzzleState.keysCollected}/${puzzleState.keysRequired})`, 2000);
        } else {
            showMessage(`Picked up key! (${puzzleState.keysCollected}/${puzzleState.keysRequired})`, 2000);
        }
        removeHighlight();
        nearbyInteractable = null;
    }
    else if (object.name === 'door') {
        if (puzzleState.hasKey && puzzleState.keysCollected >= puzzleState.keysRequired) {
            if (!object.userData.isOpen) {
                openDoor();
                playDoorOpenSound();
                const roomConfig = getRoomConfig(puzzleState.currentRoom);
                showMessage(`✅ ${roomConfig.name} completed!\n🚪 Press E again to enter next room`, 4000);
            } else {
                showMessage('🎉 Moving to next room...', 1500);
                window.dispatchEvent(new CustomEvent('doorEntered'));
            }
        } else {
            const needed = puzzleState.keysRequired - puzzleState.keysCollected;
            showMessage(`Need ${needed} more key${needed > 1 ? 's' : ''}!`, 2000);
        }
    }
    else if (object.name === 'chest') {
        showMessage('Empty chest...', 2000);
    }
});
