import { scene } from './core/scene';
import { camera } from './core/camera';
import { renderer } from './core/renderer';
import './core/lights';
import { updateControls } from './controls/fpsControls';
import * as THREE from 'three';

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();


function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  updateControls(delta);
  renderer.render(scene, camera);
}

animate();

function restartGame() {
  console.log('Restarting game...');
}

(window as any).restartGame = restartGame;

