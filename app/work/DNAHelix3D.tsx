"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  const linesRef = useRef<THREE.LineSegments>(null);

  const { viewport } = useThree();
  const numPairs = 60;
  const radius = 2;
  const height = 15;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [accentColor] = useState(() => new THREE.Color(accent));
  const [secondaryColor] = useState(() => new THREE.Color(secondary));

  // Geometry for nodes
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.12, 16, 16), []);
  const materialA = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: darkMode ? 2.5 : 0.5,
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

  // Line segments geometry
  const lineGeoRef = useRef<THREE.BufferGeometry | null>(null);
  if (!lineGeoRef.current) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(numPairs * 6); // 2 points per pair, 3 coords
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    lineGeoRef.current = geo;
  }
  const lineGeo = lineGeoRef.current;

  const lineMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: darkMode ? 0xffffff : 0x888888,
      transparent: true,
      opacity: darkMode ? 0.3 : 0.1,
    });
  }, [darkMode]);

  useFrame((state, delta) => {
    if (paused) return;

    const time = state.clock.getElapsedTime();
    const rotationSpeed = time * 0.5;

    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.5;
      groupRef.current.rotation.y = rotationSpeed * 0.5;
    }

    const positions = lineGeo.attributes.position.array as Float32Array;

    for (let i = 0; i < numPairs; i++) {
      const progress = i / numPairs;
      const y = (progress - 0.5) * height;
      const angle = progress * Math.PI * 4 + rotationSpeed;

      // A subtle wave adds organic life without destroying the structural shape
      const wave = Math.sin(progress * Math.PI * 4 + time * 1.5) * 0.15;

      const xA = Math.cos(angle) * (radius + wave);
      const zA = Math.sin(angle) * (radius + wave);

      const xB = Math.cos(angle + Math.PI) * (radius + wave);
      const zB = Math.sin(angle + Math.PI) * (radius + wave);

      // Update Node A
      dummy.position.set(xA, y, zA);
      dummy.scale.setScalar(1 + Math.sin(time * 2 + i * 0.1) * 0.2);
      dummy.updateMatrix();
      if (instancedNodesA.current) {
        instancedNodesA.current.setMatrixAt(i, dummy.matrix);
      }

      // Update Node B
      dummy.position.set(xB, y, zB);
      dummy.updateMatrix();
      if (instancedNodesB.current) {
        instancedNodesB.current.setMatrixAt(i, dummy.matrix);
      }

      // Draw horizontal rungs for EVERY node, creating a dense, clear helix ladder
      positions[i * 6] = xA;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = zA;

      positions[i * 6 + 3] = xB;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = zB;
    }

    if (instancedNodesA.current) {
      instancedNodesA.current.instanceMatrix.needsUpdate = true;
    }
    if (instancedNodesB.current) {
      instancedNodesB.current.instanceMatrix.needsUpdate = true;
    }
    if (lineGeo) {
      lineGeo.attributes.position.needsUpdate = true;
    }
  });

  // Update colors when props change
  React.useEffect(() => {
    accentColor.set(accent);
    materialA.color.set(accentColor);
    materialA.emissive.set(accentColor);

    secondaryColor.set(secondary);
    materialB.color.set(secondaryColor);
    materialB.emissive.set(secondaryColor);
  }, [accent, secondary, accentColor, secondaryColor, materialA, materialB]);

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
      <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} />
    </group>
  );
};
