import { PlaneGeometry, Mesh, MeshBasicMaterial } from "three";
import "../utils";

export default class Terrain {
  constructor() {
    this.geometry = new PlaneGeometry(5, 5, 10, 10);
    this.material = new MeshBasicMaterial({ wireframe: true });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.z = Math.PI / -3;
    this.mesh.rotation.x = Math.PI / -3;
  }
}
