export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function roundTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}

Number.prototype.remap = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export function layeredNoise(x, z, simplex) {
  let wavelength = 2.5;
  let frequency = 0.02;
  let e =
    simplex.noise2D(x * frequency, z * frequency) * wavelength +
    simplex.noise2D(x * (frequency * 2), z * (frequency * 2)) *
      (wavelength / 6) +
    simplex.noise2D(x * (frequency * 4), z * (frequency * 4)) *
      (wavelength / 8);
  let y = Math.pow(e, 3);
  return y;
}
