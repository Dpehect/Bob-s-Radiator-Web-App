"use client";

import React, { useEffect, useRef } from "react";
import { Cpu, Wind, Thermometer, ShieldAlert } from "lucide-react";

export default function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = containerRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="the-bento"
      className="py-32 px-6 border-t-2 border-white bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title Block */}
        <div className="mb-20">
          <span className="text-xs tracking-[0.25em] font-sans font-extralight text-accent block mb-4">
            SYSTEM PARAMETERS
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-serif font-black leading-[0.9] text-white tracking-[-0.03em]">
            THE BENTO <br />
            ARCHITECTURE
          </h2>
        </div>

        {/* 12-Column Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: 8 Columns - Thermal Dynamics */}
          <div
            className="animate-on-scroll md:col-span-8 border-2 border-white p-8 md:p-12 flex flex-col justify-between hover:border-accent transition-colors duration-500 group relative bg-black"
            style={{ transitionDelay: "0.1s" }}
            data-cursor="snap"
          >
            <div>
              <div className="w-12 h-12 border border-white flex items-center justify-center text-white mb-8 group-hover:border-accent group-hover:text-accent transition-colors duration-300">
                <Thermometer size={20} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight mb-4">
                THERMAL RADIATION DYNAMICS
              </h3>
              <p className="text-sm font-sans font-extralight leading-relaxed text-white/70 max-w-xl">
                Operating at peak efficiency, our core radiation modules distribute heat evenly across 12 custom fins. This architecture eliminates heat soak and ensures thermodynamic stability under heavy loads.
              </p>
            </div>
            
            <div className="mt-12 flex items-center justify-between border-t border-white/20 pt-6">
              <span className="text-[10px] font-mono text-white/40 tracking-wider">MOD_ID // TH-X4</span>
              <span className="text-xs font-sans font-semibold text-accent tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Card 2: 4 Columns - Metric */}
          <div
            className="animate-on-scroll md:col-span-4 border-2 border-white p-8 flex flex-col justify-between hover:bg-white hover:text-black transition-all duration-500 group bg-black"
            style={{ transitionDelay: "0.2s" }}
            data-cursor="snap"
          >
            <div>
              <div className="w-12 h-12 border border-white group-hover:border-black flex items-center justify-center mb-8 transition-colors duration-300">
                <Wind size={20} />
              </div>
              <span className="text-[10px] font-mono text-white/50 group-hover:text-black/50 tracking-wider block mb-2">
                ROUGHNESS SPECIFICATION
              </span>
              <div className="text-6xl md:text-7xl font-serif font-black tracking-tighter mb-4">
                0.12
              </div>
            </div>
            <p className="text-xs font-sans font-extralight tracking-wider leading-relaxed text-white/70 group-hover:text-black/80">
              Low-roughness metallic parameters optimized for maximum photon reflection.
            </p>
          </div>

          {/* Card 3: 4 Columns - System Performance */}
          <div
            className="animate-on-scroll md:col-span-4 border-2 border-white p-8 flex flex-col justify-between hover:border-accent transition-colors duration-500 group bg-black"
            style={{ transitionDelay: "0.3s" }}
            data-cursor="snap"
          >
            <div>
              <div className="w-12 h-12 border border-white flex items-center justify-center text-white mb-8 group-hover:border-accent group-hover:text-accent transition-colors duration-300">
                <Cpu size={20} />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                FUSION LOGIC
              </h3>
              <p className="text-xs font-sans font-extralight text-white/70 leading-relaxed">
                Direct integration with hardware layer drivers for real-time monitoring and dynamic speed profiles.
              </p>
            </div>
            <div className="mt-8 border-t border-white/20 pt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40">SYS_TEMP</span>
              <span className="text-xs font-mono text-white group-hover:text-accent transition-colors duration-300">
                34.8°C
              </span>
            </div>
          </div>

          {/* Card 4: 8 Columns - Interactive Stage Guide */}
          <div
            className="animate-on-scroll md:col-span-8 border-2 border-white p-8 md:p-12 flex flex-col justify-between hover:border-accent transition-colors duration-500 group relative bg-black"
            style={{ transitionDelay: "0.4s" }}
            data-cursor="snap"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 border border-white flex items-center justify-center text-white mb-8 group-hover:border-accent group-hover:text-accent transition-colors duration-300">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="text-2xl font-serif text-white tracking-tight mb-4">
                  THE THREE-D BACKGROUND STAGE
                </h3>
                <p className="text-xs font-sans font-extralight leading-relaxed text-white/70">
                  Move your mouse across the browser window to see the metallic geometry warp, rotate, and interact with the custom viewport. Click and drag on empty spots of the viewport for perspective change.
                </p>
              </div>

              {/* Graphical Brutalist Box */}
              <div className="border-2 border-dashed border-white/30 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:border-accent/50 transition-colors duration-300">
                <div className="absolute top-0 left-0 border-r border-b border-white p-1 text-[8px] font-mono text-white/50">
                  REF_01
                </div>
                <div className="text-[10px] font-mono text-accent mb-2 tracking-widest animate-pulse">
                  [LOCKED ON MOUSE]
                </div>
                <div className="text-xs font-sans font-extralight text-white/40">
                  X: POINTER_COORD <br />
                  Y: POINTER_COORD
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40 tracking-wider">3D_STAGE // CONFIG_LOADED</span>
              <span className="text-xs font-sans text-white/80 group-hover:text-accent transition-colors duration-300">
                INTERACTIVE CANVAS ACTIVE
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
