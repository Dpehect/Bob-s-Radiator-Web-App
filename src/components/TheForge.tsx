"use client";

import React, { useEffect, useRef } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ForgeRadiatorCanvas = dynamic(() => import("./ForgeRadiatorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border border-[#C45C26]/20 border-t-[#C45C26] animate-spin" />
    </div>
  ),
});

interface StoryPeriod {
  year: string;
  title: string;
  desc: string;
}

const STORY_DATA: StoryPeriod[] = [
  {
    year: "1952",
    title: "The First Fire",
    desc: "A cold winter day in Karaköy. Bob melted cast iron salvaged from an old factory gate. The thick-piped radiator that emerged was the first raw sculpture proving that metal could hold not just warmth — but stories.",
  },
  {
    year: "1968",
    title: "The Shipyard Draft",
    desc: "As Golden Horn winds battered the workshop, the casting moulds shifted. Bob blended sheet alloys to craft wider-bodied, kiln-fired copper-clad forms that could trap heat far longer than anything before.",
  },
  {
    year: "1987",
    title: "Wave Dynamics",
    desc: "Industrial minimalism swept the city. Bob recalculated the millimetric gaps between pipes. The first subtly rippled models — guiding heat waves along their curves — were born in this era.",
  },
  {
    year: "2004",
    title: "Thin Lines",
    desc: "Architecture thinned; time compressed. Heavy castings gave way to elegant vertical columns. Bob's workshop transformed the heating device into sculptural objects that completed the spirit of a space.",
  },
  {
    year: "2025",
    title: "82° — The Heat That Remembers",
    desc: "And today. 73 years of foundry knowledge met brushed-brass columns and smart heat directors. The warmth of the past flows into the future through the finest pipe structure ever forged in this workshop.",
  },
];

export default function TheForge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const timelineIndicatorRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setForgeProgress = useHeatStore((state) => state.setForgeProgress);
  const heatLevel = useHeatStore((state) => state.heatLevel);

  useEffect(() => {
    const container = containerRef.current;
    const scrollTrack = scrollTrackRef.current;
    if (!container || !scrollTrack) return;

    const mainCtx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          setForgeProgress(self.progress);
          const computedHeat = Math.min(100, Math.round(15 + self.progress * 40));
          useHeatStore.getState().updateGlobalHeat(computedHeat);
        },
      });

      gsap.to(timelineIndicatorRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=300%",
          scrub: 0.5,
        },
      });

      STORY_DATA.forEach((_, index) => {
        const yearEl = yearRefs.current[index];
        const textEl = textRefs.current[index];

        if (yearEl) {
          gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: () => `top+=${(index / STORY_DATA.length) * pinTrigger.end} top`,
              end: () => `top+=${((index + 1) / STORY_DATA.length) * pinTrigger.end} top`,
              scrub: 0.5,
            },
          })
            .to(yearEl, { color: "#C45C26", scale: 1.25, duration: 0.5 })
            .to(yearEl, { color: "rgba(232, 217, 200, 0.3)", scale: 1.0, duration: 0.5 }, "+=0.5");
        }

        if (textEl) {
          gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: () => `top+=${(index / STORY_DATA.length) * pinTrigger.end} top`,
              end: () => `top+=${((index + 0.85) / STORY_DATA.length) * pinTrigger.end} top`,
              scrub: 0.5,
            },
          })
            .fromTo(textEl, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 })
            .to(textEl, { opacity: 0, y: -50, duration: 0.5 }, "+=0.3");
        }
      });
    }, container);

    return () => mainCtx.revert();
  }, [setForgeProgress]);

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#14110F] relative flex flex-col justify-center overflow-hidden">

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[#C45C26]/[0.01] blur-3xl pointer-events-none" />

      {/* Main pinned contents */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full relative z-10">

        {/* Left Column: Vertical Timeline Track */}
        <div className="hidden lg:col-span-2 h-[60vh] flex items-center justify-start relative">
          <div className="absolute left-[36px] top-0 bottom-0 w-[1px] bg-white/10">
            <div
              ref={timelineIndicatorRef}
              className="absolute top-0 left-0 w-full bg-[#C45C26] shadow-[0_0_8px_rgba(196,92,38,0.8)]"
              style={{ height: "0%" }}
            />
          </div>

          <div className="flex flex-col justify-between h-full pl-0 relative z-10 w-full">
            {STORY_DATA.map((item, index) => (
              <div
                key={item.year}
                ref={(el) => { yearRefs.current[index] = el; }}
                className="flex items-center gap-6 font-sans text-xs tracking-[0.25em] font-semibold text-inherit/30 cursor-pointer select-none origin-left"
              >
                <div className="w-2.5 h-2.5 rounded-full border border-inherit/20 bg-[#14110F] flex items-center justify-center transition-all duration-300">
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <span>{item.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center-Left Column: Poetic Stories */}
        <div ref={scrollTrackRef} className="lg:col-span-5 h-[40vh] flex items-center justify-center relative">
          <div className="w-full h-full relative flex items-center">
            {STORY_DATA.map((item, index) => (
              <div
                key={item.year}
                ref={(el) => { textRefs.current[index] = el; }}
                className="absolute inset-0 flex flex-col items-start justify-center select-none opacity-0"
              >
                <span className="lg:hidden text-xs font-sans tracking-[0.3em] text-[#C45C26] font-semibold mb-2">
                  {item.year}
                </span>

                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-inherit/40 mb-3">
                  Workshop Memory
                </span>

                <h3 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-inherit">
                  {item.title}
                </h3>

                <p className="font-sans text-sm md:text-base leading-relaxed text-inherit/70 max-w-lg font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Radiator Scene */}
        <div className="lg:col-span-5 h-[50vh] lg:h-[65vh] flex justify-center items-center relative">
          <div
            className="w-full max-w-[480px] aspect-[4/3] border border-inherit/5 bg-black/10 relative rounded-none shadow-[inset_0_4px_30px_rgba(0,0,0,0.2)]"
            style={{ filter: heatLevel > 15 ? "url(#heat-haze-filter)" : "none" }}
          >
            <ForgeRadiatorCanvas />

            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-inherit/20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-inherit/20" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-inherit/20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-inherit/20" />

            <div className="absolute bottom-4 right-4 text-[9px] font-sans tracking-[0.25em] uppercase text-inherit/30">
              Form Evolution
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
