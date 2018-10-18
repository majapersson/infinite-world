import {
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry
} from "three";

export default class Terrain {
  constructor() {
    this.geometry = new PlaneBufferGeometry(5, 5, 10, 10);
    this.setZ();
    this.material = new MeshBasicMaterial({ wireframe: true });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.z = Math.PI / -3;
    this.mesh.rotation.x = Math.PI / -3;
  }

  setZ() {
    const vertices = this.geometry.getAttribute("position").array;

    for (let i = 0; i < vertices.length; i++) {
      if ((i + 1) % 3 === 0) {
        const x = vertices[i - 2];
        const y = vertices[i - 1];
        vertices[i] = Math.random();
      }
    }

    this.geometry.addAttribute("position", new BufferAttribute(vertices, 3));
  }
}
