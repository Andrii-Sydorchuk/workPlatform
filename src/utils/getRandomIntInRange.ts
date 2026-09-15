interface MinMax {
  min: number,
  max: number,
}

export function getRandomIntInRange({min, max}: MinMax) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}