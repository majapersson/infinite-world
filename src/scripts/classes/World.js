import { Mesh, Vector3, Scene } from "three";
import SimplexNoise from "simplex-noise";

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
    console.log(this.loadTrees());
    // this.treeModels = this.loadTrees();

    this.settings = {
      size: SIZE,
      segments: SEGMENTS,
      simplex: this.simplex,
      height: this.height,
      smoothing: this.smoothing
    };

    for (let xOffset = -1; xOffset < 2; xOffset++) {
      for (let zOffset = -1; zOffset < 2; zOffset++) {
        // const treeMesh = this.generateTreeMesh();
        // console.log(treeMesh);
        const tile = new Terrain(xOffset, zOffset, this.settings);
        // tile.mesh.add(treeMesh);
        this.tiles.push(tile);
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

  async loadTrees() {
    const treeIndexes = 3;
    const models = [];
    for (let i = 0; i < treeIndexes; i++) {
      const model = await this.loadModel(`tree${i + 1}`);
      console.log(model);
    }
    return models;
  }

  loadModel(file) {
    return new Promise((resolve, reject) => {
      try {
        const MTLLoader = new THREE.MTLLoader();
        MTLLoader.load(`/assets/models/${file}.mtl`, materials => {
          materials.preload();

          const OBJLoader = new THREE.OBJLoader();
          OBJLoader.setMaterials(materials);
          OBJLoader.load(`/assets/models/${file}.obj`, object => {
            object.name = file;
            object.castShadow = true;
            object.traverse(child => {
              if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            resolve(object);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  generateTreeMesh() {
    const padding = 0.5;
    const treePositions = [];
    for (let i = -(SEGMENTS - padding); i < SEGMENTS - padding; i += 6) {
      for (
        let j = -(SEGMENTS - padding);
        j < SEGMENTS - padding;
        j += this.simplex.noise2D(i, j).remap(-1, 1, 1, 3)
      ) {
        j = roundTwoDecimals(j);
        const y = this.getHeightAt(i, j);
        const addTree =
          this.simplex.noise3D(
            i / this.smoothing,
            j / this.smoothing,
            y / this.smoothing
          ) * 10;
        if (addTree > 6) {
          treePositions.push(new Vector3(i, y, j));
        }
      }
    }
    const tree = new Tree(this.treeModels);

    tree.addTrees(treePositions, this.simplex);
  }
}
