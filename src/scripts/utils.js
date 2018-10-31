export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function roundTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}

Number.prototype.remap = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
