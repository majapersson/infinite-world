import { Mesh, MeshBasicMaterial, PointLight, SphereGeometry } from "three";

export default class Player {
  constructor(world) {
    this.radius = 0.15;
    this.height = 2;
    this.segments = 10;
    this.geometry = new SphereGeometry(this.radius, this.segments);
    this.material = new MeshBasicMaterial({ color: 0x9bc0df });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.y =
      world.getHeightAt(this.mesh.position.x, this.mesh.position.z) +
      this.height;
    this.light = new PointLight(0x9bc0df, 1, 10, 2);
    this.light.castShadow = true;
    this.mesh.add(this.light);

    this.speed = 0.5;
  }

  addTo(scene) {
    scene.add(this.mesh, this.mesh);
  }

  move(mouse) {
    const { position } = this.mesh;

    this.mesh.translateX(mouse.x.remap(0, 1, -this.speed, this.speed));
    this.mesh.translateZ(mouse.y.remap(0, 1, -this.speed, this.speed));
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
