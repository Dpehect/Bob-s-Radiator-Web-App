"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";

const BackdropShimmerShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uHeatRatio;
    uniform vec2 uPointer;
    varying vec2 vUv;

    void main() {
      // Coordinates centered around (0.0, 0.0)
      vec2 uv = vUv - 0.5;

      // Dynamic wave coordinate distortion for rising thermal waves
      vec2 waveUv = vUv * 3.0;
      waveUv.y -= uTime * 0.65; // rise upwards over time
      waveUv.x += sin(waveUv.y * 2.0 + uTime * 1.5) * 0.12 * uHeatRatio;

      // Layered noise waves to make it feel organic/fluid
      float n = sin(waveUv.x * 2.5 + waveUv.y * 1.5) * cos(waveUv.y * 3.0 - uTime);
      n += sin(waveUv.x * 5.0 - uTime * 2.0) * 0.25;
      n = (n + 1.25) * 0.44; // map noise to roughly 0 - 1

      // Subtle mouse tracking interactive plume glow
      float distToPointer = length(uv - uPointer * 0.45);
      float pointerGlow = exp(-distToPointer * 5.0) * uHeatRatio * 0.22;

      // Base radial warmth behind the radiator
      float radialGlow = exp(-length(uv) * 2.2);

      // 1950s workshop color palette
      // Cool mode background: dark rustic charcoal/brown (#120F0D)
      vec3 coolBg = vec3(0.07, 0.059, 0.051);

      // Hot mode background: deep smoldering copper/rust
      vec3 hotBg = mix(vec3(0.15, 0.065, 0.04), vec3(0.24, 0.09, 0.05), vUv.y);

      // Emissive core heater color: glowing embers orange-yellow (#FF6B35)
      vec3 glowColor = vec3(1.0, 0.42, 0.21);

      // Blend base background colors
      vec3 finalBg = mix(coolBg, hotBg, uHeatRatio);

      // Composite features
      vec3 finalColor = finalBg 
        + (radialGlow * 0.15 * uHeatRatio * glowColor) 
        + (n * 0.06 * uHeatRatio * glowColor) 
        + (pointerGlow * glowColor);

      // Soft circular vignette overlay
      float vignette = smoothstep(0.95, 0.22, length(uv));
      finalColor *= mix(0.28, 1.0, vignette);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

export default function BackdropShimmer() {
  const meshRef = useRef<THREE.Mesh>(null);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeatRatio: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uHeatRatio.value = heatRatio;
      
      // Interpolate pointer values smoothly
      const targetPX = state.pointer.x;
      const targetPY = state.pointer.y;
      material.uniforms.uPointer.value.x = THREE.MathUtils.lerp(
        material.uniforms.uPointer.value.x,
        targetPX,
        0.08
      );
      material.uniforms.uPointer.value.y = THREE.MathUtils.lerp(
        material.uniforms.uPointer.value.y,
        targetPY,
        0.08
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2.2]}>
      {/* Scaled large enough to cover viewport behind camera */}
      <planeGeometry args={[14, 10]} />
      <shaderMaterial
        depthWrite={false}
        vertexShader={BackdropShimmerShader.vertexShader}
        fragmentShader={BackdropShimmerShader.fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
