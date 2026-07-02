"use client";

import React, { useEffect, useState } from "react";
import { useHeatStore } from "@/store/useHeatStore";

export default function HeatHazeFilter() {
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const [waveTime, setWaveTime] = useState(0);

  useEffect(() => {
    // Only animate turbulence phase if heat is active
    if (heatLevel <= 15) return;

    let animFrame: number;
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTime) * 0.001; // in seconds
      lastTime = now;

      setWaveTime((prev) => (prev + delta * 0.8) % 100);
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [heatLevel]);

  // Scale map size proportionally with heatLevel
  const scale = (heatLevel / 100) * 8.0;

  // Modulate frequency slightly to create a shifting wave shimmer
  const freqX = 0.01 + Math.sin(waveTime * 0.8) * 0.0015;
  const freqY = 0.04 + Math.cos(waveTime * 1.2) * 0.005;

  return (
    <svg className="absolute w-0 h-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <defs>
        <filter id="heat-haze-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${freqX} ${freqY}`}
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
