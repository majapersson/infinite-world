import {
  Mesh,
  MeshPhongMaterial,
  PointLight,
  ConeGeometry,
  Vector3
} from "three";
import { toRadians } from "../utils";

export default class Player {
  constructor(terrainHeight) {
    this.radius = 0.2;
    this.height = 0.5;
    this.segments = 10;
    this.geometry = new ConeGeometry(this.radius, this.height, this.segments);
    this.material = new MeshPhongMaterial({ color: 0xffff00, shininess: 0 });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y = terrainHeight + this.height;

    // Controls
    this.up = 87;
    this.down = 83;
    this.left = 65;
    this.right = 68;
  }

  move(direction, terrain) {
    const { position } = this.mesh;
    if (direction) {
      direction.sub(position);
      this.mesh.translateX(direction.x * 0.05);
      this.mesh.translateZ(direction.z * 0.05);
    }
    const y = terrain.getHeightAt(position.x, -position.z) + this.height;
    position.y = y;
  }
}
