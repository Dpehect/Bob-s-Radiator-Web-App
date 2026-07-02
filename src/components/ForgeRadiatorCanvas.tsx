"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";

// Deterministic PRNG for purity
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

function ForgeRadiatorModel({ isMobile = false }: { isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const forgeProgress = useHeatStore((state) => state.forgeProgress);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Parallax rotation tilt based on mouse position
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Ambient self-rotation
    groupRef.current.rotation.y += delta * 0.08;

    // Smooth tilt to follow cursor
    const targetX = state.pointer.y * 0.25;
    const targetZ = -state.pointer.x * 0.25;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetZ,
      0.05
    );
  });

  // Radiator properties dynamically morphing based on forgeProgress (0 = 1952, 1 = 2025)
  // 1. Spacing: Wider in 1952 (0.65) -> Tighter/Sleeker in 2025 (0.42)
  const spacing = 0.65 - 0.23 * forgeProgress;
  const pipesCount = 8;
  const width = (pipesCount - 1) * spacing;

  // 2. Tube thickness parameters
  const headerRadius = 0.15 - 0.06 * forgeProgress; // 0.15 -> 0.09
  const columnRadius = 0.085 - 0.045 * forgeProgress; // 0.085 -> 0.04

  // 3. Material Properties: Matte copper-black (1952) -> Sleek brushed brass (2025)
  const color1952 = new THREE.Color("#2E1911"); // rough oxidized copper-iron
  const color2025 = new THREE.Color("#B3985C"); // warm satin brass gold
  const currentColor = color1952.clone().lerp(color2025, forgeProgress);

  const metalness = 0.45 + 0.4 * forgeProgress; // 0.45 -> 0.85
  const roughness = 0.85 - 0.55 * forgeProgress; // 0.85 -> 0.30

  // Emissive color matching active system warmth
  const emissiveColor = new THREE.Color("#C45C26");
  const emissiveIntensity = heatRatio * 0.7;

  // Static imperfect offsets to maintain workshop sculpture aesthetics
  const pipeOffsets = useMemo(() => {
    const random = createPRNG(952);
    const offsets = [];
    for (let i = 0; i < pipesCount; i++) {
      offsets.push({
        x: (random() - 0.5) * 0.03,
        z: (random() - 0.5) * 0.03,
        rotZ: (random() - 0.5) * 0.015,
        rotX: (random() - 0.5) * 0.015,
      });
    }
    return offsets;
  }, [pipesCount]);

  return (
    <group ref={groupRef}>
      {/* Upper Horizontal Pipe */}
      <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[headerRadius, headerRadius, width + 0.4, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Lower Horizontal Pipe */}
      <mesh position={[0, -1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[headerRadius, headerRadius, width + 0.4, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Vertical Columns */}
      {Array.from({ length: pipesCount }).map((_, index) => {
        const offset = pipeOffsets[index];
        // Calculate X position using current interpolated spacing
        const posX = -width / 2 + index * spacing + offset.x;
        const posZ = offset.z;

        return (
          <group
            key={index}
            position={[posX, 0, posZ]}
            rotation={[offset.rotX, 0, offset.rotZ]}
          >
            <mesh>
              <cylinderGeometry args={[columnRadius, columnRadius, 2.7, isMobile ? 6 : 16]} />
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

import { useState, useEffect } from "react";

export default function ForgeRadiatorCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="w-full h-full min-h-[450px] lg:min-h-[550px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Lights */}
        <ambientLight intensity={0.35} />
        
        {/* Cool filling keylight */}
        <directionalLight position={[-5, 5, 2]} intensity={0.8} color="#9B8D82" />
        
        {/* Warm keylight */}
        <directionalLight position={[5, 3, 4]} intensity={1.5} color="#E8D9C8" />
        
        {/* Soft glowing pointlight behind */}
        <pointLight position={[0, 0, -2.5]} intensity={1.8} color="#C45C26" distance={7} />

        <Center>
          <ForgeRadiatorModel isMobile={isMobile} />
        </Center>

        {/* Dynamic Glow Bloom - bypass on mobile for performance */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.25}
              luminanceSmoothing={0.85}
              height={300}
              intensity={1.0}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
