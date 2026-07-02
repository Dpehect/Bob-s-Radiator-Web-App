"use client";

import React from "react";
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
      {/* 1. Form Selector */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-medium">
          01 / Select Form
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {RADIATOR_TYPES.map((t) => {
            const active = t.id === radiatorType;
            return (
              <button
                key={t.id}
                onClick={() => setRadiatorType(t.id)}
                className={`py-3 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  active
                    ? "bg-charcoal border-charcoal text-cream shadow-md scale-[1.02]"
                    : "bg-transparent border-charcoal/10 text-charcoal hover:border-charcoal/30"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-smoke/70 italic">
          {RADIATOR_TYPES.find((t) => t.id === radiatorType)?.description}
        </p>
      </div>

      {/* 2. Surface Selector */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-medium">
          02 / Surface Coat
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          {RADIATOR_SURFACES.map((s) => {
            const active = s.id === radiatorSurface;
            return (
              <button
                key={s.id}
                onClick={() => setRadiatorSurface(s.id)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border text-left cursor-pointer ${
                  active
                    ? "bg-charcoal border-charcoal text-cream shadow-md scale-[1.02]"
                    : "bg-transparent border-charcoal/10 text-charcoal hover:border-charcoal/30"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-cream/20 flex-shrink-0"
                  style={{ backgroundColor: s.hex }}
                />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Height Selector */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-medium">
          03 / Dimensions
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {RADIATOR_HEIGHTS.map((h) => {
            const active = h.id === radiatorHeight;
            return (
              <button
                key={h.id}
                onClick={() => setRadiatorHeight(h.id)}
                className={`py-3 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  active
                    ? "bg-charcoal border-charcoal text-cream shadow-md scale-[1.02]"
                    : "bg-transparent border-charcoal/10 text-charcoal hover:border-charcoal/30"
                }`}
              >
                {h.label}
                <span className="block text-[9px] opacity-60 font-medium mt-0.5 lowercase">
                  ({h.spec})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Heat Memory Slider */}
      <div className="space-y-4 pt-4 border-t border-charcoal/10">
        <div className="flex justify-between items-baseline">
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-smoke font-medium">
            04 / Heat Memory
          </h4>
          <span className="font-display text-lg font-bold text-terracotta">
            {heatLevel}°C
          </span>
        </div>

        <div className="relative flex items-center group py-2">
          <input
            type="range"
            min="20"
            max="100"
            value={heatLevel}
            onChange={(e) => setHeatLevel(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none bg-charcoal/10 accent-terracotta"
            style={{
              background: `linear-gradient(to right, var(--color-terracotta) 0%, var(--color-terracotta) ${
                ((heatLevel - 20) / 80) * 100
              }%, rgba(28,24,20,0.1) ${((heatLevel - 20) / 80) * 100}%, rgba(28,24,20,0.1) 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-smoke/50 uppercase tracking-widest font-semibold">
          <span>Ambient (20°C)</span>
          <span>Furnace Limit (100°C)</span>
        </div>
      </div>
    </div>
  );
}
