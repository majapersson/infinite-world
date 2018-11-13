import {
  Color,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

import World from "./classes/World";
import Player from "./classes/Player";
import Camera from "./classes/Camera";
import Lights from "./classes/Lights";
import Ray from "./classes/Ray";

const scene = new Scene();
scene.background = new Color(0x78c9f2);

const renderer = new WebGLRenderer({ antialiasing: true });
const keymap = {};
const mouse = new Vector2();
mouse.isPressed = false;

const world = new World();

// Third person view
const player = new Player(world);
const camera = new Camera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const lights = new Lights(camera);
lights.add(scene);

const raycaster = new Ray();

// const controls = new THREE.OrbitControls(camera);

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.gammaOutput = true;
  document.body.appendChild(renderer.domElement);

  scene.add(player.mesh);
  world.addTo(scene);
}

export function animate() {
  requestAnimationFrame(animate);

  // Third person controls
  raycaster.setFromCamera(mouse, camera);
  const distance = raycaster.getDistance(scene, player);

  if (mouse.isPressed) {
    player.move(distance);
    player.updateHeight(world);
  }

  camera.update(player.mesh.position);
  world.update(player.mesh.position, scene);

  // controls.update();

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
