import {
  BufferAttribute,
  Color,
  Math as ThreeMath,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Vector3
} from "three";

import Tree from "./Tree";
import Flower from "./Flower";

import { layeredNoise } from "../utils";

export default class Terrain {
  constructor(x, z, settings) {
    // Terrain generation variables
    this.size = settings.size;
    this.segments = settings.segments;
    this.simplex = settings.simplex;
    this.height = settings.height;
    this.smoothing = settings.smoothing;
    this.waterLevel = settings.waterLevel;

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
    this.mesh.name = `${this.offsetX}:${this.offsetZ}`;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.position.x, 0, this.position.z);

    this.addWater();
  }

  /*
  * Loop over every vertex in the geometry, set y values to Z position and generate new Y value
  */
  setHeight(settings) {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 2; i < vertices.length; i += 3) {
      const x = vertices[i - 2];
      const y = vertices[i - 1];
      const z = vertices[i];
      vertices[i] = -y;

      vertices[i - 1] = layeredNoise(
        x + this.size * this.offsetX,
        -y + this.size * this.offsetZ,
        this.simplex
      );
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    this.geometry.computeVertexNormals();
  }

  /*
  * Add water plane
  */
  addWater() {
    const geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.segments,
      this.segments
    );

    const material = new MeshPhongMaterial({
      color: 0x0000ff,
      flatShading: true,
      shininess: 100
    });
    const water = new Mesh(geometry, material);
    water.position.y = this.waterLevel;
    water.rotation.x = ThreeMath.degToRad(-90);
    this.mesh.add(water);
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
}
