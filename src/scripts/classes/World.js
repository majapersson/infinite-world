import SimplexNoise from "simplex-noise";

import Terrain from "./Terrain";

import { roundTwoDecimals } from "../utils";

const SIZE = 50;
const SEGMENTS = SIZE / 2;

export default class World {
  constructor() {
    this.simplex = new SimplexNoise();
    this.height = this.simplex.noise2D(SIZE, SEGMENTS).remap(-1, 1, 1, 5);
    this.smoothing = 10 + Math.pow(this.height, 2);
    this.tileCount = 9;
    this.tiles = [];

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        this.tiles.push(new Terrain(j, i, this.simplex));
      }
    }
  }

  getHeightAt(x, z) {
    const X = roundTwoDecimals(x);
    const Z = roundTwoDecimals(z);
    return (
      this.simplex.noise2D(X / this.smoothing, Z / this.smoothing) * this.height
    );
  }

  addTo(scene) {
    this.tiles.forEach(tile => {
      scene.add(tile.mesh);
    });
  }

  update(position, scene) {
    this.removeTiles(position, scene);

    if (this.tiles.length < this.tileCount) {
      this.addTiles();
    }
  }

  removeTiles(position, scene) {
    const removeTiles = [];
    const keepTiles = [];

    for (let i = 0; i < this.tiles.length; i++) {
      const isOutLeft = this.tiles[i].mesh.position.x < position.x - SIZE;
      const isOutRight = this.tiles[i].mesh.position.x > position.x + SIZE;
      const isOutTop = this.tiles[i].mesh.position.z < position.z - SIZE;
      const isOutBottom = this.tiles[i].mesh.position.z > position.z + SIZE;

      if (isOutLeft || isOutRight || isOutTop || isOutBottom) {
        removeTiles.push(this.tiles[i]);
      } else {
        keepTiles.push(this.tiles[i]);
      }
    }

    removeTiles.forEach(tile => {
      scene.remove(tile.mesh);
    });

    this.tiles = keepTiles;
  }

  addTiles() {}
}
