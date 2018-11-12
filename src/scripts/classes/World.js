import { Mesh, Vector3, Scene } from "three";
import SimplexNoise from "simplex-noise";

import Loader from "./Loader";
import Terrain from "./Terrain";
import Tree from "./Tree";

import { roundTwoDecimals } from "../utils";

const SIZE = 50;
const SEGMENTS = SIZE / 2;

export default class World {
  constructor() {
    this.simplex = new SimplexNoise(12345);
    this.height = this.simplex.noise2D(SIZE, SEGMENTS).remap(-1, 1, 1, 5);
    this.smoothing = 10 + Math.pow(this.height, 2);
    this.tileCount = 9;
    this.tiles = [];
    this.treeModels = this.loadTrees();

    this.settings = {
      size: SIZE,
      segments: SEGMENTS,
      simplex: this.simplex,
      height: this.height,
      smoothing: this.smoothing
    };
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
  * Generates terrain tiles
  */
  generateTerrain(x, z) {
    for (let xOffset = x - 1; xOffset < x + 2; xOffset++) {
      for (let zOffset = z - 1; zOffset < z + 2; zOffset++) {
        if (
          !this.tiles.some(
            tile => tile.offsetX === xOffset && tile.offsetZ === zOffset
          )
        ) {
          const tile = new Terrain(xOffset, zOffset, this.settings);
          const treeMesh = this.generateTreeMesh(
            tile.position.x,
            tile.position.z
          );
          treeMesh.children.forEach(child => {
            tile.mesh.add(child);
          });

          this.tiles.push(tile);
        }
      }
    }
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

    if (this.tiles.length < this.tileCount && this.treeModels) {
      this.addTiles(position);
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

    this.generateTerrain(currentTile.x, currentTile.z);
  }

  async loadTrees() {
    const treeIndexes = 3;
    const models = [];
    for (let i = 0; i < treeIndexes; i++) {
      const model = await new Loader().loadModel(`tree${i + 1}`);
      models.push(model);
    }
    return models;
  }

  generateTreeMesh(x, z) {
    const padding = 0.5;
    const treePositions = [];
    for (let i = -SIZE / 2; i < SIZE / 2; i += 6) {
      for (
        let j = -SIZE / 2;
        j < SIZE / 2;
        j += this.simplex.noise2D(i, j).remap(-1, 1, 1, 3)
      ) {
        const y = this.getHeightAt(i + x, j + z);
        const addTree =
          this.simplex.noise3D(
            i + z / this.smoothing,
            j + z / this.smoothing,
            y / this.smoothing
          ) * 10;
        if (addTree > 6) {
          treePositions.push(new Vector3(i, y, j));
        }
      }
    }
    const tree = new Tree(this.treeModels);

    tree.addTrees(treePositions, this.simplex);

    return tree;
  }
}
