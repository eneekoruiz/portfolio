"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DNAHelix3DProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
  lowPower?: boolean;
  isMobile?: boolean;
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

  const config = useMemo(() => {
    if (isMobile) {
      return {
        pairs: 38,
        radius: 2.25,
        height: 16.5,
        turns: 2.25,
        tubeSegments: 88,
        radialSegments: 6,
        nodeSegments: 9,
        strandRadius: 0.042,
        rungRadius: 0.034,
        nodeScale: 0.145,
        rotationSpeed: 0.12,
        scale: [0.86, 1.06, 0.86] as [number, number, number],
        rotation: [4, 10, -6] as [number, number, number],
      };
    }

    return {
      pairs: lowPower ? 46 : 64,
      radius: 2.85,
      height: 22,
      turns: lowPower ? 3.05 : 3.45,
      tubeSegments: lowPower ? 112 : 168,
      radialSegments: lowPower ? 6 : 8,
      nodeSegments: lowPower ? 10 : 14,
      strandRadius: lowPower ? 0.036 : 0.048,
      rungRadius: lowPower ? 0.03 : 0.04,
      nodeScale: lowPower ? 0.135 : 0.155,
      rotationSpeed: lowPower ? 0.16 : 0.24,
      scale: [1.05, 1, 1.05] as [number, number, number],
      rotation: [7, 18, -10] as [number, number, number],
    };
  }, [isMobile, lowPower]);

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
    [config.radialSegments, config.strandRadius, config.tubeSegments, helixData.curveA],
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
    [config.radialSegments, config.strandRadius, config.tubeSegments, helixData.curveB],
  );

  const materialA = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: darkMode ? 1.15 : 0.18,
        roughness: 0.38,
        metalness: 0.18,
        toneMapped: false,
      }),
    [accentColor, darkMode],
  );

  const materialB = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: secondaryColor,
        emissive: secondaryColor,
        emissiveIntensity: darkMode ? 0.95 : 0.14,
        roughness: 0.4,
        metalness: 0.16,
        toneMapped: false,
      }),
    [secondaryColor, darkMode],
  );

  const rungMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: darkMode ? 0xf2f6ff : 0x737a86,
        emissive: darkMode ? 0x123a7a : 0x000000,
        emissiveIntensity: darkMode ? 0.34 : 0,
        transparent: true,
        opacity: darkMode ? 0.74 : 0.5,
        roughness: 0.42,
        metalness: 0.22,
      }),
    [darkMode],
  );

  useEffect(() => {
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

  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 0.32) * 0.26;
    groupRef.current.rotation.y += delta * config.rotationSpeed;
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
    <group
      ref={groupRef}
      rotation={config.rotation.map(THREE.MathUtils.degToRad) as [number, number, number]}
      scale={config.scale}
    >
      <mesh geometry={strandAGeo} material={materialA} />
      <mesh geometry={strandBGeo} material={materialB} />
      <instancedMesh ref={rungsRef} args={[rungGeo, rungMat, config.pairs]} />
      <instancedMesh ref={nodesARef} args={[sphereGeo, materialA, config.pairs]} />
      <instancedMesh ref={nodesBRef} args={[sphereGeo, materialB, config.pairs]} />
    </group>
  );
};
