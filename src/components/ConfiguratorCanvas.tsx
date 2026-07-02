"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";

interface ConfiguratorCanvasProps {
  type: "classic" | "wave" | "tower";
  surface: "brass" | "black" | "terracotta" | "copper";
  height: "low" | "mid" | "tall";
}

// Seeded PRNG
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

// Particles shader reacting to global heatLevel
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
      
      // Speed scales up dynamically with heat
      float speed = 0.35 + uHeatRatio * 0.95;
      float drift = 0.12 + uHeatRatio * 0.45;
      
      // Cycle Y position
      float progress = mod(uTime * speed + aRandom.x * 25.0, 5.0);
      pos.y = -2.3 + progress;
      
      // Add complex sine wave drift for turbulence simulation
      pos.x += sin(uTime * 2.0 + aRandom.y * 100.0) * drift;
      pos.z += cos(uTime * 1.6 + aRandom.z * 100.0) * drift;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Particle scale based on depth and heat
      gl_PointSize = (11.0 * aRandom.z * (1.0 + uHeatRatio * 0.4)) / -mvPosition.z;
      
      float fadeIn = smoothstep(-2.3, -1.6, pos.y);
      float fadeOut = smoothstep(2.3, 0.8, pos.y);
      
      // Particle density/alpha grows with heat ratio
      float activeChance = step(aRandom.x, 0.15 + uHeatRatio * 0.85);
      vAlpha = fadeIn * fadeOut * activeChance * (0.1 + uHeatRatio * 0.9);
      
      vPosition = pos;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float intensity = smoothstep(0.5, 0.15, dist);
      
      // Hot orange sparks
      vec3 coreColor = vec3(0.95, 0.88, 0.82); // #F5EFEB
      vec3 glowColor = vec3(0.85, 0.38, 0.15); // #C45C26
      
      float colorMix = clamp((vPosition.y + 1.0) / 2.5, 0.0, 1.0);
      vec3 particleColor = mix(coreColor, glowColor, colorMix);
      
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

  // Surface Material Configuration
  const surfaceConfig = useMemo(() => {
    switch (surface) {
      case "brass":
        return {
          color: "#C3AC5B", // brass gold
          metalness: 0.88,
          roughness: 0.24,
        };
      case "black":
        return {
          color: "#202022", // matte black iron
          metalness: 0.4,
          roughness: 0.85,
        };
      case "terracotta":
        return {
          color: "#8D3E31", // red terracotta clay
          metalness: 0.15,
          roughness: 0.9,
        };
      case "copper":
        return {
          color: "#B2694E", // antique copper
          metalness: 0.8,
          roughness: 0.45,
        };
    }
  }, [surface]);

  const { color, metalness, roughness } = surfaceConfig;

  // Heat emissive glow
  const emissiveColor = new THREE.Color("#C45C26");
  const emissiveIntensity = heatRatio * 1.5; // glowing embers

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

  return (
    <group ref={groupRef}>
      {/* Upper Horizontal Pipe */}
      <mesh position={[0, modelHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[pipeRadius * 1.6, pipeRadius * 1.6, width + 0.35, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Lower Horizontal Pipe */}
      <mesh position={[0, -modelHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[pipeRadius * 1.6, pipeRadius * 1.6, width + 0.35, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Columns */}
      {Array.from({ length: pipesCount }).map((_, index) => {
        const offset = pipeOffsets[index];
        const posX = -width / 2 + index * spacing + offset.x;

        // Wave depth wave-offset
        const waveOffsetZ = type === "wave" ? Math.sin(index * 1.3) * 0.15 : 0;
        const posZ = offset.z + waveOffsetZ;

        return (
          <group key={index} position={[posX, 0, posZ]} rotation={[0, 0, offset.rotZ]}>
            <mesh>
              <cylinderGeometry args={[pipeRadius, pipeRadius, modelHeight - 0.1, isMobile ? 6 : 16]} />
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={roughness}
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

// Room Background environment
function RoomEnvironment() {
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Room back walls color slightly warming up with heatLevel
  const wallBaseColor = new THREE.Color("#131110");
  const wallHotColor = new THREE.Color("#2C1D18");
  const currentWallColor = wallBaseColor.clone().lerp(wallHotColor, heatRatio * 0.4);

  return (
    <group position={[0, -0.2, -1.0]}>
      {/* Floor plane (warm dark wood panel look) */}
      <mesh position={[0, -1.8, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial
          color="#221C18"
          roughness={0.72}
          metalness={0.1}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.2, -1.0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial
          color={currentWallColor}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Left Wall (slight corner) */}
      <mesh position={[-5.8, 1.2, 1.0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial
          color={currentWallColor}
          roughness={0.92}
          metalness={0.02}
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

  return (
    <div className="w-full h-full min-h-[500px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Lights */}
        <ambientLight intensity={0.3} />
        
        {/* Cool filling keylight */}
        <directionalLight position={[-4, 4, 3]} intensity={0.6} color="#8D9B9A" />
        
        {/* Warm keylight */}
        <directionalLight position={[4, 5, 4]} intensity={1.6} color="#E8D9C8" />
        
        {/* Glowing radiator red-hot backlight */}
        <pointLight position={[0, 0, -1]} intensity={2.0} color="#C45C26" distance={6} />

        <RoomEnvironment />

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
