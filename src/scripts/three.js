import { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import Terrain from "./classes/Terrain";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer({ antialiasing: true });

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const terrain = new Terrain().mesh;

  scene.add(terrain);
  camera.position.z = 5;
}

export function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
