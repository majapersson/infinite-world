import {
  DirectionalLight,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Vector2,
  Vector3,
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
const mouse = new Vector2();
let mousePressed = false;
const raycaster = new Raycaster();

const terrain = new Terrain();
const player = new Player(terrain.getHeightAt(0, 0));
const rayGeometry = new SphereGeometry(0.1, 5, 5);
const rayMaterial = new MeshPhongMaterial({ color: 0xff0000 });
const rayHelper = new Mesh(rayGeometry, rayMaterial);

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  light.position.set(2, 5, 4);

  scene.add(terrain.mesh, player.mesh, light);
  camera.position.set(-0.6, 4, 4.5);
  scene.add(terrain.mesh, player.mesh, rayHelper, light);
  camera.position.set(-0.6, 4, 7);
  camera.lookAt(player.mesh.position);
}

export function animate() {
  requestAnimationFrame(animate);
  camera.position.x = player.mesh.position.x;
  camera.position.z = player.mesh.position.z + 4;
  raycaster.setFromCamera(mouse, camera);

  const intersections = raycaster.intersectObject(terrain.mesh);
  let direction;

  if (intersections.length !== 0) {
    direction = intersections[0].point;
    rayHelper.position.set(direction.x, direction.y, direction.z);
  }

  if (mousePressed) {
    player.move(direction, terrain);
  }

  renderer.render(scene, camera);
}
function handleMouseMove(e) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function handleClick(e) {
  mousePressed = !mousePressed;
}

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mousedown", handleClick);
window.addEventListener("mouseup", handleClick);
