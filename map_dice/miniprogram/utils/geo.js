// 区域定义与随机选点逻辑
const SIXTH_RING_POLYGON = [
  [116.072, 39.714], [116.075, 39.705], [116.078, 39.695], [116.099, 39.688], [116.122, 39.688],
  [116.167, 39.685], [116.202, 39.684], [116.275, 39.682], [116.37, 39.701], [116.415, 39.711],
  [116.459, 39.715], [116.516, 39.729], [116.543, 39.734], [116.604, 39.749], [116.627, 39.769],
  [116.648, 39.788], [116.665, 39.806], [116.673, 39.815], [116.685, 39.824], [116.691, 39.832],
  [116.697, 39.841], [116.707, 39.864], [116.712, 39.874], [116.715, 39.884], [116.718, 39.904],
  [116.718, 39.922], [116.714, 39.938], [116.715, 39.952], [116.716, 39.965], [116.709, 39.993],
  [116.7, 40.005], [116.69, 40.016], [116.661, 40.057], [116.656, 40.064], [116.652, 40.069],
  [116.643, 40.078], [116.64, 40.082], [116.637, 40.086], [116.633, 40.091], [116.63, 40.103],
  [116.629, 40.107], [116.627, 40.112], [116.624, 40.121], [116.623, 40.132], [116.617, 40.142],
  [116.613, 40.145], [116.608, 40.146], [116.601, 40.147], [116.584, 40.149], [116.542, 40.152],
  [116.501, 40.161], [116.468, 40.164], [116.399, 40.164], [116.344, 40.178], [116.279, 40.181],
  [116.173, 40.175], [116.15, 40.161], [116.138, 40.126], [116.129, 40.086], [116.11, 40.066],
  [116.08, 40.029], [116.071, 39.98], [116.099, 39.94], [116.122, 39.909], [116.122, 39.885],
  [116.11, 39.859], [116.096, 39.814], [116.091, 39.797], [116.084, 39.787], [116.077, 39.75],
  [116.073, 39.734]
];

const AREAS = {
  'sixth-ring': { type: 'polygon', polygon: SIXTH_RING_POLYGON },
  'beijing': { type: 'rect', minLng: 115.42, maxLng: 117.5, minLat: 39.42, maxLat: 41.05 },
  'shanhe-four': { type: 'rect', minLng: 110.2, maxLng: 122.7, minLat: 31.4, maxLat: 42.6 },
  'china': { type: 'rect', minLng: 73.5, maxLng: 135, minLat: 18.2, maxLat: 53.5 },
  'world': { type: 'rect', minLng: -180, maxLng: 180, minLat: -90, maxLat: 90 }
};

const UNSAFE_KEYWORDS = ['湖', '河', '水库', '海', '江', '港', '池', '潭', '溪', '沟', '渠', '运河', '水道', '湿地', '军事', '军区', '基地', '禁区', '营房'];

function pointInPolygon(lng, lat, polygon) {
  const n = polygon.length;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomPointInArea(area) {
  if (area.type === 'rect') {
    return [randomInRange(area.minLng, area.maxLng), randomInRange(area.minLat, area.maxLat)];
  }
  const poly = area.polygon;
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
  poly.forEach(p => {
    minLng = Math.min(minLng, p[0]); maxLng = Math.max(maxLng, p[0]);
    minLat = Math.min(minLat, p[1]); maxLat = Math.max(maxLat, p[1]);
  });
  for (let i = 0; i < 100; i++) {
    const lng = randomInRange(minLng, maxLng);
    const lat = randomInRange(minLat, maxLat);
    if (pointInPolygon(lng, lat, poly)) return [lng, lat];
  }
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

function isUnsafeAddress(address) {
  if (!address) return true;
  return UNSAFE_KEYWORDS.some(kw => address.includes(kw));
}

module.exports = {
  AREAS,
  UNSAFE_KEYWORDS,
  randomPointInArea,
  isUnsafeAddress
};
