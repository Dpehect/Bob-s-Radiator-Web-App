"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";

// Simple deterministic PRNG for React 19 render purity
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

// Custom Shader for rising heat particles
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
      
      // Calculate speed and drift based on heat ratio
      float speed = 0.4 + uHeatRatio * 0.8;
      float driftX = 0.15 + uHeatRatio * 0.35;
      float driftZ = 0.15 + uHeatRatio * 0.35;
      
      // Y movement cycles between -2.5 and 2.5
      float progress = mod(uTime * speed + aRandom.x * 20.0, 5.0);
      pos.y = -2.5 + progress;
      
      // Add subtle wavy side movements (sine drift)
      pos.x += sin(uTime * 1.5 + aRandom.y * 100.0) * driftX;
      pos.z += cos(uTime * 1.2 + aRandom.z * 100.0) * driftZ;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation based on distance and random factor
      gl_PointSize = (10.0 * aRandom.z) / -mvPosition.z;
      
      // Fade in near bottom, fade out near top
      float fadeIn = smoothstep(-2.5, -1.8, pos.y);
      float fadeOut = smoothstep(2.5, 1.0, pos.y);
      vAlpha = fadeIn * fadeOut * (0.15 + uHeatRatio * 0.85);
      
      vPosition = pos;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      // Circular soft particles
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float intensity = smoothstep(0.5, 0.15, dist);
      
      // Heat color palette: warm cream (#E8D9C8) to hot orange (#C45C26)
      vec3 coolColor = vec3(0.91, 0.85, 0.78); // #E8D9C8
      vec3 hotColor = vec3(0.77, 0.36, 0.15);  // #C45C26
      
      // Interpolate colors based on particle vertical position
      float colorMix = clamp((vPosition.y + 1.5) / 3.0, 0.0, 1.0);
      vec3 particleColor = mix(coolColor, hotColor, colorMix);
      
      gl_FragColor = vec4(particleColor, intensity * vAlpha * 0.75);
    }
  `,
};

function HeatParticles({ count = 35 }) {
  const meshRef = useRef<THREE.Points>(null);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Generate initial random values for particles
  const [positions, randoms] = useMemo(() => {
    const random = createPRNG(42);
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spawn particles inside a volume enclosing the radiator
      pos[i * 3] = (random() - 0.5) * 4.2;     // X spread
      pos[i * 3 + 1] = (random() - 0.5) * 5.0; // Y spread (will loop in vertex shader)
      pos[i * 3 + 2] = (random() - 0.5) * 0.8; // Z depth spread

      rand[i * 3] = random();     // speed offset
      rand[i * 3 + 1] = random(); // frequency offset
      rand[i * 3 + 2] = random(); // size multiplier
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 3]}
        />
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

function RadiatorModel({ isMobile = false }: { isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Track cursor to do parallax tilting
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Ambient self-rotation (slow and steady)
    groupRef.current.rotation.y += delta * 0.08;

    // Smooth cursor tracking parallax tilt
    const targetX = state.pointer.y * 0.22;  // tilt pitch
    const targetZ = -state.pointer.x * 0.22; // tilt roll

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetZ,
      0.04
    );
  });

  // Radiator dimensions & structure config
  const pipesCount = 8;
  const spacing = 0.55;
  const width = (pipesCount - 1) * spacing;

  // Generate slightly random offsets to make it look crafted, organic, and imperfect
  const pipeOffsets = useMemo(() => {
    const random = createPRNG(82);
    const offsets = [];
    for (let i = 0; i < pipesCount; i++) {
      offsets.push({
        x: (random() - 0.5) * 0.035, // slight horizontal placement offset
        z: (random() - 0.5) * 0.035, // depth offset
        rotZ: (random() - 0.5) * 0.02, // slight tilt angle around Z
        rotX: (random() - 0.5) * 0.02, // slight tilt angle around X
      });
    }
    return offsets;
  }, [pipesCount]);

  // Color interpolation based on heat level
  // Base cool metal is a dark, matte, crafted steel (#241F1B)
  // Heated metal is an active glowing warmth (#C45C26)
  const baseColor = new THREE.Color("#241F1B");
  const hotColor = new THREE.Color("#C45C26");
  const currentColor = baseColor.clone().lerp(hotColor, heatRatio);

  return (
    <group ref={groupRef}>
      {/* 1. Header Tube (Upper Horizontal Pipe) */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, width + 0.5, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          metalness={0.82}
          roughness={0.38}
          color={currentColor}
          emissive={hotColor}
          emissiveIntensity={heatRatio * 0.65}
        />
      </mesh>

      {/* 2. Footer Tube (Lower Horizontal Pipe) */}
      <mesh position={[0, -1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, width + 0.5, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          metalness={0.82}
          roughness={0.38}
          color={currentColor}
          emissive={hotColor}
          emissiveIntensity={heatRatio * 0.65}
        />
      </mesh>

      {/* 3. Vertical Radiator Columns */}
      {Array.from({ length: pipesCount }).map((_, index) => {
        const offset = pipeOffsets[index];
        const posX = -width / 2 + index * spacing + offset.x;
        const posZ = offset.z;

        return (
          <group
            key={index}
            position={[posX, 0, posZ]}
            rotation={[offset.rotX, 0, offset.rotZ]}
          >
            <mesh>
              <cylinderGeometry args={[0.075, 0.075, 2.8, isMobile ? 6 : 16]} />
              <meshStandardMaterial
                metalness={0.82}
                roughness={0.38}
                color={currentColor}
                emissive={hotColor}
                emissiveIntensity={heatRatio * 0.65}
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Rising Heat Particles enclosing the model */}
      <HeatParticles count={isMobile ? 15 : 40} />
    </group>
  );
}

export default function RadiatorCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[600px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        
        {/* Warm key light */}
        <directionalLight position={[5, 5, 4]} intensity={1.5} color="#E8D9C8" />
        
        {/* Glowing radiator red-hot backlight */}
        <pointLight position={[0, 0, -2]} intensity={2.0} color="#C45C26" distance={8} />

        <Center>
          <RadiatorModel isMobile={isMobile} />
        </Center>

        {/* Dynamic postprocessing glow - bypass on mobile for performance */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              height={300}
              intensity={1.2}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
