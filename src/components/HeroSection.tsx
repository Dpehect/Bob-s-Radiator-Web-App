"use client";

import { useEffect, useRef } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const RadiatorCanvas = dynamic(() => import("./RadiatorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-[#C45C26]/20 border-t-[#C45C26] animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  const isLoaded = useHeatStore((state) => state.isLoaded);
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);
  const updateGlobalHeat = useHeatStore((state) => state.updateGlobalHeat);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const clickCountRef = useRef(0);

  // Scroll-based heat accumulation
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Map scroll progress to heat — adds up to +30 as user scrolls
          const target = Math.round(self.progress * 30);
          const cur = useHeatStore.getState().heatLevel;
          if (target > cur) {
            updateGlobalHeat(Math.min(100, cur + 1));
          }
        },
      });
    });

    return () => ctx.revert();
  }, [isLoaded, updateGlobalHeat]);

  const heatRatio = heatLevel / 100;

  // Multi-layer click on the big 82° title
  const handleTitleClick = () => {
    increaseHeat(12);
    clickCountRef.current++;

    if (!titleRef.current) return;
    const tl = gsap.timeline();

    // Layer 1: Scale pulse
    tl.to(titleRef.current, {
      scale: 0.94,
      duration: 0.08,
      ease: "power3.in",
    })
      // Layer 2: Elastic bounce back
      .to(titleRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1.1, 0.35)",
      })
      // Layer 3: subtle x-shake at peak
      .to(
        titleRef.current,
        {
          x: 6,
          duration: 0.04,
          ease: "none",
          yoyo: true,
          repeat: 5,
        },
        "<0.02"
      )
      .to(titleRef.current, { x: 0, duration: 0.15 });
  };

  // Multi-layer hover on the canvas box
  const handleCanvasClick = () => {
    increaseHeat(8);
    if (!canvasBoxRef.current) return;
    gsap.fromTo(
      canvasBoxRef.current,
      { boxShadow: "0 0 0px rgba(196,92,38,0)" },
      {
        boxShadow: `0 0 ${30 + heatLevel * 0.4}px rgba(196,92,38,${0.15 + heatRatio * 0.25})`,
        duration: 0.4,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        repeatDelay: 0.1,
      }
    );
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 md:px-12 pt-28 pb-10 overflow-hidden">
      {/* Dynamic radial glow behind everything — grows with heat */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 70% 50%, rgba(196, 92, 38, ${0.025 + heatRatio * 0.055}) 0%, transparent 65%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10 w-full">

        {/* Left column */}
        <div className="lg:col-span-5 flex flex-col items-start text-left select-none pr-0 lg:pr-8">

          {/* 82° Title - GSAP multi-layer click */}
          <div className="relative overflow-visible">
            <motion.h1
              ref={titleRef}
              initial={{ y: 80, opacity: 0 }}
              animate={isLoaded ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
              onClick={handleTitleClick}
              className="heading-dynamic text-[10rem] sm:text-[13rem] md:text-[15rem] lg:text-[16rem] font-bold tracking-tighter leading-[0.8] cursor-pointer"
              style={{ willChange: "transform" }}
            >
              82
              <span
                className="relative inline-block"
                style={{
                  color: `hsl(${20 + heatRatio * 10}deg, ${65 + heatRatio * 20}%, ${45 + heatRatio * 10}%)`,
                  textShadow: heatLevel > 20
                    ? `0 0 ${20 + heatLevel}px rgba(196,92,38,${0.1 + heatRatio * 0.4})`
                    : "none",
                  transition: "color 0.6s ease, text-shadow 0.6s ease",
                }}
              >
                °
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
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

          {/* Turkish description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 1.0 }}
            className="font-serif text-xl sm:text-2xl italic leading-relaxed text-inherit/80 max-w-md font-light"
          >
            Carrying the same fire since 1952. Come, touch it.
          </motion.p>

          {/* Heat level indicator strip */}
          {heatLevel > 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-3"
            >
              <div className="w-24 h-[1.5px] relative overflow-hidden bg-white/[0.06] rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "linear-gradient(to right, #3D2B1F, #C45C26)" }}
                  animate={{ width: `${heatLevel}%` }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                />
              </div>
              <span
                className="font-sans text-[9px] tracking-[0.2em] uppercase tabular-nums"
                style={{ color: `rgba(196, 92, 38, ${0.4 + heatRatio * 0.6})` }}
              >
                {heatLevel}° aktif
              </span>
            </motion.div>
          )}
        </div>

        {/* Right column — 3D canvas with multi-layer hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1], delay: 0.8 }}
          className="lg:col-span-7 flex justify-center items-center relative"
          onClick={handleCanvasClick}
        >
          <div
            ref={canvasBoxRef}
            className="w-full aspect-[4/3] max-w-[640px] border border-inherit/5 bg-black/10 relative group cursor-grab active:cursor-grabbing"
            data-cursor="3d"
            style={{
              filter: heatLevel > 15 ? "url(#heat-haze-filter)" : "none",
              transition: "box-shadow 0.5s ease, border-color 0.5s ease",
              borderColor: `rgba(196, 92, 38, ${0.04 + heatRatio * 0.2})`,
            }}
          >
            {/* Glow behind canvas */}
            <div
              className="absolute inset-0 bg-[#C45C26] blur-3xl rounded-full pointer-events-none"
              style={{ opacity: 0.02 + heatRatio * 0.1 }}
            />

            <RadiatorCanvas />

            {/* Corner styling */}
            <div
              className="absolute top-0 left-0 w-3 h-3 border-t border-l pointer-events-none transition-colors duration-500"
              style={{ borderColor: `rgba(196, 92, 38, ${0.2 + heatRatio * 0.5})` }}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 border-t border-r pointer-events-none transition-colors duration-500"
              style={{ borderColor: `rgba(196, 92, 38, ${0.2 + heatRatio * 0.5})` }}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 border-b border-l pointer-events-none transition-colors duration-500"
              style={{ borderColor: `rgba(196, 92, 38, ${0.2 + heatRatio * 0.5})` }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 border-b border-r pointer-events-none transition-colors duration-500"
              style={{ borderColor: `rgba(196, 92, 38, ${0.2 + heatRatio * 0.5})` }}
            />

            {/* Hint */}
            <div className="absolute bottom-4 right-4 text-[9px] font-sans tracking-[0.2em] uppercase text-inherit/30 pointer-events-none group-hover:text-inherit/55 transition-colors duration-300">
              Touch to Feed (+8°)
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={isLoaded ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 1.2 }}
        className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-inherit/5 z-10"
      >
        {/* Heat Wave SVG */}
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

        {/* Scroll down */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="group flex flex-col items-center gap-2 text-inherit/50 hover:text-inherit transition-colors duration-300 font-sans text-[10px] tracking-[0.25em] uppercase bg-transparent border-none cursor-pointer"
        >
          <span>Start feeding the fire</span>
          <ChevronDown
            size={14}
            className="animate-bounce text-[#C45C26] mt-1 group-hover:translate-y-1 transition-transform duration-300"
          />
        </button>
      </motion.div>
    </section>
  );
}
