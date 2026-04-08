"use client";
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildMorphTargets } from "@/lib/particleTargets";
import { themeTokens } from "@/lib/theme";

type ParticleParams = {
  count: number;
  baseSize: number;
  sizeJitter: number;
  morphHold: number;
  morphDuration: number;
  attraction: number;
  damping: number;
  driftAmp: number;
  driftFreq: number;
  hoverRadius: number;
  hoverFalloffPow: number;
};

const DESKTOP_PARAMS: ParticleParams = {
  count: 4000,
  baseSize: 1.05,
  sizeJitter: 1.05,
  morphHold: 3.8,
  morphDuration: 9.5,
  attraction: 0.02,
  damping: 0.95,
  driftAmp: 0.14,
  driftFreq: 0.46,
  hoverRadius: 0.28,
  hoverFalloffPow: 1.8,
};

const MOBILE_PARAMS: ParticleParams = {
  count: 5000,
  baseSize: 1.55,
  sizeJitter: 0.9,
  morphHold: 3.4,
  morphDuration: 8.0,
  attraction: 0.075,
  damping: 0.9,
  driftAmp: 0.009,
  driftFreq: 0.44,
  hoverRadius: 0.12,
  hoverFalloffPow: 1,
};

const vertexShader = `
attribute float aSize;
attribute float aHover;
uniform float uPixelRatio;
uniform float uPointScale;
uniform float uHoverSizeBoost;
varying float vHover;
void main() {
  vHover = aHover;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float size = aSize + aHover * uHoverSizeBoost;
  gl_PointSize = size * uPointScale * uPixelRatio / max(0.35, -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uHoverColor;
varying float vHover;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = dot(c, c);
  if (d > 0.25) discard;

  vec3 color = mix(uBaseColor, uHoverColor, vHover);
  gl_FragColor = vec4(color, 1.0);
}
`;

function mulberry32(seed: number) {
  let t = seed;
  return function next() {
    t += 0x6d2b79f5;
    let v = Math.imul(t ^ (t >>> 15), t | 1);
    v ^= v + Math.imul(v ^ (v >>> 7), v | 61);
    return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
  };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function hash01(i: number) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function ParticleCloud({ params, organicCursor }: { params: ParticleParams; organicCursor: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hoverValues = useMemo(() => new Float32Array(params.count), [params.count]);
  const velocity = useMemo(() => new Float32Array(params.count * 3), [params.count]);
  const current = useMemo(() => new Float32Array(params.count * 3), [params.count]);
  const morphClockRef = useRef(0);
  const holdRef = useRef(0);
  const targetARef = useRef(0);
  const targetBRef = useRef(1);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  /** NDC (-1..1) from window pointermove; canvas does not receive events when covered by z-10 UI. */
  const windowNdcRef = useRef({ x: 0, y: 0, hasMove: false });
  const prevWorldRef = useRef({ x: 0, y: 0 });
  const velSmoothRef = useRef({ x: 0, y: 0 });
  const velInitRef = useRef(false);

  const targets = useMemo(() => buildMorphTargets(params.count, 73), [params.count]);
  const baseSizes = useMemo(() => {
    const rand = mulberry32(91);
    const arr = new Float32Array(params.count);
    for (let i = 0; i < params.count; i += 1) {
      arr[i] = params.baseSize + rand() * params.sizeJitter;
    }
    return arr;
  }, [params.baseSize, params.count, params.sizeJitter]);

  const aPhase = useMemo(() => {
    const rand = mulberry32(203);
    const arr = new Float32Array(params.count);
    for (let i = 0; i < params.count; i += 1) {
      arr[i] = rand();
    }
    return arr;
  }, [params.count]);

  const { viewport, pointer, gl } = useThree();
  const token = themeTokens;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const initial = new Float32Array(targets[0]);
    current.set(initial);
    g.setAttribute("position", new THREE.BufferAttribute(initial, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(baseSizes, 1));
    g.setAttribute("aHover", new THREE.BufferAttribute(hoverValues, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
    return g;
  }, [aPhase, baseSizes, current, hoverValues, targets]);

  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const uniforms = mat.uniforms;
    (uniforms.uBaseColor.value as THREE.Color).setRGB(...token.particleBase);
    (uniforms.uHoverColor.value as THREE.Color).setRGB(...token.particleHover);
  }, [token.particleBase, token.particleHover]);

  useEffect(() => {
    const canvas = gl.domElement;
    const syncFromClient = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      windowNdcRef.current.x = ((clientX - r.left) / r.width) * 2 - 1;
      windowNdcRef.current.y = -((clientY - r.top) / r.height) * 2 + 1;
      windowNdcRef.current.hasMove = true;
    };
    const onPointerMove = (e: PointerEvent) => syncFromClient(e.clientX, e.clientY);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const onLeave = () => {
      windowNdcRef.current.hasMove = false;
      mouseRef.current.active = false;
    };
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const mat = materialRef.current;
    if (!points || !mat) return;

    const clampedDelta = Math.min(0.033, delta);
    const dt = clampedDelta * 60;

    const wnd = windowNdcRef.current;
    const px = wnd.hasMove ? wnd.x : pointer.x;
    const py = wnd.hasMove ? wnd.y : pointer.y;
    mouseRef.current.x = px * viewport.width * 0.5;
    mouseRef.current.y = py * viewport.height * 0.5;
    mouseRef.current.active =
      wnd.hasMove || Math.abs(pointer.x) > 1e-3 || Math.abs(pointer.y) > 1e-3;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const posArray = pos.array as Float32Array;
    const hover = geometry.getAttribute("aHover") as THREE.BufferAttribute;
    const targetA = targets[targetARef.current];
    const targetB = targets[targetBRef.current];

    holdRef.current += clampedDelta;
    if (holdRef.current >= params.morphHold) {
      morphClockRef.current += clampedDelta / params.morphDuration;
      if (morphClockRef.current >= 1) {
        morphClockRef.current = 0;
        holdRef.current = 0;
        targetARef.current = targetBRef.current;
        targetBRef.current = (targetBRef.current + 1 + Math.floor(Math.random() * 2)) % targets.length;
      }
    }

    const t = morphClockRef.current;
    const ease = t * t * (3 - 2 * t);
    const hoverRadiusWorld = params.hoverRadius * Math.min(viewport.width, viewport.height);
    const hoverRadiusSq = hoverRadiusWorld * hoverRadiusWorld;

    const wx = mouseRef.current.x;
    const wy = mouseRef.current.y;
    if (organicCursor && mouseRef.current.active) {
      if (!velInitRef.current) {
        prevWorldRef.current = { x: wx, y: wy };
        velInitRef.current = true;
      }
      const invDt = 1 / Math.max(clampedDelta, 1e-4);
      const ix = (wx - prevWorldRef.current.x) * invDt;
      const iy = (wy - prevWorldRef.current.y) * invDt;
      prevWorldRef.current = { x: wx, y: wy };
      velSmoothRef.current.x = velSmoothRef.current.x * 0.88 + ix * 0.12;
      velSmoothRef.current.y = velSmoothRef.current.y * 0.88 + iy * 0.12;
    } else if (!mouseRef.current.active) {
      velInitRef.current = false;
    }

    const phaseAttr = geometry.getAttribute("aPhase") as THREE.BufferAttribute;
    const phaseArr = phaseAttr.array as Float32Array;
    const time = state.clock.elapsedTime;
    const svx = velSmoothRef.current.x;
    const svy = velSmoothRef.current.y;
    const speed = Math.hypot(svx, svy);
    const speedNorm = Math.min(speed / (hoverRadiusWorld * 1.15 + 1e-4), 2.2);

    for (let i = 0; i < params.count; i += 1) {
      const idx = i * 3;
      const x = current[idx];
      const y = current[idx + 1];
      const z = current[idx + 2];

      const tx0 = targetA[idx] + (targetB[idx] - targetA[idx]) * ease;
      const ty0 = targetA[idx + 1] + (targetB[idx + 1] - targetA[idx + 1]) * ease;
      const tz0 = targetA[idx + 2] + (targetB[idx + 2] - targetA[idx + 2]) * ease;

      const driftX = Math.sin(state.clock.elapsedTime * params.driftFreq + i * 0.0017) * params.driftAmp;
      const driftY = Math.cos(state.clock.elapsedTime * (params.driftFreq * 1.1) + i * 0.0011) * params.driftAmp;
      const tx = tx0 + driftX;
      const ty = ty0 + driftY;
      const tz = tz0;

      let ax = (tx - x) * params.attraction;
      let ay = (ty - y) * params.attraction;
      const az = (tz - z) * params.attraction * 0.4;

      let near = 0;
      if (params.hoverRadius > 0 && mouseRef.current.active) {
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        const distPhys = Math.sqrt(distSq + 1e-10);

        if (organicCursor) {
          const phase = phaseArr[i];
          const ripple = 0.78 + 0.22 * Math.sin(time * 2.05 + phase * Math.PI * 2 + i * 0.017);
          const rScale = 0.82 + 0.38 * phase;
          const rMax = hoverRadiusWorld * rScale * ripple;
          const rMaxSq = rMax * rMax;

          const fastCursor = speed > Math.max(2.4, hoverRadiusWorld * 0.09);

          if (fastCursor) {
            const inv = 1 / speed;
            const ux = svx * inv;
            const uy = svy * inv;
            const along = dx * ux + dy * uy;
            const across = dx * -uy + dy * ux;
            const stretch = 1 + speedNorm * 0.42;
            const squash = 1 / Math.sqrt(stretch);
            const aN = along / (rMax * stretch);
            const cN = across / (rMax * squash);
            const metricSq = aN * aN + cN * cN;
            if (metricSq < 1) {
              const metricDist = Math.sqrt(metricSq);
              const falloff = 1 - metricDist;
              near = Math.pow(Math.max(0, falloff), params.hoverFalloffPow);
            }
          } else if (distSq < rMaxSq) {
            const falloff = 1 - distPhys / rMax;
            near = Math.pow(Math.max(0, falloff), params.hoverFalloffPow);
          }

          const edgeGrain = 0.52 + 0.48 * (0.5 + 0.5 * Math.sin(time * 2.8 + phase * 7.1 + i * 0.023));
          near *= edgeGrain;

          if (near > 0.004) {
            const invD = 1 / (distPhys + 0.08 * hoverRadiusWorld);
            const txv = -dy * invD;
            const tyv = dx * invD;
            const swirl =
              near * (0.0042 + 0.0034 * phase) * Math.sin(time * 1.7 + phase * 4.2);
            ax += txv * swirl;
            ay += tyv * swirl;
            const jx = (hash01(i + 37) - 0.5) * near * 0.0055;
            const jy = (hash01(i + 91) - 0.5) * near * 0.0055;
            ax += jx;
            ay += jy;
          }
        } else if (distSq < hoverRadiusSq) {
          const falloff = 1 - distPhys / hoverRadiusWorld;
          near = Math.pow(Math.max(0, falloff), params.hoverFalloffPow);
        }
      }

      const vx = velocity[idx] * params.damping + ax * dt;
      const vy = velocity[idx + 1] * params.damping + ay * dt;
      const vz = velocity[idx + 2] * params.damping + az * dt;
      velocity[idx] = vx;
      velocity[idx + 1] = vy;
      velocity[idx + 2] = vz;

      current[idx] = x + vx * 0.015 * dt;
      current[idx + 1] = y + vy * 0.015 * dt;
      current[idx + 2] = z + vz * 0.015 * dt;
      posArray[idx] = current[idx];
      posArray[idx + 1] = current[idx + 1];
      posArray[idx + 2] = current[idx + 2];

      hoverValues[i] = hoverValues[i] * 0.72 + near * 0.28;
    }

    pos.needsUpdate = true;
    hover.needsUpdate = true;
    mat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.75);
    mat.uniforms.uPointScale.value = viewport.width < 7 ? 2.35 : 2.75;
    mat.uniforms.uHoverSizeBoost.value = organicCursor ? 2.05 : 1.55;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={{
          uPixelRatio: { value: 1 },
          uPointScale: { value: 1 },
          uHoverSizeBoost: { value: 1.55 },
          uBaseColor: { value: new THREE.Color(...token.particleBase) },
          uHoverColor: { value: new THREE.Color(...token.particleHover) },
        }}
      />
    </points>
  );
}

export function ParticleCloudScene({ organicCursor = false }: { organicCursor?: boolean }) {
  const isMobile = useIsMobile();
  const params = isMobile ? MOBILE_PARAMS : DESKTOP_PARAMS;

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.4], fov: 42 }}
      >
        <ParticleCloud params={params} organicCursor={organicCursor} />
      </Canvas>
    </div>
  );
}
