import * as THREE from 'three';
import { scene } from '../core/scene';
import { showMessage, setInteractionLog, clearInteractionLog } from '../hud/hud';
import { puzzleState } from '../constants/constant';
import { getRoomOrigin } from '../core/roomManager';
import { RoomOrigin, ColorData, MathData, PuzzleState, PuzzleType } from '../interface/interface';
import { playWrongAnswerSound, playSuccessSound } from '../audio/audioManager';

let currentPuzzle: PuzzleState = {
    type: null,
    sequence: [],
    playerSequence: [],
    objects: [],
    completed: false,
    attempts: 3
};

let tileInteractionLog: string[] = [];

interface BonusCrystalsState {
    enabled: boolean;
    total: number;
    collected: number;
    objects: THREE.Object3D[];
}

let bonusCrystals: BonusCrystalsState = {
    enabled: false,
    total: 0,
    collected: 0,
    objects: []
};

function clearBonusCrystals() {
    bonusCrystals.objects.forEach(obj => scene.remove(obj));
    bonusCrystals.objects = [];
    bonusCrystals.enabled = false;
    bonusCrystals.total = 0;
    bonusCrystals.collected = 0;
}

function setupBonusCrystals(roomNumber: number) {
    clearBonusCrystals();
    bonusCrystals.enabled = true;
    bonusCrystals.total = 5;
    bonusCrystals.collected = 0;

    const roomOrigin = getRoomOrigin(roomNumber);
    const positions = [
        { x: roomOrigin.x - 5.5, y: 1.0, z: roomOrigin.z - 5.5 },
        { x: roomOrigin.x + 5.5, y: 1.0, z: roomOrigin.z - 5.5 },
        { x: roomOrigin.x - 5.5, y: 1.0, z: roomOrigin.z + 5.5 },
        { x: roomOrigin.x + 5.5, y: 1.0, z: roomOrigin.z + 5.5 },
        { x: roomOrigin.x + 0, y: 1.4, z: roomOrigin.z + 0 }
    ];

    positions.forEach((pos, index) => {
        const geometry = new THREE.OctahedronGeometry(0.25);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1
        });

        const item = new THREE.Mesh(geometry, material);
        item.position.set(pos.x, pos.y, pos.z);
        item.name = 'puzzle_hidden_item';
        item.userData.itemIndex = index;
        item.userData.rotationSpeed = 0.01 + Math.random() * 0.02;

        scene.add(item);
        bonusCrystals.objects.push(item);
    });
}

export function createColorPuzzle(roomNumber: number) {
    const colors: ColorData[] = [
        { name: 'RED', color: 0xff0000, emissive: 0xff0000 },
        { name: 'BLUE', color: 0x0000ff, emissive: 0x0000ff },
        { name: 'GREEN', color: 0x00ff00, emissive: 0x00ff00 },
        { name: 'YELLOW', color: 0xffff00, emissive: 0xffff00 }
    ];

    const sequence: ColorData[] = [];
    const sequenceLength = 5;
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    currentPuzzle.type = 'color';
    currentPuzzle.sequence = sequence;
    currentPuzzle.playerSequence = [];
    currentPuzzle.completed = false;
    currentPuzzle.objects = [];
    setInteractionLog([], 'Recent colors');
    clearBonusCrystals();

    const roomOrigin = getRoomOrigin(roomNumber);

    const colorNames: { [key: string]: string } = {
        'RED': 'RED',
        'BLUE': 'BLUE',
        'GREEN': 'GREEN',
        'YELLOW': 'YELLOW'
    };
    showMessage('🎨 COLOR PUZZLE: Touch the orbs in order: ' +
        sequence.map(c => colorNames[c.name]).join(' → '), 8000);

    const colorSequence = sequence.map(c => colorNames[c.name]);
    let answerText: string;
    if (colorSequence.join(' → ').length > 35) {
        const half = Math.ceil(colorSequence.length / 2);
        answerText = `COLOR ORDER:\n${colorSequence.slice(0, half).join(' → ')}\n${colorSequence.slice(half).join(' → ')}`;
    } else {
        answerText = `COLOR ORDER:\n${colorSequence.join(' → ')}`;
    }
    createAnswerBoard(roomOrigin, answerText, 'color');

    const positions = [
        { x: roomOrigin.x - 5, y: 1.5, z: roomOrigin.z - 5 },
        { x: roomOrigin.x + 5, y: 1.5, z: roomOrigin.z - 5 },
        { x: roomOrigin.x - 5, y: 1.5, z: roomOrigin.z + 5 },
        { x: roomOrigin.x + 5, y: 1.5, z: roomOrigin.z + 5 }
    ];

    colors.forEach((colorData, index) => {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: colorData.color,
            emissive: colorData.emissive,
            emissiveIntensity: 0.5,
            metalness: 0.5,
            roughness: 0.2
        });

        const orb = new THREE.Mesh(geometry, material);
        const pos = positions[index];
        orb.position.set(pos.x, pos.y, pos.z);
        orb.name = 'puzzle_orb';
        orb.userData.colorName = colorData.name;
        orb.userData.colorData = colorData;
        orb.userData.puzzleIndex = index;

        const light = new THREE.PointLight(colorData.color, 1, 3);
        light.position.copy(orb.position);
        scene.add(light);
        orb.userData.light = light;

        scene.add(orb);
        currentPuzzle.objects.push(orb);
    });

    console.log('✅ Color puzzle created at room origin:', roomOrigin);
    console.log('🎨 Color sequence:', sequence.map(c => c.name).join(' → '));
    console.log('📍 Orb positions:', positions);
}

export function createNumberPuzzle(roomNumber: number) {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const c = Math.floor(Math.random() * 9) + 1;
    const d = Math.floor(Math.random() * 9) + 1;

    const eq1 = a + b;
    const eq2 = a * 2;
    const eq3 = b + c;
    const eq4 = c - d;

    const mathData: MathData = {
        a,
        b,
        c,
        d,
        equations: [
            `a + b = ${eq1}`,
            `2a = ${eq2}`,
            `b + c = ${eq3}`,
            `c - d = ${eq4}`
        ],
        finalCode: parseInt(`${a}${b}${c}${d}`)
    };

    const code = [a, b, c, d];

    currentPuzzle.type = 'number';
    currentPuzzle.sequence = code;
    currentPuzzle.playerSequence = [];
    currentPuzzle.completed = false;
    currentPuzzle.objects = [];
    setInteractionLog([], 'Recent numbers');
    clearBonusCrystals();
    currentPuzzle.userData = { mathData };

    const roomOrigin = getRoomOrigin(roomNumber);
    const baseZ = roomOrigin.z - 7;

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const positions = [
        { x: roomOrigin.x - 3, y: 1.5, z: baseZ },
        { x: roomOrigin.x - 2, y: 1.5, z: baseZ },
        { x: roomOrigin.x - 1, y: 1.5, z: baseZ },
        { x: roomOrigin.x + 0, y: 1.5, z: baseZ },
        { x: roomOrigin.x + 1, y: 1.5, z: baseZ },
        { x: roomOrigin.x + 2, y: 1.5, z: baseZ },
        { x: roomOrigin.x + 3, y: 1.5, z: baseZ },
        { x: roomOrigin.x - 2.5, y: 1, z: baseZ },
        { x: roomOrigin.x - 1.5, y: 1, z: baseZ },
        { x: roomOrigin.x - 0.5, y: 1, z: baseZ }
    ];

    numbers.forEach((num, index) => {
        const button = createNumberButton(num, positions[index]);
        scene.add(button);
        currentPuzzle.objects.push(button);
    });

    const equationsText = mathData.equations.join('\n');
    const hintText = `Solve for a, b, c, d\nThen enter: abcd`;
    
    showMessage(`🧮 MATH PUZZLE: Solve the equations to find a, b, c, d. Then enter the 4-digit code (abcd)`, 12000);

    createAnswerBoard(roomOrigin, `\n\n\n\n${equationsText}\n\n${hintText}`, 'number');

}

export function createPatternPuzzle(roomNumber: number) {
    const patternLength = 5;
    const pattern: number[] = [];

    for (let i = 0; i < patternLength; i++) {
        pattern.push(Math.floor(Math.random() * 4));
    }

    currentPuzzle.type = 'pattern';
    currentPuzzle.sequence = pattern;
    currentPuzzle.playerSequence = [];
    currentPuzzle.completed = false;
    currentPuzzle.objects = [];
    setInteractionLog([], 'Recent tiles');
    tileInteractionLog = [];
    clearBonusCrystals();

    const roomOrigin = getRoomOrigin(roomNumber);

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
    const positions = [
        { x: roomOrigin.x - 2, y: 1.5, z: roomOrigin.z + 0 },
        { x: roomOrigin.x + 2, y: 1.5, z: roomOrigin.z + 0 },
        { x: roomOrigin.x + 0, y: 1.5, z: roomOrigin.z - 2 },
        { x: roomOrigin.x + 0, y: 1.5, z: roomOrigin.z + 2 }
    ];

    positions.forEach((pos, index) => {
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const material = new THREE.MeshStandardMaterial({
            color: colors[index],
            emissive: colors[index],
            emissiveIntensity: 0.3
        });

        const tile = new THREE.Mesh(geometry, material);
        tile.position.set(pos.x, pos.y, pos.z);
        tile.name = 'puzzle_tile';
        tile.userData.tileIndex = index;

        scene.add(tile);
        currentPuzzle.objects.push(tile);
    });

    showPatternSequence();

    showMessage(`🧩 PATTERN PUZZLE: Watch the tiles light up, then touch them in the correct order!`, 8000);

    const colorHints = ['RED', 'GREEN', 'BLUE', 'YELLOW'];
    const patternText = pattern.map(idx => colorHints[idx]).join(' → ');
    createAnswerBoard(roomOrigin, `PATTERN:\n${patternText}`, 'pattern');

    console.log('✅ Pattern puzzle created at room origin:', roomOrigin);
    console.log('🧩 Pattern:', pattern);
}

export function createHiddenObjectsPuzzle(roomNumber: number) {
    const itemCount = 5;

    currentPuzzle.type = 'hidden';
    currentPuzzle.sequence = [];
    currentPuzzle.playerSequence = [];
    currentPuzzle.completed = false;
    currentPuzzle.objects = [];
    currentPuzzle.totalItems = itemCount;
    setInteractionLog([], 'Items found');
    clearBonusCrystals();

    const roomOrigin = getRoomOrigin(roomNumber);

    const positions = [
        { x: roomOrigin.x - 5.5, y: 1.0, z: roomOrigin.z - 5.5 },
        { x: roomOrigin.x + 5.5, y: 1.0, z: roomOrigin.z - 5.5 },
        { x: roomOrigin.x - 5.5, y: 1.0, z: roomOrigin.z + 5.5 },
        { x: roomOrigin.x + 5.5, y: 1.0, z: roomOrigin.z + 5.5 },
        { x: roomOrigin.x + 0, y: 1.4, z: roomOrigin.z + 0 }
    ];

    positions.forEach((pos, index) => {
        const geometry = new THREE.OctahedronGeometry(0.25);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1
        });

        const item = new THREE.Mesh(geometry, material);
        item.position.set(pos.x, pos.y, pos.z);
        item.name = 'puzzle_hidden_item';
        item.userData.itemIndex = index;

        item.userData.rotationSpeed = 0.01 + Math.random() * 0.02;

        scene.add(item);
        currentPuzzle.objects.push(item);
    });

    showMessage(`🔍 FIND CRYSTALS: Collect all ${itemCount} golden crystals visible in the room!`, 10000);

    createAnswerBoard(roomOrigin, `CRYSTALS: ALL VISIBLE IN ROOM`, 'hidden');

    console.log('✅ Hidden objects puzzle created at room origin:', roomOrigin);
    console.log('🔍 Item count:', itemCount, 'Positions:', positions);
}

export function checkPuzzleInteraction(object: THREE.Object3D): boolean {
    if (bonusCrystals.enabled && object.name === 'puzzle_hidden_item') {
        return handleBonusCrystalClick(object);
    }

    if (!currentPuzzle.type || currentPuzzle.completed) return false;

    switch (currentPuzzle.type) {
        case 'color':
            return handleColorPuzzleClick(object);
        case 'number':
            return handleNumberPuzzleClick(object);
        case 'pattern':
            return handlePatternPuzzleClick(object);
        case 'hidden':
            return handleHiddenObjectClick(object);
    }

    return false;
}

function handleColorPuzzleClick(object: THREE.Object3D): boolean {
    if (object.name !== 'puzzle_orb') return false;

    const clickedColor = object.userData.colorName;

    const colorNames: { [key: string]: string } = {
        'RED': 'RED',
        'BLUE': 'BLUE',
        'GREEN': 'GREEN',
        'YELLOW': 'YELLOW'
    };

    currentPuzzle.playerSequence.push(clickedColor);
    if (currentPuzzle.playerSequence.length > currentPuzzle.sequence.length) {
        currentPuzzle.playerSequence.shift();
    }
    setInteractionLog(currentPuzzle.playerSequence as string[], 'Recent colors');

    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        object.material.emissiveIntensity = 1.5;
        setTimeout(() => {
            if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
                object.material.emissiveIntensity = 0.5;
            }
        }, 200);
    }

    const sequenceNames = (currentPuzzle.sequence as ColorData[]).map(color => color.name);
    const isCompleteAttempt = currentPuzzle.playerSequence.length === sequenceNames.length;
    const matchesSequence = isCompleteAttempt &&
        currentPuzzle.playerSequence.every((color, index) => color === sequenceNames[index]);

    if (matchesSequence) {
        if (puzzleState.currentRoom === 5) {
            currentPuzzle.completed = true;
            setupBonusCrystals(puzzleState.currentRoom);
            setInteractionLog([`0/${bonusCrystals.total}`], 'Crystals found');
            showMessage(`✅ Colors correct! Collect crystals (0/${bonusCrystals.total})`, 2000);
        } else {
            completePuzzle();
        }
    } else {
        showMessage(`${colorNames[clickedColor]}`, 800);
        if (isCompleteAttempt) {
            playWrongAnswerSound(); // Play error sound when wrong sequence is complete
            currentPuzzle.playerSequence = [];
            setInteractionLog([], 'Recent colors');
        }
    }

    return true;
}

function handleNumberPuzzleClick(object: THREE.Object3D): boolean {
    if (object.name !== 'puzzle_number_button') return false;

    const number = object.userData.number;
    currentPuzzle.playerSequence.push(number);
    if (currentPuzzle.playerSequence.length > currentPuzzle.sequence.length) {
        currentPuzzle.playerSequence.shift();
    }
    setInteractionLog(currentPuzzle.playerSequence as number[], 'Recent numbers');

    const originalScale = object.scale.clone();
    object.scale.set(0.9, 0.9, 0.9);
    setTimeout(() => {
        object.scale.copy(originalScale);
    }, 150);

    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        object.material.emissive.setHex(0x00ff00);
        object.material.emissiveIntensity = 0.8;
        setTimeout(() => {
            if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
                object.material.emissive.setHex(0x000000);
                object.material.emissiveIntensity = 0;
            }
        }, 300);
    }

    showMessage(`Entered: ${currentPuzzle.playerSequence.join('')}`, 1000);
    console.log('Number pressed:', number, 'Current code:', currentPuzzle.playerSequence.join(''));

    if (currentPuzzle.playerSequence.length === 4) {
        // Check if this is a math puzzle (has userData.mathData)
        if (currentPuzzle.userData && currentPuzzle.userData.mathData) {
            const enteredCode = parseInt(currentPuzzle.playerSequence.join(''));
            const correctCode = currentPuzzle.userData.mathData.finalCode;

            if (enteredCode === correctCode) {
                completePuzzle();
            } else {
                playWrongAnswerSound(); // Play error sound
                currentPuzzle.attempts--;
                const wrongSequence = currentPuzzle.playerSequence.join('');
                currentPuzzle.playerSequence = [];

                currentPuzzle.objects.forEach(btn => {
                    if (btn instanceof THREE.Mesh && btn.material instanceof THREE.MeshStandardMaterial) {
                        btn.material.emissive.setHex(0xff0000);
                        btn.material.emissiveIntensity = 0.5;
                    }
                });
                setTimeout(() => {
                    currentPuzzle.objects.forEach(btn => {
                        if (btn instanceof THREE.Mesh && btn.material instanceof THREE.MeshStandardMaterial) {
                            btn.material.emissive.setHex(0x000000);
                            btn.material.emissiveIntensity = 0;
                        }
                    });
                }, 500);

                if (currentPuzzle.attempts > 0) {
                    showMessage(`✗ Wrong code (${wrongSequence})! ${currentPuzzle.attempts} attempts remaining`, 2000);
                } else {
                    showMessage(`✗ Puzzle failed! Restarting...`, 2000);
                    currentPuzzle.attempts = 3;
                }
            }
            return true;
        }

        // Original number puzzle logic (for non-math puzzles)
        const correct = currentPuzzle.playerSequence.every((num, idx) =>
            num === currentPuzzle.sequence[idx]
        );

        if (correct) {
            completePuzzle();
        } else {
            playWrongAnswerSound(); // Play error sound
            currentPuzzle.attempts--;
            const wrongSequence = currentPuzzle.playerSequence.join('');
            currentPuzzle.playerSequence = [];

            currentPuzzle.objects.forEach(btn => {
                if (btn instanceof THREE.Mesh && btn.material instanceof THREE.MeshStandardMaterial) {
                    btn.material.emissive.setHex(0xff0000);
                    btn.material.emissiveIntensity = 0.5;
                }
            });
            setTimeout(() => {
                currentPuzzle.objects.forEach(btn => {
                    if (btn instanceof THREE.Mesh && btn.material instanceof THREE.MeshStandardMaterial) {
                        btn.material.emissive.setHex(0x000000);
                        btn.material.emissiveIntensity = 0;
                    }
                });
            }, 500);

            if (currentPuzzle.attempts > 0) {
                showMessage(`✗ Wrong code (${wrongSequence})! ${currentPuzzle.attempts} attempts remaining`, 2000);
            } else {
                showMessage(`✗ Puzzle failed! Restarting...`, 2000);
                currentPuzzle.attempts = 3;
            }
        }
    }

    return true;
}

function handlePatternPuzzleClick(object: THREE.Object3D): boolean {
    if (object.name !== 'puzzle_tile') return false;

    const tileIndex = object.userData.tileIndex;
    currentPuzzle.playerSequence.push(tileIndex);
    const tileNames = ['RED', 'GREEN', 'BLUE', 'YELLOW'];
    tileInteractionLog.push(tileNames[tileIndex] ?? String(tileIndex));
    if (tileInteractionLog.length > currentPuzzle.sequence.length) {
        tileInteractionLog.shift();
    }
    setInteractionLog(tileInteractionLog, 'Recent tiles');

    if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        object.material.emissiveIntensity = 1.0;
        setTimeout(() => {
            if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
                object.material.emissiveIntensity = 0.3;
            }
        }, 200);
    }

    if (currentPuzzle.playerSequence.length === currentPuzzle.sequence.length) {
        const matchesPattern = currentPuzzle.playerSequence.every(
            (value, index) => value === currentPuzzle.sequence[index]
        );

        if (matchesPattern) {
            completePuzzle();
        } else {
            playWrongAnswerSound(); // Play error sound
            currentPuzzle.attempts--;
            currentPuzzle.playerSequence = [];
            tileInteractionLog = [];
            setInteractionLog([], 'Recent tiles');

            if (currentPuzzle.attempts > 0) {
                showMessage(`✗ Wrong! Watch again. ${currentPuzzle.attempts} attempts remaining`, 2000);
                setTimeout(showPatternSequence, 2000);
            } else {
                showMessage(`✗ Puzzle failed! Restarting...`, 2000);
                currentPuzzle.attempts = 3;
                setTimeout(showPatternSequence, 2000);
            }
        }
    }

    return true;
}

function handleHiddenObjectClick(object: THREE.Object3D): boolean {
    if (object.name !== 'puzzle_hidden_item') return false;

    scene.remove(object);
    currentPuzzle.objects = currentPuzzle.objects.filter(obj => obj !== object);
    currentPuzzle.playerSequence.push(object.userData.itemIndex);
    setInteractionLog([`${currentPuzzle.playerSequence.length}/${currentPuzzle.totalItems}`], 'Items found');

    showMessage(`🔍 Found ${currentPuzzle.playerSequence.length}/${currentPuzzle.totalItems}!`, 1000);

    if (currentPuzzle.playerSequence.length === currentPuzzle.totalItems) {
        completePuzzle();
    }

    return true;
}

function handleBonusCrystalClick(object: THREE.Object3D): boolean {
    if (object.name !== 'puzzle_hidden_item' || !bonusCrystals.enabled) return false;

    scene.remove(object);
    bonusCrystals.objects = bonusCrystals.objects.filter(obj => obj !== object);
    bonusCrystals.collected++;

    setInteractionLog([`${bonusCrystals.collected}/${bonusCrystals.total}`], 'Crystals found');
    showMessage(`💎 Crystals ${bonusCrystals.collected}/${bonusCrystals.total}`, 1000);

    if (currentPuzzle.completed && bonusCrystals.collected >= bonusCrystals.total) {
        completePuzzle();
    }

    return true;
}

function showPatternSequence() {
    showMessage('👀 Watch the pattern...', 1000);

    currentPuzzle.sequence.forEach((tileIndex, sequenceIndex) => {
        setTimeout(() => {
            const tile = currentPuzzle.objects[tileIndex as number];
            if (tile && tile instanceof THREE.Mesh && tile.material instanceof THREE.MeshStandardMaterial) {
                tile.material.emissiveIntensity = 1.5;
                setTimeout(() => {
                    if (tile instanceof THREE.Mesh && tile.material instanceof THREE.MeshStandardMaterial) {
                        tile.material.emissiveIntensity = 0.3;
                    }
                }, 500);
            }
        }, sequenceIndex * 800);
    });

    setTimeout(() => {
        showMessage('Now repeat the pattern!', 2000);
    }, currentPuzzle.sequence.length * 800 + 500);
}

function completePuzzle() {
    currentPuzzle.completed = true;
    puzzleState.puzzleSolved = true;

    // Play success sound when puzzle is completed
    playSuccessSound();

    currentPuzzle.objects.forEach(obj => {
        if (obj.name === 'answer_board' || obj.type === 'SpotLight') {
            return;
        }

        if (obj.userData.light) {
            scene.remove(obj.userData.light);
        }
        scene.remove(obj);
    });

    showMessage('🎉 Puzzle solved! The key has appeared!', 3000);
    console.log('Puzzle completed!');

    clearBonusCrystals();
    clearInteractionLog();
    window.dispatchEvent(new CustomEvent('puzzleSolved'));
}

export function updatePuzzle(delta: number) {
    if (!currentPuzzle.objects || currentPuzzle.completed) return;

    if (currentPuzzle.type === 'hidden') {
        currentPuzzle.objects.forEach(obj => {
            if (obj.name === 'answer_board' || obj.type === 'SpotLight') return;

            if (obj instanceof THREE.Mesh && obj.rotation) {
                obj.rotation.y += obj.userData.rotationSpeed || 0;
                obj.rotation.x += (obj.userData.rotationSpeed || 0) * 0.5;
            }
        });
    }
}

export function cleanupPuzzle() {
    currentPuzzle.objects.forEach(obj => {
        if (obj.userData.light) {
            scene.remove(obj.userData.light);
        }
        scene.remove(obj);
    });

    currentPuzzle = {
        type: null,
        sequence: [],
        playerSequence: [],
        objects: [],
        completed: false,
        attempts: 3
    };
    clearBonusCrystals();
    clearInteractionLog();
}

function createNumberButton(number: number, position: { x: number; y: number; z: number }) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.15);
    const material = new THREE.MeshStandardMaterial({
        color: 0x444444,
        emissive: 0x000000,
        metalness: 0.6,
        roughness: 0.4
    });

    const button = new THREE.Mesh(geometry, material);
    button.position.set(position.x, position.y, position.z);
    button.name = 'puzzle_number_button';
    button.userData.number = number;

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return button;

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 128, 128);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 124, 124);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const textGeometry = new THREE.PlaneGeometry(0.45, 0.45);
    const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = 0.08;
    textMesh.name = 'number_text_' + number;
    button.add(textMesh);

    return button;
}

function createAnswerBoard(roomOrigin: RoomOrigin, answerText: string, puzzleType: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 500, 500);

    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('📜 ANSWER 📜', 256, 40);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = answerText.split('\n');

    let fontSize = 28;
    let lineHeight = 40;

    if (answerText.length > 40 || lines.some((line: string) => line.length > 30)) {
        fontSize = 22;
        lineHeight = 32;
    }

    ctx.font = `bold ${fontSize}px Arial`;

    const startY = 256 - ((lines.length - 1) * lineHeight / 2);

    lines.forEach((line: string, index: number) => {
        if (line.length > 35) {
            const words = line.split(' ');
            let currentLine = '';
            let yOffset = 0;

            words.forEach((word: string, wordIndex: number) => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > 450 && currentLine) {
                    ctx.fillText(currentLine, 256, startY + (index * lineHeight) + yOffset);
                    currentLine = word;
                    yOffset += lineHeight * 0.8;
                } else {
                    currentLine = testLine;
                }

                if (wordIndex === words.length - 1) {
                    ctx.fillText(currentLine, 256, startY + (index * lineHeight) + yOffset);
                }
            });
        } else {
            ctx.fillText(line, 256, startY + (index * lineHeight));
        }
    });

    const texture = new THREE.CanvasTexture(canvas);
    const boardGeometry = new THREE.PlaneGeometry(3, 3);
    const boardMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: false,
        emissive: 0xffff88,
        emissiveIntensity: 0.2
    });

    const board = new THREE.Mesh(boardGeometry, boardMaterial);

    board.position.set(roomOrigin.x + 7, 2, roomOrigin.z);
    board.rotation.y = -Math.PI / 2;
    board.name = 'answer_board';

    const spotlight = new THREE.SpotLight(0xffffaa, 1, 10, Math.PI / 6, 0.5, 1);
    spotlight.position.set(roomOrigin.x + 6, 3, roomOrigin.z);
    spotlight.target = board;
    scene.add(spotlight);

    scene.add(board);
    currentPuzzle.objects.push(board);
    currentPuzzle.objects.push(spotlight);

    console.log('📜 Answer board created with text:', answerText);
}

export function isPuzzleCompleted(): boolean {
    return currentPuzzle.completed;
}

export function getCurrentPuzzleType(): PuzzleType {
    return currentPuzzle.type;
}