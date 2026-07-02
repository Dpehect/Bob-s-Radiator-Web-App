"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { X, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ArchiveModalProps {
  card: {
    type: "kulyutan" | "fisilti" | "kalitim" | "kiziltoprak" | "sessizalev";
    title: string;
    story: string;
    spec: string;
    weight: string;
    bobsNote: string;
  };
  onClose: (localSliderValue: number) => void;
}

// Seeded PRNG
const createPRNG = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

// Shader for rising modal heat sparks
const ModalHeatParticlesShader = {
  uniforms: {
    uTime: { value: 0 },
    uActiveRatio: { value: 0.3 }, // sliderValue / 10
  },
  vertexShader: `
    uniform float uTime;
    uniform float uActiveRatio;
    attribute vec3 aRandom;
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      vec3 pos = position;
      
      // Determine if this particle is active based on the ratio
      float isParticleActive = step(aRandom.x, uActiveRatio);
      
      float speed = 0.4 + uActiveRatio * 0.9;
      float drift = 0.15 + uActiveRatio * 0.4;
      
      // Cycle Y position
      float progress = mod(uTime * speed + aRandom.y * 30.0, 5.0);
      pos.y = -2.3 + progress;
      
      pos.x += sin(uTime * 1.8 + aRandom.y * 120.0) * drift;
      pos.z += cos(uTime * 1.4 + aRandom.z * 120.0) * drift;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      gl_PointSize = (13.0 * aRandom.z) / -mvPosition.z;
      
      float fadeIn = smoothstep(-2.3, -1.5, pos.y);
      float fadeOut = smoothstep(2.3, 0.8, pos.y);
      vAlpha = fadeIn * fadeOut * isParticleActive * (0.2 + uActiveRatio * 0.8);
      
      vPosition = pos;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    varying vec3 vPosition;

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float intensity = smoothstep(0.5, 0.18, dist);
      
      vec3 coolColor = vec3(0.91, 0.85, 0.78); // #E8D9C8
      vec3 hotColor = vec3(0.85, 0.35, 0.12);  // #C45C26
      
      float colorMix = clamp((vPosition.y + 1.2) / 2.4, 0.0, 1.0);
      vec3 particleColor = mix(coolColor, hotColor, colorMix);
      
      gl_FragColor = vec4(particleColor, intensity * vAlpha * 0.85);
    }
  `,
};

function ModalParticles({ count = 80, activeRatio }: { count?: number; activeRatio: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count * 3);
    const random = createPRNG(777);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 4.2;
      pos[i * 3 + 1] = (random() - 0.5) * 4.6;
      pos[i * 3 + 2] = (random() - 0.5) * 1.0;

      rand[i * 3] = random();     // activation probability
      rand[i * 3 + 1] = random(); // speed offset
      rand[i * 3 + 2] = random(); // size multiplier
    }
    return [pos, rand];
  }, [count]);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uActiveRatio: { value: 0.3 },
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uActiveRatio.value = activeRatio;
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
        vertexShader={ModalHeatParticlesShader.vertexShader}
        fragmentShader={ModalHeatParticlesShader.fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}

function ModalRadiatorModel({ type, sliderValue }: { type: string; sliderValue: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const activeRatio = sliderValue / 10;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Ambient self-rotation
    groupRef.current.rotation.y += delta * 0.08;

    // Subtle pointer parallax tilt
    const targetX = state.pointer.y * 0.22;
    const targetZ = -state.pointer.x * 0.22;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.05);
  });

  const config = useMemo(() => {
    switch (type) {
      case "kulyutan":
        return {
          pipesCount: 6,
          spacing: 0.60,
          pipeRadius: 0.09,
          height: 2.0,
          color: "#2C2825",
          metalness: 0.65,
          roughness: 0.72,
          emissive: "#C45C26",
          emissiveIntensity: 0.06,
        };
      case "fisilti":
        return {
          pipesCount: 10,
          spacing: 0.36,
          pipeRadius: 0.04,
          height: 2.8,
          color: "#919396",
          metalness: 0.9,
          roughness: 0.2,
          emissive: "#E8D9C8",
          emissiveIntensity: 0.06,
        };
      case "kalitim":
        return {
          pipesCount: 8,
          spacing: 0.48,
          pipeRadius: 0.062,
          height: 2.3,
          color: "#A35C38",
          metalness: 0.8,
          roughness: 0.35,
          emissive: "#C45C26",
          emissiveIntensity: 0.12,
        };
      case "kiziltoprak":
        return {
          pipesCount: 7,
          spacing: 0.54,
          pipeRadius: 0.072,
          height: 2.1,
          color: "#913E30",
          metalness: 0.5,
          roughness: 0.8,
          emissive: "#A85E3B",
          emissiveIntensity: 0.1,
        };
      case "sessizalev":
        return {
          pipesCount: 9,
          spacing: 0.44,
          pipeRadius: 0.052,
          height: 2.4,
          color: "#1A1B1F",
          metalness: 0.95,
          roughness: 0.12,
          emissive: "#C45C26",
          emissiveIntensity: 0.6,
        };
      default:
        return {
          pipesCount: 8,
          spacing: 0.5,
          pipeRadius: 0.06,
          height: 2.2,
          color: "#3A302A",
          metalness: 0.8,
          roughness: 0.4,
          emissive: "#C45C26",
          emissiveIntensity: 0.1,
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

  const pipeOffsets = useMemo(() => {
    const random = createPRNG(type.charCodeAt(0) + 100);
    const offsets = [];
    for (let i = 0; i < pipesCount; i++) {
      offsets.push({
        x: (random() - 0.5) * 0.03,
        z: (random() - 0.5) * 0.03,
        rotZ: (random() - 0.5) * 0.015,
      });
    }
    return offsets;
  }, [pipesCount, type]);

  // Interpolate emissive glow dynamically based on modal local slider state
  // Glow increases exponentially with slider progress (activeRatio)
  const currentEmissiveIntensity = emissiveIntensity + Math.pow(activeRatio, 2) * 2.2;
  const currentColor = new THREE.Color(color).lerp(new THREE.Color("#C45C26"), activeRatio * 0.25);

  return (
    <group>
      <group ref={groupRef}>
        {/* Upper Pipe */}
        <mesh position={[0, height / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[pipeRadius * 1.6, pipeRadius * 1.6, width + 0.35, 32]} />
          <meshStandardMaterial
            color={currentColor}
            metalness={metalness}
            roughness={roughness}
            emissive={new THREE.Color(emissive)}
            emissiveIntensity={currentEmissiveIntensity}
          />
        </mesh>

        {/* Lower Pipe */}
        <mesh position={[0, -height / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[pipeRadius * 1.6, pipeRadius * 1.6, width + 0.35, 32]} />
          <meshStandardMaterial
            color={currentColor}
            metalness={metalness}
            roughness={roughness}
            emissive={new THREE.Color(emissive)}
            emissiveIntensity={currentEmissiveIntensity}
          />
        </mesh>

        {/* Columns */}
        {Array.from({ length: pipesCount }).map((_, index) => {
          const offset = pipeOffsets[index];
          const posX = -width / 2 + index * spacing + offset.x;
          const posZ = offset.z;

          return (
            <group key={index} position={[posX, 0, posZ]} rotation={[0, 0, offset.rotZ]}>
              <mesh>
                <cylinderGeometry args={[pipeRadius, pipeRadius, height - 0.1, 16]} />
                <meshStandardMaterial
                  color={currentColor}
                  metalness={metalness}
                  roughness={roughness}
                  emissive={new THREE.Color(emissive)}
                  emissiveIntensity={currentEmissiveIntensity}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* GPU Particles aligned with model */}
      <ModalParticles activeRatio={activeRatio} count={90} />
    </group>
  );
}

export default function ArchiveModal({ card, onClose }: ArchiveModalProps) {
  const [sliderValue, setSliderValue] = useState(3); // default 3/10 local heat index

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0807]/90 backdrop-blur-xl pointer-events-auto">
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-6xl h-[90vh] md:h-[80vh] bg-[#14110F] border border-white/5 grid grid-cols-1 md:grid-cols-12 overflow-hidden relative"
      >
        
        {/* Custom Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20" />

        {/* Close Button */}
        <button
          onClick={() => onClose(sliderValue)}
          className="absolute top-4 right-4 z-10 p-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-all rounded-none cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Left Side: Technical Info & Narrative (5 Columns) */}
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between h-full overflow-y-auto select-none border-r border-white/5">
          <div className="flex flex-col items-start">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C45C26] font-semibold mb-3">
              Arşiv Kod No. 0{card.type.charCodeAt(0) % 9}
            </span>
            <h3 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              {card.title}
            </h3>
            
            <p className="font-sans text-sm leading-relaxed text-white/70 mb-8 font-light">
              {card.story}
            </p>

            {/* Spec Table */}
            <div className="w-full border-t border-white/5 pt-6 flex flex-col gap-4">
              <div className="flex justify-between items-center py-1">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">Alaşım/Doku</span>
                <span className="font-serif text-sm font-medium text-white/90">{card.spec}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-white/5">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">Döküm Ağırlığı</span>
                <span className="font-serif text-sm font-medium text-white/90">{card.weight}</span>
              </div>
              <div className="flex flex-col gap-2 py-3 border-t border-white/5">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">Dökümhane Notu</span>
                <span className="font-sans text-xs italic text-[#E8D9C8]/80 leading-relaxed font-light">
                  &ldquo;{card.bobsNote}&rdquo;
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Heat Control */}
          <div className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 flex items-center gap-1.5">
                <Flame size={12} className="text-[#C45C26]" /> Isı Derecesi
              </span>
              <span className="font-serif text-xl font-bold text-[#C45C26]">{sliderValue} / 10</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C45C26] focus:outline-none"
              style={{
                backgroundImage: `linear-gradient(to right, #C45C26 0%, #C45C26 ${(sliderValue - 1) * 11.1}%, rgba(255,255,255,0.1) ${(sliderValue - 1) * 11.1}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />

            <button
              onClick={() => onClose(sliderValue)}
              className="w-full py-3 bg-[#C45C26] hover:bg-[#d56b33] active:scale-98 transition-all font-sans text-xs tracking-[0.2em] uppercase text-[#E8D9C8] font-semibold rounded-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={12} />
              Isıyı Sal ve Kapat (+{sliderValue * 2}°)
            </button>
          </div>
        </div>

        {/* Right Side: High-fidelity Canvas (7 Columns) */}
        <div className="md:col-span-7 h-[45vh] md:h-full relative bg-[#0C0A09]">
          <Canvas
            camera={{ position: [0, 0, 4.4], fov: 45 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 4, 3]} intensity={1.5} color="#E8D9C8" />
            <directionalLight position={[-4, -2, -2]} intensity={0.5} color="#9B8D82" />
            <pointLight position={[0, 0, -2]} intensity={2.0} color="#C45C26" distance={6} />

            <Center>
              <ModalRadiatorModel type={card.type} sliderValue={sliderValue} />
            </Center>

            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                height={300}
                intensity={1.1}
              />
            </EffectComposer>
          </Canvas>
          
          <div className="absolute bottom-4 left-4 text-[9px] font-sans tracking-[0.2em] uppercase text-white/30 pointer-events-none">
            Etkileşimli Model (İncele & Döndür)
          </div>
        </div>

      </motion.div>
    </div>
  );
}
