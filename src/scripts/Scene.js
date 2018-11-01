import {
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

import Terrain from "./classes/Terrain";
import Flower from "./classes/Flower";
import Tree from "./classes/Tree";
import Player from "./classes/Player";
import Camera from "./classes/Camera";
import Lights from "./classes/Lights";

import { toRadians } from "./utils";

const scene = new Scene();
scene.background = new THREE.Color(0x78c9f2);

const renderer = new WebGLRenderer({ antialiasing: true });
const keymap = {};
const mouse = new Vector2();
mouse.isPressed = false;

const raycaster = new Raycaster();

const terrain = new Terrain();

// Third person view
const player = new Player(terrain.getHeightAt(0, 0));
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-9, 15, -12);
camera.lookAt(scene.position);

const lights = new Lights(camera);
lights.add(scene);

const controls = new THREE.OrbitControls(camera);

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaOutput = true;
  document.body.appendChild(renderer.domElement);

  scene.add(terrain.mesh, player.mesh);
}

export function animate() {
  requestAnimationFrame(animate);

  // Third person controls
  // raycaster.setFromCamera(mouse, camera);
  // const intersection = raycaster.intersectObject(terrain.mesh);
  // let direction = new Vector3();
  // if (intersection.length > 0) {
  //   direction = intersection[0].point;
  // }
  //
  // if (mouse.isPressed) {
  //   player.move(direction, terrain);
  // }

  controls.update();

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

function handleClick() {
  mouse.isPressed = !mouse.isPressed;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.addEventListener("mousemove", moveMouse);
window.addEventListener("mousedown", handleClick);
window.addEventListener("mouseup", handleClick);
