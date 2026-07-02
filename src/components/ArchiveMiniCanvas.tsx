"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MiniRadiatorProps {
  type: "kulyutan" | "fisilti" | "kalitim" | "kiziltoprak" | "sessizalev";
  isHovered?: boolean;
}

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

interface MiniRadiatorModelProps extends MiniRadiatorProps {
  geoms: SharedGeometries;
}

function MiniRadiatorModel({ type, isHovered, geoms }: MiniRadiatorModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth hover tilt & self rotation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.12;

    const targetX = state.pointer.y * 0.25;
    const targetZ = -state.pointer.x * 0.25;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.08
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetZ,
      0.08
    );

    const targetScale = isHovered ? 1.08 : 1.0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08)
    );
  });

  const config = useMemo(() => {
    switch (type) {
      case "kulyutan":
        return {
          pipesCount: 5,
          spacing: 0.65,
          pipeRadius: 0.09,
          height: 1.8,
          color: "#2E2A27",
          metalness: 0.6,
          roughness: 0.75,
          emissive: "#C45C26",
          emissiveIntensity: 0.05,
        };
      case "fisilti":
        return {
          pipesCount: 9,
          spacing: 0.35,
          pipeRadius: 0.04,
          height: 2.6,
          color: "#8B8D8F",
          metalness: 0.88,
          roughness: 0.22,
          emissive: "#E8D9C8",
          emissiveIntensity: 0.05,
        };
      case "kalitim":
        return {
          pipesCount: 7,
          spacing: 0.48,
          pipeRadius: 0.065,
          height: 2.1,
          color: "#A85E3B",
          metalness: 0.78,
          roughness: 0.38,
          emissive: "#C45C26",
          emissiveIntensity: 0.1,
        };
      case "kiziltoprak":
        return {
          pipesCount: 6,
          spacing: 0.55,
          pipeRadius: 0.075,
          height: 1.9,
          color: "#8E3D2F",
          metalness: 0.45,
          roughness: 0.82,
          emissive: "#A85E3B",
          emissiveIntensity: 0.08,
        };
      case "sessizalev":
        return {
          pipesCount: 8,
          spacing: 0.42,
          pipeRadius: 0.05,
          height: 2.2,
          color: "#18191C",
          metalness: 0.95,
          roughness: 0.15,
          emissive: "#C45C26",
          emissiveIntensity: 0.55,
        };
    }
  }, [type]);

  const {
    pipesCount,
    spacing,
    pipeRadius,
    height,
    color,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
  } = config;

  const width = (pipesCount - 1) * spacing;
  const emissiveColor = new THREE.Color(emissive);
  const finalEmissive = isHovered ? emissiveIntensity * 2.0 : emissiveIntensity;

  const headerRadius = pipeRadius * 1.5;

  const pipeOffsets = useMemo(() => {
    const random = createPRNG(type.charCodeAt(0));
    const offsets = [];
    for (let i = 0; i < pipesCount; i++) {
      offsets.push({
        x: (random() - 0.5) * 0.025,
        z: (random() - 0.5) * 0.025,
        rotZ: (random() - 0.5) * 0.015,
      });
    }
    return offsets;
  }, [pipesCount, type]);

  const mat = { color, metalness, roughness, emissive: emissiveColor, emissiveIntensity: finalEmissive };

  return (
    <group ref={groupRef}>
      {/* 1. Upper Horizontal Pipe */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, height / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.3, headerRadius]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Capped upper end domes */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.15, height / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.15, height / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>

      {/* 2. Lower Horizontal Pipe */}
      <mesh
        geometry={geoms.cylinder}
        position={[0, -height / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[headerRadius, width + 0.3, headerRadius]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Capped lower end domes */}
      <mesh
        geometry={geoms.sphere}
        position={[-width / 2 - 0.15, -height / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh
        geometry={geoms.sphere}
        position={[width / 2 + 0.15, -height / 2, 0]}
        scale={[headerRadius, headerRadius, headerRadius]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>

      {/* 3. Valve detail */}
      <mesh
        geometry={geoms.torus}
        position={[-width / 2 - 0.24, -height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[pipeRadius * 1.4, pipeRadius * 1.4, pipeRadius * 1.4]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh
        geometry={geoms.cylinder}
        position={[-width / 2 - 0.24, -height / 2 + 0.1, 0]}
        scale={[pipeRadius * 0.4, 0.09, pipeRadius * 0.4]}
      >
        <meshStandardMaterial {...mat} />
      </mesh>

      {/* 4. Columns with connection collars */}
      {Array.from({ length: pipesCount }).map((_, index) => {
        const offset = pipeOffsets[index];
        const posX = -width / 2 + index * spacing + offset.x;
        const posZ = offset.z;

        return (
          <group key={index} position={[posX, 0, posZ]} rotation={[0, 0, offset.rotZ]}>
            {/* Column tube */}
            <mesh
              geometry={geoms.cylinder}
              scale={[pipeRadius, height - 0.1, pipeRadius]}
            >
              <meshStandardMaterial {...mat} />
            </mesh>

            {/* Torus collar - top */}
            <mesh
              geometry={geoms.torus}
              position={[0, height / 2 - 0.06, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[pipeRadius + 0.005, pipeRadius + 0.005, pipeRadius + 0.005]}
            >
              <meshStandardMaterial {...mat} />
            </mesh>

            {/* Torus collar - bottom */}
            <mesh
              geometry={geoms.torus}
              position={[0, -height / 2 + 0.06, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[pipeRadius + 0.005, pipeRadius + 0.005, pipeRadius + 0.005]}
            >
              <meshStandardMaterial {...mat} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function ArchiveMiniCanvas({ type, isHovered = false }: MiniRadiatorProps) {
  // Shared static geometries
  const sharedGeoms = useMemo(() => {
    return {
      cylinder: new THREE.CylinderGeometry(1, 1, 1, 12),
      sphere: new THREE.SphereGeometry(1, 10, 10),
      torus: new THREE.TorusGeometry(1, 0.22, 6, 12),
    };
  }, []);

  // Proper memory cleanup
  useEffect(() => {
    return () => {
      sharedGeoms.cylinder.dispose();
      sharedGeoms.sphere.dispose();
      sharedGeoms.torus.dispose();
    };
  }, [sharedGeoms]);

  return (
    <div className="w-full h-full min-h-[220px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.35} />
        
        <directionalLight position={[3, 3, 2]} intensity={1.2} color="#E8D9C8" />
        
        <directionalLight position={[-3, -1, -2]} intensity={0.6} color="#9B8D82" />
        
        <pointLight
          position={[0, 0, -1]}
          intensity={isHovered ? 1.6 : 0.8}
          color="#FF6B35"
          distance={4}
        />

        <MiniRadiatorModel type={type} isHovered={isHovered} geoms={sharedGeoms} />
      </Canvas>
    </div>
  );
}
