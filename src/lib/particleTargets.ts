const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  let t = seed;
  return function next() {
    t += 0x6d2b79f5;
    let v = Math.imul(t ^ (t >>> 15), t | 1);
    v ^= v + Math.imul(v ^ (v >>> 7), v | 61);
    return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
  };
}

type Blob = {
  w: number;
  cx: number;
  cy: number;
  sx: number;
  sy: number;
  rot: number;
};

type Morphology = {
  name: string;
  blobs: Blob[];
  ring?: {
    cx: number;
    cy: number;
    r: number;
    t: number;
    wobble: number;
    density: number;
  };
  jitter: number;
  scaleX: number;
  scaleY: number;
  warpA: number;
  warpB: number;
};

function gaussianSample(rand: () => number) {
  const u = Math.max(rand(), 1e-8);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

function sampleBlob(rand: () => number, blob: Blob) {
  const gx = gaussianSample(rand) * blob.sx;
  const gy = gaussianSample(rand) * blob.sy;
  const c = Math.cos(blob.rot);
  const s = Math.sin(blob.rot);
  const x = blob.cx + gx * c - gy * s;
  const y = blob.cy + gx * s + gy * c;
  return [x, y] as const;
}

function sampleRing(rand: () => number, morph: Morphology) {
  if (!morph.ring) return null;
  const { cx, cy, r, t, wobble } = morph.ring;
  const a = rand() * TAU;
  const wave = Math.sin(a * 3.1) * wobble + Math.cos(a * 1.7) * wobble * 0.6;
  const rr = r + wave + gaussianSample(rand) * t;
  return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const;
}

function pickBlob(rand: () => number, blobs: Blob[]) {
  const total = blobs.reduce((acc, b) => acc + b.w, 0);
  let p = rand() * total;
  for (let i = 0; i < blobs.length; i += 1) {
    p -= blobs[i].w;
    if (p <= 0) return blobs[i];
  }
  return blobs[blobs.length - 1];
}

const MORPHOLOGIES: Morphology[] = [
  {
    name: "two-lobed",
    blobs: [
      { w: 1.4, cx: -0.62, cy: 0.12, sx: 0.26, sy: 0.35, rot: -0.36 },
      { w: 1.25, cx: 0.6, cy: -0.03, sx: 0.34, sy: 0.28, rot: 0.2 },
      { w: 0.45, cx: -0.02, cy: -0.04, sx: 0.18, sy: 0.14, rot: 0.04 },
    ],
    jitter: 0.011,
    scaleX: 1.04,
    scaleY: 0.9,
    warpA: 0.11,
    warpB: 0.08,
  },
  {
    name: "mass-with-extension",
    blobs: [
      { w: 1.55, cx: 0.56, cy: -0.03, sx: 0.34, sy: 0.34, rot: 0.1 },
      { w: 0.5, cx: -0.48, cy: 0.24, sx: 0.24, sy: 0.2, rot: 0.25 },
      { w: 0.8, cx: -0.1, cy: -0.09, sx: 0.23, sy: 0.1, rot: -0.42 },
      { w: 0.35, cx: -0.78, cy: -0.23, sx: 0.14, sy: 0.1, rot: -0.3 },
    ],
    jitter: 0.012,
    scaleX: 1.05,
    scaleY: 0.92,
    warpA: 0.13,
    warpB: 0.08,
  },
  {
    name: "vertical-anchor",
    blobs: [
      { w: 1.45, cx: 0.1, cy: 0.34, sx: 0.2, sy: 0.42, rot: 0.1 },
      { w: 1.0, cx: 0.2, cy: -0.33, sx: 0.19, sy: 0.14, rot: -0.22 },
      { w: 0.55, cx: -0.2, cy: -0.04, sx: 0.2, sy: 0.18, rot: 0.2 },
    ],
    jitter: 0.011,
    scaleX: 0.95,
    scaleY: 1.08,
    warpA: 0.09,
    warpB: 0.1,
  },
  {
    name: "rounded-asymmetric",
    blobs: [
      { w: 1.5, cx: 0.2, cy: 0.02, sx: 0.38, sy: 0.32, rot: 0.2 },
      { w: 0.55, cx: -0.32, cy: -0.15, sx: 0.2, sy: 0.16, rot: -0.38 },
      { w: 0.45, cx: 0.63, cy: -0.11, sx: 0.16, sy: 0.2, rot: 0.4 },
    ],
    jitter: 0.01,
    scaleX: 1.04,
    scaleY: 0.94,
    warpA: 0.1,
    warpB: 0.07,
  },
  {
    name: "partial-hollow",
    blobs: [
      { w: 0.85, cx: -0.16, cy: 0.05, sx: 0.24, sy: 0.22, rot: 0.1 },
      { w: 0.9, cx: 0.31, cy: -0.01, sx: 0.21, sy: 0.2, rot: -0.1 },
      { w: 0.45, cx: 0.09, cy: -0.23, sx: 0.24, sy: 0.1, rot: 0.02 },
    ],
    ring: { cx: 0.05, cy: 0.02, r: 0.63, t: 0.06, wobble: 0.05, density: 0.38 },
    jitter: 0.009,
    scaleX: 0.95,
    scaleY: 0.95,
    warpA: 0.07,
    warpB: 0.1,
  },
];

function warpPoint(
  x: number,
  y: number,
  morph: Morphology,
  rand: () => number,
): [number, number] {
  const xw = x + Math.sin(y * 2.5 + x * 0.8) * morph.warpA + (rand() - 0.5) * morph.jitter;
  const yw = y + Math.cos(x * 2.2 - y * 0.6) * morph.warpB + (rand() - 0.5) * morph.jitter;
  return [xw * morph.scaleX, yw * morph.scaleY];
}

export function buildMorphTargets(count: number, seed = 41) {
  return MORPHOLOGIES.map((morph, morphIdx) => {
    const rand = mulberry32(seed + morphIdx * 1013);
    const points = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      let x = 0;
      let y = 0;
      const useRing = morph.ring && rand() < morph.ring.density;
      if (useRing) {
        const ringPoint = sampleRing(rand, morph);
        if (ringPoint) {
          x = ringPoint[0];
          y = ringPoint[1];
        }
      } else {
        const b = pickBlob(rand, morph.blobs);
        const p = sampleBlob(rand, b);
        x = p[0];
        y = p[1];
      }

      const w = warpPoint(x, y, morph, rand);
      const z = (rand() - 0.5) * 0.08;
      const idx = i * 3;
      points[idx] = w[0];
      points[idx + 1] = w[1];
      points[idx + 2] = z;
    }

    // Fit each morphology into a broad hero-scale composition so the field occupies
    // most of the viewport.
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const x = points[idx];
      const y = points[idx + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const cx = (minX + maxX) * 0.5;
    const cy = (minY + maxY) * 0.5;
    const rx = Math.max((maxX - minX) * 0.5, 1e-6);
    const ry = Math.max((maxY - minY) * 0.5, 1e-6);

    const targetSpanX = 3.52;
    const targetSpanY = 2.48;
    const centerLift = -0.03;

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      const nx = (points[idx] - cx) / rx;
      const ny = (points[idx + 1] - cy) / ry;

      let x = nx * targetSpanX;
      let y = ny * targetSpanY + centerLift;

      // Add gentle local decorrelation to reduce packed visual clumps while preserving shape.
      const decorrelate = 0.138;
      x += (rand() - 0.5) * decorrelate;
      y += (rand() - 0.5) * decorrelate;

      points[idx] = x;
      points[idx + 1] = y;
    }
    return points;
  });
}
