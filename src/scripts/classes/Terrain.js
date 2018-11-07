import {
  BufferAttribute,
  Color,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Vector3
} from "three";

import Tree from "./Tree";
import Flower from "./Flower";

export default class Terrain {
  constructor(x, z, settings) {
    // Terrain generation variables
    this.size = settings.size;
    this.segments = settings.segments;
    this.simplex = settings.simplex;
    this.height = settings.height;
    this.smoothing = settings.smoothing;

    // Positioning
    this.offsetX = x;
    this.offsetZ = z;
    this.position = new Vector3(
      this.size * this.offsetX,
      0,
      this.size * this.offsetZ
    );

    // Geometry
    this.geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.segments,
      this.segments
    );
    this.setHeight();

    // Material
    this.material = new MeshPhongMaterial({
      color: new Color(0.225, 0.593, 0.162),
      flatShading: true,
      shininess: 0
    });

    // Mesh
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.name = "Terrain";
    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.position.x, 0, this.position.z);

    // Content
    // this.treeSpread = 4;
    // this.splitVertices();
    // this.addTrees();
    // this.addFlowers();
  }

  /*
  * Loop over every vertex in the geometry, set y values to Z position and generate new Y value
  */
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

  /*
  * Check to see if terrain is too far from player
  */
  shouldBeRemoved(position) {
    const isOutLeft = this.position.x < position.x - this.size;
    const isOutRight = this.position.x > position.x + this.size;
    const isOutTop = this.position.z < position.z - this.size;
    const isOutBottom = this.position.z > position.z + this.size;

    return isOutLeft || isOutRight || isOutTop || isOutBottom;
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
}
