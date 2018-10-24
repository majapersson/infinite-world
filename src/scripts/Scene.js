import { DirectionalLight, Scene, Vector2, WebGLRenderer } from "three";

import Terrain from "./classes/Terrain";
import Camera from "./classes/Camera";

import { toRadians } from "./utils";

const scene = new Scene();
const light = new DirectionalLight(0xffffff, 0.5);

const renderer = new WebGLRenderer({ antialiasing: true });
const keymap = {};
const mouse = new Vector2();

const terrain = new Terrain();
const camera = new Camera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  light.position.set(2, 5, 4);

  scene.add(terrain.mesh, light);
}

export function animate() {
  requestAnimationFrame(animate);

  camera.move(keymap, terrain);

  renderer.render(scene, camera);
}

function keyDown(e) {
  keymap[e.keyCode] = true;
}

function keyUp(e) {
  keymap[e.keyCode] = false;
}

function moveMouse(e) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.addEventListener("mousemove", moveMouse);
