import { DirectionalLight, HemisphereLight } from "three";

export default class Lights {
  constructor(camera) {
    this.hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.5);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 10, 0);

    this.dirLight = new DirectionalLight(0xffffff, 0.5);
    this.dirLight.color.setHSL(0.12, 1, 0.7);
    this.dirLight.position.set(1, 0.5, -1);
    this.dirLight.position.multiplyScalar(30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.top = camera.fov;
    this.dirLight.shadow.camera.right = camera.fov;
    this.dirLight.shadow.camera.left = -camera.fov;
    this.dirLight.shadow.camera.bottom = -camera.fov;
  }

  addTo(scene) {
    scene.add(this.hemiLight, this.dirLight);
  }
}
