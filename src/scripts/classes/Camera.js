import { PerspectiveCamera } from "three";

class Camera extends PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.distanceToPlayer = 15;
  }

  update(position) {
    this.position.set(
      position.x,
      position.y + this.distanceToPlayer,
      position.z + this.distanceToPlayer
    );
    this.lookAt(position);
  }
}

export default Camera;
