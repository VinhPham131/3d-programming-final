import React, { useEffect } from "react";
import "./App.css";
import { renderer } from "./core/renderer";
import "./main";

function App() {
  useEffect(() => {
    const container = document.getElementById("game-container");
    if (container && !container.contains(renderer.domElement)) {
      container.appendChild(renderer.domElement);
    }
  }, []);

  return (
    <div
      className="App"
      id="game-container"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

export default App;
