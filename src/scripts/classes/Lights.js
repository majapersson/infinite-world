import { DirectionalLight, HemisphereLight } from "three";

hemiLight.color.setHSL(0.6, 1, 0.6);
export const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.5);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);

dirLight.color.setHSL(0.1, 1, 0.95);
export const dirLight = new DirectionalLight(0xffffff, 0.3);
dirLight.position.set(-1, 1.75, 1);
dirLight.position.multiplyScalar(30);
