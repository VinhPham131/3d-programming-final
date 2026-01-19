import * as THREE from 'three';
export interface RoomOrigin {
    x: number;
    z: number;
}

export interface ColorData {
    name: string;
    color: number;
    emissive: number;
}

export interface MathData {
    a: number;
    b: number;
    c: number;
    d: number;
    equations: string[];
    finalCode: number;
}

export type PuzzleType = 'color' | 'number' | 'pattern' | 'hidden' | 'math' | null;

export interface PuzzleState {
    type: PuzzleType;
    sequence: (ColorData | number)[];
    playerSequence: (string | number)[];
    objects: THREE.Object3D[];
    completed: boolean;
    attempts: number;
    totalItems?: number;
    userData?: any;
}