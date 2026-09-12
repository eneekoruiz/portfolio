"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { materia } from "../lib/materia";
import { HelixSignal } from "./helixSignal";

interface DNAHelix3DProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
  lowPower?: boolean;
  isMobile?: boolean;
}

function createAtmosphereMaterial(
  accent: string,
  secondary: string,
  darkMode: boolean,
) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color(accent) },
      uSecondary: { value: new THREE.Color(secondary) },
      uDark: { value: darkMode ? 1 : 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uAccent;
      uniform vec3 uSecondary;
      uniform float uDark;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float radial = 1.0 - smoothstep(0.04, 0.72, length(uv * vec2(0.62, 1.0)));
        float ribbons = sin((uv.y + noise(uv * 4.0 + uTime * 0.06) * 0.12) * 34.0 + uTime * 0.85);
        float strands = smoothstep(0.7, 1.0, ribbons) * radial;
        float mist = noise(uv * 7.0 + vec2(uTime * 0.035, -uTime * 0.025)) * radial;
        vec3 color = mix(uSecondary, uAccent, 0.55 + 0.45 * sin(uv.y * 8.0 + uTime * 0.4));
        float edge = smoothstep(0.0, 0.14, vUv.x) * smoothstep(0.0, 0.14, 1.0 - vUv.x)
          * smoothstep(0.0, 0.1, vUv.y) * smoothstep(0.0, 0.1, 1.0 - vUv.y);
        float alpha = (strands * 0.16 + mist * 0.08) * (0.48 + uDark * 0.52) * edge;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function HelixAtmosphere({
  accent,
  secondary,
  darkMode,
  paused,
}: {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const palette = useMemo(
    () => ({ accent: new THREE.Color(), secondary: new THREE.Color() }),
    [],
  );
  if (!materialRef.current) {
    materialRef.current = createAtmosphereMaterial(accent, secondary, darkMode);
  }

  const planeGeometry = useMemo(
    () => new THREE.PlaneGeometry(12, 32, 1, 1),
    [],
  );

  useEffect(() => {
    const uniforms = materialRef.current?.uniforms;
    if (!uniforms) return;
    uniforms.uAccent.value.set(accent);
    uniforms.uSecondary.value.set(secondary);
    uniforms.uDark.value = darkMode ? 1 : 0;
  }, [accent, darkMode, secondary]);

  useFrame((_state, delta) => {
    const uniforms = materialRef.current?.uniforms;
    if (paused || !uniforms) return;
    // Three uniforms are mutable GPU state updated outside React rendering.
    // eslint-disable-next-line react-hooks/immutability
    uniforms.uTime.value += Math.min(delta, 0.05);
    palette.accent.set(materia.accent);
    palette.secondary.set(materia.secondary);
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) * 4);
    uniforms.uAccent.value.lerp(palette.accent, blend);
    uniforms.uSecondary.value.lerp(palette.secondary, blend);
  });

  useEffect(() => {
    const material = materialRef.current;
    return () => {
      material?.dispose();
      planeGeometry.dispose();
    };
  }, [planeGeometry]);

  return (
    <mesh
      geometry={planeGeometry}
      material={materialRef.current}
      position={[0, 0, -3.2]}
      scale={[1.08, 1, 1]}
    />
  );
}
export const DNAHelix3D: React.FC<DNAHelix3DProps> = ({
  accent,
  secondary,
  darkMode,
  paused = false,
  lowPower = false,
  isMobile = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodesARef = useRef<THREE.InstancedMesh>(null);
  const nodesBRef = useRef<THREE.InstancedMesh>(null);
  const rungsRef = useRef<THREE.InstancedMesh>(null);
  const baseRotationRef = useRef(0);
  const smoothScrollTurnRef = useRef(0);
  const signal = useMemo(() => new HelixSignal(), []);

  const config = useMemo(() => {
    if (isMobile) {
      return {
        pairs: 40,
        radius: 2.45,
        height: 18,
        turns: 2.3,
        tubeSegments: 88,
        radialSegments: 6,
        nodeSegments: 9,
        strandRadius: 0.045,
        rungRadius: 0.036,
        nodeScale: 0.155,
        rotationSpeed: 0.15,
        scale: [0.96, 1.08, 0.96] as [number, number, number],
        rotation: [4, 10, -6] as [number, number, number],
      };
    }

    return {
      pairs: lowPower ? 50 : 68,
      radius: lowPower ? 2.95 : 3.35,
      height: 24,
      turns: lowPower ? 3.1 : 3.4,
      tubeSegments: lowPower ? 112 : 168,
      radialSegments: lowPower ? 6 : 8,
      nodeSegments: lowPower ? 10 : 14,
      strandRadius: lowPower ? 0.042 : 0.054,
      rungRadius: lowPower ? 0.035 : 0.045,
      nodeScale: lowPower ? 0.15 : 0.175,
      rotationSpeed: lowPower ? 0.18 : 0.26,
      scale: [1.25, 1.08, 1.25] as [number, number, number],
      rotation: [7, 18, -10] as [number, number, number],
    };
  }, [isMobile, lowPower]);

  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  const secondaryColor = useMemo(() => new THREE.Color(secondary), [secondary]);
  const liveColors = useMemo(
    () => ({ accent: new THREE.Color(), secondary: new THREE.Color() }),
    [],
  );

  const helixData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matricesA: THREE.Matrix4[] = [];
    const matricesB: THREE.Matrix4[] = [];
    const rungMatrices: THREE.Matrix4[] = [];
    const pointsA: THREE.Vector3[] = [];
    const pointsB: THREE.Vector3[] = [];
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < config.pairs; i++) {
      const progress = i / (config.pairs - 1);
      const y = (progress - 0.5) * config.height;
      const t = progress * Math.PI * 2 * config.turns;

      const a = new THREE.Vector3(
        config.radius * Math.cos(t),
        y,
        config.radius * Math.sin(t),
      );
      const b = new THREE.Vector3(
        config.radius * Math.cos(t + Math.PI),
        y,
        config.radius * Math.sin(t + Math.PI),
      );

      pointsA.push(a);
      pointsB.push(b);

      const depthA = 0.88 + ((Math.sin(t) + 1) / 2) * 0.22;
      const depthB = 0.88 + ((Math.sin(t + Math.PI) + 1) / 2) * 0.22;

      dummy.position.copy(a);
      dummy.quaternion.identity();
      dummy.scale.setScalar(config.nodeScale * depthA);
      dummy.updateMatrix();
      matricesA.push(dummy.matrix.clone());

      dummy.position.copy(b);
      dummy.quaternion.identity();
      dummy.scale.setScalar(config.nodeScale * depthB);
      dummy.updateMatrix();
      matricesB.push(dummy.matrix.clone());

      const mid = a.clone().lerp(b, 0.5);
      const dir = b.clone().sub(a);
      const length = dir.length();
      dummy.position.copy(mid);
      dummy.quaternion.setFromUnitVectors(up, dir.normalize());
      dummy.scale.set(1, length, 1);
      dummy.updateMatrix();
      rungMatrices.push(dummy.matrix.clone());
    }

    return {
      matricesA,
      matricesB,
      rungMatrices,
      curveA: new THREE.CatmullRomCurve3(pointsA),
      curveB: new THREE.CatmullRomCurve3(pointsB),
    };
  }, [config]);

  const sphereGeo = useMemo(
    () => new THREE.SphereGeometry(1, config.nodeSegments, config.nodeSegments),
    [config.nodeSegments],
  );
  const rungGeo = useMemo(
    () =>
      new THREE.CylinderGeometry(
        config.rungRadius,
        config.rungRadius,
        1,
        config.radialSegments,
      ),
    [config.radialSegments, config.rungRadius],
  );
  const strandAGeo = useMemo(
    () =>
      new THREE.TubeGeometry(
        helixData.curveA,
        config.tubeSegments,
        config.strandRadius,
        config.radialSegments,
        false,
      ),
    [
      config.radialSegments,
      config.strandRadius,
      config.tubeSegments,
      helixData.curveA,
    ],
  );
  const strandBGeo = useMemo(
    () =>
      new THREE.TubeGeometry(
        helixData.curveB,
        config.tubeSegments,
        config.strandRadius,
        config.radialSegments,
        false,
      ),
    [
      config.radialSegments,
      config.strandRadius,
      config.tubeSegments,
      helixData.curveB,
    ],
  );

  const materialA = useMemo(
    () =>
      signal.apply(
        new THREE.MeshPhysicalMaterial({
          color: accentColor,
          emissive: accentColor,
          emissiveIntensity: darkMode ? 0.4 : 0.08,
          roughness: lowPower ? 0.38 : 0.24,
          metalness: lowPower ? 0.18 : 0.42,
          clearcoat: lowPower ? 0 : 0.75,
          clearcoatRoughness: 0.2,
          toneMapped: false,
        }),
      ),
    [accentColor, darkMode, signal, lowPower],
  );

  const materialB = useMemo(
    () =>
      signal.apply(
        new THREE.MeshPhysicalMaterial({
          color: secondaryColor,
          emissive: secondaryColor,
          emissiveIntensity: darkMode ? 0.3 : 0.06,
          roughness: lowPower ? 0.4 : 0.27,
          metalness: lowPower ? 0.16 : 0.48,
          clearcoat: lowPower ? 0 : 0.6,
          clearcoatRoughness: 0.23,
          toneMapped: false,
        }),
      ),
    [secondaryColor, darkMode, signal, lowPower],
  );

  const rungMat = useMemo(
    () =>
      signal.apply(
        new THREE.MeshStandardMaterial({
          color: darkMode ? 0xf2f6ff : 0x737a86,
          emissive: darkMode ? 0x123a7a : 0x000000,
          emissiveIntensity: darkMode ? 0.34 : 0,
          transparent: true,
          opacity: darkMode ? 0.74 : 0.5,
          roughness: 0.42,
          metalness: 0.22,
        }),
      ),
    [darkMode, signal],
  );

  const matARef = useRef(materialA);
  matARef.current = materialA;
  const matBRef = useRef(materialB);
  matBRef.current = materialB;

  useLayoutEffect(() => {
    const nodesA = nodesARef.current;
    const nodesB = nodesBRef.current;
    const rungs = rungsRef.current;
    if (!nodesA || !nodesB || !rungs) return;

    for (let i = 0; i < config.pairs; i++) {
      nodesA.setMatrixAt(i, helixData.matricesA[i]);
      nodesB.setMatrixAt(i, helixData.matricesB[i]);
      rungs.setMatrixAt(i, helixData.rungMatrices[i]);
    }

    nodesA.instanceMatrix.needsUpdate = true;
    nodesB.instanceMatrix.needsUpdate = true;
    rungs.instanceMatrix.needsUpdate = true;
  }, [config.pairs, helixData]);

  useFrame((_state, delta) => {
    if (paused || !groupRef.current) return;
    signal.update(
      delta,
      materia.velocity,
      materia.warp.value,
      lowPower || isMobile,
    );
    const time = signal.elapsed;
    const flow = signal.tension.value;
    const chapter = materia.chapter.value;
    const studio = materia.studio.value;
    const size = 1 + studio * (isMobile ? 0.06 : 0.14);
    groupRef.current.scale.set(
      config.scale[0] * signal.breath * size,
      (config.scale[1] / signal.breath) * size,
      config.scale[2] * signal.breath * size,
    );
    const currentScrollY =
      typeof window !== "undefined"
        ? window.scrollY || document.documentElement.scrollTop || 0
        : 0;
    const scrollMax =
      typeof document !== "undefined"
        ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        : 4000;
    const scrollFraction = Math.min(1, Math.max(0, currentScrollY / scrollMax));
    const targetScrollTurn =
      currentScrollY * 0.0035 + materia.chapter.value * 0.75;
    smoothScrollTurnRef.current +=
      (targetScrollTurn - smoothScrollTurnRef.current) *
      (1 - Math.exp(-Math.min(delta, 0.05) * 8));

    baseRotationRef.current +=
      Math.min(delta, 0.05) *
      (config.rotationSpeed +
        Math.min(Math.abs(materia.velocity) * 0.0018, 0.5)) *
      (1 + materia.warp.value * 6 + studio * 0.8);

    groupRef.current.position.y =
      Math.sin(time * 0.32) * 0.26 +
      Math.sin(chapter * 0.9) * 0.7 -
      scrollFraction * 3.4 +
      studio * 1.2;
    groupRef.current.position.z = Math.sin(chapter * 0.7) * 0.65 - studio * 1.4;
    groupRef.current.rotation.x =
      THREE.MathUtils.degToRad(config.rotation[0]) +
      materia.tiltX.value +
      flow * (isMobile ? 0.025 : 0.07) +
      Math.sin(chapter) * 0.08;
    groupRef.current.rotation.z =
      THREE.MathUtils.degToRad(config.rotation[2]) +
      materia.tiltY.value +
      flow * 0.035 +
      Math.sin(chapter * 1.3) * (isMobile ? 0.035 : 0.15) -
      studio * 0.24;
    groupRef.current.position.x = isMobile
      ? 0
      : materia.composition.value * 2.5;
    groupRef.current.rotation.y =
      baseRotationRef.current + smoothScrollTurnRef.current;
    liveColors.accent.set(materia.accent);
    liveColors.secondary.set(materia.secondary);
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) * 5);
    const matA = matARef.current;
    const matB = matBRef.current;
    if (matA && matB) {
      matA.color.lerp(liveColors.accent, blend);
      matA.emissive.copy(matA.color);
      matA.emissiveIntensity =
        (darkMode ? 0.45 : 0.15) * (1 + materia.warp.value * 1.4);
      matB.color.lerp(liveColors.secondary, blend);
      matB.emissive.copy(matB.color);
      matB.emissiveIntensity =
        (darkMode ? 0.35 : 0.12) * (1 + materia.warp.value * 1.4);
    }
  });

  useEffect(() => {
    return () => {
      sphereGeo.dispose();
      rungGeo.dispose();
      strandAGeo.dispose();
      strandBGeo.dispose();
    };
  }, [sphereGeo, rungGeo, strandAGeo, strandBGeo]);

  useEffect(() => {
    return () => {
      materialA.dispose();
      materialB.dispose();
      rungMat.dispose();
    };
  }, [materialA, materialB, rungMat]);

  return (
    <group
      ref={groupRef}
      rotation={
        config.rotation.map(THREE.MathUtils.degToRad) as [
          number,
          number,
          number,
        ]
      }
      scale={config.scale}
    >
      {!lowPower && !isMobile && (
        <HelixAtmosphere
          accent={accent}
          secondary={secondary}
          darkMode={darkMode}
          paused={paused}
        />
      )}
      <mesh geometry={strandAGeo} material={materialA} />
      <mesh geometry={strandBGeo} material={materialB} />
      <instancedMesh ref={rungsRef} args={[rungGeo, rungMat, config.pairs]} />
      <instancedMesh
        ref={nodesARef}
        args={[sphereGeo, materialA, config.pairs]}
      />
      <instancedMesh
        ref={nodesBRef}
        args={[sphereGeo, materialB, config.pairs]}
      />
    </group>
  );
};
