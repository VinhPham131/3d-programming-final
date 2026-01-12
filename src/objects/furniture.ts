import { scene } from '../core/scene';
import { getFurnitureConfig, getRoomOrigin, getRoomSize } from '../core/roomManager';
import * as THREE from 'three';

let furnitureObjects: THREE.Object3D[] = [];

const tableGeometry = new THREE.BoxGeometry(1.5, 0.05, 1);
const tableMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.6,
    metalness: 0.1
});

const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12);
const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.7,
    metalness: 0.2
});

const chestGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.6);
const chestMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3728,
    roughness: 0.7,
    metalness: 0.1
});

const chestLockGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
const chestLockMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.9,
    roughness: 0.1
});

const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.5,
    metalness: 0.3
});

const bookshelfWidth = 0.3;
const bookshelfHeight = 1.8;
const bookshelfDepth = 0.6;
const bookshelfMaterial = new THREE.MeshStandardMaterial({
    color: 0x5C4033,
    roughness: 0.7,
    metalness: 0.1
});

const chairSeatGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
const chairSeatMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.6
});

const chairBackGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.05);
const chairBackMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.6
});

const vaseGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.35, 16);
const vaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A90E2,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x1a2a3a,
    emissiveIntensity: 0.2
});

const statueBaseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.1, 16);
const statueBodyGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 16);
const statueHeadGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const statueMaterial = new THREE.MeshStandardMaterial({
    color: 0xC0C0C0,
    roughness: 0.2,
    metalness: 0.8
});

const lampBaseGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 16);
const lampPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
const lampShadeGeometry = new THREE.ConeGeometry(0.12, 0.25, 16);
const lampBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x2C2C2C,
    roughness: 0.3,
    metalness: 0.7
});
const lampShadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFE5B4,
    roughness: 0.9,
    metalness: 0.0,
    emissive: 0xFFE5B4,
    emissiveIntensity: 0.3
});

const plantPotGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.2, 16);
const plantStemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
const plantLeafGeometry = new THREE.SphereGeometry(0.08, 8, 8);
const plantPotMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.7
});
const plantMaterial = new THREE.MeshStandardMaterial({
    color: 0x228B22,
    roughness: 0.8
});

const mirrorFrameGeometry = new THREE.BoxGeometry(1.0, 1.3, 0.15);
const mirrorFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B6914,
    roughness: 0.4,
    metalness: 0.5
});
const mirrorGlassGeometry = new THREE.PlaneGeometry(0.85, 1.15);
const mirrorGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x444444,
    emissiveIntensity: 0.1
});

const rugMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.9,
    metalness: 0.0
});

const clockCaseGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.15);
const clockFaceGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
const clockCaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.6,
    metalness: 0.2
});
const clockFaceMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5F5DC,
    roughness: 0.7
});

const paintingFrameGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.15);
const paintingFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B6914,
    roughness: 0.4,
    metalness: 0.3
});
const paintingCanvasGeometry = new THREE.PlaneGeometry(1.0, 1.3);
const paintingCanvasMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x8B7355 }),
    new THREE.MeshStandardMaterial({ color: 0x6B5B4A }),
    new THREE.MeshStandardMaterial({ color: 0x7A6B5A }),
    new THREE.MeshStandardMaterial({ color: 0x5A4A3A })
];

function createTable(pos : THREE.Vector3) {
    const table = new THREE.Mesh(tableGeometry, tableMaterial.clone());
    table.position.set(pos.x, pos.y, pos.z);
    table.name = 'table';
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);
    furnitureObjects.push(table);

    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(legGeometry, legMaterial.clone());
        const x = (i % 2) * 1.4 - 0.7;
        const z = Math.floor(i / 2) * 0.9 - 0.45;
        leg.position.set(pos.x + x, pos.y - 0.25, pos.z + z);
        leg.castShadow = true;
        scene.add(leg);
        furnitureObjects.push(leg);
    }
}

function createChest(pos : THREE.Vector3) {
    const chest = new THREE.Mesh(chestGeometry, chestMaterial.clone());
    chest.position.set(pos.x, pos.y, pos.z);
    chest.name = 'chest';
    chest.castShadow = true;
    chest.receiveShadow = true;
    scene.add(chest);
    furnitureObjects.push(chest);

    const chestLock = new THREE.Mesh(chestLockGeometry, chestLockMaterial.clone());
    chestLock.position.set(0, 0.25, 0.31);
    chest.add(chestLock);

    const bandGeometry = new THREE.BoxGeometry(0.82, 0.08, 0.02);
    const bandMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    for (let i = 0; i < 3; i++) {
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.position.set(0, -0.2 + i * 0.25, 0.31);
        chest.add(band);
    }
}

function createPillar(pos : THREE.Vector3) {
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial.clone());
    pillar.position.set(pos.x, pos.y, pos.z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    scene.add(pillar);
    furnitureObjects.push(pillar);

    const baseGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16);
    const base = new THREE.Mesh(baseGeometry, pillarMaterial.clone());
    base.position.set(pos.x, pos.y - 0.8, pos.z);
    base.castShadow = true;
    scene.add(base);
    furnitureObjects.push(base);

    const topGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16);
    const top = new THREE.Mesh(topGeometry, pillarMaterial.clone());
    top.position.set(pos.x, pos.y + 0.8, pos.z);
    top.castShadow = true;
    scene.add(top);
    furnitureObjects.push(top);
}

function createBookshelf(pos : THREE.Vector3) {
    const bookshelfGroup = new THREE.Group();
    bookshelfGroup.position.set(pos.x, pos.y, pos.z);

    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(bookshelfWidth, bookshelfHeight, bookshelfDepth),
        bookshelfMaterial.clone()
    );
    backPanel.position.set(0, 0, -bookshelfDepth / 2 + 0.05);
    backPanel.castShadow = true;
    backPanel.receiveShadow = true;
    bookshelfGroup.add(backPanel);

    for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(bookshelfWidth, 0.05, bookshelfDepth - 0.1),
            bookshelfMaterial.clone()
        );
        shelf.position.set(0, -0.6 + i * 0.6, 0);
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        bookshelfGroup.add(shelf);

        for (let j = 0; j < 4; j++) {
            const bookWidth = 0.05 + Math.random() * 0.02;
            const bookHeight = 0.25 + Math.random() * 0.1;
            const bookDepth = 0.35;
            const bookColors = [0x8B4513, 0x654321, 0xA0522D, 0xCD853F, 0xDEB887];
            const book = new THREE.Mesh(
                new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth),
                new THREE.MeshStandardMaterial({
                    color: bookColors[Math.floor(Math.random() * bookColors.length)],
                    roughness: 0.8
                })
            );
            book.position.set(
                -bookshelfWidth / 2 + bookWidth / 2 + j * (bookshelfWidth - bookWidth) / 3,
                -0.6 + i * 0.6 + bookHeight / 2,
                -0.05
            );
            book.castShadow = true;
            bookshelfGroup.add(book);
        }
    }

    const sidePanelGeometry = new THREE.BoxGeometry(0.05, bookshelfHeight, bookshelfDepth);
    const leftSide = new THREE.Mesh(sidePanelGeometry, bookshelfMaterial.clone());
    leftSide.position.set(-bookshelfWidth / 2 + 0.025, 0, 0);
    leftSide.castShadow = true;
    bookshelfGroup.add(leftSide);

    const rightSide = new THREE.Mesh(sidePanelGeometry, bookshelfMaterial.clone());
    rightSide.position.set(bookshelfWidth / 2 - 0.025, 0, 0);
    rightSide.castShadow = true;
    bookshelfGroup.add(rightSide);

    scene.add(bookshelfGroup);
    furnitureObjects.push(bookshelfGroup);
}

function createChair(pos : THREE.Vector3) {
    const chairGroup = new THREE.Group();
    chairGroup.position.set(pos.x, pos.y, pos.z);

    // Seat
    const seat = new THREE.Mesh(chairSeatGeometry, chairSeatMaterial.clone());
    seat.position.set(0, 0, 0);
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    // Back
    const back = new THREE.Mesh(chairBackGeometry, chairBackMaterial.clone());
    back.position.set(0, 0.325, -0.225);
    back.rotation.x = -0.1;
    back.castShadow = true;
    chairGroup.add(back);

    // Legs
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(legGeometry, legMaterial.clone());
        const x = (i % 2) * 0.4 - 0.2;
        const z = Math.floor(i / 2) * 0.4 - 0.2;
        leg.position.set(x, -0.2, z);
        leg.castShadow = true;
        chairGroup.add(leg);
    }

    scene.add(chairGroup);
    furnitureObjects.push(chairGroup);
}

function createVase(pos : THREE.Vector3) {
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial.clone());
    vase.position.set(pos.x, pos.y, pos.z);
    vase.castShadow = true;
    vase.receiveShadow = true;
    scene.add(vase);
    furnitureObjects.push(vase);

    // Vase decoration (rings)
    for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.13, 0.01, 8, 16),
            new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.9,
                roughness: 0.1
            })
        );
        ring.position.set(pos.x, pos.y - 0.1 + i * 0.15, pos.z);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
        furnitureObjects.push(ring);
    }
}

function createPainting(pos : THREE.Vector3, rotation : number) {
    const paintingGroup = new THREE.Group();
    paintingGroup.position.set(pos.x, pos.y, pos.z);
    paintingGroup.rotation.y = rotation;

    // Frame
    const frame = new THREE.Mesh(paintingFrameGeometry, paintingFrameMaterial.clone());
    frame.castShadow = true;
    frame.receiveShadow = true;
    paintingGroup.add(frame);

    // Canvas
    const canvasMaterial = paintingCanvasMaterials[Math.floor(Math.random() * paintingCanvasMaterials.length)].clone();
    const canvas = new THREE.Mesh(paintingCanvasGeometry, canvasMaterial);
    canvas.position.set(0, 0, 0.08);
    paintingGroup.add(canvas);

    scene.add(paintingGroup);
    furnitureObjects.push(paintingGroup);
}

function createStatue(pos : THREE.Vector3) {
    const statueGroup = new THREE.Group();
    statueGroup.position.set(pos.x, pos.y, pos.z);
    statueGroup.name = 'statue';

    // Base
    const base = new THREE.Mesh(statueBaseGeometry, statueMaterial.clone());
    base.position.y = 0.05;
    base.castShadow = true;
    statueGroup.add(base);

    // Body
    const body = new THREE.Mesh(statueBodyGeometry, statueMaterial.clone());
    body.position.y = 0.3;
    body.castShadow = true;
    statueGroup.add(body);

    // Head
    const head = new THREE.Mesh(statueHeadGeometry, statueMaterial.clone());
    head.position.y = 0.65;
    head.castShadow = true;
    statueGroup.add(head);

    scene.add(statueGroup);
    furnitureObjects.push(statueGroup);
}

function createLamp(pos : THREE.Vector3) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(pos.x, pos.y, pos.z);
    lampGroup.name = 'lamp';

    // Base
    const base = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial.clone());
    base.position.y = 0.075;
    base.castShadow = true;
    lampGroup.add(base);

    // Pole
    const pole = new THREE.Mesh(lampPoleGeometry, lampBaseMaterial.clone());
    pole.position.y = 0.4;
    pole.castShadow = true;
    lampGroup.add(pole);

    // Shade
    const shade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial.clone());
    shade.position.y = 0.7;
    shade.rotation.x = Math.PI;
    shade.castShadow = true;
    lampGroup.add(shade);

    // Add point light
    const light = new THREE.PointLight(0xFFE5B4, 0.8, 4);
    light.position.set(0, 0.7, 0);
    lampGroup.add(light);

    scene.add(lampGroup);
    furnitureObjects.push(lampGroup);
}

function createPlant(pos : THREE.Vector3) {
    const plantGroup = new THREE.Group();
    plantGroup.position.set(pos.x, pos.y, pos.z);
    plantGroup.name = 'plant';

    // Pot
    const pot = new THREE.Mesh(plantPotGeometry, plantPotMaterial.clone());
    pot.position.y = 0.1;
    pot.castShadow = true;
    plantGroup.add(pot);

    // Stems and leaves
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const stem = new THREE.Mesh(plantStemGeometry, plantMaterial.clone());
        stem.position.set(Math.cos(angle) * 0.05, 0.3, Math.sin(angle) * 0.05);
        stem.rotation.z = (Math.random() - 0.5) * 0.3;
        plantGroup.add(stem);

        const leaf = new THREE.Mesh(plantLeafGeometry, plantMaterial.clone());
        leaf.position.set(Math.cos(angle) * 0.1, 0.5, Math.sin(angle) * 0.1);
        leaf.scale.set(1, 1.5, 0.8);
        plantGroup.add(leaf);
    }

    scene.add(plantGroup);
    furnitureObjects.push(plantGroup);
}

function createMirror(pos : THREE.Vector3, rotation : number) {
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(pos.x, pos.y, pos.z);
    mirrorGroup.rotation.y = rotation;
    mirrorGroup.name = 'mirror';

    // Frame
    const frame = new THREE.Mesh(mirrorFrameGeometry, mirrorFrameMaterial.clone());
    frame.castShadow = true;
    frame.receiveShadow = true;
    mirrorGroup.add(frame);

    // Glass
    const glass = new THREE.Mesh(mirrorGlassGeometry, mirrorGlassMaterial.clone());
    glass.position.set(0, 0, 0.08);
    mirrorGroup.add(glass);

    scene.add(mirrorGroup);
    furnitureObjects.push(mirrorGroup);
}

function createRug(pos : THREE.Vector3, size : number = 3) {
    const rug = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size),
        rugMaterial.clone()
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(pos.x, 0.01, pos.z);
    rug.name = 'rug';
    rug.receiveShadow = true;
    scene.add(rug);
    furnitureObjects.push(rug);
}

function createClock(pos : THREE.Vector3, rotation : number) {
    const clockGroup = new THREE.Group();
    clockGroup.position.set(pos.x, pos.y, pos.z);
    clockGroup.rotation.y = rotation;
    clockGroup.name = 'clock';

    // Case
    const case_ = new THREE.Mesh(clockCaseGeometry, clockCaseMaterial.clone());
    case_.castShadow = true;
    clockGroup.add(case_);

    // Face
    const face = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial.clone());
    face.rotation.x = Math.PI / 2;
    face.position.z = 0.08;
    clockGroup.add(face);

    scene.add(clockGroup);
    furnitureObjects.push(clockGroup);
}

export function createFurniture(roomId : number) {
    clearFurniture();

    const furnitureConfig = getFurnitureConfig(roomId);
    const origin = getRoomOrigin(roomId);
    const roomHalf = getRoomSize() / 2;

    const placedBBoxes: THREE.Box3[] = [];

    furnitureConfig.forEach(item => {
        const basePos = {
            x: origin.x + (item.position.x || 0),
            y: (item.position.y || 0),
            z: origin.z + (item.position.z || 0)
        };

        // Clamp to room bounds (keep margin of 0.8)
        const margin = 0.8;
        basePos.x = Math.max(origin.x - roomHalf + margin, Math.min(origin.x + roomHalf - margin, basePos.x));
        basePos.z = Math.max(origin.z - roomHalf + margin, Math.min(origin.z + roomHalf - margin, basePos.z));

        let placed = false;
        let attempts = 0;
        let pos = { ...basePos };
        while (!placed && attempts < 8) {
            let obj = null;
            if (item.type === 'table') {
                obj = new THREE.Mesh(tableGeometry, tableMaterial.clone());
                obj.position.set(pos.x, pos.y, pos.z);
            } else if (item.type === 'chest') {
                obj = new THREE.Mesh(chestGeometry, chestMaterial.clone());
                obj.position.set(pos.x, pos.y, pos.z);
            } else if (item.type === 'pillar') {
                obj = new THREE.Mesh(pillarGeometry, pillarMaterial.clone());
                obj.position.set(pos.x, pos.y, pos.z);
            } else if (item.type === 'bookshelf') {
                obj = new THREE.Group();
                const bookshelfGroup = new THREE.Group();
                bookshelfGroup.position.set(pos.x, pos.y, pos.z);
                const backPanel = new THREE.Mesh(new THREE.BoxGeometry(bookshelfWidth, bookshelfHeight, bookshelfDepth), bookshelfMaterial.clone());
                backPanel.position.set(0, 0, -bookshelfDepth / 2 + 0.05);
                bookshelfGroup.add(backPanel);
                for (let i = 0; i < 3; i++) {
                    const shelf = new THREE.Mesh(new THREE.BoxGeometry(bookshelfWidth, 0.05, bookshelfDepth - 0.1), bookshelfMaterial.clone());
                    shelf.position.set(0, -0.6 + i * 0.6, 0);
                    bookshelfGroup.add(shelf);
                }
                obj = bookshelfGroup;
            } else if (item.type === 'chair') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
                const seat = new THREE.Mesh(chairSeatGeometry, chairSeatMaterial.clone());
                seat.position.set(0, 0, 0);
                obj.add(seat);
            } else if (item.type === 'vase') {
                obj = new THREE.Mesh(vaseGeometry, vaseMaterial.clone());
                obj.position.set(pos.x, pos.y, pos.z);
            } else if (item.type === 'painting') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
            } else if (item.type === 'statue') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
                const base = new THREE.Mesh(statueBaseGeometry, statueMaterial.clone());
                base.position.y = 0.05;
                obj.add(base);
                const body = new THREE.Mesh(statueBodyGeometry, statueMaterial.clone());
                body.position.y = 0.3;
                obj.add(body);
                const head = new THREE.Mesh(statueHeadGeometry, statueMaterial.clone());
                head.position.y = 0.65;
                obj.add(head);
            } else if (item.type === 'lamp') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
                const base = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial.clone());
                base.position.y = 0.075;
                obj.add(base);
                const pole = new THREE.Mesh(lampPoleGeometry, lampBaseMaterial.clone());
                pole.position.y = 0.4;
                obj.add(pole);
                const shade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial.clone());
                shade.position.y = 0.7;
                shade.rotation.x = Math.PI;
                obj.add(shade);
            } else if (item.type === 'plant') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
                const pot = new THREE.Mesh(plantPotGeometry, plantPotMaterial.clone());
                pot.position.y = 0.1;
                obj.add(pot);
                const stem = new THREE.Mesh(plantStemGeometry, plantMaterial.clone());
                stem.position.set(0, 0.3, 0);
                obj.add(stem);
            } else if (item.type === 'mirror') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
                obj.rotation.y = item.rotation || 0;
                const frame = new THREE.Mesh(mirrorFrameGeometry, mirrorFrameMaterial.clone());
                obj.add(frame);
                const glass = new THREE.Mesh(mirrorGlassGeometry, mirrorGlassMaterial.clone());
                glass.position.set(0, 0, 0.08);
                obj.add(glass);
            } else if (item.type === 'rug') {
                obj = new THREE.Mesh(
                    new THREE.PlaneGeometry(item.size || 3, item.size || 3),
                    rugMaterial.clone()
                );
                obj.rotation.x = -Math.PI / 2;
                obj.position.set(pos.x, 0.01, pos.z);
            } else if (item.type === 'clock') {
                obj = new THREE.Group();
                obj.position.set(pos.x, pos.y, pos.z);
                obj.rotation.y = item.rotation || 0;
                const case_ = new THREE.Mesh(clockCaseGeometry, clockCaseMaterial.clone());
                obj.add(case_);
                const face = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial.clone());
                face.rotation.x = Math.PI / 2;
                face.position.z = 0.08;
                obj.add(face);
            }

            // Check if obj was created, if not skip this item
            if (!obj) {
                console.warn(`[createFurniture] Unknown furniture type: ${item.type}, skipping`);
                return; // Skip this item in forEach
            }

            // Compute bounding box - ensure obj has geometry or children
            let bbox;
            if ((obj as THREE.Mesh).geometry || ((obj as THREE.Group).children && (obj as THREE.Group).children.length > 0)) {
                try {
                    bbox = new THREE.Box3().setFromObject(obj);
                } catch (e) {
                    console.warn(`[createFurniture] Error creating bbox for ${item.type}:`, e);
                    // Use default bbox
                    bbox = new THREE.Box3();
                    bbox.min.set(pos.x - 0.5, pos.y - 0.5, pos.z - 0.5);
                    bbox.max.set(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
                }
            } else {
                // Empty object, use default bbox
                bbox = new THREE.Box3();
                bbox.min.set(pos.x - 0.5, pos.y - 0.5, pos.z - 0.5);
                bbox.max.set(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
            }
            // If bbox is empty (some groups), expand to a small box around position
            if (bbox.isEmpty()) {
                bbox.min.set(pos.x - 0.5, pos.y - 0.5, pos.z - 0.5);
                bbox.max.set(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
            }

            // Check overlap
            let overlap = false;
            for (const b of placedBBoxes) {
                if (bbox.intersectsBox(b)) { overlap = true; break; }
            }

            if (!overlap) {
                // Place the real object via existing helpers to keep visual details
                if (item.type === 'table') createTable(pos as THREE.Vector3);
                else if (item.type === 'chest') createChest(pos as THREE.Vector3);
                else if (item.type === 'pillar') createPillar(pos as THREE.Vector3);
                else if (item.type === 'bookshelf') createBookshelf(pos as THREE.Vector3);
                else if (item.type === 'chair') createChair(pos as THREE.Vector3);
                else if (item.type === 'vase') createVase(pos as THREE.Vector3);
                else if (item.type === 'painting') createPainting(pos as THREE.Vector3, item.rotation || 0);
                else if (item.type === 'statue') createStatue(pos as THREE.Vector3);
                else if (item.type === 'lamp') createLamp(pos as THREE.Vector3);
                else if (item.type === 'plant') createPlant(pos as THREE.Vector3);
                else if (item.type === 'mirror') createMirror(pos as THREE.Vector3, item.rotation || 0);
                else if (item.type === 'rug') createRug(pos as THREE.Vector3, item.size || 3);
                else if (item.type === 'clock') createClock(pos as THREE.Vector3, item.rotation || 0);

                placedBBoxes.push(bbox);
                placed = true;
            } else {
                // Nudge towards room center slightly and retry
                const dirX = origin.x - pos.x;
                const dirZ = origin.z - pos.z;
                const len = Math.sqrt(dirX * dirX + dirZ * dirZ) || 1;
                pos.x += (dirX / len) * 0.6; // move 0.6 units toward center
                pos.z += (dirZ / len) * 0.6;
                attempts++;
            }
        }
        if (!placed) {
            // As fallback, place without check
            if (item.type === 'table') createTable(basePos as THREE.Vector3);
            else if (item.type === 'chest') createChest(basePos as THREE.Vector3);
            else if (item.type === 'pillar') createPillar(basePos as THREE.Vector3);
            else if (item.type === 'bookshelf') createBookshelf(basePos as THREE.Vector3);
            else if (item.type === 'chair') createChair(basePos as THREE.Vector3);
            else if (item.type === 'vase') createVase(basePos as THREE.Vector3);
            else if (item.type === 'painting') createPainting(basePos as THREE.Vector3, item.rotation || 0);
            else if (item.type === 'statue') createStatue(basePos as THREE.Vector3);
            else if (item.type === 'lamp') createLamp(basePos as THREE.Vector3);
            else if (item.type === 'plant') createPlant(basePos as THREE.Vector3);
            else if (item.type === 'mirror') createMirror(basePos as THREE.Vector3, item.rotation || 0);
            else if (item.type === 'rug') createRug(basePos as THREE.Vector3, item.size || 3);
            else if (item.type === 'clock') createClock(basePos as THREE.Vector3, item.rotation || 0);
        }
    });
}

export function clearFurniture() {
    furnitureObjects.forEach(obj => {
        scene.remove(obj);
    });
    furnitureObjects = [];
}

export function getFurnitureObjects() {
    return furnitureObjects;
}