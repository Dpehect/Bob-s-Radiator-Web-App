"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { smoothSpring } from "@/lib/motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

/**
 * Premium Button component with organic hand-drawn background and layered hover animations.
 * Inspired by the organic, high-end creative style of Crav Burgers.
 */
export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onClick={onClick}
      className={`relative py-4 px-8 font-sans font-bold uppercase tracking-wider text-sm select-none outline-none border-none bg-transparent cursor-pointer ${className}`}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {/* Organic Background Blob */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={{
          hover: {
            scale: 1.05,
            transition: smoothSpring,
          },
          tap: {
            scale: 0.98,
            transition: { duration: 0.1 },
          },
        }}
      >
        <svg
          viewBox="0 0 200 60"
          className="w-full h-full drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
          preserveAspectRatio="none"
        >
          <path
            d="M 12,4 
               C 58,2 142,5 188,4 
               C 196,4 198,16 197,30 
               C 196,44 194,56 186,56 
               C 142,55 58,58 14,56 
               C 6,56 4,44 3,30 
               C 2,16 4,4 12,4 Z"
            fill={isPrimary ? "var(--color-terracotta)" : "var(--color-brass)"}
            className="transition-colors duration-300"
          />
        </svg>
      </motion.div>

      {/* Button Text */}
      <span
        className={`relative z-10 block transition-transform duration-300 ${
          isPrimary ? "text-cream" : "text-charcoal"
        }`}
      >
        <span className="relative overflow-hidden inline-block group">
          <span className="block transition-all duration-300 group-hover:-translate-y-full">
            {children}
          </span>
          <span
            className="block absolute inset-0 w-full h-full transition-all duration-300 translate-y-full group-hover:translate-y-0"
            aria-hidden="true"
          >
            {children}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
