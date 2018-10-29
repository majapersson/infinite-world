import {
  Mesh,
  MeshPhongMaterial,
  PointLight,
  SphereGeometry,
  Vector3
} from "three";
import { toRadians, roundTwoDecimals } from "../utils";

export default class Player {
  constructor(terrainHeight) {
    this.radius = 0.5;
    this.height = 0.5;
    this.segments = 10;
    this.geometry = new SphereGeometry(this.radius, this.segments);
    this.material = new MeshPhongMaterial({ color: 0xffff00, shininess: 0 });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y = terrainHeight + this.height;
    this.mesh.position.x = 1;

    this.speed = 0.05;
  }

  move(direction, terrain) {
    const { position } = this.mesh;
    if (direction) {
      direction.sub(position);
      this.mesh.translateX(direction.x * this.speed);
      this.mesh.translateZ(direction.z * this.speed);
    }
    const y =
      terrain.getHeightAt(
        roundTwoDecimals(position.x),
        roundTwoDecimals(-position.z)
      ) + this.height;
    position.y = y;
  }
}
