import { Raycaster, Vector3 } from "three";

export default class Ray extends Raycaster {
  getDistance(terrain, player) {
    const intersection = this.intersectObject(terrain.mesh);

    let direction;
    if (intersection.length > 0) {
      direction = intersection[0].point;
    } else {
      const { x, y, z } = player.mesh.position;
      direction = new Vector3(x, y, z);
    }

    const distance = direction.sub(player.mesh.position);
    return distance;
  }
}
