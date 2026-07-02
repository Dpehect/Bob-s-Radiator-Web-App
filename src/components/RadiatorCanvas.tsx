"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useHeatStore } from "@/store/useHeatStore";
import BackdropShimmer from "./BackdropShimmer";
import gsap from "gsap";

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
  const burstPointsRef = useRef<THREE.Points>(null);
  const burstParticlesRef = useRef<{ pos: THREE.Vector3; vel: THREE.Vector3; age: number; maxAge: number }[]>([]);
  
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);
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

    // Update burst particles
    const particles = burstParticlesRef.current;
    const pointsMesh = burstPointsRef.current;
    
    if (particles.length > 0) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += delta;
        if (p.age >= p.maxAge) {
          particles.splice(i, 1);
          continue;
        }
        p.pos.addScaledVector(p.vel, delta);
        p.vel.y -= 2.5 * delta; // gravity pull
        p.vel.multiplyScalar(0.95); // air drag
      }

      if (pointsMesh) {
        const geom = pointsMesh.geometry;
        const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        
        for (let i = 0; i < 200; i++) {
          if (i < particles.length) {
            const p = particles[i];
            arr[i * 3] = p.pos.x;
            arr[i * 3 + 1] = p.pos.y;
            arr[i * 3 + 2] = p.pos.z;
          } else {
            arr[i * 3] = 9999;
            arr[i * 3 + 1] = 9999;
            arr[i * 3 + 2] = 9999;
          }
        }
        posAttr.needsUpdate = true;
      }
    } else if (pointsMesh) {
      const geom = pointsMesh.geometry;
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      if (arr[0] !== 9999) {
        for (let i = 0; i < 200; i++) {
          arr[i * 3] = 9999;
          arr[i * 3 + 1] = 9999;
          arr[i * 3 + 2] = 9999;
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  // Short GSAP shaking timeline
  const triggerShake = () => {
    if (!groupRef.current) return;
    gsap.timeline()
      .to(groupRef.current.scale, {
        x: 1.05,
        y: 0.96,
        z: 1.05,
        duration: 0.08,
        ease: "power2.out"
      })
      .to(groupRef.current.rotation, {
        z: 0.03,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        ease: "none"
      })
      .to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.45,
        ease: "elastic.out(1.2, 0.4)"
      })
      .to(groupRef.current.rotation, {
        z: 0,
        duration: 0.35,
        ease: "elastic.out(1, 0.5)"
      }, "<");
  };

  const triggerBurst = (clickPoint?: THREE.Vector3) => {
    const origin = clickPoint || new THREE.Vector3(0, 0, 0);
    const particles = burstParticlesRef.current;
    
    // Add 25 new burst particles
    for (let i = 0; i < 25; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = 0.6 + Math.random() * 2.2;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.abs(Math.sin(phi) * Math.sin(theta)) * speed * 1.6 + 0.8, // push upwards
        Math.cos(phi) * speed
      );

      particles.push({
        pos: origin.clone(),
        vel: vel,
        age: 0,
        maxAge: 0.4 + Math.random() * 0.4,
      });
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    triggerShake();
    triggerBurst(e.point);
    increaseHeat(8);
  };

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
  const currentColor = baseColor.clone().lerp(hotColor, heatRatio * 0.55);

  // Dynamic metallic stats based on heat
  const metalness = 0.88;
  const roughness = 0.38 - heatRatio * 0.12;
  const emissiveColor = new THREE.Color("#FF6B35");
  const emissiveIntensity = heatRatio * 1.25;

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* 1. Conical Header Tube (Upper Horizontal Pipe) */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.14, width + 0.5, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          envMapIntensity={1.0}
        />
      </mesh>
      {/* Capped upper end domes */}
      <mesh position={[-width / 2 - 0.25, 1.45, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[width / 2 + 0.25, 1.45, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 2. Conical Footer Tube (Lower Horizontal Pipe) */}
      <mesh position={[0, -1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.14, width + 0.5, isMobile ? 12 : 32]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          envMapIntensity={1.0}
        />
      </mesh>
      {/* Capped lower end domes */}
      <mesh position={[-width / 2 - 0.25, -1.45, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[width / 2 + 0.25, -1.45, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 3. Valve Detayı (On left side of lower pipe) */}
      {/* Stem pipe */}
      <mesh position={[-width / 2 - 0.38, -1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.22, 12]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Valve connector spherical joint */}
      <mesh position={[-width / 2 - 0.49, -1.45, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Hand wheel handle dial */}
      <mesh position={[-width / 2 - 0.49, -1.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.022, 8, 20]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Valve inner pin */}
      <mesh position={[-width / 2 - 0.49, -1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
        <meshStandardMaterial
          metalness={metalness}
          roughness={roughness}
          color={currentColor}
        />
      </mesh>

      {/* 4. Vertical Radiator Columns with Connection Toruses */}
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
            <mesh>
              <cylinderGeometry args={[0.075, 0.075, 2.8, isMobile ? 6 : 16]} />
              <meshStandardMaterial
                metalness={metalness}
                roughness={roughness}
                color={currentColor}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                envMapIntensity={1.0}
              />
            </mesh>

            {/* Torus Collar - Top Connection */}
            <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.078, 0.016, 8, 16]} />
              <meshStandardMaterial
                metalness={metalness}
                roughness={roughness}
                color={currentColor}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>

            {/* Torus Collar - Bottom Connection */}
            <mesh position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.078, 0.016, 8, 16]} />
              <meshStandardMaterial
                metalness={metalness}
                roughness={roughness}
                color={currentColor}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
          </group>
        );
      })}

      {/* 5. Click Burst Particles Points Mesh */}
      <points ref={burstPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(200 * 3).fill(9999), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FF7034"
          size={isMobile ? 0.08 : 0.12}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 6. Rising Heat Particles enclosing the model */}
      <HeatParticles count={isMobile ? 15 : 40} />
    </group>
  );
}

export default function RadiatorCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

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
    <div className="w-full h-full min-h-[500px] md:min-h-[600px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Lights - Dynamic warmth based on global heat store */}
        <ambientLight intensity={0.3 + heatRatio * 0.2} />
        
        {/* Warm key light */}
        <directionalLight position={[5, 5, 4]} intensity={1.5} color="#E8D9C8" />
        
        {/* Glowing radiator red-hot backlight */}
        <pointLight position={[0, 0, -2]} intensity={1.5 + heatRatio * 2.0} color={pointLightColor} distance={8} />

        {/* Shimmer background shader */}
        <BackdropShimmer />

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
            <Vignette eskil={false} offset={0.15} darkness={1.1} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
