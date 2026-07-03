"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom spring trailing pointer cursor matching the Editorial layout style.
 * Interactive click-growing scaling parameters are integrated.
 */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 280, damping: 28, mass: 0.4 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Simple client-side mount hook
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Listeners setup when mounted
  useEffect(() => {
    if (!mounted) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const addHoverListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, input[type="range"], [role="button"]'
      );
      targets.forEach((elem) => {
        elem.addEventListener("mouseenter", () => setHovered(true));
        elem.addEventListener("mouseleave", () => setHovered(false));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, [mounted, cursorX, cursorY]);

  if (!mounted || typeof window === "undefined") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 mix-blend-difference hidden md:block">
      {/* Outer Spring Ring */}
      <motion.div
        className="absolute w-8 h-8 rounded-full border border-warm-white"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: clicked ? 2.2 : hovered ? 1.6 : 1,
          backgroundColor: clicked 
            ? "rgba(255, 69, 0, 0.2)" 
            : hovered 
              ? "rgba(250, 249, 246, 0.15)" 
              : "rgba(0, 0, 0, 0)",
          borderColor: clicked || hovered 
            ? "var(--color-electric-orange)" 
            : "var(--color-warm-white)",
          opacity: hidden ? 0 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
      />

      {/* Inner Point Dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-electric-orange"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: clicked ? 0.4 : hovered ? 0.6 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
      />
    </div>
  );
}
