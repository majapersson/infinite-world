import { Mesh, MeshBasicMaterial, PointLight, SphereGeometry } from "three";

export default class Player {
  constructor(world) {
    this.radius = 0.15;
    this.height = 2;
    this.segments = 10;
    this.geometry = new SphereGeometry(this.radius, this.segments);
    this.material = new MeshBasicMaterial({ color: 0xffc107 });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y =
      world.getHeightAt(this.mesh.position.x, this.mesh.position.z) +
      this.height;
    this.light = new PointLight(0xffc107, 0.7, 10, 2);
    this.mesh.add(this.light);

    this.speed = 0.02;
  }

  addTo(scene) {
    scene.add(this.mesh, this.mesh);
  }

  move(distance) {
    const { position } = this.mesh;
    if (distance) {
      let velocityX = distance.x * this.speed;
      let velocityZ = distance.z * this.speed;
      if (velocityZ < -1) {
        velocityZ = -1;
      }
      this.mesh.translateX(velocityX);
      this.mesh.translateZ(velocityZ);
    }
  }

  updateHeight(world) {
    const { position } = this.mesh;
    const y = world.getHeightAt(position.x, position.z);
    if (y < world.settings.waterLevel) {
      position.y = world.settings.waterLevel + this.height;
    } else {
      position.y = y + this.height;
    }
  }
}
