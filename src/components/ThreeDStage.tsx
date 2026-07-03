"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A component that renders the interactive mesh
function InteractiveShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // useFrame runs inside the R3F loop
  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow self-rotation
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.z += 0.001;

    // Mouse movement response (lerped)
    // state.pointer ranges from -1 to 1 representing mouse coordinates on screen
    targetRotation.current.x = -state.pointer.y * 0.4;
    targetRotation.current.y = state.pointer.x * 0.4;

    // Interpolate (lerp) mesh rotation to respond to mouse pointer
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05;
    
    // Slight floating position offset based on mouse
    const targetX = state.pointer.x * 0.6;
    const targetY = state.pointer.y * 0.6;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;

    // Add a gentle floating wave
    meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 1.5) * 0.002;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1.0}
    >
      {/* TorusKnotGeometry has a beautiful abstract brutalist structure */}
      <torusKnotGeometry args={[1.4, 0.45, 120, 16]} />
      {/* Highly metallic, glossy, hyper-realistic standard material */}
      <meshStandardMaterial
        color="#ffffff"
        metalness={1.0}
        roughness={0.12}
        envMapIntensity={1.0}
      />
    </mesh>
  );
}

export default function ThreeDStage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-black" />;
  }

  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-black pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 55 }}
        gl={{ antialias: true }}
      >
        {/* Lights for hyper-realistic metallic reflection */}
        <ambientLight intensity={0.15} />
        
        {/* Strong white light from top-right */}
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" />
        
        {/* Orange glow from bottom-left for intense accent coloring */}
        <directionalLight position={[-6, -6, -3]} intensity={1.5} color="#FF4500" />
        
        {/* Backlight for edge shine */}
        <pointLight position={[0, 0, -5]} intensity={1.0} color="#ffffff" />
        <pointLight position={[3, -3, 2]} intensity={0.8} color="#FF4500" />

        <InteractiveShape />
      </Canvas>
    </div>
  );
}
