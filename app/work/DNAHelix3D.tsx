"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DNAHelix3DProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
}

export const DNAHelix3D: React.FC<DNAHelix3DProps> = ({
  accent,
  secondary,
  darkMode,
  paused = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const rungsRef = useRef<THREE.LineSegments>(null);
  
  const numPairs = 70;
  const radius = 2.5;
  const height = 24;
  const turns = 5.5;

  const [accentColor] = useState(() => new THREE.Color(accent));
  const [secondaryColor] = useState(() => new THREE.Color(secondary));

  // Pre-calculate positions once to avoid massive CPU overhead in useFrame
  const { positionsA, positionsB, rungsPositions, strandAPositions, strandBPositions } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matricesA: THREE.Matrix4[] = [];
    const matricesB: THREE.Matrix4[] = [];
    const rungs = new Float32Array(numPairs * 6);
    const strandA = new Float32Array(numPairs * 3);
    const strandB = new Float32Array(numPairs * 3);

    for (let i = 0; i < numPairs; i++) {
      const progress = i / (numPairs - 1);
      const y = (progress - 0.5) * height;
      const angle = progress * Math.PI * 2 * turns;

      const xA = Math.cos(angle) * radius;
      const zA = Math.sin(angle) * radius;
      const xB = Math.cos(angle + Math.PI) * radius;
      const zB = Math.sin(angle + Math.PI) * radius;

      // Node A
      dummy.position.set(xA, y, zA);
      dummy.scale.setScalar(1); // Perfect rigid shape, no pulsing
      dummy.updateMatrix();
      matricesA.push(dummy.matrix.clone());

      // Node B
      dummy.position.set(xB, y, zB);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      matricesB.push(dummy.matrix.clone());

      // Rungs
      rungs[i * 6] = xA;
      rungs[i * 6 + 1] = y;
      rungs[i * 6 + 2] = zA;
      rungs[i * 6 + 3] = xB;
      rungs[i * 6 + 4] = y;
      rungs[i * 6 + 5] = zB;

      // Strands
      strandA[i * 3] = xA;
      strandA[i * 3 + 1] = y;
      strandA[i * 3 + 2] = zA;
      strandB[i * 3] = xB;
      strandB[i * 3 + 1] = y;
      strandB[i * 3 + 2] = zB;
    }

    return { positionsA: matricesA, positionsB: matricesB, rungsPositions: rungs, strandAPositions: strandA, strandBPositions: strandB };
  }, [numPairs, radius, height, turns]);

  // Geometry for nodes
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []);
  const materialA = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: darkMode ? 2.0 : 0.5,
    toneMapped: false,
  }), [accentColor, darkMode]);

  const materialB = useMemo(() => new THREE.MeshStandardMaterial({
    color: secondaryColor,
    emissive: secondaryColor,
    emissiveIntensity: darkMode ? 1.5 : 0.3,
    toneMapped: false,
  }), [secondaryColor, darkMode]);

  // Geometries for lines
  const rungsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(rungsPositions, 3));
    return geo;
  }, [rungsPositions]);

  const strandAGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(strandAPositions, 3));
    return geo;
  }, [strandAPositions]);

  const strandBGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(strandBPositions, 3));
    return geo;
  }, [strandBPositions]);

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: darkMode ? 0xffffff : 0x888888,
    transparent: true,
    opacity: darkMode ? 0.4 : 0.2,
  }), [darkMode]);
  
  const strandMatA = useMemo(() => new THREE.LineBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: darkMode ? 0.6 : 0.4,
  }), [accentColor, darkMode]);

  const strandMatB = useMemo(() => new THREE.LineBasicMaterial({
    color: secondaryColor,
    transparent: true,
    opacity: darkMode ? 0.6 : 0.4,
  }), [secondaryColor, darkMode]);

  const instancedNodesA = useRef<THREE.InstancedMesh>(null);
  const instancedNodesB = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (instancedNodesA.current && instancedNodesB.current) {
      for (let i = 0; i < numPairs; i++) {
        instancedNodesA.current.setMatrixAt(i, positionsA[i]);
        instancedNodesB.current.setMatrixAt(i, positionsB[i]);
      }
      instancedNodesA.current.instanceMatrix.needsUpdate = true;
      instancedNodesB.current.instanceMatrix.needsUpdate = true;
    }
  }, [positionsA, positionsB, numPairs]);

  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Only animate the parent group rotation/position for massive performance boost
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.5;
    groupRef.current.rotation.y += delta * 0.5;
  });

  useEffect(() => {
    accentColor.set(accent);
    materialA.color.set(accentColor);
    materialA.emissive.set(accentColor);
    strandMatA.color.set(accentColor);

    secondaryColor.set(secondary);
    materialB.color.set(secondaryColor);
    materialB.emissive.set(secondaryColor);
    strandMatB.color.set(secondaryColor);
  }, [accent, secondary, accentColor, secondaryColor, materialA, materialB, strandMatA, strandMatB]);

  return (
    <group ref={groupRef} rotation={[0, 0, THREE.MathUtils.degToRad(-15)]}>
      <instancedMesh ref={instancedNodesA} args={[sphereGeo, materialA, numPairs]} />
      <instancedMesh ref={instancedNodesB} args={[sphereGeo, materialB, numPairs]} />
      <lineSegments ref={rungsRef} geometry={rungsGeo} material={lineMat} />
      <primitive object={new THREE.Line(strandAGeo, strandMatA)} />
      <primitive object={new THREE.Line(strandBGeo, strandMatB)} />
    </group>
  );
};
