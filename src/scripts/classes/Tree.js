import { Math as ThreeMath, Mesh, Object3D, Vector3 } from "three";

export default class Tree extends Object3D {
  addTrees(positions, simplex, models) {
    for (let i = 0; i < positions.length; i++) {
      const scale = simplex
        .noise2D(positions[i].y, positions[i].z)
        .remap(-1, 1, 0.9, 1.2);
      const index = Math.floor(
        simplex.noise2D(positions[i].x, positions[i].z).remap(-1, 1, 0, 3)
      );
      const model = models[index];
      const rotation = ThreeMath.degToRad(
        simplex.noise2D(positions[i].y, positions[i].z) * 360
      );
      const tree = new Mesh(model.geometry, model.material);
      tree.position.set(positions[i].x, positions[i].y, positions[i].z);
      tree.rotation.y = rotation;
      tree.scale.set(scale, scale, scale);
      tree.traverse(child => {
        if (child instanceof Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      tree.castShadow = true;
      tree.receiveShadow = true;

      this.add(tree);
    }
  }
}
