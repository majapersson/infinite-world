export function roundTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}

Number.prototype.remap = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export function layeredNoise(x, z, simplex) {
  let wavelength = 3.8;
  let frequency = 0.01;
  let e =
    simplex.noise2D(x * frequency, z * frequency) * wavelength +
    simplex.noise2D(x * (frequency * 4), z * (frequency * 4)) *
      (wavelength / 4) +
    simplex.noise2D(x * (frequency * 8), z * (frequency * 8)) *
      (wavelength / 8);
  let convert;
  if (e < 0) {
    convert = true;
    e = -e;
  }

  let y = Math.pow(e, 2);
  if (convert) {
    y = -y;
  }
  return y;
}
