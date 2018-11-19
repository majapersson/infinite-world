import { Mesh, Vector3, Scene } from "three";
import SimplexNoise from "simplex-noise";

import Terrain from "./Terrain";
import Tree from "./Tree";
import Flower from "./Flower";

import { roundTwoDecimals, layeredNoise } from "../utils";

const SIZE = 50;
const SEGMENTS = SIZE / 2;

export default class World {
  constructor(treeModels, flowerModels) {
    this.simplex = new SimplexNoise();
    this.height = 15;
    this.smoothing = 30;
    this.tileCount = 9;
    this.tiles = [];
    this.treeModels = treeModels;
    this.flowerModels = flowerModels;

    this.settings = {
      size: SIZE,
      segments: SEGMENTS,
      simplex: this.simplex,
      height: this.height,
      smoothing: this.smoothing,
      waterLevel: -4
    };
  }

  /*
  * Return calculated Y position from X and Z values
  */
  getHeightAt(x, z) {
    const X = roundTwoDecimals(x);
    const Z = roundTwoDecimals(z);
    return layeredNoise(x, z, this.simplex);
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
          const treeMesh = this.generateMesh(
            tile.position.x,
            tile.position.z,
            10,
            3,
            "tree"
          );
          treeMesh.castShadow = true;
          tile.mesh.add(treeMesh);

          const flowerMesh = this.generateMesh(
            tile.position.x,
            tile.position.z,
            2,
            1.5,
            "flower"
          );
          tile.mesh.add(flowerMesh);

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
      const existingObject = scene.getObjectByName(tile.mesh.name);

      if (!existingObject) {
        scene.add(tile.mesh);
      }
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

      tile.mesh.geometry.dispose();
      tile.mesh.material.dispose();
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

  /*
  * Generate positions for mesh content and creates mesh
  */
  generateMesh(x, z, spread, density, type) {
    const size = SIZE / 2;
    const positions = [];
    let mesh;

    for (
      let i = -size;
      i < size;
      i += this.simplex.noise2D(x, z).remap(-1, 1, spread / 3, spread)
    ) {
      for (
        let j = -size;
        j < size;
        j += this.simplex.noise2D(i, j).remap(-1, 1, spread / 2, spread)
      ) {
        const y = this.getHeightAt(i + x, j + z);
        if (y > this.settings.waterLevel && y < -this.settings.waterLevel) {
          let add;
          if (type === "tree") {
            add = this.simplex
              .noise2D(i / this.smoothing, j / this.smoothing)
              .remap(-1, 1, 0, 10);
          }
          if (type === "flower") {
            add = this.simplex
              .noise3D(
                i / this.smoothing,
                y / this.smoothing,
                j / this.smoothing
              )
              .remap(-1, 1, 0, 10);
          }
          if (add < density) {
            positions.push(new Vector3(i, y, j));
          }
        }
      }
    }
    if (type === "tree") {
      mesh = new Tree();
      mesh.addTrees(positions, this.simplex, this.treeModels);
    }
    if (type === "flower") {
      mesh = new Flower(this.flowerModels);
      mesh.addFlowers(positions, this.simplex, this.flowerModels);
    }
    return mesh;
  }
}
