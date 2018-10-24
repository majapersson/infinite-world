import { PerspectiveCamera } from "three";
import { roundTwoDecimals } from "../utils";

class Camera extends PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.height = 1.5;
    this.speed = 0.05;

    // Controls
    this.controls = {
      up: 87,
      down: 83,
      left: 65,
      right: 68
    };
  }

  move(keymap, terrain) {
    const border = terrain.size / 2;
    let { x, y, z } = this.position;

    if (x < -border) {
      x = -border;
    }
    if (x > border) {
      x = border;
    }
    if (z < -border) {
      z = -border;
    }
    if (z > border) {
      z = border;
    }

    y =
      terrain.getHeightAt(roundTwoDecimals(x), roundTwoDecimals(-z)) +
      this.height;

    this.position.set(x, y, z);

    if (keymap[this.controls.up]) {
      this.translateZ(-this.speed);
    }
    if (keymap[this.controls.down]) {
      this.translateZ(this.speed);
    }
    if (keymap[this.controls.left]) {
      this.translateX(-this.speed);
    }
    if (keymap[this.controls.right]) {
      this.translateX(this.speed);
    }
  }
}

export default Camera;
