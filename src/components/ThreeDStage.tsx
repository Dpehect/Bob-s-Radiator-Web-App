"use client";

import React, { useRef, useState, useEffect } from "react";
// Canvas is our 3D portal, useFrame updates rendering on every screen frame
import { Canvas, useFrame } from "@react-three/fiber";
// MeshDistortMaterial allows vertex displacement, making meshes wiggle like jelly
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Interactive Jiggling Jelly Bubble Mesh
 */
function JellyBubbleShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // States to monitor pointer interactions
  const [isHovered, setIsHovered] = useState(false);

  // Animation values to interpolate (lerp) smoothly
  const stateRef = useRef({
    distort: 0.25,
    speed: 2.0,
    scale: 1.0,
    posX: 0,
    posY: 0,
  });

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    // 1. PLAYFUL JELLY PHYSICS (SQUISH & WOBBLE):
    // When pointer hovers, shape squishes rapidly. When idle, it floats gently.
    const targetDistort = isHovered ? 0.6 : 0.25;
    const targetSpeed = isHovered ? 4.5 : 2.0;
    const targetScale = isHovered ? 1.2 : 1.0;

    // Linear Interpolation (lerp) for smooth fluid motion transition
    stateRef.current.distort += (targetDistort - stateRef.current.distort) * 0.1;
    stateRef.current.speed += (targetSpeed - stateRef.current.speed) * 0.1;
    stateRef.current.scale += (targetScale - stateRef.current.scale) * 0.1;

    materialRef.current.distort = stateRef.current.distort;
    materialRef.current.speed = stateRef.current.speed;
    
    // Set scale directly on mesh
    meshRef.current.scale.setScalar(stateRef.current.scale);

    // 2. MOUSE TRACKING FLOAT:
    // Bubbles wobble and float towards cursor coordinates
    const targetX = state.pointer.x * 1.0;
    // Add a natural jiggling wave using Math.sin
    const bounceOffset = Math.sin(state.clock.getElapsedTime() * 1.8) * 0.12;
    const targetY = state.pointer.y * 1.0 + bounceOffset;

    stateRef.current.posX += (targetX - stateRef.current.posX) * 0.06;
    stateRef.current.posY += (targetY - stateRef.current.posY) * 0.06;

    meshRef.current.position.x = stateRef.current.posX;
    meshRef.current.position.y = stateRef.current.posY;

    // Wobbling rotation
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Faceted geometry that morphs smoothly into bubble shapes */}
      <icosahedronGeometry args={[1.5, 32]} />
      
      {/* 
        MeshDistortMaterial provides jelly physics.
        - color: Friendly Pink (#FF7DA0)
        - metalness: 0.1 (not metal, clay/jelly look)
        - roughness: 0.05 (high-gloss wet surface look)
      */}
      <MeshDistortMaterial
        ref={materialRef}
        color="#ff7da0"
        roughness={0.05}
        metalness={0.1}
        distort={0.25}
        speed={2.0}
        emissive="#551122"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

/**
 * ThreeDStage loads the WebGL canvas, lighting, and placement.
 * Sits fixed in background, colored lights provide yellow, pink, orange shifts.
 */
export default function ThreeDStage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-[#faf5ef]" />;
  }

  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#faf5ef] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Soft overall room light */}
        <ambientLight intensity={0.4} />
        
        {/* Bright white light from top-right for gloss reflection highlights */}
        <directionalLight position={[3, 5, 3]} intensity={2.0} color="#ffffff" />
        
        {/* Sunny Yellow light from bottom-left */}
        <directionalLight position={[-4, -3, 2]} intensity={1.5} color="#ffd13b" />
        
        {/* Jelly Peach Orange glow pointing from center back */}
        <pointLight position={[0, -2, -2]} intensity={2.5} color="#ff8052" />
        
        {/* Soft pink highlight point light */}
        <pointLight position={[2, 2, -1]} intensity={1.5} color="#ff7da0" />

        <JellyBubbleShape />
      </Canvas>
    </div>
  );
}
