import {
  BufferAttribute,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Vector3
} from "three";
import SimplexNoise from "simplex-noise";

import { toRadians } from "../utils";

import Tree from "./Tree";
import Flower from "./Flower";

const SIZE = 50;
const SEGMENTS = SIZE / 2;

const SMOOTHING = 10;
const HEIGHT = 1;

export default class Terrain {
  constructor(scene) {
    this.size = SIZE;
    this.segments = SEGMENTS;
    this.simplex = new SimplexNoise(12345);

    this.geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.segments * 1.2,
      this.segments
    );
    this.setHeight();
    this.material = new MeshPhongMaterial({
      color: 0x00ff00,
      flatShading: true,
      shininess: 0
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.name = "Terrain";
    this.mesh.rotateX(toRadians(-90));

    this.scene = scene;
    this.treeSpread = 4;
    this.flowerSpread = 2;
    this.splitVertices();
    this.addTrees();
    this.addFlowers();
  }

  setHeight() {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 0; i < vertices.length; i++) {
      if ((i + 1) % 3 === 0) {
        const x = vertices[i - 2];
        const y = vertices[i - 1];
        const z = vertices[i];
        vertices[i - 2] += this.simplex.noise2D(y, z);
        vertices[i - 1] += this.simplex.noise2D(x, z);

        vertices[i] =
          this.simplex.noise2D(x / SMOOTHING, y / SMOOTHING) * HEIGHT;
      }
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    this.geometry.computeVertexNormals();
  }

  getHeightAt(x, y) {
    return this.simplex.noise2D(x / SMOOTHING, y / SMOOTHING) * HEIGHT;
  }

  splitVertices() {
    const vertices = this.geometry.getAttribute("position").array;
    this.splitVertices = [];

    for (let i = 0; i < vertices.length; i++) {
      if ((i + 1) % 3 === 0) {
        this.splitVertices.push(
          new Vector3(vertices[i - 2], vertices[i - 1], vertices[i])
        );
      }
    }
  }

  addTrees(scene) {
    for (let i = 0; i < this.splitVertices.length; i += this.treeSpread) {
      const addTree =
        this.simplex.noise3D(
          this.splitVertices[i].x * SMOOTHING,
          this.splitVertices[i].y * SMOOTHING,
          this.splitVertices[i].z * SMOOTHING
        ) * 10;
      if (addTree > 6) {
        const tree = new Tree(this.scene, this.splitVertices[i], this.simplex);
      }
    }
  }
  addFlowers(scene) {
    for (let i = 0; i < this.splitVertices.length; i++) {
      const addFlower =
        this.simplex.noise3D(
          this.splitVertices[i].y / SMOOTHING,
          this.splitVertices[i].z / SMOOTHING,
          this.splitVertices[i].x / SMOOTHING
        ) * 10;
      if (addFlower > 5) {
        const flower = new Flower(
          this.scene,
          this.splitVertices[i],
          this.simplex
        );
      }
    }
  }
}
