import { Mesh, MeshPhongMaterial, PointLight, ConeGeometry } from "three";
import { toRadians } from "../utils";

export default class Player {
  constructor(terrainHeight) {
    this.radius = 0.2;
    this.height = 0.5;
    this.segments = 10;
    this.geometry = new ConeGeometry(this.radius, this.height, this.segments);
    this.material = new MeshPhongMaterial({ color: 0xffff00, shininess: 0 });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y = terrainHeight + this.radius;
    this.mesh.rotation.x = toRadians(-90);

    // Controls
    this.up = 87;
    this.down = 83;
    this.left = 65;
    this.right = 68;
  }
}
