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
      // color: new Color(0.225, 0.593, 0.162),
      flatShading: true,
      shininess: 0,
      vertexColors: THREE.VertexColors
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
  setHeight() {
    const vertices = this.geometry.getAttribute("position").array;
    const groundColor = { r: 0.225, g: 0.593, b: 0.162 };
    const mountainColor = { r: 0.346, g: 0.143, b: 0.072 };
    const colors = [];

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
      if (vertices[i - 1] > -this.waterLevel * 1.5) {
        colors.push(mountainColor.r, mountainColor.g, mountainColor.b);
      } else {
        colors.push(groundColor.r, groundColor.g, groundColor.b);
      }
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    this.geometry.addAttribute(
      "color",
      new BufferAttribute(new Float32Array(colors), 3)
    );
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

    const vertices = geometry.getAttribute("position").array;

    for (let i = 2; i < vertices.length; i += 3) {
      const x = vertices[i - 2];
      const y = vertices[i - 1];
      const z = vertices[i];
      vertices[i] = -y;

      vertices[i - 1] =
        this.simplex.noise2D(
          x + this.size * this.offsetX,
          -y + this.size * this.offsetZ
        ) * 0.5;
    }

    geometry.addAttribute("position", new BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new MeshPhongMaterial({
      color: new Color(0, 0.73, 0.831),
      flatShading: true,
      shininess: 100
    });
    const water = new Mesh(geometry, material);
    water.position.y = this.waterLevel;
    // water.rotation.x = ThreeMath.degToRad(-90);
    this.mesh.add(water);
  }

  /*
  * Check to see if terrain is too far from player
  */
  shouldBeRemoved(position) {
    const isOutLeft = this.position.x < position.x - this.size * 1.5;
    const isOutRight = this.position.x > position.x + this.size * 1.5;
    const isOutTop = this.position.z < position.z - this.size * 1.5;
    const isOutBottom = this.position.z > position.z + this.size * 1.5;

    return isOutLeft || isOutRight || isOutTop || isOutBottom;
  }

  removeChildren() {
    this.mesh.traverse(child => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        if (child.material.length) {
          child.material.forEach(material => {
            material.dispose();
          });
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
