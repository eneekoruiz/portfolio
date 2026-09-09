"use client";

/* GPU uniforms are intentionally mutable state owned by Three, not React. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { materia } from "../lib/materia";
import { DNAHelix3D } from "./DNAHelix3D";

const MAX_SURFACES = 8;
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;
const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uScene;
  uniform vec2 uResolution;
  uniform vec3 uPaper;
  uniform float uTime;
  uniform float uDark;
  uniform int uCount;
  uniform vec4 uRects[${MAX_SURFACES}];
  uniform vec4 uGestures[${MAX_SURFACES}];
  uniform vec4 uOptics[${MAX_SURFACES}];
  uniform vec3 uColors[${MAX_SURFACES}];
  float grain(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }
  float roundBox(vec2 p, vec2 size, float radius) {
    vec2 q = abs(p) - size + radius;
    return min(max(q.x,q.y), 0.0) + length(max(q,0.0)) - radius;
  }
  vec3 sceneAt(vec2 uv) {
    vec4 s = texture2D(uScene, clamp(uv, 0.001, 0.999));
    return mix(uPaper, s.rgb, s.a * mix(0.65, 0.82, uDark));
  }
  void main() {
    vec2 pixel = vec2(vUv.x, 1.0-vUv.y) * uResolution;
    vec3 color = sceneAt(vUv);
    for (int i=0; i<${MAX_SURFACES}; i++) {
      if (i >= uCount) break;
      vec4 rect = uRects[i];
      vec2 p = pixel - rect.xy - rect.zw * 0.5;
      float radius = min(uOptics[i].y, min(rect.z, rect.w) * 0.5);
      float distance = roundBox(p, rect.zw * 0.5, radius);
      if (distance > 22.0) continue;
      float mask = 1.0 - smoothstep(-1.0, 1.0, distance);
      float energy = clamp(uOptics[i].x, 0.0, 1.2);
      vec2 local = p / max(rect.zw * 0.5, vec2(1.0));
      vec2 pointer = uGestures[i].xy * rect.zw + rect.xy;
      vec2 tangent = uGestures[i].zw;
      vec2 delta = pixel - pointer;
      float proximity = exp(-dot(delta,delta) / 65000.0);
      float rim = exp(-abs(distance) * 0.15);
      vec2 normal = normalize(local + vec2(0.0001));
      vec2 bend = normal * (5.0 + rim * 16.0) + tangent * proximity * energy * 10.0;
      bend.y *= -1.0;
      vec2 offset = bend / uResolution;
      vec2 dispersion = vec2(tangent.x, -tangent.y) * (0.6 + energy * 2.3) / uResolution;
      vec3 lens;
      lens.r = sceneAt(vUv + offset + dispersion).r;
      lens.g = sceneAt(vUv + offset).g;
      lens.b = sceneAt(vUv + offset - dispersion).b;
      lens = mix(lens, uColors[i], 0.025 + energy * 0.035);
      color = mix(color, lens, mask);
      // Directional rim + soft optical bloom, computed without a blur pass.
      float glint = pow(max(0.0, dot(normal, normalize(tangent + vec2(0.001)))), 6.0);
      float caustic = exp(-abs(distance) * 0.7) + exp(-abs(distance) * 0.11) * 0.16;
      color += mix(uColors[i], vec3(1.0), 0.45) * caustic * energy * proximity * (0.22 + glint * 0.7);
      float noise = grain(floor(pixel) + floor(uTime * 12.0)) - 0.5;
      color += noise * 0.008 * mask;
    }
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

interface Props {
  accent: string;
  secondary: string;
  darkMode: boolean;
  active: boolean;
  lowPower: boolean;
  isMobile: boolean;
}

export function OpticalCompositor({
  accent,
  secondary,
  darkMode,
  active,
  lowPower,
  isMobile,
}: Props) {
  const { gl, size } = useThree();
  const sourceScene = useMemo(() => new THREE.Scene(), []);
  const resources = useMemo(() => {
    if (lowPower) return null;
    const target = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    });
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uScene: { value: target.texture },
        uResolution: { value: new THREE.Vector2() },
        uPaper: { value: new THREE.Color() },
        uDark: { value: 0 },
        uTime: { value: 0 },
        uCount: { value: 0 },
        uRects: {
          value: Array.from(
            { length: MAX_SURFACES },
            () => new THREE.Vector4(),
          ),
        },
        uGestures: {
          value: Array.from(
            { length: MAX_SURFACES },
            () => new THREE.Vector4(),
          ),
        },
        uOptics: {
          value: Array.from(
            { length: MAX_SURFACES },
            () => new THREE.Vector4(),
          ),
        },
        uColors: {
          value: Array.from({ length: MAX_SURFACES }, () => new THREE.Color()),
        },
      },
    });
    return { target, material };
  }, [lowPower]);

  useEffect(() => {
    if (!resources) return;
    resources.material.uniforms.uPaper.value.set(
      darkMode ? "#080b12" : "#f5f5f7",
    );
    resources.material.uniforms.uDark.value = darkMode ? 1 : 0;
  }, [resources, darkMode]);
  useEffect(
    () => () => {
      resources?.target.dispose();
      resources?.material.dispose();
    },
    [resources],
  );

  useFrame((state) => {
    if (!active || materia.paused) return;
    const previousTarget = gl.getRenderTarget();
    if (!resources) {
      gl.setRenderTarget(null);
      gl.render(sourceScene, state.camera);
      if (gl.domElement.dataset.materiaRenderer !== "direct")
        gl.domElement.dataset.materiaRenderer = "direct";
      gl.setRenderTarget(previousTarget);
      return;
    }
    const { target, material } = resources;
    const dpr = Math.min(gl.getPixelRatio(), 1.5);
    const width = Math.max(1, Math.round(size.width * dpr));
    const height = Math.max(1, Math.round(size.height * dpr));
    if (target.width !== width || target.height !== height)
      target.setSize(width, height);
    const u = material.uniforms;
    u.uResolution.value.set(size.width, size.height);
    u.uTime.value = state.clock.elapsedTime;
    let count = 0;
    for (const surface of materia.surfaces) {
      if (count === MAX_SURFACES) break;
      if (!surface.visible || !surface.element.isConnected) continue;
      const rect = surface.element.getBoundingClientRect();
      if (
        rect.bottom <= 0 ||
        rect.top >= size.height ||
        rect.width < 1 ||
        rect.height < 1
      )
        continue;
      u.uRects.value[count].set(rect.left, rect.top, rect.width, rect.height);
      u.uGestures.value[count].set(
        surface.x.value,
        surface.y.value,
        surface.tangentX.value,
        surface.tangentY.value,
      );
      u.uOptics.value[count].set(surface.hover.value, surface.radius, 0, 0);
      u.uColors.value[count].set(surface.color);
      count++;
    }
    u.uCount.value = count;
    gl.setRenderTarget(target);
    gl.render(sourceScene, state.camera);
    gl.setRenderTarget(null);
    gl.render(state.scene, state.camera);
    if (gl.domElement.dataset.materiaRenderer !== "refraction")
      gl.domElement.dataset.materiaRenderer = "refraction";
    gl.setRenderTarget(previousTarget);
  }, 1);

  return (
    <>
      {createPortal(
        <>
          <ambientLight intensity={darkMode ? 0.68 : 1.08} />
          <directionalLight
            position={[7, 9, 8]}
            intensity={darkMode ? 1.35 : 2.1}
          />
          <directionalLight
            position={[-6, -4, -7]}
            intensity={darkMode ? 0.35 : 0.75}
          />
          <DNAHelix3D
            accent={accent}
            secondary={secondary}
            darkMode={darkMode}
            paused={!active}
            lowPower={lowPower}
            isMobile={isMobile}
          />
        </>,
        sourceScene,
      )}
      {resources && (
        <mesh material={resources.material} frustumCulled={false}>
          <planeGeometry args={[2, 2]} />
        </mesh>
      )}
    </>
  );
}
