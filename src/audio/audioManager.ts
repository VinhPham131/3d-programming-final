import * as THREE from 'three';

const audioListener = new THREE.AudioListener();

let backgroundMusic: any | null = null;
let isFootstepPlaying = false;
let isMusicLoaded = false;

export function initAudio(camera : any) {
    camera.add(audioListener);
    console.log('Audio system initialized');
}

export function loadBackgroundMusic() {
    if (isMusicLoaded) return;

    backgroundMusic = new THREE.Audio(audioListener);

    const context = audioListener.context;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, context.currentTime);
    gainNode.gain.setValueAtTime(0.05, context.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    isMusicLoaded = true;
    console.log('Background music loaded');
}

// Play background music (ambient/creepy)
export function playBackgroundMusic() {
    if (!backgroundMusic) loadBackgroundMusic();

    const context = audioListener.context;

    function createAmbientSound() {
        const osc1 = context.createOscillator();
        const osc2 = context.createOscillator();
        const gainNode = context.createGain();
        const filter = context.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(110, context.currentTime); // A2
        osc2.frequency.setValueAtTime(165, context.currentTime); // E3

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, context.currentTime);

        gainNode.gain.setValueAtTime(0.03, context.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(context.destination);

        osc1.start();
        osc2.start();

        // Tạo hiệu ứng thay đổi tần số để âm thanh đáng sợ hơn
        setInterval(() => {
            const freq1 = 110 + Math.random() * 20;
            const freq2 = 165 + Math.random() * 20;
            osc1.frequency.setValueAtTime(freq1, context.currentTime);
            osc2.frequency.setValueAtTime(freq2, context.currentTime);
        }, 3000);
    }

    createAmbientSound();
    console.log('Background music playing');
}

export function playFootstepSound() {
    if (isFootstepPlaying) return;
    isFootstepPlaying = true;

    const context = audioListener.context;
    const bufferSize = context.sampleRate * 0.1; // 0.1 seconds of audio
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = context.createBufferSource();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    noiseSource.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, context.currentTime);

    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    noiseSource.start();
    noiseSource.stop(context.currentTime + 0.1);

    setTimeout(() => {
        isFootstepPlaying = false;
    }, 200);
}

// Play key pickup sound
export function playKeyPickupSound() {
    const context = audioListener.context;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);

    console.log('🔑 Key pickup sound played');
}

// Play door open sound
export function playDoorOpenSound() {
    const context = audioListener.context;

    // Creaking door sound (multiple frequencies)
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100 + i * 50, context.currentTime);
            oscillator.frequency.linearRampToValueAtTime(150 + i * 50, context.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0.2, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.5);
        }, i * 150);
    }

    console.log('🚪 Door open sound played');
}

// Play game over sound (scary)
export function playGameOverSound() {
    const context = audioListener.context;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, context.currentTime + 1);

    gainNode.gain.setValueAtTime(0.4, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 1);

    console.log('💀 Game over sound played');
}

// Play victory sound (happy)
export function playVictorySound() {
    const context = audioListener.context;

    // Victory fanfare with multiple notes
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, context.currentTime);

            gainNode.gain.setValueAtTime(0.3, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.5);
        }, index * 200);
    });

    console.log('🎉 Victory sound played');
}

// Play NPC chase sound (heartbeat effect)
export function playNPCChaseSound() {
    const context = audioListener.context;

    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, context.currentTime);

            gainNode.gain.setValueAtTime(0.3, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.1);
        }, i * 200);
    }
}

// Play wrong answer sound (error/fail sound)
export function playWrongAnswerSound() {
    const context = audioListener.context;
    
    // Create a harsh, dissonant sound for wrong answer
    const oscillator1 = context.createOscillator();
    const oscillator2 = context.createOscillator();
    const gainNode = context.createGain();

    oscillator1.type = 'sawtooth';
    oscillator2.type = 'square';
    
    // Dissonant frequencies
    oscillator1.frequency.setValueAtTime(200, context.currentTime);
    oscillator2.frequency.setValueAtTime(210, context.currentTime); // Slightly off for dissonance
    
    // Descending pitch for "failure" feeling
    oscillator1.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.3);
    oscillator2.frequency.exponentialRampToValueAtTime(105, context.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(context.currentTime + 0.3);
    oscillator2.stop(context.currentTime + 0.3);

    console.log('❌ Wrong answer sound played');
}

// Play success sound (puzzle solved)
export function playSuccessSound() {
    const context = audioListener.context;

    // Success melody with ascending notes
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6 (major chord progression)
    notes.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, context.currentTime);

            gainNode.gain.setValueAtTime(0.25, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.4);
        }, index * 150);
    });

    console.log('✅ Success sound played');
}

export function stopAllSounds() {
    // Web Audio API oscillators automatically stop
    console.log('All sounds stopped');
}