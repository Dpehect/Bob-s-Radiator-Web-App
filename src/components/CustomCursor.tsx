"use client";

import { useEffect, useState } from "react";
// motion allows us to create hardware-accelerated animations using Framer Motion
// useMotionValue stores coordinates, useSpring adds physical spring weight/damping
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor replaces the standard system cursor with a physical spring ring.
 * It lags slightly behind the mouse to feel organic and elastic, scaling up on hover.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates (stored as motion values, does not trigger re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Framer Motion Spring settings:
  // - stiffness: controls the speed of the snap (high values mean faster snap)
  // - damping: controls the "wobble" (low values wobble like jelly, high values stop instantly)
  // - mass: weight of the cursor
  const springConfig = { stiffness: 250, damping: 28, mass: 0.6 };
  
  // Create spring-interpolated coordinates
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Hide native cursor
    document.documentElement.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Listen to mouse hovers on clickable items to expand cursor ring
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]'
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    addHoverListeners();

    // Re-attach listeners when DOM changes dynamically
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible, mouseX, mouseY]);

  // Disable custom cursor on touchscreens (mobile/tablet) to prevent issues
  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* 
        The actual visual ring.
        We animate its scale and border/background smoothly using Framer Motion's springs.
      */}
      <motion.div
        animate={{
          width: isHovered ? 48 : 20,
          height: isHovered ? 48 : 20,
          borderColor: isHovered ? "#00f5ff" : "#ffffff", // Change from white to cyan on hover
          backgroundColor: isHovered ? "rgba(0, 245, 255, 0.1)" : "rgba(255, 255, 255, 0)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5,
        }}
        className="border-2 rounded-full flex items-center justify-center"
      >
        {/* Tiny center dot that appears on hover */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 bg-coralAccent rounded-full"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
