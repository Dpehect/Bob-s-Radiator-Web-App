"use client";

import React, { useEffect } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

export default function EasterEgg() {
  const logoClickCount = useHeatStore((state) => state.logoClickCount);
  const setLogoClickCount = useHeatStore((state) => state.setLogoClickCount);

  const isOpen = logoClickCount >= 7;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setLogoClickCount(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md select-none pointer-events-auto"
        >
          {/* Film Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none bg-repeat"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\"/%3E%3C/svg%3E')"
            }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all rounded-none cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Main frame */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-md w-full flex flex-col items-center text-center p-8 bg-[#14110F] border border-white/5 relative"
          >
            {/* Retro Corner trims */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20" />

            {/* Vintage Photograph Frame */}
            <div className="w-64 h-64 border border-white/10 bg-zinc-900 p-2 relative shadow-2xl mb-8 flex justify-center items-center">
              <div className="w-full h-full relative overflow-hidden grayscale contrast-[1.1] sepia-[0.15]">
                {/* Fallback box with text in case image fails */}
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white/20 text-[10px] uppercase tracking-widest p-4">
                  <span>Bob Atölyesinde</span>
                  <span className="mt-1">1952</span>
                </div>
                <Image
                  src="/bob_workshop.jpg"
                  alt="Bob in his workshop, 1952"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="256px"
                  priority
                  className="opacity-90"
                />
              </div>
            </div>

            {/* Poetic quote */}
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#C45C26] font-semibold mb-3">
              Mirasın Kurucusu
            </span>
            <p className="font-serif text-lg md:text-xl text-white/80 leading-relaxed italic mb-6 font-light">
              &ldquo;Demir soğuktur evlat, ama hafızası vardır. Ona verdiğin her derece ısıyı, o da sana bir hikâye olarak geri fısıldar.&rdquo;
            </p>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">
              — Bob, Karaköy 1952
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
