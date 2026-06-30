"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DNAHelix3DProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
}

const PAIRS = 76;
const RADIUS = 2.45;
const HEIGHT = 24;
const TURNS = 5.75;

export const DNAHelix3D: React.FC<DNAHelix3DProps> = ({
  accent,
  secondary,
  darkMode,
  paused = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodesARef = useRef<THREE.InstancedMesh>(null);
  const nodesBRef = useRef<THREE.InstancedMesh>(null);
  const rungsRef = useRef<THREE.InstancedMesh>(null);

  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  const secondaryColor = useMemo(() => new THREE.Color(secondary), [secondary]);

  const helixData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matricesA: THREE.Matrix4[] = [];
    const matricesB: THREE.Matrix4[] = [];
    const rungMatrices: THREE.Matrix4[] = [];
    const pointsA: THREE.Vector3[] = [];
    const pointsB: THREE.Vector3[] = [];
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < PAIRS; i++) {
      const progress = i / (PAIRS - 1);
      const y = (progress - 0.5) * HEIGHT;
      const t = progress * Math.PI * 2 * TURNS;

      const a = new THREE.Vector3(
        RADIUS * Math.cos(t),
        y,
        RADIUS * Math.sin(t),
      );
      const b = new THREE.Vector3(
        RADIUS * Math.cos(t + Math.PI),
        y,
        RADIUS * Math.sin(t + Math.PI),
      );

      pointsA.push(a);
      pointsB.push(b);

      const nodeScale = 0.11 + (i % 3) * 0.006;
      dummy.position.copy(a);
      dummy.quaternion.identity();
      dummy.scale.setScalar(nodeScale);
      dummy.updateMatrix();
      matricesA.push(dummy.matrix.clone());

      dummy.position.copy(b);
      dummy.quaternion.identity();
      dummy.scale.setScalar(nodeScale);
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
  }, []);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 12), []);
  const rungGeo = useMemo(() => new THREE.CylinderGeometry(0.018, 0.018, 1, 8), []);
  const strandAGeo = useMemo(
    () => new THREE.TubeGeometry(helixData.curveA, 180, 0.024, 8, false),
    [helixData.curveA],
  );
  const strandBGeo = useMemo(
    () => new THREE.TubeGeometry(helixData.curveB, 180, 0.024, 8, false),
    [helixData.curveB],
  );

  const materialA = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: darkMode ? 1.4 : 0.25,
        roughness: 0.34,
        metalness: 0.22,
        toneMapped: false,
      }),
    [accentColor, darkMode],
  );

  const materialB = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: secondaryColor,
        emissive: secondaryColor,
        emissiveIntensity: darkMode ? 1.1 : 0.18,
        roughness: 0.36,
        metalness: 0.18,
        toneMapped: false,
      }),
    [secondaryColor, darkMode],
  );

  const rungMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: darkMode ? 0xdde7ff : 0x6f7480,
        emissive: darkMode ? 0x172b58 : 0x000000,
        emissiveIntensity: darkMode ? 0.32 : 0,
        transparent: true,
        opacity: darkMode ? 0.58 : 0.42,
        roughness: 0.48,
        metalness: 0.28,
      }),
    [darkMode],
  );

  useEffect(() => {
    const nodesA = nodesARef.current;
    const nodesB = nodesBRef.current;
    const rungs = rungsRef.current;
    if (!nodesA || !nodesB || !rungs) return;

    for (let i = 0; i < PAIRS; i++) {
      nodesA.setMatrixAt(i, helixData.matricesA[i]);
      nodesB.setMatrixAt(i, helixData.matricesB[i]);
      rungs.setMatrixAt(i, helixData.rungMatrices[i]);
    }

    nodesA.instanceMatrix.needsUpdate = true;
    nodesB.instanceMatrix.needsUpdate = true;
    rungs.instanceMatrix.needsUpdate = true;
  }, [helixData]);

  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 0.45) * 0.42;
    groupRef.current.rotation.y += delta * 0.42;
  });

  useEffect(() => {
    return () => {
      sphereGeo.dispose();
      rungGeo.dispose();
      strandAGeo.dispose();
      strandBGeo.dispose();
      materialA.dispose();
      materialB.dispose();
      rungMat.dispose();
    };
  }, [materialA, materialB, rungGeo, rungMat, sphereGeo, strandAGeo, strandBGeo]);

  return (
    <group ref={groupRef} rotation={[0, 0, THREE.MathUtils.degToRad(-15)]}>
      <mesh geometry={strandAGeo} material={materialA} />
      <mesh geometry={strandBGeo} material={materialB} />
      <instancedMesh ref={rungsRef} args={[rungGeo, rungMat, PAIRS]} />
      <instancedMesh ref={nodesARef} args={[sphereGeo, materialA, PAIRS]} />
      <instancedMesh ref={nodesBRef} args={[sphereGeo, materialB, PAIRS]} />
    </group>
  );
};
