"use client";

import { useHeatStore } from "@/store/useHeatStore";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Canvas component since Three.js relies on document/window API
const RadiatorCanvas = dynamic(() => import("./RadiatorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Subtle warm loading pulse */}
      <div className="w-12 h-12 rounded-full border border-[#C45C26]/20 border-t-[#C45C26] animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  const isLoaded = useHeatStore((state) => state.isLoaded);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);

  const handleScrollDown = () => {
    // Scroll down by 1 full screen height
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 md:px-12 pt-28 pb-10 overflow-hidden">
      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10 w-full">
        {/* Left column (45% on desktop) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left select-none pr-0 lg:pr-8">
          
          {/* Main Title - 82° */}
          <div className="relative overflow-visible">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={isLoaded ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
              onClick={() => increaseHeat(12)}
              className="heading-dynamic text-[10rem] sm:text-[13rem] md:text-[15rem] lg:text-[16rem] font-bold tracking-tighter leading-[0.8] cursor-pointer active:scale-95 transition-transform duration-300"
            >
              82
              <span className="text-[#C45C26] relative inline-block transition-transform duration-700 hover:rotate-12">
                °
              </span>
            </motion.h1>
          </div>

          {/* Subtitle - The Heat That Remembers */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.7 }}
            className="mt-6 md:mt-8"
          >
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.25em] font-sans font-semibold text-inherit/60">
              The Heat That Remembers
            </h2>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isLoaded ? { scaleX: 1, opacity: 0.15 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: 0.9 }}
            className="w-24 h-[1px] bg-current my-6 origin-left"
          />

          {/* Turkish Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 1.0 }}
            className="font-serif text-xl sm:text-2xl italic leading-relaxed text-inherit/80 max-w-md font-light"
          >
            1952’den beri aynı ateşi taşıyoruz. Sen de dokun.
          </motion.p>
        </div>

        {/* Right column (55% on desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1], delay: 0.8 }}
          className="lg:col-span-7 flex justify-center items-center relative"
          onClick={() => increaseHeat(8)}
        >
          {/* 3D Canvas Box wrapper */}
          <div className="w-full aspect-[4/3] max-w-[640px] border border-inherit/5 bg-black/10 relative group cursor-grab active:cursor-grabbing">
            
            {/* Subtle glow behind canvas */}
            <div
              className="absolute inset-0 bg-[#C45C26] opacity-[0.03] blur-3xl rounded-full transition-opacity duration-1000 pointer-events-none"
              style={{
                opacity: 0.02 + (heatLevel / 100) * 0.12,
              }}
            />

            <RadiatorCanvas />
            
            {/* Corner styling to emphasize craftsmanship */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-inherit/25" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-inherit/25" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-inherit/25" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-inherit/25" />

            {/* Click to add heat hint overlay */}
            <div className="absolute bottom-4 right-4 text-[9px] font-sans tracking-[0.2em] uppercase text-inherit/30 pointer-events-none group-hover:text-inherit/50 transition-colors duration-300">
              Dokunarak Besle (+{heatLevel}°)
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom control & elegant heat wave */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={isLoaded ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 1.2 }}
        className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-inherit/5 z-10"
      >
        {/* Heat Wave SVG Animation (thin, matte) */}
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-inherit/40">
            Aura
          </span>
          <div className="flex gap-1 items-center h-8">
            <svg
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              className="w-32 h-6 pointer-events-none overflow-visible"
            >
              {/* Wave 1 */}
              <path
                d="M0,10 Q25,2 50,10 T100,10"
                fill="none"
                stroke="var(--color-hot-orange)"
                strokeWidth="1"
                opacity="0.35"
              >
                <animate
                  attributeName="d"
                  dur="4s"
                  repeatCount="indefinite"
                  values="M0,10 Q25,2 50,10 T100,10;
                          M0,10 Q25,18 50,10 T100,10;
                          M0,10 Q25,2 50,10 T100,10"
                />
              </path>
              
              {/* Wave 2 */}
              <path
                d="M0,10 Q25,16 50,10 T100,10"
                fill="none"
                stroke="var(--color-warm-cream)"
                strokeWidth="0.8"
                opacity="0.2"
              >
                <animate
                  attributeName="d"
                  dur="5.5s"
                  repeatCount="indefinite"
                  values="M0,10 Q25,16 50,10 T100,10;
                          M0,10 Q25,4 50,10 T100,10;
                          M0,10 Q25,16 50,10 T100,10"
                />
              </path>
            </svg>
          </div>
        </div>

        {/* Scroll Trigger button */}
        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-2 text-inherit/50 hover:text-inherit transition-colors duration-300 font-sans text-[10px] tracking-[0.25em] uppercase bg-transparent border-none cursor-pointer"
        >
          <span>Ateşi beslemeye başla</span>
          <ChevronDown
            size={14}
            className="animate-bounce text-[#C45C26] mt-1 group-hover:translate-y-1 transition-transform duration-300"
          />
        </button>
      </motion.div>
    </section>
  );
}
