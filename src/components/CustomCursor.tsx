"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "hover-3d" | "hover-link">("default");
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for cursor coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for lag/trail effect
  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide standard cursor
    document.documentElement.style.cursor = "none";
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Global cursor hover delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest('[data-cursor="3d"]') || target.closest("canvas")) {
        setCursorType("hover-3d");
      } else if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        target.closest('input[type="range"]')
      ) {
        setCursorType("hover-link");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === "undefined" || !isVisible) return null;

  // Determine styling based on type
  const getCursorStyles = () => {
    switch (cursorType) {
      case "hover-3d":
        return {
          width: 48,
          height: 48,
          backgroundColor: "rgba(196, 92, 38, 0.05)",
          borderColor: "rgba(196, 92, 38, 0.8)",
          borderWidth: "1.5px",
        };
      case "hover-link":
        return {
          width: 32,
          height: 32,
          backgroundColor: "rgba(232, 217, 200, 0.08)",
          borderColor: "rgba(232, 217, 200, 0.4)",
          borderWidth: "1px",
        };
      default:
        return {
          width: 8,
          height: 8,
          backgroundColor: "rgba(232, 217, 200, 0.35)",
          borderColor: "rgba(232, 217, 200, 0.15)",
          borderWidth: "1px",
        };
    }
  };

  const styles = getCursorStyles();

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border border-solid overflow-visible"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        width: styles.width,
        height: styles.height,
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
        transition: "width 0.25s ease-out, height 0.25s ease-out, background-color 0.25s ease-out, border-color 0.25s ease-out",
      }}
    >
      {/* 3D Canvas Hover Heat Wave icon inside cursor */}
      {cursorType === "hover-3d" && (
        <svg
          viewBox="0 0 100 20"
          className="w-8 h-4 opacity-75 pointer-events-none overflow-visible"
        >
          <path
            d="M 10 10 Q 30 2 50 10 T 90 10"
            fill="none"
            stroke="#C45C26"
            strokeWidth="1.2"
          >
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="M 10 10 Q 30 2 50 10 T 90 10;
                      M 10 10 Q 30 18 50 10 T 90 10;
                      M 10 10 Q 30 2 50 10 T 90 10"
            />
          </path>
        </svg>
      )}
    </motion.div>
  );
}
