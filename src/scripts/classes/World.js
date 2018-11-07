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
}
