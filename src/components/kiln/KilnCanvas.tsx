"use client";

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

// Procedural noise bump texture generator for metal/clay surfaces
const createProceduralTexture = (surface: string) => {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 128, 128);

  const imgData = ctx.getImageData(0, 0, 128, 128);
  const data = imgData.data;

  if (surface === "brass") {
    // Brushed metal: vertical lines
    for (let x = 0; x < 128; x++) {
      const colNoise = Math.sin(x * 0.45) * 12 + (Math.random() - 0.5) * 35;
      for (let y = 0; y < 128; y++) {
        const val = Math.max(0, Math.min(255, 128 + colNoise + (Math.random() - 0.5) * 12));
        const idx = (y * 128 + x) * 4;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }
    }
  } else if (surface === "black") {
    // Coarse cast iron: hammered noise
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.max(0, Math.min(255, 128 + (Math.random() - 0.5) * 30));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imgData, 0, 0);
    // Draw cells
    for (let k = 0; k < 25; k++) {
      const rx = Math.random() * 128;
      const ry = Math.random() * 128;
      const rad = 4 + Math.random() * 8;
      const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
      grad.addColorStop(0, "rgba(80,80,80,0.2)");
      grad.addColorStop(0.5, "rgba(128,128,128,0.06)");
      grad.addColorStop(1, "rgba(128,128,128,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  } else if (surface === "terracotta") {
    // Sand grains: clay feel
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.max(0, Math.min(255, 128 + (Math.random() - 0.5) * 40));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  } else {
    // Aged copper: organic oxidation ripples
    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const val = Math.max(
          0,
          Math.min(
            255,
            128 +
              Math.sin(x * 0.05 + y * 0.04) * 12 +
              Math.cos(y * 0.04 - x * 0.04) * 12 +
              (Math.random() - 0.5) * 10
          )
        );
        const idx = (y * 128 + x) * 4;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }
    }
  }

  if (surface !== "black") {
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 4.0);
  return texture;
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
    groupRef.current.rotation.y += delta * 0.12;

    const targetX = state.pointer.y * 0.2;
    const targetZ = -state.pointer.x * 0.2;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.06);
  });

  // Height configurations
  const heightMultiplier = useMemo(() => {
    if (radiatorHeight === "low") return 0.65;
    if (radiatorHeight === "tall") return 1.4;
    return 1.0; // mid
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

  // Surface config details
  const surfaceConfig = useMemo(() => {
    if (radiatorSurface === "black") {
      return { color: "#1E1C1A", metalness: 0.75, roughness: 0.65 };
    }
    if (radiatorSurface === "terracotta") {
      return { color: "#8D3E31", metalness: 0.1, roughness: 0.85 };
    }
    if (radiatorSurface === "copper") {
      return { color: "#B2694E", metalness: 0.88, roughness: 0.38 };
    }
    return { color: "#C3AC5B", metalness: 0.9, roughness: 0.26 }; // brass
  }, [radiatorSurface]);

  const { color, metalness, roughness } = surfaceConfig;

  // Procedural texture memo + cleanup
  const bumpTexture = useMemo(() => {
    return createProceduralTexture(radiatorSurface);
  }, [radiatorSurface]);

  useEffect(() => {
    return () => {
      if (bumpTexture) bumpTexture.dispose();
    };
  }, [bumpTexture]);

  const bumpScale = useMemo(() => {
    if (radiatorSurface === "terracotta") return 0.015;
    if (radiatorSurface === "black") return 0.025;
    return 0.006;
  }, [radiatorSurface]);

  const emissiveColor = new THREE.Color("#FF5E1A");
  const emissiveIntensity = heatRatio * 1.5;

  // Random micro-variations for craft look
  const pipeOffsets = useMemo(() => {
    const random = createPRNG(radiatorType.charCodeAt(0) + radiatorSurface.charCodeAt(0));
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: (random() - 0.5) * 0.02,
        z: (random() - 0.5) * 0.02,
        rotZ: (random() - 0.5) * 0.012,
      });
    }
    return list;
  }, [count, radiatorType, radiatorSurface]);

  const currentColor = new THREE.Color(color).lerp(new THREE.Color("#D45C26"), heatRatio * 0.2);
  const currentRoughness = Math.max(0.12, roughness - heatRatio * 0.08);

  return (
    <group ref={groupRef}>
      {/* Upper header tube */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, modelHeight / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.3, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          bumpMap={bumpTexture || undefined}
          bumpScale={bumpScale}
        />
      </mesh>
      
      {/* End caps */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.15, modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.15, modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Lower header tube */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, -modelHeight / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.3, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          bumpMap={bumpTexture || undefined}
          bumpScale={bumpScale}
        />
      </mesh>
      
      {/* Lower caps */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.15, -modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.15, -modelHeight / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={metalness}
          roughness={currentRoughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Columns */}
      {Array.from({ length: count }).map((_, i) => {
        const offset = pipeOffsets[i] || { x: 0, z: 0, rotZ: 0 };
        const posX = -width / 2 + i * spacing + offset.x;
        const waveZ = radiatorType === "wave" ? Math.sin(i * 1.3) * 0.12 : 0;
        const posZ = offset.z + waveZ;

        return (
          <group key={i} position={[posX, 0, posZ]} rotation={[0, 0, offset.rotZ]}>
            <mesh
              geometry={geoms.cylinder}
              scale={[radius, modelHeight - 0.08, radius]}
            >
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={currentRoughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                bumpMap={bumpTexture || undefined}
                bumpScale={bumpScale}
              />
            </mesh>

            {/* Top Collar */}
            <mesh
              geometry={geoms.torus}
              position={[0, modelHeight / 2 - 0.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[radius + 0.005, radius + 0.005, radius + 0.005]}
            >
              <meshStandardMaterial
                color={currentColor}
                metalness={metalness}
                roughness={currentRoughness}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Bottom Collar */}
            <mesh
              geometry={geoms.torus}
              position={[0, -modelHeight / 2 + 0.04, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[radius + 0.005, radius + 0.005, radius + 0.005]}
            >
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

// Background environment with soft lights
function KilnEnvironment() {
  const { heatLevel } = useHeatStore();
  const heatRatio = heatLevel / 100;

  const wallColor = useMemo(() => {
    return new THREE.Color("#141210").lerp(new THREE.Color("#361E14"), heatRatio * 0.3);
  }, [heatRatio]);

  return (
    <group position={[0, 0, -2.5]}>
      {/* Wall backdrop */}
      <mesh>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.05} />
      </mesh>
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

  const lightColor = useMemo(() => {
    return new THREE.Color("#E8D3B8").lerp(new THREE.Color("#FF5E1A"), heatRatio * 0.5);
  }, [heatRatio]);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.1, 4.4], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.2 + heatRatio * 0.2} />
        
        {/* Fill keys */}
        <directionalLight position={[-4, 4, 3]} intensity={0.5} color="#8A9998" />
        <directionalLight position={[4, 5, 4]} intensity={1.4} color={lightColor} />

        {/* Backdrop light */}
        <pointLight position={[0, 0, -1]} intensity={1.0 + heatRatio * 1.5} color="#FF6B35" distance={6} />

        <KilnEnvironment />

        <Center>
          <RadiatorModel geoms={sharedGeoms} />
        </Center>
      </Canvas>
    </div>
  );
}
