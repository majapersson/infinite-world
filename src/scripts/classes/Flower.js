import { Vector3 } from "three";
import { toRadians } from "../utils";

export default class Flower {
  constructor(scene, position, simplex) {
    this.scale = simplex.noise2D(position.y, position.z).remap(-1, 1, 0.5, 1);
    const MTLLoader = new THREE.MTLLoader();
    MTLLoader.load("/assets/models/flower.mtl", materials => {
      materials.preload();

      const OBJLoader = new THREE.OBJLoader();
      OBJLoader.setMaterials(materials);
      OBJLoader.load("/assets/models/flower.obj", object => {
        object.position.set(position.x, position.z, -position.y);
        object.rotation.y = toRadians(Math.random() * 360);
        object.scale.set(this.scale, this.scale, this.scale);
        scene.add(object);
      });
    });
  }
}
