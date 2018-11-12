import { Mesh, Object3D, Vector3 } from "three";
import { toRadians } from "../utils";

export default class Flower extends Object3D {
  constructor(models) {
    super();
    this.models = models;
  }

  addFlowers(positions, simplex) {
    positions.forEach(position => {
      const scale = simplex
        .noise2D(position.y, position.z)
        .remap(-1, 1, 0.9, 1.2);
      const index = Math.floor(
        simplex.noise2D(position.x, position.z).remap(-1, 1, 0, 3)
      );
      const flower = this.models[index].clone();
      flower.position.set(position.x, position.y, position.z);
      flower.rotation.y = toRadians(
        simplex.noise2D(position.y, position.z) * 360
      );
      flower.scale.set(scale, scale, scale);
      this.add(flower);
    });
  }
}
