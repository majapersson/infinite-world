import {
  DirectionalLight,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from "three";

import Terrain from "./classes/Terrain";
import Player from "./classes/Player";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const light = new DirectionalLight(0xffffff, 0.5);

const renderer = new WebGLRenderer({ antialiasing: true });

const terrain = new Terrain();
const player = new Player(terrain.getHeightAt(0, 0));

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  light.position.set(2, 5, 4);

  scene.add(terrain.mesh, player.mesh, light);
  camera.position.set(-0.6, 4, 4.5);
  camera.lookAt(player.mesh.position);
  console.log(player.mesh);
}

export function animate() {
  requestAnimationFrame(animate);
  camera.position.x = player.mesh.position.x;
  camera.position.z = player.mesh.position.z + 4;

  renderer.render(scene, camera);
}
