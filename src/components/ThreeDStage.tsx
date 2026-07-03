"use client";

import React, { useRef, useState, useEffect } from "react";
// Canvas provides the 3D space, and useFrame runs on every single browser animation frame
import { Canvas, useFrame } from "@react-three/fiber";
// MeshDistortMaterial is a pre-made shader material that distorts mesh vertices like liquid
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * 3D Shape Component rendering a liquid organic metal mesh
 */
function InteractiveDistortedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // States to control distortion properties
  const [isHovered, setIsHovered] = useState(false);

  // Keep track of target and current animation variables for smooth interpolation (lerping)
  const animRef = useRef({
    distort: 0.3,
    speed: 1.5,
    rotationX: 0,
    rotationY: 0,
    positionX: 0,
    positionY: 0,
  });

  // useFrame runs inside the React Three Fiber loop (roughly 60-120 times per second)
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    // 1. LIQUID WAVE EFFECT (SU DALGALANMASI):
    // If user hovers over the shape, speed up and intensify the waves. Otherwise, keep it gentle.
    const targetDistort = isHovered ? 0.75 : 0.35;
    const targetSpeed = isHovered ? 5.0 : 1.5;

    // Linear Interpolation (lerp) formula: current += (target - current) * factor
    // This removes the "snappy" feeling and creates a smooth fluid-like transition.
    animRef.current.distort += (targetDistort - animRef.current.distort) * 0.08;
    animRef.current.speed += (targetSpeed - animRef.current.speed) * 0.08;

    // Apply the lerped values to the material properties
    materialRef.current.distort = animRef.current.distort;
    materialRef.current.speed = animRef.current.speed;

    // 2. MOUSE ROTATION LERPING:
    // Move shape slightly based on where the cursor is on the screen (state.pointer ranges from -1 to 1)
    const targetRotX = -state.pointer.y * 0.5;
    const targetRotY = state.pointer.x * 0.5;

    animRef.current.rotationX += (targetRotX - animRef.current.rotationX) * 0.05;
    animRef.current.rotationY += (targetRotY - animRef.current.rotationY) * 0.05;

    // Add general slow spinning rotation so the shape is never static
    meshRef.current.rotation.x = animRef.current.rotationX + state.clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.y = animRef.current.rotationY + state.clock.getElapsedTime() * 0.1;

    // 3. FLOATING PHYSICAL EFFECT:
    // Make the shape drift and float gently like a bubble in water
    const floatOffset = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.15;
    const targetPosX = state.pointer.x * 0.8;
    const targetPosY = state.pointer.y * 0.8 + floatOffset;

    animRef.current.positionX += (targetPosX - animRef.current.positionX) * 0.05;
    animRef.current.positionY += (targetPosY - animRef.current.positionY) * 0.05;

    meshRef.current.position.x = animRef.current.positionX;
    meshRef.current.position.y = animRef.current.positionY;
  });

  return (
    <mesh
      ref={meshRef}
      // Trigger states on hover
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      scale={isHovered ? 1.25 : 1.1}
    >
      {/* IcosahedronGeometry builds a highly faceted sphere which distorts beautifully */}
      <icosahedronGeometry args={[1.5, 32]} />
      
      {/* 
        MeshDistortMaterial acts like liquid metal.
        - color: Cyan-turquoise (#00F5FF) base
        - roughness: 0.1 (extremely glossy and shiny like chrome)
        - metalness: 1.0 (pure metallic shine)
      */}
      <MeshDistortMaterial
        ref={materialRef}
        color="#00f5ff"
        roughness={0.08}
        metalness={1.0}
        distort={0.3} // Start distortion level
        speed={1.5}   // Start speed
        // Emissive light glow for extra nighttime vibe
        emissive="#005577"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/**
 * ThreeDStage wraps the 3D canvas and lights.
 * It sits in the background fixed behind the page content.
 */
export default function ThreeDStage() {
  const [mounted, setMounted] = useState(false);

  // Prevent server-side rendering errors by only running after hydration on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 w-full h-full bg-[#050510]" />;
  }

  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#050510] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Ambient light sets the overall dark environment light */}
        <ambientLight intensity={0.2} />
        
        {/* Main light from top right hitting the sphere with white specular light */}
        <directionalLight position={[4, 5, 4]} intensity={2.5} color="#ffffff" />
        
        {/* Coral side light to tint the shadows and create Awwwards-style color fusion */}
        <directionalLight position={[-4, -4, 2]} intensity={2.0} color="#ff6b6b" />
        
        {/* Glow point light directly behind the center of the mesh */}
        <pointLight position={[0, 0, -2]} intensity={1.5} color="#00f5ff" />

        <InteractiveDistortedShape />
      </Canvas>
    </div>
  );
}
