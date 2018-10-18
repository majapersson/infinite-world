import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from "three";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer({ antialiasing: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new PlaneGeometry(5, 5, 10, 10);
const material = new MeshBasicMaterial({ wireframe: true });
const plane = new Mesh(geometry, material);

plane.rotation.z = Math.PI / -3;
plane.rotation.x = Math.PI / -3;

scene.add(plane);
camera.position.z = 5;

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
