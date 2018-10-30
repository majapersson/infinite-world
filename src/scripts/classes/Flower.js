import { Vector3 } from "three";

export default class Flower {
  constructor(scene) {
    const MTLLoader = new THREE.MTLLoader();
    MTLLoader.load("/assets/models/flower.mtl", materials => {
      materials.preload();

      const OBJLoader = new THREE.OBJLoader();
      OBJLoader.setMaterials(materials);
      OBJLoader.load("/assets/models/flower.obj", object => {
        scene.add(object);
      });
    });
  }
}
