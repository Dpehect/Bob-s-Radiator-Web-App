"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Rekindling the Karaköy forge...",
  "Casting raw iron patterns...",
  "Warming up the brass sheets...",
  "Setting temperature parameters...",
  "Ready to shape memory...",
];

/**
 * Premium loading screen with numerical transition progress indicator.
 * Blocks viewport interactions until complete, then slides up elegantly.
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const duration = 1800; // 1.8 seconds loading
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next === 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShow(false);
            // Unlock scroll
            document.body.style.overflow = "";
          }, 400);
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  // Compute active message dynamically during render to avoid cascading state effects
  const segment = Math.floor((progress / 100) * MESSAGES.length);
  const index = Math.min(segment, MESSAGES.length - 1);
  const activeMessage = MESSAGES[index] || MESSAGES[0];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{
            y: "-100vh",
            transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 w-full h-screen bg-charcoal text-cream z-99999 flex flex-col justify-between p-12 select-none"
        >
          {/* Top tagline */}
          <div className="flex justify-between items-center w-full">
            <span className="font-display text-lg tracking-wider font-bold">82°</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-cream/35">
              Est. 1952 — Karaköy
            </span>
          </div>

          {/* Core progress center */}
          <div className="space-y-4 max-w-md">
            <h2 className="text-[11px] tracking-[0.25em] uppercase text-brass font-medium">
              {activeMessage}
            </h2>
            <div className="font-display text-[80px] md:text-[120px] font-black leading-none flex items-baseline">
              <span>{Math.floor(progress)}</span>
              <span className="text-xl md:text-3xl text-terracotta ml-2">%</span>
            </div>
          </div>

          {/* Bottom progress bar */}
          <div className="w-full space-y-4">
            <div className="w-full h-1 bg-cream/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-terracotta"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-[9px] tracking-widest text-cream/20 uppercase font-semibold">
              <span>Initializing Live feed</span>
              <span>Memory systems calibrated</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
