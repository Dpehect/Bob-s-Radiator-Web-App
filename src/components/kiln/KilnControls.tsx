"use client";

import React from "react";
import { motion } from "framer-motion";
import { useHeatStore } from "@/store/useHeatStore";
import { RADIATOR_TYPES, RADIATOR_SURFACES, RADIATOR_HEIGHTS } from "@/lib/constants";

/**
 * Editorial-themed minimalist control panel for the Living Kiln configurator.
 */
export default function KilnControls() {
  const {
    radiatorType,
    radiatorSurface,
    radiatorHeight,
    heatLevel,
    setRadiatorType,
    setRadiatorSurface,
    setRadiatorHeight,
    setHeatLevel,
  } = useHeatStore();

  return (
    <div className="space-y-10 w-full max-w-md font-sans text-warm-white">
      {/* ── 1. Form Selector ── */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-editorial-gray/60 font-bold">
          01 / Radiator Geometry
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {RADIATOR_TYPES.map((t) => {
            const active = t.id === radiatorType;
            return (
              <motion.button
                key={t.id}
                onClick={() => setRadiatorType(t.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative py-3.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider 
                  transition-all duration-300 border cursor-pointer select-none
                  ${
                    active
                      ? "bg-electric-orange border-electric-orange text-black-pure shadow-lg shadow-electric-orange/10"
                      : "bg-transparent border-warm-white/10 text-editorial-gray hover:border-warm-white/30 hover:text-warm-white"
                  }
                `}
              >
                {t.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Surface Material ── */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-editorial-gray/60 font-bold">
          02 / Alloy Finish
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {RADIATOR_SURFACES.map((s) => {
            const active = s.id === radiatorSurface;
            return (
              <motion.button
                key={s.id}
                onClick={() => setRadiatorSurface(s.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  flex items-center gap-3.5 py-4 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider 
                  transition-all duration-300 border text-left cursor-pointer select-none relative
                  ${
                    active
                      ? "bg-electric-orange border-electric-orange text-black-pure shadow-lg shadow-electric-orange/10"
                      : "bg-transparent border-warm-white/10 text-editorial-gray hover:border-warm-white/30 hover:text-warm-white"
                  }
                `}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black-pure/10 flex-shrink-0"
                  style={{ backgroundColor: s.hex }}
                />
                {s.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Dimensions ── */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-editorial-gray/60 font-bold">
          03 / Dimensions
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {RADIATOR_HEIGHTS.map((h) => {
            const active = h.id === radiatorHeight;
            return (
              <motion.button
                key={h.id}
                onClick={() => setRadiatorHeight(h.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative py-3.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider 
                  transition-all duration-300 border cursor-pointer select-none
                  ${
                    active
                      ? "bg-electric-orange border-electric-orange text-black-pure shadow-lg shadow-electric-orange/10"
                      : "bg-transparent border-warm-white/10 text-editorial-gray hover:border-warm-white/30 hover:text-warm-white"
                  }
                `}
              >
                {h.label}
                <span className="block text-[8px] opacity-60 font-bold mt-0.5 lowercase">
                  ({h.spec})
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Heat Memory Slider ── */}
      <div className="space-y-4 pt-6 border-t border-warm-white/10">
        <div className="flex justify-between items-baseline">
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-editorial-gray/60 font-bold">
            04 / Heat memory limits
          </h4>
          <motion.span
            key={heatLevel}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-2xl font-black text-electric-orange"
          >
            {heatLevel}°C
          </motion.span>
        </div>

        <div className="relative flex flex-col gap-2.5 py-2">
          {/* Temperature Tick Marks */}
          <div className="absolute -top-1 left-0 w-full flex justify-between px-1 pointer-events-none select-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1.5px] h-2 transition-colors duration-300 ${
                  heatLevel >= 20 + i * 10 ? "bg-electric-orange" : "bg-warm-white/10"
                }`}
              />
            ))}
          </div>

          <input
            type="range"
            min="20"
            max="100"
            value={heatLevel}
            onChange={(e) => setHeatLevel(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none bg-warm-white/10 accent-electric-orange z-10"
            style={{
              background: `linear-gradient(to right, var(--color-electric-orange) 0%, var(--color-electric-orange) ${
                ((heatLevel - 20) / 80) * 100
              }%, rgba(250,249,246,0.1) ${((heatLevel - 20) / 80) * 100}%, rgba(250,249,246,0.1) 100%)`,
            }}
          />
        </div>
        
        <div className="flex justify-between text-[9px] text-editorial-gray/40 uppercase tracking-widest font-bold">
          <span>Ambient (20°C)</span>
          <span>Furnace Limit (100°C)</span>
        </div>
      </div>
    </div>
  );
}
