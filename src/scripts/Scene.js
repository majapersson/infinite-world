import {
  DirectionalLight,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

import Terrain from "./classes/Terrain";
import Player from "./classes/Player";
import Camera from "./classes/Camera";
import { hemiLight, dirLight } from "./classes/Lights";

import { toRadians } from "./utils";

const scene = new Scene();

const renderer = new WebGLRenderer({ antialiasing: true });
const keymap = {};
const mouse = new Vector2();

const raycaster = new Raycaster();

const terrain = new Terrain();

const camera = new Camera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Third person view
// const player = new Player(terrain.getHeightAt(0, 0));
// const camera = new PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
camera.position.set(-2, 6, -5);
camera.lookAt(scene.position);

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  scene.add(terrain.mesh, hemiLight, dirLight);
}

export function animate() {
  requestAnimationFrame(animate);

  // First person controls
  camera.move(keymap, terrain);

  // Third person controls
  // raycaster.setFromCamera(mouse, camera);
  // const intersection = raycaster.intersectObject(terrain.mesh);
  // let direction = new Vector3();
  // if (intersection.length > 0) {
  //   direction = intersection[0].point;
  // }
  // player.move(direction, terrain);

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
