import { Mesh } from "three";

export default class Loader {
  loadModel(file) {
    return new Promise((resolve, reject) => {
      try {
        const MTLLoader = new THREE.MTLLoader();
        MTLLoader.load(`./assets/models/${file}.mtl`, materials => {
          materials.preload();

          const OBJLoader = new THREE.OBJLoader();
          OBJLoader.setMaterials(materials);
          OBJLoader.load(`./assets/models/${file}.obj`, object => {
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
}
