export function feetToCm(feet) {
  const [ft, inch = 0] = String(feet)
    .split(/[^\d]+/)
    .map(Number);
  return ft * 30.48 + inch * 2.54;
}

export function cmToFeet(cm) {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inch = Math.round(totalInches % 12);
  return `${ft}'${inch}"`;
}

export function lbToKg(lb) {
  return lb / 2.20462;
}
export function kgToLb(kg) {
  return kg * 2.20462;
}
