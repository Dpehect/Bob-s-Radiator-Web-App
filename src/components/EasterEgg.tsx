"use client";

import React, { useEffect, useRef } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

export default function EasterEgg() {
  const logoClickCount = useHeatStore((state) => state.logoClickCount);
  const setLogoClickCount = useHeatStore((state) => state.setLogoClickCount);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const isOpen = logoClickCount >= 7;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Cinematic entrance: card + photo staggered
      if (cardRef.current && photoRef.current) {
        const tl = gsap.timeline({ delay: 0.15 });

        tl.fromTo(
          cardRef.current,
          { y: 24, scale: 0.93, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: "expo.out" }
        )
          .fromTo(
            photoRef.current,
            { filter: "brightness(0) sepia(0)", scale: 1.04 },
            { filter: "brightness(1) sepia(0.15)", scale: 1, duration: 1.6, ease: "power2.out" },
            "<0.2"
          );
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 3D parallax tilt on mouse move
  useEffect(() => {
    if (!isOpen || !cardRef.current) return;
    const card = cardRef.current;
    let raf: number;

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        gsap.to(card, {
          rotateX: -dy * 4,
          rotateY: dx * 4,
          duration: 0.6,
          ease: "power2.out",
          transformPerspective: 800,
          transformOrigin: "center center",
        });
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    window.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
      gsap.set(card, { clearProps: "rotateX,rotateY,transformPerspective" });
    };
  }, [isOpen]);

  const handleClose = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 30,
        scale: 0.92,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setLogoClickCount(0),
      });
    } else {
      setLogoClickCount(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-6 bg-black/96 backdrop-blur-sm select-none"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Film grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.045] pointer-events-none bg-repeat"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
            }}
          />

          {/* Warm vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(196,92,38,0.04) 0%, transparent 70%)",
          }} />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2.5 border border-white/10 hover:border-white/30 text-white/35 hover:text-white transition-all cursor-pointer group"
          >
            <X size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Card */}
          <div
            ref={cardRef}
            className="max-w-[420px] w-full flex flex-col items-center text-center p-9 relative"
            style={{
              backgroundColor: "#13100E",
              boxShadow: "0 40px 120px rgba(0,0,0,0.85), inset 0 0 30px rgba(0,0,0,0.15)",
            }}
          >
            {/* Corner trims */}
            {[
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ].map((cls, i) => (
              <div key={i} className={`absolute w-3 h-3 border-white/20 ${cls}`} />
            ))}

            {/* Vintage Photo Frame */}
            <div className="w-56 h-56 border-2 border-white/[0.08] bg-zinc-950 p-2.5 relative shadow-2xl mb-8 flex justify-center items-center overflow-hidden">
              {/* Inner frame rule */}
              <div className="absolute inset-3 border border-white/[0.04] pointer-events-none z-10" />

              <div ref={photoRef} className="w-full h-full relative overflow-hidden">
                {/* Fallback placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center text-white/15 text-[10px] uppercase tracking-widest p-4 font-sans">
                  <span>Bob Atölyesinde</span>
                  <span className="mt-1.5">1952</span>
                </div>
                <Image
                  src="/bob_workshop.jpg"
                  alt="Bob atölyesinde çalışırken, 1952"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="224px"
                  priority
                  className="opacity-90 grayscale contrast-[1.08] sepia-[0.12]"
                />
              </div>

              {/* Photo aging vignette */}
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
              />
              {/* Dust scratches illusion */}
              <div className="absolute inset-0 opacity-20 pointer-events-none z-10"
                style={{
                  backgroundImage: "repeating-linear-gradient(92deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 4px)",
                }}
              />
            </div>

            {/* Content */}
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#C45C26] font-semibold mb-4"
            >
              The Founder
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              className="font-serif text-xl text-white/80 leading-relaxed italic mb-6 font-light"
            >
              &ldquo;Iron is cold, my son, but it remembers. Every degree of heat you give it,
              it whispers back to you as a story.&rdquo;
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/35">
                — Bob, Karaköy 1952
              </span>
              {/* Warm signature line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="w-12 h-[1px] bg-[#C45C26]/40 origin-left mt-1"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
