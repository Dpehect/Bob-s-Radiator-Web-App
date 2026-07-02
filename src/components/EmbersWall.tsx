"use client";

import React, { useState, useEffect } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { Flame, Calendar, User, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import ConfiguratorCanvas to preview selected design in 3D modal
const ConfiguratorCanvas = dynamic(() => import("./ConfiguratorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-black/10">
      <div className="w-6 h-6 rounded-full border border-[#C45C26]/20 border-t-[#C45C26] animate-spin" />
    </div>
  ),
});

interface SavedDesign {
  id: string;
  name: string;
  type: "classic" | "wave" | "tower";
  surface: "brass" | "black" | "terracotta" | "copper";
  height: "low" | "mid" | "tall";
  heatLevel: number;
  timestamp: string;
}

// Fallback presets
const PRESET_DESIGNS: SavedDesign[] = [
  {
    id: "preset-1",
    name: "Bob (Founder)",
    type: "classic",
    surface: "black",
    height: "mid",
    heatLevel: 82,
    timestamp: "11/12/1952",
  },
  {
    id: "preset-2",
    name: "Architect Selim",
    type: "tower",
    surface: "brass",
    height: "tall",
    heatLevel: 65,
    timestamp: "04/14/2024",
  },
  {
    id: "preset-3",
    name: "Karaköy Restoration",
    type: "wave",
    surface: "copper",
    height: "low",
    heatLevel: 45,
    timestamp: "09/28/2025",
  },
];

export default function EmbersWall() {
  const globalHeatLevel = useHeatStore((state) => state.heatLevel);
  
  const [designs, setDesigns] = useState<SavedDesign[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bobs_embers");
      const savedList = stored ? JSON.parse(stored) : [];
      return [...savedList, ...PRESET_DESIGNS];
    }
    return PRESET_DESIGNS;
  });

  const [activePreview, setActivePreview] = useState<SavedDesign | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("bobs_embers");
      const savedList = stored ? JSON.parse(stored) : [];
      setDesigns([...savedList, ...PRESET_DESIGNS]);
    };

    // Listen to the custom update event
    window.addEventListener("embersUpdated", handleUpdate);
    return () => {
      window.removeEventListener("embersUpdated", handleUpdate);
    };
  }, []);

  const getSurfaceLabel = (s: string) => {
    switch (s) {
      case "brass": return "Raw Brass";
      case "black": return "Matte Cast Iron";
      case "terracotta": return "Red Earth";
      default: return "Aged Copper";
    }
  };

  const getTypeLabel = (t: string) => {
    switch (t) {
      case "wave": return "Wave Body";
      case "tower": return "Slim Vertical Column";
      default: return "Classic Workshop";
    }
  };

  return (
    <section
      id="embers"
      className="w-full min-h-screen bg-[#0C0A09] py-24 md:py-32 flex flex-col justify-center relative overflow-hidden select-none border-t border-white/5"
    >
      {/* Background glow syncing with global heat Level */}
      <div
        className="absolute inset-0 bg-[#C45C26] blur-[140px] pointer-events-none transition-all duration-1000"
        style={{
          opacity: 0.005 + (globalHeatLevel / 100) * 0.04,
        }}
      />

      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start mb-16 relative z-10">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C45C26] font-semibold mb-3">
          Heritage Gallery
        </span>
        <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Heats Left Behind
        </h2>
        <p className="font-sans text-sm md:text-base text-white/50 font-light leading-relaxed max-w-xl">
          Original configurations left at our foundry by visitors and craftsmen.
          Every card carries a fire once lit. Browse them and click to see the 3D detail.
        </p>
      </div>

      {/* Designs Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {designs.map((design, index) => {
          const heatRatio = design.heatLevel / 100;
          return (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              onClick={() => setActivePreview(design)}
              className="group border border-white/5 bg-[#14110F] p-6 relative cursor-pointer hover:border-[#C45C26]/30 transition-all duration-500 flex flex-col justify-between h-[230px] rounded-none overflow-hidden"
              style={{
                boxShadow: `0 8px 30px -15px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Dynamic warm glow background inside card */}
              <div
                className="absolute inset-0 bg-[#C45C26] opacity-0 group-hover:opacity-[0.02] blur-xl transition-all duration-700 pointer-events-none"
                style={{
                  opacity: heatRatio * 0.015,
                }}
              />

              {/* Top Info */}
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 flex items-center gap-1">
                    <User size={10} /> {design.name}
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 flex items-center gap-1">
                    <Calendar size={10} /> {design.timestamp}
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-white group-hover:text-[#C45C26] transition-colors duration-300">
                  {getTypeLabel(design.type)}
                </h4>
                
                <span className="font-sans text-xs text-white/50 mt-1.5 font-light">
                  {getSurfaceLabel(design.surface)} • {design.height === "low" ? "Low" : design.height === "tall" ? "Tall" : "Standard"}
                </span>
              </div>

              {/* Bottom stats with blueprint SVG sketch */}
              <div className="flex items-end justify-between w-full mt-4">
                
                {/* Visual SVG blueprint sketching the design */}
                <div className="w-16 h-12 relative opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <svg viewBox="0 0 80 50" className="w-full h-full stroke-current text-white fill-none">
                    {/* Header */}
                    <line x1="10" y1="5" x2="70" y2="5" strokeWidth="1.5" />
                    {/* Footer */}
                    <line x1="10" y1="45" x2="70" y2="45" strokeWidth="1.5" />
                    {/* Columns representation */}
                    <line x1="20" y1="5" x2="20" y2="45" strokeWidth="0.8" />
                    <line x1="30" y1="5" x2="30" y2="45" strokeWidth="0.8" />
                    <line x1="40" y1="5" x2="40" y2="45" strokeWidth="0.8" />
                    <line x1="50" y1="5" x2="50" y2="45" strokeWidth="0.8" />
                    <line x1="60" y1="5" x2="60" y2="45" strokeWidth="0.8" />
                  </svg>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#C45C26] font-serif text-base font-bold">
                    <Flame size={12} />
                    {design.heatLevel}°C
                  </div>
                  
                  <span className="p-1.5 border border-white/5 group-hover:border-[#C45C26]/20 text-white/30 group-hover:text-[#E8D9C8] transition-all bg-black/10">
                    <Eye size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ember Preview Modal */}
      <AnimatePresence>
        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto">
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-4xl bg-[#14110F] border border-white/10 grid grid-cols-1 md:grid-cols-2 overflow-hidden relative"
            >
              {/* Corner Trims */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20" />

              <button
                onClick={() => setActivePreview(null)}
                className="absolute top-4 right-4 z-10 p-2 border border-white/10 text-white/50 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Info Column */}
              <div className="p-8 md:p-10 flex flex-col justify-between border-r border-white/5 select-none">
                <div className="flex flex-col items-start w-full">
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#C45C26] font-semibold mb-3">
                    Heritage Design
                  </span>
                  
                  <h3 className="font-serif text-3xl font-bold text-white mb-2 leading-tight">
                    {getTypeLabel(activePreview.type)}
                  </h3>
                  
                  <p className="font-sans text-xs text-white/40 mb-6">
                    Ignited by {activePreview.name} on {activePreview.timestamp}.
                  </p>

                  <div className="w-full border-t border-white/5 pt-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">Designer</span>
                      <span className="font-serif text-sm font-medium text-white">{activePreview.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1 border-t border-white/5">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">Surface</span>
                      <span className="font-serif text-sm font-medium text-white">{getSurfaceLabel(activePreview.surface)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1 border-t border-white/5">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">Size</span>
                      <span className="font-serif text-sm font-medium text-white">
                        {activePreview.height === "low" ? "1.5 Metres (Low)" : activePreview.height === "tall" ? "3.3 Metres (Tall)" : "2.2 Metres (Standard)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 flex items-center gap-1">
                    <Flame size={12} className="text-[#C45C26]" /> Heat Energy
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#C45C26]">
                    {activePreview.heatLevel}°C
                  </span>
                </div>
              </div>

              {/* 3D Model Column */}
              <div className="h-[320px] md:h-auto bg-[#0C0A09] relative">
                <ConfiguratorCanvas
                  type={activePreview.type}
                  surface={activePreview.surface}
                  height={activePreview.height}
                />
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
