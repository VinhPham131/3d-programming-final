
});
const handle = new THREE.Mesh(handleGeometry, handleMaterial);
handle.position.set(0.4, 0, 0.11);
handle.rotation.z = Math.PI / 2;
door.add(handle);

const lockGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.05);
const lockMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.5
});
const lock = new THREE.Mesh(lockGeometry, lockMaterial);
lock.position.set(-0.3, 0, 0.11);
door.add(lock);

export function setupDoor(roomId : number) {
    const localDoorPos = getDoorPosition(roomId);
    const origin = getRoomOrigin(roomId);
    const doorPos = { x: localDoorPos.x + origin.x, z: localDoorPos.z + origin.z };
    const roomSize = getRoomSize();
    const roomHalf = roomSize / 2;
    const threshold = 0.5;

    let direction = 'south';
    let rotationY = 0;

    if (Math.abs(localDoorPos.z + roomHalf) < threshold) {
        direction = 'south'; 
        rotationY = 0;
    } else if (Math.abs(localDoorPos.z - roomHalf) < threshold) {
        direction = 'north';
        rotationY = Math.PI;
    } else if (Math.abs(localDoorPos.x - roomHalf) < threshold) {
        direction = 'east';
        rotationY = -Math.PI / 2;
    } else if (Math.abs(localDoorPos.x + roomHalf) < threshold) {
        direction = 'west';
        rotationY = Math.PI / 2;
    }

    door.userData.doorDirection = direction;
    door.userData.initialRotationY = rotationY;
    door.userData.initialPosition = { x: doorPos.x, z: doorPos.z };

    // Reset door state
    door.userData.isOpen = false;
    door.userData.openAngle = 0;
    door.rotation.y = rotationY;
    door.position.set(doorPos.x, 1, doorPos.z);

    // Update frame position and rotation
    frame.position.set(doorPos.x, 1, doorPos.z);
    frame.rotation.y = rotationY;

    // Reset lock
    lockMaterial.color.setHex(0xff0000);
    lockMaterial.emissive.setHex(0xff0000);
}

export function openDoor() {
    door.userData.isOpen = true;
    lockMaterial.color.setHex(0x00ff00);
    lockMaterial.emissive.setHex(0x00ff00);
    lockMaterial.emissiveIntensity = 1.0; // Bright green glow

    // Make door glow bright to indicate it's ready
    door.material.emissive.setHex(0xffff00); // Yellow glow
    door.material.emissiveIntensity = 0.3;
}

export function animateDoor(delta : any) {
    if (door.userData.isOpen && door.userData.openAngle < Math.PI / 2) {
        door.userData.openAngle += delta * 2;
        door.userData.openAngle = Math.min(door.userData.openAngle, Math.PI / 2);

        const direction = door.userData.doorDirection;
        const baseRot = door.userData.initialRotationY;
        const basePos = door.userData.initialPosition;
        const angle = door.userData.openAngle;

        if (direction === 'south') {
            door.rotation.y = baseRot + angle;
            door.position.x = basePos.x + Math.sin(angle) * 0.5;
            door.position.z = basePos.z + (1 - Math.cos(angle)) * 0.5;
        } else if (direction === 'north') {
            door.rotation.y = baseRot - angle;
            door.position.x = basePos.x - Math.sin(angle) * 0.5;
            door.position.z = basePos.z - (1 - Math.cos(angle)) * 0.5;
        } else if (direction === 'east') {
            door.rotation.y = baseRot + angle;
            door.position.x = basePos.x - (1 - Math.cos(angle)) * 0.5;
            door.position.z = basePos.z - Math.sin(angle) * 0.5;
        } else if (direction === 'west') {
            door.rotation.y = baseRot - angle;
            door.position.x = basePos.x + (1 - Math.cos(angle)) * 0.5;
            door.position.z = basePos.z + Math.sin(angle) * 0.5;
        }
    }
}