import React from 'react';
import { getScale, getContrast } from 'color2k';
// import { getContrast } from 'polished';

const OFFSET_TO_TARGET_RATIO_PAIRS = [
  [100, 1.08],
  [200, 1.2],
  [300, 1.35],
  [400, 2],
  [500, 2.8],
  [600, 3.3],
  [700, 5],
  [800, 10],
  [900, 13],
  [1000, 16],
  [1100, 17.5],
  [1200, 19.5],
];

export function App() {
  const _scale = getScale('#fff', '#1f73b7', '#000');
  const scale = (x: number) => _scale(x / 100);

  const start = 2;
  const end = 100;

  let palette = [];
  let contrasts = [];
  for (let i = start; i <= end; i++) {
    const color = scale(i);

    palette.push(color);
    contrasts.push(Number(getContrast('#FFF', color).toFixed(2)));
  }

  return (
    <div>
      <pre>{JSON.stringify(buildPalette(palette, contrasts), null, 2)}</pre>
    </div>
  );
}

function findNearestIndex(target: number, arr: number[]) {
  if (typeof target !== 'number' || isNaN(target)) {
    throw new Error('Target must be a number.');
  }
  if (!Array.isArray(arr)) {
    throw new Error('Second argument must be an array.');
  }

  let left = 0;
  let right = arr.length - 1;

  if (target < arr[left]) return left;
  if (target > arr[right]) return right;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return arr[left] - target < target - arr[right] ? left : right;
}

function buildPalette(colors: string[], ratios: number[]) {
  return OFFSET_TO_TARGET_RATIO_PAIRS.reduce((palette, [offset, ratio]) => {
    (palette as any)[offset] = colors[findNearestIndex(ratio, ratios)];

    return palette;
  }, {});
}
