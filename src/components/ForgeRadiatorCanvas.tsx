"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";
import BackdropShimmer from "./BackdropShimmer";

// Deterministic PRNG for purity
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

interface SharedGeometries {
  cylinder: THREE.CylinderGeometry;
  sphere: THREE.SphereGeometry;
  torus: THREE.TorusGeometry;
}

interface ForgeRadiatorModelProps {
  geoms: SharedGeometries;
}

function ForgeRadiatorModel({ geoms }: ForgeRadiatorModelProps) {
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
  const headerRadius = 0.15 - 0.06 * forgeProgress;   // 0.15 -> 0.09
  const columnRadius = 0.085 - 0.045 * forgeProgress; // 0.085 -> 0.04

  // 3. Material Properties: Matte copper-black (1952) -> Sleek brushed brass (2025)
  const color1952 = new THREE.Color("#2E1911"); // rough oxidized copper-iron
  const color2025 = new THREE.Color("#B3985C"); // warm satin brass gold
  const currentColor = color1952.clone().lerp(color2025, forgeProgress);

  const metalness = 0.45 + 0.4 * forgeProgress; // 0.45 -> 0.85
  const roughness = 0.85 - 0.5 * forgeProgress; // 0.85 -> 0.35

  // Emissive color matching active system warmth (#FF6B35 direction)
  const emissiveColor = new THREE.Color("#FF6B35");
  const emissiveIntensity = heatRatio * 0.9;

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
      {/* 1. Upper Horizontal Pipe */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, 1.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.4, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Capped upper end domes */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.2, 1.4, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.2, 1.4, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 2. Lower Horizontal Pipe */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, -1.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.4, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Capped lower end domes */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.2, -1.4, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.2, -1.4, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 3. Valve Detayı */}
      <mesh
        geometry={geoms.cylinder}
        position={[-width / 2 - 0.3, -1.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[columnRadius * 0.9, 0.18, columnRadius * 0.9]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.39, -1.4, 0]}
        scale={[columnRadius * 1.5, columnRadius * 1.5, columnRadius * 1.5]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh
        geometry={geoms.torus}
        position={[-width / 2 - 0.39, -1.28, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[columnRadius * 2.2, columnRadius * 2.2, columnRadius * 2.2]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 4. Vertical Columns with Connection Toruses */}
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
            {/* Vertical Column */}
            <mesh
              geometry={geoms.cylinder}
              scale={[columnRadius, 2.7, columnRadius]}
            >
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={roughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Torus Collar - Top Connection */}
            <mesh
              geometry={geoms.torus}
              position={[0, 1.3, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[columnRadius + 0.007, columnRadius + 0.007, columnRadius + 0.007]}
            >
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={roughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Torus Collar - Bottom Connection */}
            <mesh
              geometry={geoms.torus}
              position={[0, -1.3, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[columnRadius + 0.007, columnRadius + 0.007, columnRadius + 0.007]}
            >
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

export default function ForgeRadiatorCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sharedGeoms = useMemo(() => {
    const radialSegments = isMobile ? 12 : 24;
    return {
      cylinder: new THREE.CylinderGeometry(1, 1, 1, radialSegments),
      sphere: new THREE.SphereGeometry(1, 12, 12),
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

  const pointLightColor = useMemo(() => {
    const coolColor = new THREE.Color("#C45C26");
    const hotColor = new THREE.Color("#FF3B00");
    return coolColor.lerp(hotColor, heatRatio);
  }, [heatRatio]);

  return (
    <div className="w-full h-full min-h-[450px] lg:min-h-[550px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Lights - Dynamic Warmth */}
        <ambientLight intensity={0.25 + heatRatio * 0.15} />
        
        {/* Cool filling keylight */}
        <directionalLight position={[-5, 5, 2]} intensity={0.8} color="#9B8D82" />
        
        {/* Warm keylight */}
        <directionalLight position={[5, 3, 4]} intensity={1.5} color="#E8D9C8" />
        
        {/* Soft glowing pointlight behind */}
        <pointLight position={[0, 0, -2.5]} intensity={1.2 + heatRatio * 1.8} color={pointLightColor} distance={7} />

        {/* Shimmer background shader */}
        <BackdropShimmer />

        <Center>
          <ForgeRadiatorModel geoms={sharedGeoms} />
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
