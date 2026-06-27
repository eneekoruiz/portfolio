"use client";

import React, { useRef, useMemo, useState } from "react";
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
  const instancedNodesA = useRef<THREE.InstancedMesh>(null);
  const instancedNodesB = useRef<THREE.InstancedMesh>(null);
  const rungsRef = useRef<THREE.LineSegments>(null);
  const strandARef = useRef<THREE.Line>(null);
  const strandBRef = useRef<THREE.Line>(null);

  const numPairs = 120;
  const radius = 2;
  const height = 18;
  const turns = 4;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [accentColor] = useState(() => new THREE.Color(accent));
  const [secondaryColor] = useState(() => new THREE.Color(secondary));

  // Geometry for nodes
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []);
  const materialA = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: darkMode ? 2.0 : 0.5,
      toneMapped: false,
    });
  }, [accentColor, darkMode]);

  const materialB = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: secondaryColor,
      emissive: secondaryColor,
      emissiveIntensity: darkMode ? 1.5 : 0.3,
      toneMapped: false,
    });
  }, [secondaryColor, darkMode]);

  // Rungs geometry (line segments)
  const rungsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(numPairs * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [numPairs]);

  // Strands geometry (continuous lines)
  const strandAGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(numPairs * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [numPairs]);

  const strandBGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(numPairs * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [numPairs]);

  const lineMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: darkMode ? 0xffffff : 0x888888,
      transparent: true,
      opacity: darkMode ? 0.4 : 0.2,
    });
  }, [darkMode]);
  
  const strandMatA = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: darkMode ? 0.6 : 0.4,
    });
  }, [accentColor, darkMode]);

  const strandMatB = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: darkMode ? 0.6 : 0.4,
    });
  }, [secondaryColor, darkMode]);

  useFrame((state, delta) => {
    if (paused) return;

    // Use elapsedTime to avoid THREE.Clock deprecation warning
    const time = state.clock.elapsedTime;
    const rotationSpeed = time * 0.5;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.5;
      groupRef.current.rotation.y = rotationSpeed * 0.5;
    }

    const rungsPos = rungsGeo.attributes.position.array as Float32Array;
    const strandAPos = strandAGeo.attributes.position.array as Float32Array;
    const strandBPos = strandBGeo.attributes.position.array as Float32Array;

    for (let i = 0; i < numPairs; i++) {
      const progress = i / (numPairs - 1);
      const y = (progress - 0.5) * height;
      const angle = progress * Math.PI * 2 * turns + rotationSpeed;

      const xA = Math.cos(angle) * radius;
      const zA = Math.sin(angle) * radius;

      const xB = Math.cos(angle + Math.PI) * radius;
      const zB = Math.sin(angle + Math.PI) * radius;

      // Node A
      dummy.position.set(xA, y, zA);
      dummy.scale.setScalar(1 + Math.sin(time * 2 + i * 0.1) * 0.1);
      dummy.updateMatrix();
      if (instancedNodesA.current) {
        instancedNodesA.current.setMatrixAt(i, dummy.matrix);
      }

      // Node B
      dummy.position.set(xB, y, zB);
      dummy.scale.setScalar(1 + Math.sin(time * 2 + i * 0.1) * 0.1);
      dummy.updateMatrix();
      if (instancedNodesB.current) {
        instancedNodesB.current.setMatrixAt(i, dummy.matrix);
      }

      // Rungs (horizontal lines)
      rungsPos[i * 6] = xA;
      rungsPos[i * 6 + 1] = y;
      rungsPos[i * 6 + 2] = zA;

      rungsPos[i * 6 + 3] = xB;
      rungsPos[i * 6 + 4] = y;
      rungsPos[i * 6 + 5] = zB;

      // Strands (continuous lines)
      strandAPos[i * 3] = xA;
      strandAPos[i * 3 + 1] = y;
      strandAPos[i * 3 + 2] = zA;

      strandBPos[i * 3] = xB;
      strandBPos[i * 3 + 1] = y;
      strandBPos[i * 3 + 2] = zB;
    }

    if (instancedNodesA.current) instancedNodesA.current.instanceMatrix.needsUpdate = true;
    if (instancedNodesB.current) instancedNodesB.current.instanceMatrix.needsUpdate = true;
    
    rungsGeo.attributes.position.needsUpdate = true;
    strandAGeo.attributes.position.needsUpdate = true;
    strandBGeo.attributes.position.needsUpdate = true;
  });

  React.useEffect(() => {
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
      <instancedMesh
        ref={instancedNodesA}
        args={[sphereGeo, materialA, numPairs]}
      />
      <instancedMesh
        ref={instancedNodesB}
        args={[sphereGeo, materialB, numPairs]}
      />
      <lineSegments ref={rungsRef} geometry={rungsGeo} material={lineMat} />
      <line ref={strandARef} geometry={strandAGeo} material={strandMatA} />
      <line ref={strandBRef} geometry={strandBGeo} material={strandMatB} />
    </group>
  );
};
