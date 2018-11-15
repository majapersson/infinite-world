import { Math as ThreeMath, Mesh, Object3D, Vector3 } from "three";

export default class Tree extends Object3D {
  addTrees(positions, simplex, models) {
    positions.forEach(position => {
      const scale = simplex
        .noise2D(position.y, position.z)
        .remap(-1, 1, 0.9, 1.2);
      const index = Math.floor(
        simplex.noise2D(position.x, position.z).remap(-1, 1, 0, 3)
      );
      const model = models[index].children[0];
      const tree = new Mesh(model.geometry, model.material);
      tree.position.set(position.x, position.y, position.z);
      tree.rotation.y = ThreeMath.degToRad(
        simplex.noise2D(position.y, position.z) * 360
      );
      tree.scale.set(scale, scale, scale);
      tree.traverse(child => {
        if (child instanceof Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.add(tree);
    });
  }
}
