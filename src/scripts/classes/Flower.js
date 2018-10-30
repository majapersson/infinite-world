import { Vector3 } from "three";

export default class Flower {
  constructor(scene, position) {
    const MTLLoader = new THREE.MTLLoader();
    MTLLoader.load("/assets/models/flower.mtl", materials => {
      materials.preload();

      const OBJLoader = new THREE.OBJLoader();
      OBJLoader.setMaterials(materials);
      OBJLoader.load("/assets/models/flower.obj", object => {
        object.position.set(position.x, position.z, -position.y);
        scene.add(object);
      });
    });
  }
}
