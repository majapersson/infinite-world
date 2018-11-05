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
import Ray from "./classes/Ray";

import { toRadians } from "./utils";

const scene = new Scene();
scene.background = new THREE.Color(0x78c9f2);

const renderer = new WebGLRenderer({ antialiasing: true });
const keymap = {};
const mouse = new Vector2();
mouse.isPressed = false;

const terrain = new Terrain();

// Third person view
const player = new Player(terrain.getHeightAt(0, 0));
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 9, 9);
camera.lookAt(scene.position);

const lights = new Lights(camera);
lights.add(scene);

const raycaster = new Ray();

// const controls = new THREE.OrbitControls(camera);
camera.position.set(0, 15, 12);

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
  raycaster.setFromCamera(mouse, camera);

  // const intersection = raycaster.intersectObject(terrain.mesh);
  //
  // let direction;
  // if (intersection.length > 0) {
  //   direction = intersection[0].point;
  // } else {
  //   const { x, y, z } = player.mesh.position;
  //   direction = new Vector3(x, y, z);
  // }
  //
  const distance = raycaster.getDistance(terrain, player);

  if (mouse.isPressed) {
    terrain.update(distance);
    //   player.move(direction, terrain);
    //   const { x, y, z } = player.mesh.position;
    //   camera.position.set(x, y + 9, z + 9);
  } else {
    terrain.update();
  }

  // controls.update();
  player.move(distance);
  player.update(terrain);

  // player.mesh.position.y =
  //   terrain.getHeightAt(
  //     player.mesh.position.x + terrain.offsetX,
  //     -player.mesh.position.z + terrain.offsetZ
  //   ) + 1;

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
