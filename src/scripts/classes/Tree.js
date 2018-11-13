import { Math as ThreeMath, Mesh, Object3D, Vector3 } from "three";

export default class Tree extends Object3D {
  constructor(models) {
    super();
    this.models = models;
  }

  addTrees(positions, simplex) {
    positions.forEach(position => {
      const scale = simplex
        .noise2D(position.y, position.z)
        .remap(-1, 1, 0.9, 1.2);
      const index = Math.floor(
        simplex.noise2D(position.x, position.z).remap(-1, 1, 0, 3)
      );
      const tree = this.models[index].clone();
      tree.position.set(position.x, position.y, position.z);
      tree.rotation.y = ThreeMath.degToRad(
        simplex.noise2D(position.y, position.z) * 360
      );
      tree.scale.set(scale, scale, scale);
      tree.castShadow = true;
      tree.receiveShadow = true;
      this.add(tree);
    });
  }
}
