"use client";
/* eslint-disable react-hooks/refs */

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";

// Simple deterministic PRNG for pure render offsets
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

// Shader for thermal heat haze particles
const HeatParticlesShader = {
  uniforms: {
    uTime: { value: 0 },
    uHeatRatio: { value: 0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uHeatRatio;
    attribute vec3 aRandom;
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      vec3 pos = position;
      float speed = 0.4 + uHeatRatio * 1.0;
      float drift = 0.08 + uHeatRatio * 0.3;
      
      // Vertical ascent looping
      float progress = mod(uTime * speed + aRandom.x * 10.0, 4.4);
      pos.y = -2.2 + progress;
      
      // Sinusoidal horizontal waving drift
      pos.x += sin(uTime * 2.0 + aRandom.y * 100.0) * drift;
      pos.z += cos(uTime * 1.5 + aRandom.z * 100.0) * drift;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Point size scales with heat
      gl_PointSize = (10.0 * aRandom.z * (0.3 + uHeatRatio * 0.7)) / -mvPosition.z;
      
      float fadeIn = smoothstep(-2.2, -1.6, pos.y);
      float fadeOut = smoothstep(2.2, 0.5, pos.y);
      vAlpha = fadeIn * fadeOut * (0.02 + uHeatRatio * 0.9);
      vPosition = pos;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float intensity = smoothstep(0.5, 0.1, dist);
      vec3 color = vec3(1.0, 0.27, 0.0); // Electric Orange (#FF4500)
      
      gl_FragColor = vec4(color, intensity * vAlpha * 0.9);
    }
  `,
};

function KilnParticles({ count = 75 }) {
  const meshRef = useRef<THREE.Points>(null);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count * 3);
    const random = createPRNG(456);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 3.5;
      pos[i * 3 + 1] = (random() - 0.5) * 4.4;
      pos[i * 3 + 2] = (random() - 0.5) * 0.6;

      rand[i * 3] = random();
      rand[i * 3 + 1] = random();
      rand[i * 3 + 2] = random();
    }
    return [pos, rand];
  }, [count]);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uHeatRatio: { value: 0 },
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uHeatRatio.value = heatRatio;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={HeatParticlesShader.vertexShader}
        fragmentShader={HeatParticlesShader.fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}

// Custom Material Shader applying wave distortion to radiator vertices on high temperature
const RadiatorWireframeShader = {
  uniforms: {
    uTime: { value: 0 },
    uHeatRatio: { value: 0 },
    uColor: { value: new THREE.Color("#FF4500") },
    uBaseColor: { value: new THREE.Color("#FAF9F6") },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uHeatRatio;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 pos = position;
      
      // Vertex heat wobble distortion: physical waving ripples that scale on temperature
      float wave = sin(pos.y * 3.5 - uTime * 6.0) * cos(pos.x * 2.0 + uTime * 4.0);
      float displacement = wave * 0.08 * uHeatRatio;
      pos.x += displacement;
      pos.z += displacement * 0.5;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      vNormal = normalMatrix * normal;
      vPosition = pos;
    }
  `,
  fragmentShader: `
    uniform float uHeatRatio;
    uniform vec3 uColor;
    uniform vec3 uBaseColor;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Glow outlines
      float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      
      // Colors shift from sleek warm white outline to fiery electric orange based on temperature
      vec3 color = mix(uBaseColor, uColor, uHeatRatio * 0.8);
      
      gl_FragColor = vec4(color, 0.4 + intensity * 0.6);
    }
  `,
};

interface SharedGeometries {
  cylinder: THREE.CylinderGeometry;
  sphere: THREE.SphereGeometry;
  torus: THREE.TorusGeometry;
}

interface RadiatorModelProps {
  geoms: SharedGeometries;
}

function RadiatorModel({ geoms }: RadiatorModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const { radiatorType, radiatorSurface, radiatorHeight, heatLevel } = useHeatStore();
  const heatRatio = heatLevel / 100;

  // Custom mouse parallax & ambient spin
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;

    const targetX = state.pointer.y * 0.18;
    const targetZ = -state.pointer.x * 0.18;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.06);
  });

  // Height configurations
  const heightMultiplier = useMemo(() => {
    if (radiatorHeight === "low") return 0.65;
    if (radiatorHeight === "tall") return 1.4;
    return 1.0;
  }, [radiatorHeight]);

  const modelHeight = 2.3 * heightMultiplier;

  // Pipe count/radius settings
  const geometryConfig = useMemo(() => {
    if (radiatorType === "tower") {
      return { count: 11, spacing: 0.38, radius: 0.045 };
    }
    if (radiatorType === "wave") {
      return { count: 8, spacing: 0.52, radius: 0.065 };
    }
    return { count: 8, spacing: 0.5, radius: 0.07 }; // classic
  }, [radiatorType]);

  const { count, spacing, radius } = geometryConfig;
  const width = (count - 1) * spacing;
  const headerRadius = radius * 1.45;

  // Metal outlines color configurations
  const outlineColor = useMemo(() => {
    if (radiatorSurface === "black") return new THREE.Color("#2E2E2E");
    if (radiatorSurface === "terracotta") return new THREE.Color("#D15F47");
    if (radiatorSurface === "copper") return new THREE.Color("#FF7A4D");
    return new THREE.Color("#FAF9F6"); // brass / default white
  }, [radiatorSurface]);

  // Stable uniforms reference container to comply with react-hooks/immutability lint rules
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uHeatRatio: { value: 0 },
    uColor: { value: new THREE.Color("#FF4500") }, // Electric Orange
    uBaseColor: { value: outlineColor },
  });

  // Keep uniforms value in sync with computed outlineColor changes
  uniformsRef.current.uBaseColor.value = outlineColor;

  // Shader material setup
  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: RadiatorWireframeShader.vertexShader,
      fragmentShader: RadiatorWireframeShader.fragmentShader,
      uniforms: uniformsRef.current,
      wireframe: true,
      transparent: true,
    });
    return mat;
  }, []);

  useFrame((state) => {
    uniformsRef.current.uTime.value = state.clock.getElapsedTime();
    uniformsRef.current.uHeatRatio.value = heatRatio;
  });

  return (
    <group ref={groupRef}>
      {/* Upper header tube */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, modelHeight / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.3, headerRadius]}
        material={shaderMaterial}
      />
      
      {/* End caps */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.15, modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
        material={shaderMaterial}
      />
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.15, modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
        material={shaderMaterial}
      />

      {/* Lower header tube */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, -modelHeight / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.3, headerRadius]}
        material={shaderMaterial}
      />
      
      {/* Lower caps */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.15, -modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
        material={shaderMaterial}
      />
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.15, -modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
        material={shaderMaterial}
      />

      {/* Columns */}
      {Array.from({ length: count }).map((_, i) => {
        const posX = -width / 2 + i * spacing;
        const waveZ = radiatorType === "wave" ? Math.sin(i * 1.3) * 0.12 : 0;

        return (
          <group key={i} position={[posX, 0, waveZ]}>
            <mesh
              geometry={geoms.cylinder}
              scale={[radius, modelHeight - 0.08, radius]}
              material={shaderMaterial}
            />

            {/* Top Collar */}
            <mesh
              geometry={geoms.torus}
              position={[0, modelHeight / 2 - 0.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[radius + 0.005, radius + 0.005, radius + 0.005]}
              material={shaderMaterial}
            />

            {/* Bottom Collar */}
            <mesh
              geometry={geoms.torus}
              position={[0, -modelHeight / 2 + 0.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[radius + 0.005, radius + 0.005, radius + 0.005]}
              material={shaderMaterial}
            />
          </group>
        );
      })}
    </group>
  );
}

export default function KilnCanvas() {
  const { heatLevel } = useHeatStore();
  const heatRatio = heatLevel / 100;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Shared geometry buffer to completely eliminate interaction stalls
  const sharedGeoms = useMemo(() => {
    const segments = isMobile ? 12 : 24;
    return {
      cylinder: new THREE.CylinderGeometry(1, 1, 1, segments),
      sphere: new THREE.SphereGeometry(1, 10, 10),
      torus: new THREE.TorusGeometry(1, 0.22, 6, 12),
    };
  }, [isMobile]);

  useEffect(() => {
    return () => {
      sharedGeoms.cylinder.dispose();
      sharedGeoms.sphere.dispose();
      sharedGeoms.torus.dispose();
    };
  }, [sharedGeoms]);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.1, 4.4], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.1} />

        {/* Dynamic lights */}
        <pointLight position={[0, 0, -1]} intensity={0.5 + heatRatio * 1.5} color="#FF4500" distance={6} />

        <Center>
          <RadiatorModel geoms={sharedGeoms} />
        </Center>

        {/* GPU Point Particles generating visual heat haze rising vertically */}
        <KilnParticles count={isMobile ? 30 : 80} />
      </Canvas>
    </div>
  );
}
