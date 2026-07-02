"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHeatStore } from "@/store/useHeatStore";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "hover-3d" | "hover-link" | "hover-btn">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  const heatLevel = useHeatStore((state) => state.heatLevel);
  const heatRatio = heatLevel / 100;

  // Main trailing cursor coords
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // Outer ring has heavier spring (more lag = elegant trail)
  const ringConfig = { damping: 28, stiffness: 220, mass: 0.8 };
  const ringXSpring = useSpring(cursorX, ringConfig);
  const ringYSpring = useSpring(cursorY, ringConfig);

  // Dot follows instantly
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  useEffect(() => {
    document.documentElement.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      // Dot: direct position
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      // Ring: spring-lagged
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest('[data-cursor="3d"]') || target.closest("canvas")) {
        setCursorType("hover-3d");
      } else if (target.closest("button")) {
        setCursorType("hover-btn");
      } else if (
        target.closest("a") ||
        target.closest(".cursor-pointer") ||
        target.closest('input[type="range"]')
      ) {
        setCursorType("hover-link");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (typeof window === "undefined") return null;

  // Dynamic ring accent color: cool grey → warm orange as heat rises
  const ringOpacity = cursorType === "hover-3d" ? 0.9 : cursorType === "hover-btn" ? 0.7 : 0.45;
  const ringColorR = Math.round(140 + heatRatio * 96);  // 140 → 196 (grey → orange)
  const ringColorG = Math.round(110 - heatRatio * 50);  // 110 → 92
  const ringColorB = Math.round(100 - heatRatio * 62);  // 100 → 38
  const ringColor = `rgba(${ringColorR}, ${ringColorG}, ${ringColorB}, ${ringOpacity})`;

  // Ring sizing per state
  const ringSize = isPressed
    ? 20
    : cursorType === "hover-3d"
    ? 52 + heatRatio * 8
    : cursorType === "hover-btn"
    ? 38
    : cursorType === "hover-link"
    ? 28
    : 18;

  return (
    <>
      {/* ─── Outer Lagging Ring ─── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block -translate-x-1/2 -translate-y-1/2"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          width: ringSize,
          height: ringSize,
          border: `1px solid ${ringColor}`,
          backgroundColor:
            cursorType === "hover-3d"
              ? `rgba(${ringColorR}, ${ringColorG}, ${ringColorB}, ${0.04 + heatRatio * 0.05})`
              : cursorType === "hover-btn"
              ? "rgba(196, 92, 38, 0.06)"
              : "transparent",
          transition: "width 0.35s cubic-bezier(0.25,1,0.5,1), height 0.35s cubic-bezier(0.25,1,0.5,1), border-color 0.4s ease, background-color 0.4s ease",
          // Add a warm glow on 3D/hot hover
          boxShadow:
            cursorType === "hover-3d" && heatRatio > 0.3
              ? `0 0 ${Math.round(8 + heatRatio * 14)}px rgba(196, 92, 38, ${0.15 + heatRatio * 0.25})`
              : "none",
        }}
      >
        {/* Heat wave inside 3D hover */}
        {cursorType === "hover-3d" && (
          <svg
            viewBox="0 0 100 24"
            className="w-full h-full p-2.5 opacity-80 pointer-events-none overflow-visible"
          >
            <path
              d="M 5 12 Q 28 3 50 12 T 95 12"
              fill="none"
              stroke={`rgb(${ringColorR}, ${ringColorG}, ${ringColorB})`}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur="1.6s"
                repeatCount="indefinite"
                values="M 5 12 Q 28 3 50 12 T 95 12;
                        M 5 12 Q 28 21 50 12 T 95 12;
                        M 5 12 Q 28 3 50 12 T 95 12"
              />
            </path>
          </svg>
        )}
      </motion.div>

      {/* ─── Immediate Inner Dot ─── */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block -translate-x-1/2 -translate-y-1/2"
        style={{
          x: dotX,
          y: dotY,
          width: isVisible ? (cursorType === "default" ? 4 : 3) : 0,
          height: isVisible ? (cursorType === "default" ? 4 : 3) : 0,
          backgroundColor:
            cursorType === "default"
              ? `rgba(${ringColorR}, ${ringColorG}, ${ringColorB}, 0.7)`
              : `rgb(${ringColorR}, ${ringColorG}, ${ringColorB})`,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.15s ease, height 0.15s ease, opacity 0.15s ease",
        }}
      />
    </>
  );
}
