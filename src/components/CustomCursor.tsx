"use client";

import { useEffect, useRef, useState } from "react";
// motion helps us link spring variables to coordinates and transforms
// useMotionValue stores cursor positioning, useSpring computes smooth physics lag
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from "framer-motion";

/**
 * CustomCursor acts like a soft liquid droplet.
 * It stretches and deforms based on mouse velocity and snaps to buttons with spring.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse Coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-elasticity spring settings for lag (feels toy-like and organic)
  const springConfig = { stiffness: 350, damping: 25, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Calculate mouse speed (velocity) to deform bubble
  const xVelocity = useVelocity(mouseX);
  const yVelocity = useVelocity(mouseY);

  // Map velocity to scaling: moving fast stretches the bubble on X, squeezes on Y
  const scaleX = useTransform(xVelocity, [-2000, 0, 2000], [1.3, 1, 1.3]);
  const scaleY = useTransform(yVelocity, [-2000, 0, 2000], [0.7, 1, 0.7]);

  // Rotates bubble in the direction of motion
  const rotateAngle = useTransform(
    [xVelocity, yVelocity],
    ([latestX, latestY]: any[]) => {
      if (Math.abs(latestX) < 10 && Math.abs(latestY) < 10) return 0;
      return (Math.atan2(latestY, latestX) * 180) / Math.PI;
    }
  );

  useEffect(() => {
    // Disable native cursor
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

    // Expand cursor blob when hovering over clickable components
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

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible, mouseX, mouseY]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
        rotate: rotateAngle,
      }}
    >
      {/* 
        The dynamic liquid bubble cursor shape:
        - Animated width/height based on hover.
        - Deformed skew/scale calculated dynamically based on mouse velocity.
      */}
      <motion.div
        style={{
          scaleX: isHovered ? 1.0 : scaleX,
          scaleY: isHovered ? 1.0 : scaleY,
        }}
        animate={{
          width: isHovered ? 52 : 24,
          height: isHovered ? 52 : 24,
          backgroundColor: isHovered ? "rgba(255, 125, 160, 0.25)" : "#ff7da0",
          borderWidth: isHovered ? 2 : 0,
          borderColor: isHovered ? "#ff7da0" : "transparent",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 22,
        }}
        className="rounded-full flex items-center justify-center border-solid"
      >
        {/* Soft yellow core dot which scales up on click-interactive hover */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2.5 h-2.5 bg-yellowAccent rounded-full"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
