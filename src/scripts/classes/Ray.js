import { Raycaster, Vector3 } from "three";

export default class Ray extends Raycaster {
  getDistance(scene, player) {
    const intersections = this.intersectObjects(scene.children);

    let direction;
    if (intersections.length > 0) {
      direction = intersections[0].point;
    } else {
      const { x, y, z } = player.mesh.position;
      direction = new Vector3(x, y, z);
    }

    const distance = direction.sub(player.mesh.position);
    return distance;
  }
}
