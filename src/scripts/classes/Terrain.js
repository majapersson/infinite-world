import {
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry
} from "three";
import SimplexNoise from "simplex-noise";

const SIZE = 5;
const SEGMENTS = 20;
const ROTATION = Math.PI / -3;

const SMOOTHING = 0.4;
const HEIGHT = 0.5;

const simplex = new SimplexNoise();

export default class Terrain {
  constructor() {
    this.geometry = new PlaneBufferGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    this.setZ();
    this.material = new MeshBasicMaterial({ wireframe: true });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.z = ROTATION;
    this.mesh.rotation.x = ROTATION;
  }

  setZ() {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 0; i < vertices.length; i++) {
      if ((i + 1) % 3 === 0) {
        const x = vertices[i - 2];
        const y = vertices[i - 1];
        vertices[i] = simplex.noise2D(x * SMOOTHING, y * SMOOTHING) * HEIGHT;
      }
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
  }
}
