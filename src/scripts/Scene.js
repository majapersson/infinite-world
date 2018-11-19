import {
  Color,
  FogExp2,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

import Loader from "./classes/Loader";
import World from "./classes/World";
import Player from "./classes/Player";
import Camera from "./classes/Camera";
import Lights from "./classes/Lights";
import Ray from "./classes/Ray";

let scene,
  renderer,
  stats,
  callPanel,
  geometryPanel,
  world,
  camera,
  lights,
  raycaster,
  player,
  treeModels,
  flowerModels;

const mouse = new Vector2();
mouse.isPressed = false;

export async function loadModels() {
  const loader = new Loader();
  let treeCount = 3;
  let flowerCount = 3;

  treeModels = [];
  flowerModels = [];

  for (let i = 1; i <= treeCount; i++) {
    const model = await loader.loadModel(`tree${i}`);
    treeModels.push(model);
  }

  for (let i = 1; i <= flowerCount; i++) {
    const model = await loader.loadModel(`flower${i}`);
    flowerModels.push(model);
  }

  init();
}

export function init() {
  // Renderer settings
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.gammaOutput = true;
  document.body.appendChild(renderer.domElement);

  // Scene settings
  scene = new Scene();
  scene.background = new Color(0x78c9f2); // blue
  // scene.background = new Color(0xf0be7e); // yellow
  scene.fog = new FogExp2(0x78c9f2, 0.018);

  // Stats settings
  stats = new Stats();
  callPanel = stats.addPanel(new Stats.Panel("Calls", "#ff8", "#221"));
  geometryPanel = stats.addPanel(new Stats.Panel("Geometries", "#ff8", "#221"));
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0";
  document.body.appendChild(stats.domElement);

  // Init objects
  camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  lights = new Lights(camera);
  lights.addTo(scene);

  raycaster = new Ray();

  world = new World(treeModels, flowerModels);
  player = new Player(world);

  world.addTo(scene);
  player.addTo(scene);

  animate();
}

export function animate() {
  requestAnimationFrame(animate);

  if (mouse.isPressed) {
    player.move(mouse);
    player.updateHeight(world);
  }

  camera.update(player.mesh.position);
  world.update(player.mesh.position, scene);

  callPanel.update(renderer.info.render.calls, 460);
  geometryPanel.update(renderer.info.memory.geometries, 460);
  stats.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveMouse(event) {
  mouse.x = event.clientX / window.innerWidth;
  mouse.y = event.clientY / window.innerHeight;
}

function handleClick() {
  mouse.isPressed = !mouse.isPressed;
}

window.addEventListener("mousemove", moveMouse);
window.addEventListener("mousedown", handleClick);
window.addEventListener("mouseup", handleClick);
window.addEventListener("touchstart", handleClick);
window.addEventListener("touchend", handleClick);
window.addEventListener("touchmove", moveMouse);
window.addEventListener("resize", onWindowResize, false);
