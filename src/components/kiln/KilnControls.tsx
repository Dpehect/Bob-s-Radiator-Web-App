"use client";

import React from "react";
import { motion } from "framer-motion";
import { useHeatStore } from "@/store/useHeatStore";
import { RADIATOR_TYPES, RADIATOR_SURFACES, RADIATOR_HEIGHTS } from "@/lib/constants";

/**
 * Tactical control panels for The Living Kiln configurator.
 * Designed with a premium, tactile workshop-like interface.
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
    <div className="space-y-10 w-full max-w-md font-sans">
      {/* ── 1. Form Selection ── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-bold">
            01 / Select Form
          </h4>
          <span className="text-[9px] text-terracotta uppercase font-mono tracking-wider font-semibold">
            Status: Configured
          </span>
        </div>

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
                  relative py-3.5 px-2 rounded-2xl text-[11px] font-bold uppercase tracking-wider 
                  transition-colors duration-300 border cursor-pointer select-none
                  ${
                    active
                      ? "bg-charcoal border-charcoal text-cream shadow-lg"
                      : "bg-transparent border-charcoal/10 text-charcoal hover:border-charcoal/30"
                  }
                `}
              >
                {/* Active Indicator dot */}
                {active && (
                  <motion.span
                    layoutId="formDot"
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-terracotta"
                  />
                )}
                {t.label}
              </motion.button>
            );
          })}
        </div>
        <p className="text-xs text-smoke/70 italic font-medium leading-relaxed">
          {RADIATOR_TYPES.find((t) => t.id === radiatorType)?.description}
        </p>
      </div>

      {/* ── 2. Surface Coat ── */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-bold">
          02 / Surface Coat
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
                  flex items-center gap-3.5 py-4 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider 
                  transition-colors duration-300 border text-left cursor-pointer select-none relative
                  ${
                    active
                      ? "bg-charcoal border-charcoal text-cream shadow-lg"
                      : "bg-transparent border-charcoal/10 text-charcoal hover:border-charcoal/30"
                  }
                `}
              >
                <span
                  className="w-4 h-4 rounded-full border border-cream/25 flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: s.hex }}
                />
                {s.label}

                {active && (
                  <motion.span
                    layoutId="surfaceDot"
                    className="absolute top-1/2 -translate-y-1/2 right-4 w-1.5 h-1.5 rounded-full bg-terracotta"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Dimensions ── */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-bold">
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
                  relative py-3.5 px-2 rounded-2xl text-[11px] font-bold uppercase tracking-wider 
                  transition-colors duration-300 border cursor-pointer select-none
                  ${
                    active
                      ? "bg-charcoal border-charcoal text-cream shadow-lg"
                      : "bg-transparent border-charcoal/10 text-charcoal hover:border-charcoal/30"
                  }
                `}
              >
                {h.label}
                <span className="block text-[9px] opacity-60 font-semibold mt-0.5 lowercase">
                  ({h.spec})
                </span>

                {active && (
                  <motion.span
                    layoutId="heightDot"
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-terracotta"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Heat Memory Range Slider ── */}
      <div className="space-y-4 pt-6 border-t border-charcoal/10">
        <div className="flex justify-between items-baseline">
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-bold">
            04 / Heat Memory
          </h4>
          <motion.span
            key={heatLevel}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-2xl font-black text-terracotta"
          >
            {heatLevel}°C
          </motion.span>
        </div>

        {/* Custom Range Track Container */}
        <div className="relative flex flex-col gap-2.5 py-2">
          {/* Temperature Tick Markers */}
          <div className="absolute -top-1 left-0 w-full flex justify-between px-1 pointer-events-none select-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1px] h-2 transition-colors duration-300 ${
                  heatLevel >= 20 + i * 10 ? "bg-terracotta" : "bg-charcoal/15"
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
            className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none bg-charcoal/10 accent-terracotta z-10"
            style={{
              background: `linear-gradient(to right, var(--color-terracotta) 0%, var(--color-terracotta) ${
                ((heatLevel - 20) / 80) * 100
              }%, rgba(28,24,20,0.1) ${((heatLevel - 20) / 80) * 100}%, rgba(28,24,20,0.1) 100%)`,
            }}
          />
        </div>
        
        <div className="flex justify-between text-[9px] text-smoke/50 uppercase tracking-widest font-bold">
          <span>Ambient (20°C)</span>
          <span>Furnace Limit (100°C)</span>
        </div>
      </div>
    </div>
  );
}
