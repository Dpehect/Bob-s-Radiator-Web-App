"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  
  // Mouse position
  const mouseRef = useRef({ x: 0, y: 0 });
  // Lerped position
  const posRef = useRef({ x: 0, y: 0 });
  
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [snapTarget, setSnapTarget] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Hide default cursor (backup check)
    document.documentElement.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Scan for interactive hover targets
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, select, input, textarea, [role="button"], [data-cursor="pointer"], [data-cursor="snap"]'
      );

      interactiveElements.forEach((el) => {
        // Hover effect
        el.addEventListener("mouseenter", (e) => {
          setIsHovered(true);
          const target = e.currentTarget as HTMLElement;
          if (target.getAttribute("data-cursor") === "snap") {
            setSnapTarget(target.getBoundingClientRect());
          }
        });

        el.addEventListener("mouseleave", () => {
          setIsHovered(false);
          setSnapTarget(null);
        });
      });
    };

    // Initial attach
    addHoverListeners();

    // Create an observer to attach listeners to dynamically loaded content
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Raf loop for interpolation (lerp)
    let rafId: number;
    const updateCursor = () => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Lerp positioning
      // If snapping, interpolate towards the center of the snap target
      if (snapTarget) {
        const centerX = snapTarget.left + snapTarget.width / 2;
        const centerY = snapTarget.top + snapTarget.height / 2;
        posRef.current.x += (centerX - posRef.current.x) * 0.25;
        posRef.current.y += (centerY - posRef.current.y) * 0.25;
      } else {
        posRef.current.x += (targetX - posRef.current.x) * 0.18;
        posRef.current.y += (targetY - posRef.current.y) * 0.18;
      }

      // Apply transform
      cursor.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isVisible, snapTarget]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    // Do not render custom cursor on touch devices
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(0px, 0px, 0)",
        willChange: "transform",
      }}
    >
      <svg
        ref={ringRef}
        width={snapTarget ? snapTarget.width + 16 : 40}
        height={snapTarget ? snapTarget.height + 16 : 40}
        viewBox={`0 0 ${snapTarget ? snapTarget.width + 16 : 40} ${
          snapTarget ? snapTarget.height + 16 : 40
        }`}
        className="transition-all duration-300 ease-brutalist"
        style={{
          transform: isHovered && !snapTarget ? "scale(1.6)" : "scale(1)",
        }}
      >
        {snapTarget ? (
          // Brutalist bounding square when snapping
          <rect
            x="2"
            y="2"
            width={snapTarget.width + 12}
            height={snapTarget.height + 12}
            fill="none"
            stroke="#FF4500"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        ) : (
          // SVG ring cursor
          <circle
            cx="20"
            cy="20"
            r={isHovered ? "12" : "8"}
            fill="none"
            stroke={isHovered ? "#FF4500" : "#FFFFFF"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
        )}
      </svg>
    </div>
  );
}
