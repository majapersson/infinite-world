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

    this.settings = {
      size: SIZE,
      segments: SEGMENTS,
      simplex: this.simplex,
      height: this.height,
      smoothing: this.smoothing
    };

    for (let xOffset = -1; xOffset < 2; xOffset++) {
      for (let zOffset = -1; zOffset < 2; zOffset++) {
        this.tiles.push(new Terrain(xOffset, zOffset, this.settings));
      }
    }
  }

  /*
  * Return calculated Y position from X and Z values
  */
  getHeightAt(x, z) {
    const X = roundTwoDecimals(x);
    const Z = roundTwoDecimals(z);
    return (
      this.simplex.noise2D(X / this.smoothing, Z / this.smoothing) * this.height
    );
  }

  /*
  * Add terrain chunks to scene
  */
  addTo(scene) {
    this.tiles.forEach(tile => {
      scene.add(tile.mesh);
    });
  }

  /*
  * Runs every frame, update tiles
  */
  update(position, scene) {
    this.removeTiles(position, scene);

    if (this.tiles.length < this.tileCount) {
      this.addTiles(position, scene);
      this.addTo(scene);
    }
  }

  /*
  * Loop over tiles and check if any should be removed
  */
  removeTiles(position, scene) {
    const removeTiles = this.tiles.filter(tile =>
      tile.shouldBeRemoved(position)
    );
    const keepTiles = this.tiles.filter(
      tile => !tile.shouldBeRemoved(position)
    );

    removeTiles.forEach(tile => {
      scene.remove(tile.mesh);
    });

    this.tiles = keepTiles;
  }

  /*
  * Generate new tiles if any are missing
  */
  addTiles(position) {
    const currentTile = {
      x: Math.round(position.x / SIZE),
      z: Math.round(position.z / SIZE)
    };

    for (let x = currentTile.x - 1; x < currentTile.x + 2; x++) {
      for (let z = currentTile.z - 1; z < currentTile.z + 2; z++) {
        // If there aren't any tiles with the same coordinates, generate new tile
        if (
          !this.tiles.some(tile => tile.offsetX === x && tile.offsetZ === z)
        ) {
          this.tiles.push(new Terrain(x, z, this.settings));
        }
      }
    }
  }
}
