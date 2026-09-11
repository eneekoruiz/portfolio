import type { MeshStandardMaterial } from "three";
import { SpringValue } from "../lib/spring";

/** Shared GPU uniforms keep the two strands and their instanced bonds in phase. */
export class HelixSignal {
  readonly time = { value: 0 };
  readonly energy = { value: 0.25 };
  readonly tension = new SpringValue(0, 70, 16);
  elapsed = 0;
  breath = 1;

  update(delta: number, velocity: number, warp: number, lowPower: boolean) {
    const dt = Math.min(delta, 0.05);
    this.elapsed += dt;
    this.time.value += dt * (1 + warp * 3);
    this.tension.target = Math.max(-1, Math.min(1, velocity / 40));
    const flow = this.tension.step(dt);
    this.breath =
      1 + Math.sin(this.elapsed * 0.72) * (lowPower ? 0.006 : 0.012);
    this.energy.value =
      (lowPower ? 0.16 : 0.34) + Math.abs(flow) * 0.35 + warp * 0.8;
  }

  apply(material: MeshStandardMaterial) {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uHelixTime = this.time;
      shader.uniforms.uHelixEnergy = this.energy;
      shader.vertexShader =
        `varying float vHelixHeight;\n${shader.vertexShader}`.replace(
          "#include <project_vertex>",
          `#include <project_vertex>
        vec4 helixPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          helixPosition = instanceMatrix * helixPosition;
        #endif
        vHelixHeight = helixPosition.y;`,
        );
      shader.fragmentShader = `uniform float uHelixTime;
        uniform float uHelixEnergy;
        varying float vHelixHeight;\n${shader.fragmentShader}`.replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float signalDistance = mod(vHelixHeight - uHelixTime * 2.2 + 16.0, 32.0) - 16.0;
        float signalGlow = exp(-signalDistance * signalDistance * 1.6);
        totalEmissiveRadiance += mix(diffuse, vec3(1.0), 0.38) * signalGlow * uHelixEnergy;`,
      );
    };
    material.customProgramCacheKey = () => "materia-helix-signal-v1";
    return material;
  }
}
