import {
  BufferAttribute,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry
} from "three";
import SimplexNoise from "simplex-noise";

import { toRadians } from "../utils";

const SIZE = 10;
const SEGMENTS = 40;

const SMOOTHING = 4;
const HEIGHT = 1;

export default class Terrain {
  constructor() {
    this.size = SIZE;
    this.segments = SEGMENTS;
    this.simplex = new SimplexNoise(12345);

    this.geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.segments,
      this.segments
    );
    this.setHeight();
    this.material = new MeshPhongMaterial({
      color: 0x00ff00,
      shininess: 0
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = toRadians(-90);
  }

  setHeight() {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 0; i < vertices.length; i++) {
      if ((i + 1) % 3 === 0) {
        const x = vertices[i - 2];
        const y = vertices[i - 1];
        vertices[i] =
          this.simplex.noise2D(x / SMOOTHING, y / SMOOTHING) * HEIGHT;
      }
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    this.geometry.computeVertexNormals();
  }

  getHeightAt(y, x) {
    return this.simplex.noise2D(x / SMOOTHING, y / SMOOTHING) * HEIGHT;
  }
}
