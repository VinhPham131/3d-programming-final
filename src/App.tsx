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
    setStartOverlayHidden(true);
    const startOverlay = document.getElementById("startOverlay");
    if (startOverlay) {
      startOverlay.classList.add("hidden");
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
          <h1>🎮 3D ESCAPE ROOM</h1>
          <p>🧩 Puzzle Edition</p>
          <p style={{ marginTop: "30px" }}>
            Solve puzzles • Collect keys • Escape the room<br />
            Avoid NPCs • Beat the clock
          </p>
          <p className="highlight" style={{ marginTop: "40px" }}>
            👆 CLICK TO START 👆
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: "20px", color: "rgba(255,255,255,0.6)" }}>
            WASD - Move | Mouse - Rotate | E - Interact
          </p>
        </div>
      </div>

      <div id="game-container" style={{ width: "100%", height: "100%" }} />

      <div id="hud">Solve puzzles to get keys!</div>
      <div id="inventory"></div>
      <div id="timer">Time: 1:30</div>
      <div id="round">Room 1</div>
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
          <h1>🎉 CHIẾN THẮNG! 🎉</h1>
          <div className="trophy">🏆</div>
          <div className="stars">⭐ ⭐ ⭐</div>
          <div className="victoryStats">
            <div><strong>CONGRATULATIONS!</strong></div>
            <div>You completed all rooms!</div>
            <div id="victoryTime">Time: --:--</div>
            <div id="victoryRooms">Rooms completed: 0</div>
          </div>
          <button className="playAgainButton" onClick={() => (window as any).restartGame()}>
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
