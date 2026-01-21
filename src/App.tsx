import React, { useEffect, useState } from "react";
import "./App.css";
import { renderer } from "./core/renderer";
import "./main";

function App() {
  const [startOverlayHidden, setStartOverlayHidden] = useState(false);

  useEffect(() => {
    const container = document.getElementById("game-container");
    if (container && !container.contains(renderer.domElement)) {
      container.appendChild(renderer.domElement);
    }
  }, []);

  const handleStartClick = () => {
    console.log('Start overlay clicked!');
    setStartOverlayHidden(true);
    const startOverlay = document.getElementById("startOverlay");
    if (startOverlay) {
      startOverlay.classList.add("hidden");
      setTimeout(() => {
        startOverlay.style.display = 'none';
      }, 500);
    }
    
    // Start the game by locking the pointer
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.click();
    }
  };

  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      {/* Start Overlay */}
      <div
        id="startOverlay"
        className={startOverlayHidden ? "hidden" : ""}
        onClick={handleStartClick}
        style={{ cursor: "pointer" }}
      >
        <div className="startContent">
          <h1>💀 ESCAPE THE NIGHTMARE 💀</h1>
          <p className="subtitle">Horror Puzzle Edition</p>
          <p style={{ marginTop: "30px", color: "rgba(200, 200, 200, 0.9)" }}>
            Solve deadly puzzles • Find hidden keys • Survive<br />
            Evade the darkness • Time is running out
          </p>
          <p className="highlight" style={{ marginTop: "40px" }}>
            ⚠️ ENTER IF YOU DARE ⚠️
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: "20px", color: "rgba(139, 0, 0, 0.8)" }}>
            WASD - Move | Mouse - Look Around | E - Interact
          </p>
          <p style={{ fontSize: "0.8rem", marginTop: "10px", color: "rgba(100, 100, 100, 0.8)", fontStyle: "italic" }}>
            Warning: Not for the faint of heart...
          </p>
        </div>
      </div>

      <div id="game-container" style={{ width: "100%", height: "100%" }} />

      <div id="hud">Solve puzzles to get keys!</div>
      <div id="timer">Time: 1:30</div>
      <div id="round">Room 1</div>
      <div id="interactionLog"></div>
      <div id="messageBox"></div>
      <div id="crosshair"></div>
      <div id="instructions">
        <strong>🎮 CLICK TO START</strong>
        <br />
        WASD move • Mouse rotate • E interact with puzzles
      </div>

      {/* Game Over Screen */}
      <div id="gameOverScreen">
        <div className="gameOverContent">
          <h1 id="gameOverTitle">GAME OVER</h1>
          <p id="gameOverMessage">You were caught by NPC!</p>
          <button className="restartButton" onClick={() => (window as any).restartGame()}>
            PLAY AGAIN
          </button>
        </div>
      </div>

      {/* Victory Screen */}
      <div id="victoryScreen">
        <div className="victoryContent">
          <h1>YOU ESCAPED...</h1>
          <div className="skull">💀</div>
          <div className="glitchText">But at what cost?</div>
          <div className="victoryStats">
            <div><strong>SURVIVAL STATISTICS</strong></div>
            <div>You managed to escape the nightmare...</div>
            <div id="victoryTime">Time: --:--</div>
            <div id="victoryRooms">Rooms survived: 0</div>
          </div>
          <button className="playAgainButton" onClick={() => (window as any).restartGame()}>
            ENTER AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
