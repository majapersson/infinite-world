import {
  Mesh,
  MeshPhongMaterial,
  PointLight,
  SphereGeometry,
  Vector3
} from "three";

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

    this.speed = 0.02;
  }

  move(distance) {
    const { position } = this.mesh;
    if (distance) {
      this.mesh.translateX(distance.x * this.speed);
      this.mesh.translateZ(distance.z * this.speed);
    }
  }

  update(terrain) {
    const { position } = this.mesh;
    const y =
      terrain.getHeightAt(
        position.x + terrain.offsetX,
        position.z + terrain.offsetZ
      ) + this.height;
    position.y = y;
  }
}
