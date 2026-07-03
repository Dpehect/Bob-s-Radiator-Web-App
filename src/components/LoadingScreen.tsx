"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Calibrating metallurgical furnace...",
  "Casting heavy horizontal headers...",
  "Configuring live telemetry modules...",
  "Aligning visual grid parameters...",
  "Memory components calibrated...",
];

/**
 * Editorial-themed loader overlay showing progress ticks and status tags.
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
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
          className="fixed inset-0 w-full h-screen bg-black-pure text-warm-white z-99999 flex flex-col justify-between p-12 select-none"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <span className="font-display text-2xl tracking-tighter font-black text-electric-orange">82°</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-editorial-gray/40 font-bold">
              Editorial Showcase 01
            </span>
          </div>

          {/* Progress values */}
          <div className="space-y-4 max-w-md">
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-electric-orange font-bold">
              {activeMessage}
            </h2>
            <div className="font-display text-[80px] md:text-[120px] font-black leading-none flex items-baseline tracking-tighter">
              <span>{Math.floor(progress)}</span>
              <span className="text-xl md:text-3xl text-electric-orange ml-2">%</span>
            </div>
          </div>

          {/* Progress bar ticks */}
          <div className="w-full space-y-4">
            <div className="w-full h-[1px] bg-warm-white/10 relative overflow-hidden">
              <motion.div
                className="h-full bg-electric-orange absolute top-0 left-0"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-[9px] tracking-widest text-editorial-gray/30 uppercase font-bold">
              <span>SYSTEM: 82°C INITIALIZED</span>
              <span>TELEMETRY READY</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
