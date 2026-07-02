"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";
import BackdropShimmer from "./BackdropShimmer";

// Simple deterministic PRNG for React 19 render purity
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

// Shader for config particles
const ConfiguratorParticlesShader = {
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
      
      float speed = 0.35 + uHeatRatio * 0.75;
      float drift = 0.12 + uHeatRatio * 0.38;
      
      // Vertical looping movement
      float progress = mod(uTime * speed + aRandom.x * 15.0, 4.6);
      pos.y = -2.3 + progress;
      
      // Horizontal drift
      pos.x += sin(uTime * 1.4 + aRandom.y * 50.0) * drift;
      pos.z += cos(uTime * 1.1 + aRandom.z * 50.0) * drift;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      gl_PointSize = (12.0 * aRandom.z) / -mvPosition.z;
      
      float fadeIn = smoothstep(-2.3, -1.6, pos.y);
      float fadeOut = smoothstep(2.3, 0.8, pos.y);
      vAlpha = fadeIn * fadeOut * (0.12 + uHeatRatio * 0.88);
      
      vPosition = pos;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float intensity = smoothstep(0.5, 0.12, dist);
      
      vec3 coolColor = vec3(0.91, 0.85, 0.78); // #E8D9C8
      vec3 hotColor = vec3(1.0, 0.42, 0.21);   // #FF6B35 glowing embers
      
      float colorMix = clamp((vPosition.y + 1.2) / 2.4, 0.0, 1.0);
      vec3 particleColor = mix(coolColor, hotColor, colorMix);
      
      gl_FragColor = vec4(particleColor, intensity * vAlpha * 0.8);
    }
  `,
};

function ConfiguratorParticles({ count = 80 }) {
  const meshRef = useRef<THREE.Points>(null);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count * 3);
    const random = createPRNG(909);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 4.4;
      pos[i * 3 + 1] = (random() - 0.5) * 4.6;
      pos[i * 3 + 2] = (random() - 0.5) * 1.0;

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
        vertexShader={ConfiguratorParticlesShader.vertexShader}
        fragmentShader={ConfiguratorParticlesShader.fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}

interface ConfiguratorCanvasProps {
  type: "classic" | "wave" | "tower";
  surface: "brass" | "black" | "terracotta" | "copper";
  height: "low" | "mid" | "tall";
}

interface ConfiguratorRadiatorModelProps extends ConfiguratorCanvasProps {
  isMobile?: boolean;
}

function ConfiguratorRadiatorModel({ type, surface, height, isMobile = false }: ConfiguratorRadiatorModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Rotation & Parallax
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;

    const targetX = state.pointer.y * 0.22;
    const targetZ = -state.pointer.x * 0.22;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.05);
  });

  // Calculate geometry parameters based on height
  const heightMultiplier = useMemo(() => {
    switch (height) {
      case "low":
        return 0.65; // ~1.5m
      case "tall":
        return 1.45; // ~3.3m
      default:
        return 1.0;  // ~2.2m
    }
  }, [height]);

  const modelHeight = 2.4 * heightMultiplier;

  // Calculate configuration geometries based on type
  const geometryConfig = useMemo(() => {
    switch (type) {
      case "tower":
        return {
          pipesCount: 11,
          spacing: 0.38,
          pipeRadius: 0.045,
        };
      case "wave":
        return {
          pipesCount: 8,
          spacing: 0.52,
          pipeRadius: 0.065,
        };
      default: // classic
        return {
          pipesCount: 8,
          spacing: 0.5,
          pipeRadius: 0.07,
        };
    }
  }, [type]);

  const { pipesCount, spacing, pipeRadius } = geometryConfig;
  const width = (pipesCount - 1) * spacing;

  // Horizontal pipe radius
  const headerRadiusLeft = pipeRadius * 1.35;
  const headerRadiusRight = pipeRadius * 1.75;

  // Materials Config based on Surface Coat Selection
  const surfaceConfig = useMemo(() => {
    switch (surface) {
      case "black":
        return {
          color: "#1A1A1C", // Matte black iron
          metalness: 0.76,
          roughness: 0.65,
        };
      case "terracotta":
        return {
          color: "#8D3E31", // Clay brick red
          metalness: 0.15,
          roughness: 0.82,
        };
      case "copper":
        return {
          color: "#B2694E", // Aged copper sheen
          metalness: 0.88,
          roughness: 0.35,
        };
      default: // brass
        return {
          color: "#C3AC5B", // Brushed raw brass
          metalness: 0.9,
          roughness: 0.28,
        };
    }
  }, [surface]);

  const { color, metalness, roughness } = surfaceConfig;

  // Heat emissive glow (#FF6B35 direction)
  const emissiveColor = new THREE.Color("#FF6B35");
  const emissiveIntensity = heatRatio * 1.35; // glowing embers

  // Static imperfect offsets to maintain workshop sculpture aesthetics
  const pipeOffsets = useMemo(() => {
    const random = createPRNG(type.charCodeAt(0) + surface.charCodeAt(0) + height.charCodeAt(0));
    const offsets = [];
    for (let i = 0; i < pipesCount; i++) {
      offsets.push({
        x: (random() - 0.5) * 0.02,
        z: (random() - 0.5) * 0.02,
        rotZ: (random() - 0.5) * 0.012,
      });
    }
    return offsets;
  }, [pipesCount, type, surface, height]);

  // Color lerping with heat
  const currentColor = new THREE.Color(color).lerp(new THREE.Color("#C45C26"), heatRatio * 0.22);
  const currentRoughness = Math.max(0.15, roughness - heatRatio * 0.1);

  return (
    <group ref={groupRef}>
      {/* 1. Upper Horizontal Pipe */}
      <mesh position={[0, modelHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[headerRadiusLeft, headerRadiusRight, width + 0.35, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Capped upper end domes */}
      <mesh position={[-width / 2 - 0.18, modelHeight / 2, 0]}>
        <sphereGeometry args={[headerRadiusLeft, 12, 12]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[width / 2 + 0.18, modelHeight / 2, 0]}>
        <sphereGeometry args={[headerRadiusRight, 12, 12]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 2. Lower Horizontal Pipe */}
      <mesh position={[0, -modelHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[headerRadiusLeft, headerRadiusRight, width + 0.35, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Capped lower end domes */}
      <mesh position={[-width / 2 - 0.18, -modelHeight / 2, 0]}>
        <sphereGeometry args={[headerRadiusLeft, 12, 12]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[width / 2 + 0.18, -modelHeight / 2, 0]}>
        <sphereGeometry args={[headerRadiusRight, 12, 12]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 3. Valve Detayı (On left side of lower pipe) */}
      {/* Stem pipe */}
      <mesh position={[-width / 2 - 0.28, -modelHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[pipeRadius * 0.6, pipeRadius * 0.6, 0.16, 12]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Valve connector spherical joint */}
      <mesh position={[-width / 2 - 0.36, -modelHeight / 2, 0]}>
        <sphereGeometry args={[pipeRadius * 1.1, 12, 12]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Hand wheel handle dial */}
      <mesh position={[-width / 2 - 0.36, -modelHeight / 2 + 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[pipeRadius * 1.5, pipeRadius * 0.38, 8, 20]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 4. Columns with Connection Toruses */}
      {Array.from({ length: pipesCount }).map((_, index) => {
        const offset = pipeOffsets[index];
        const posX = -width / 2 + index * spacing + offset.x;

        // Wave depth offset
        const waveOffsetZ = type === "wave" ? Math.sin(index * 1.3) * 0.15 : 0;
        const posZ = offset.z + waveOffsetZ;

        return (
          <group key={index} position={[posX, 0, posZ]} rotation={[0, 0, offset.rotZ]}>
            {/* Column Tube */}
            <mesh>
              <cylinderGeometry args={[pipeRadius, pipeRadius, modelHeight - 0.1, isMobile ? 6 : 16]} />
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={currentRoughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Torus Collar - Top Connection */}
            <mesh position={[0, modelHeight / 2 - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[pipeRadius + 0.006, pipeRadius * 0.22, 8, 16]} />
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={currentRoughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Torus Collar - Bottom Connection */}
            <mesh position={[0, -modelHeight / 2 + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[pipeRadius + 0.006, pipeRadius * 0.22, 8, 16]} />
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={currentRoughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Corner plaster walls and wooden floor for configuration studio context
function RoomEnvironment() {
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Background room color turns warm and glowing under heavy heat
  const plasterColor = useMemo(() => {
    const coolPlaster = new THREE.Color("#131110");
    const hotPlaster = new THREE.Color("#411A12");
    return coolPlaster.lerp(hotPlaster, heatRatio * 0.38);
  }, [heatRatio]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. Backdrop Wall (Facing camera) */}
      <mesh position={[0, 0, -2.0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial
          color={plasterColor}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Side Wall (Angled on left side) */}
      <mesh position={[-4.5, 0, -0.5]} rotation={[0, Math.PI / 3, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color={plasterColor}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* 3. Dark Wooden Floor */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color="#1C1512"
          roughness={0.75}
          metalness={0.12}
        />
      </mesh>
    </group>
  );
}

export default function ConfiguratorCanvas({ type, surface, height }: ConfiguratorCanvasProps) {
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Scale bloom intensity with dynamic heat level
  const bloomIntensity = 0.6 + heatRatio * 1.5;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pointLightColor = useMemo(() => {
    const coolColor = new THREE.Color("#C45C26");
    const hotColor = new THREE.Color("#FF3B00");
    return coolColor.lerp(hotColor, heatRatio);
  }, [heatRatio]);

  return (
    <div className="w-full h-full min-h-[500px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Lights */}
        <ambientLight intensity={0.25 + heatRatio * 0.15} />
        
        {/* Cool filling keylight */}
        <directionalLight position={[-4, 4, 3]} intensity={0.6} color="#8D9B9A" />
        
        {/* Warm keylight */}
        <directionalLight position={[4, 5, 4]} intensity={1.6} color="#E8D9C8" />
        
        {/* Glowing radiator red-hot backlight */}
        <pointLight position={[0, 0, -1]} intensity={1.5 + heatRatio * 2.0} color={pointLightColor} distance={6} />

        <RoomEnvironment />

        {/* Shimmer background shader */}
        <BackdropShimmer />

        <Center>
          <ConfiguratorRadiatorModel type={type} surface={surface} height={height} isMobile={isMobile} />
        </Center>

        {/* Dynamic postprocessing glow */}
        <ConfiguratorParticles count={isMobile ? 25 : 70} />

        {/* Bypass bloom on mobile for performance */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.25}
              luminanceSmoothing={0.8}
              height={300}
              intensity={bloomIntensity}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
