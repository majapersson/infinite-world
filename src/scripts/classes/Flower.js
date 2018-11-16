import { Math as ThreeMath, Mesh, Object3D, Vector3 } from "three";

export default class Flower extends Object3D {
  addFlowers(positions, simplex, models) {
    positions.forEach(position => {
      const scale = simplex
        .noise2D(position.y, position.z)
        .remap(-1, 1, 0.9, 1.2);
      const index = Math.floor(
        simplex.noise2D(position.x, position.z).remap(-1, 1, 0, 3)
      );
      const model = models[index];
      const flower = new Mesh(model.geometry, model.material);
      flower.position.set(position.x, position.y, position.z);
      flower.rotation.y = ThreeMath.degToRad(
        simplex.noise2D(position.y, position.z) * 360
      );
      flower.scale.set(scale, scale, scale);
      this.add(flower);
    });
  }
}
