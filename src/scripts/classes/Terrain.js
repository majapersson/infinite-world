import {
  BufferAttribute,
  Color,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Vector3
} from "three";
import SimplexNoise from "simplex-noise";

import { roundTwoDecimals } from "../utils";

import Tree from "./Tree";
import Flower from "./Flower";

const SIZE = 50;
const SEGMENTS = SIZE / 2;

export default class Terrain {
  constructor(x, z, simplex) {
    this.size = SIZE;
    this.segments = SEGMENTS;
    this.simplex = simplex;
    this.height = simplex.noise2D(SIZE, SEGMENTS).remap(-1, 1, 1, 5);
    this.smoothing = 10 + Math.pow(this.height, 2);

    this.offsetX = x;
    this.offsetZ = z;

    this.geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.segments,
      this.segments
    );
    this.setHeight();
    this.material = new MeshPhongMaterial({
      color: new Color(0.225, 0.593, 0.162),
      flatShading: true,
      shininess: 0
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.name = "Terrain";
    this.mesh.receiveShadow = true;
    this.mesh.position.set(
      this.size * this.offsetX,
      0,
      this.size * this.offsetZ
    );

    this.treeSpread = 4;
    this.splitVertices();
    this.addTrees();
    this.addFlowers();

    this.speed = 0.02;
  }

  setHeight() {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 2; i < vertices.length; i += 3) {
      const x = vertices[i - 2];
      const y = vertices[i - 1];
      const z = vertices[i];
      // vertices[i - 2] += this.simplex.noise2D(y, z).remap(-1, 1, -0.5, 0.5);
      vertices[i] = -y;

      vertices[i - 1] =
        this.simplex.noise2D(
          (x + this.size * this.offsetX) / this.smoothing,
          (-y + this.size * this.offsetZ) / this.smoothing
        ) * this.height;
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    this.geometry.computeVertexNormals();
  }

  getHeightAt(x, z) {
    const X = roundTwoDecimals(x);
    const Z = roundTwoDecimals(z);
    return (
      this.simplex.noise2D(X / this.smoothing, Z / this.smoothing) * this.height
    );
  }

  splitVertices() {
    const vertices = this.geometry.getAttribute("position").array;
    this.splitVertices = [];

    for (let i = 2; i < vertices.length; i += 3) {
      this.splitVertices.push(
        new Vector3(vertices[i - 2], vertices[i - 1], vertices[i])
      );
    }
  }

  addTrees() {
    for (let i = 0; i < this.splitVertices.length; i += this.treeSpread) {
      const addTree =
        this.simplex.noise2D(
          this.splitVertices[i].y * this.smoothing,
          this.splitVertices[i].z * this.smoothing
        ) * 10;
      if (addTree > 6) {
        const tree = new Tree(this.mesh, this.splitVertices[i], this.simplex);
      }
    }
  }
  addFlowers() {
    const padding = 0.5;
    for (
      let i = -(this.segments - padding);
      i < this.segments - padding;
      i += 1
    ) {
      for (
        let j = -(this.segments - padding);
        j < this.segments - padding;
        j += this.simplex.noise2D(i, j).remap(-1, 1, 1, 3)
      ) {
        j = roundTwoDecimals(j);
        const y = this.getHeightAt(i, j);
        const addFlower =
          this.simplex.noise3D(
            i / this.smoothing,
            j / this.smoothing,
            y / this.smoothing
          ) * 10;
        if (addFlower > 5) {
          const flower = new Flower(
            this.mesh,
            new Vector3(i, y, -j),
            this.simplex
          );
        }
      }
    }
  }

  update(distance = null) {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 2; i < vertices.length; i += 3) {
      const x = vertices[i - 2] + this.offsetX;
      const y = vertices[i - 1];
      const z = vertices[i] + this.offsetZ;

      vertices[i - 1] =
        this.simplex.noise2D(x / this.smoothing, z / this.smoothing) *
        this.height;
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    this.geometry.computeVertexNormals();

    this.mesh.children.forEach(child => {
      let { x, y, z } = child.position;

      const offsetX = this.offsetX * this.speed;
      const offsetZ = this.offsetZ * this.speed;

      if (distance) {
        x -= distance.x * this.speed;
        z -= distance.z * this.speed;
        child.position.set(
          x,
          this.getHeightAt(x + this.offsetX, z + this.offsetZ),
          z
        );
      } else {
        child.position.y = this.getHeightAt(x + this.offsetX, z + this.offsetZ);
      }
    });

    if (distance) {
      this.offsetX += distance.x / 50;
      this.offsetZ += distance.z / 50;
    }
  }
}
