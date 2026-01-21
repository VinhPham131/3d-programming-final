import { scene } from './scene';
import * as THREE from 'three';

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
mainLight.position.set(0, 4.5, 0);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 20;
mainLight.shadow.camera.left = -6;
mainLight.shadow.camera.right = 6;
mainLight.shadow.camera.top = 6;
mainLight.shadow.camera.bottom = -6;
mainLight.shadow.bias = -0.0001;
scene.add(mainLight);

const ceilingLight1 = new THREE.PointLight(0xffffee, 0.8, 8);
ceilingLight1.position.set(-3, 4, -3);
ceilingLight1.castShadow = true;
ceilingLight1.shadow.mapSize.width = 512;
ceilingLight1.shadow.mapSize.height = 512;
scene.add(ceilingLight1);

const ceilingLight2 = new THREE.PointLight(0xffffee, 0.8, 8);
ceilingLight2.position.set(3, 4, 3);
ceilingLight2.castShadow = true;
ceilingLight2.shadow.mapSize.width = 512;
ceilingLight2.shadow.mapSize.height = 512;
scene.add(ceilingLight2);

const accentLight1 = new THREE.PointLight(0xffaa88, 0.5, 6);
accentLight1.position.set(-4, 2.5, 4);
scene.add(accentLight1);

const accentLight2 = new THREE.PointLight(0x88aaff, 0.5, 6);
accentLight2.position.set(4, 2.5, -4);
scene.add(accentLight2);

