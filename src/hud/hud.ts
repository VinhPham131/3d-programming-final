import { puzzleState } from '../constants/constant';
import { getRoomConfig, getTotalRooms } from '../core/roomManager';

let messageTimeout: ReturnType<typeof setTimeout> | null = null;
let interactionEntries: string[] = [];
let interactionTitle = '';

export function updateHUD() {
    const hudElement = document.getElementById('hud');
    const timerElement = document.getElementById('timer');
    const roundElement = document.getElementById('round');
    const interactionElement = document.getElementById('interactionLog');

    if (hudElement) {
        let hudText = '';

        // Clear level completion condition
        if (puzzleState.puzzleSolved && puzzleState.hasKey && puzzleState.keysCollected >= puzzleState.keysRequired) {
            hudText = `✅ <span style="color: #00ff00; font-weight: bold;">COMPLETED!</span><br>
                 📍 Go to the <span style="color: #ffff00;">GOLDEN DOOR</span> and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> to proceed to the next room`;
        } else if (puzzleState.puzzleSolved && !puzzleState.hasKey) {
            hudText = `🎉 Puzzle solved!<br>
                 🗝️ Key has appeared - find and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> to collect`;
        } else if (!puzzleState.puzzleSolved) {
            // Instructions by puzzle type
            const roomNum = puzzleState.currentRoom;
            if (roomNum === 1) {
                hudText = `🎨 <strong>COLOR PUZZLE</strong><br>
                   👉 Point mouse at colored spheres and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> in the correct order<br>
                   📜 <span style="color: #d4af37;">Check the answer board on the right side of the room!</span>`;
            } else if (roomNum === 2) {
                hudText = `🔢 <strong>NUMBER PUZZLE</strong><br>
                   👉 Point mouse at numbers on the wall and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> to enter 4-digit code<br>
                   📜 <span style="color: #d4af37;">Check the answer board on the right side of the room!</span>`;
            } else if (roomNum === 3) {
                hudText = `🧩 <strong>PATTERN PUZZLE</strong><br>
                   👉 Watch the lit squares, then point mouse and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> in that order<br>
                   📜 <span style="color: #d4af37;">Check the answer board on the right side of the room!</span>`;
            } else if (roomNum === 4) {
                hudText = `🔍 <strong>FIND HIDDEN ITEMS</strong><br>
                   👉 Explore to find 5 golden crystals, stand near and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span><br>
                   📜 <span style="color: #d4af37;">Check the answer board on the right side of the room!</span>`;
            } else if (roomNum === 5) {
                hudText = `🎨 <strong>COLOR PUZZLE</strong><br>
                   👉 Point mouse at colored spheres and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> in the correct order<br>
                   📜 <span style="color: #d4af37;">Check the answer board on the right side of the room!</span>`;
            } else {
                hudText = `🔢 <strong>NUMBER PUZZLE</strong><br>
                   👉 Point mouse at numbers and press <span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px;">E</span> to enter code<br>
                   📜 <span style="color: #d4af37;">Check the answer board on the right side of the room!</span>`;
            }
        }

        hudElement.innerHTML = hudText;
    }

    if (interactionElement) {
        if (interactionTitle) {
            const content = interactionEntries.length > 0 ? interactionEntries.join(', ') : '—';
            interactionElement.innerHTML = `<strong>${interactionTitle}</strong><br>${content}`;
            interactionElement.style.display = 'block';
        } else {
            interactionElement.style.display = 'none';
        }
    }

    if (timerElement && puzzleState.gameStarted && !puzzleState.gameOver) {
        const minutes = Math.floor(puzzleState.timeRemaining / 60);
        const seconds = Math.floor(puzzleState.timeRemaining % 60);
        timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Red when time is low
        if (puzzleState.timeRemaining < 10) {
            timerElement.style.color = '#ff4444';
        } else if (puzzleState.timeRemaining < 20) {
            timerElement.style.color = '#ffaa44';
        } else {
            timerElement.style.color = '#ffffff';
        }
    }

    if (roundElement) {
        const roomConfig = getRoomConfig(puzzleState.currentRoom);
        roundElement.textContent = `${roomConfig.name} (Room ${puzzleState.currentRoom}/${getTotalRooms()})`;
    }
}

export function setInteractionLog(entries: Array<string | number>, title: string) {
    interactionEntries = entries.map(entry => String(entry));
    interactionTitle = title;
}

export function clearInteractionLog() {
    interactionEntries = [];
    interactionTitle = '';
}

export function showMessage(text : string, duration = 2000) {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = text;
        messageBox.style.display = 'block';
        messageBox.style.opacity = '1';

        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }

        if (duration > 0) {
            messageTimeout = setTimeout(() => {
                messageBox.style.opacity = '0';
                setTimeout(() => {
                    messageBox.style.display = 'none';
                }, 300);
            }, duration);
        }
    }
}

export function clearMessage() {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.style.display = 'none';
            messageBox.textContent = '';
        }, 300);
    }
}

export function showGameOver(reason = 'Game Over!') {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');

    

    if (gameOverScreen) {
        if (gameOverTitle) {
            gameOverTitle.textContent = 'GAME OVER';
        }
        if (gameOverMessage) {
            gameOverMessage.textContent = reason;
        }
        gameOverScreen.classList.add('show');
    }
}

export function hideGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.classList.remove('show');
    }
}

export function showVictory(stats : any) {
    const victoryScreen = document.getElementById('victoryScreen');
    const victoryTime = document.getElementById('victoryTime');
    const victoryRooms = document.getElementById('victoryRooms');

    if (victoryScreen) {
        // Display statistics
        if (stats.totalTime !== undefined) {
            const minutes = Math.floor(stats.totalTime / 60);
            const seconds = Math.floor(stats.totalTime % 60);
            if (victoryTime){
                victoryTime.textContent = `Total Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        if (stats.totalRooms !== undefined) {
            if (victoryRooms) {
                victoryRooms.textContent = `Rooms Completed: ${stats.totalRooms}`;
            }
        }

        victoryScreen.classList.add('show');

        // Create confetti effect
        createConfetti();
    }
}

export function hideVictory() {
    const victoryScreen = document.getElementById('victoryScreen');
    if (victoryScreen) {
        victoryScreen.classList.remove('show');
        // Remove confetti
        document.querySelectorAll('.confetti').forEach(el => el.remove());
    }
}

function createConfetti() {
    const colors = ['#8b0000', '#5d0000', '#3d0000', '#1a0000', '#ff0000', '#660000', '#440000', '#220000'];
    const confettiCount = 40;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 4 + 3) + 's';
            confetti.style.width = (Math.random() * 8 + 4) + 'px';
            confetti.style.height = (Math.random() * 20 + 10) + 'px';
            confetti.style.opacity = (Math.random() * 0.5 + 0.3).toString();
            document.body.appendChild(confetti);

            // Remove after animation ends
            setTimeout(() => confetti.remove(), 7000);
        }, i * 70);
    }
}

