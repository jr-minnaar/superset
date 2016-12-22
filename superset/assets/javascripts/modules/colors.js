import $ from 'jquery';
const d3 = require('d3');

// Color related utility functions go in this object
export const bnbColors = [
  '#ff5a5f', // rausch
  '#7b0051', // hackb
  '#007A87', // kazan
  '#00d1c1', // babu
  '#8ce071', // lima
  '#ffb400', // beach
  '#b4a76c', // barol
  '#ff8083',
  '#cc0086',
  '#00a1b3',
  '#00ffeb',
  '#bbedab',
  '#ffd266',
  '#cbc29a',
  '#ff3339',
  '#ff1ab1',
  '#005c66',
  '#00b3a5',
  '#55d12e',
  '#b37e00',
  '#988b4e',
];

const spectrums = {
  blue_white_yellow: [
    '#00d1c1',
    'white',
    '#ffb400',
  ],
  fire: [
    'white',
    'yellow',
    'red',
    'black',
  ],
  white_black: [
    'white',
    'black',
  ],
  black_white: [
    'black',
    'white',
  ],
};

// Color related utility functions go in this object
export const tpColors = [
  '#000099', // Primary	Blue	Tetra Pak Corporate Blue
  '#FF0000', // Primary	Red	Tetra Pak Medium Red
  '#94C6F0', // Primary	Blue	Tetra Pak Blue
  '#387A34', // Secondary	Green	Tetra Pak Dark Green
  '#4FA74B', // Secondary	Green	Tetra Pak Medium Green
  '#8ED64C', // Secondary	Green	Tetra Pak Light Green
  '#D96300', // Secondary	Orange	Tetra Pak Dark Orange
  '#FF7D17', // Secondary	Orange	Tetra Pak Medium Orange
  '#FFA61C', // Secondary	Orange	Tetra Pak Light Orange
  '#A40000', // Secondary	Red	Tetra Pak Dark Red
  '#FF0000', // Secondary	Red	Tetra Pak Medium Red
  '#FO6673', // Secondary	Red	Tetra Pak Light Red
  '#3E5FC2', // Secondary	Blue	Tetra Pak Dark Blue
  '#94C6F0', // Secondary	Blue	Tetra Pak Sky Blue
  '#B5D9FA', // Secondary	Blue	Tetra Pak Light Blue
];

// '#FFFFFF', // Primary	White	Tetra Pak White


export const category21 = (function () {
  // Color factory
  const seen = {};
  return function (s) {
    if (!s) {
      return;
    }
    let stringifyS = String(s);
    // next line is for superset series that should have the same color
    stringifyS = stringifyS.replace('---', '');
    if (seen[stringifyS] === undefined) {
      seen[stringifyS] = Object.keys(seen).length;
    }
    /* eslint consistent-return: 0 */
    return tpColors[seen[stringifyS] % tpColors.length];
  };
}());

export const colorScalerFactory = function (colors, data, accessor) {
  // Returns a linear scaler our of an array of color
  if (!Array.isArray(colors)) {
    /* eslint no-param-reassign: 0 */
    colors = spectrums[colors];
  }
  let ext = [0, 1];
  if (data !== undefined) {
    ext = d3.extent(data, accessor);
  }
  const points = [];
  const chunkSize = (ext[1] - ext[0]) / colors.length;
  $.each(colors, function (i) {
    points.push(i * chunkSize);
  });
  return d3.scale.linear().domain(points).range(colors);
};
