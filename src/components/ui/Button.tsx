"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { smoothSpring } from "@/lib/motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

/**
 * Editorial-themed organic shaped Button with Electric Orange highlights.
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
      className={`
        relative py-3.5 px-8 font-sans font-bold uppercase tracking-wider text-xs select-none outline-none border-none bg-transparent cursor-pointer
        ${className}
      `}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {/* Background shape */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={{
          hover: {
            scale: 1.05,
            rotate: -1,
            transition: smoothSpring,
          },
          tap: {
            scale: 0.96,
          },
        }}
      >
        <svg
          viewBox="0 0 200 56"
          className="w-full h-full drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
          preserveAspectRatio="none"
        >
          <path
            d="M 10,3 
               C 50,1 150,5 190,3 
               C 197,3 199,14 198,28 
               C 197,42 195,53 188,53 
               C 148,52 50,55 12,53 
               C 5,53 3,42 2,28 
               C 1,14 3,3 10,3 Z"
            fill={isPrimary ? "var(--color-electric-orange)" : "var(--color-charcoal-light)"}
            stroke={isPrimary ? "none" : "rgba(255, 69, 0, 0.2)"}
            strokeWidth={1.5}
            className="transition-colors duration-300"
          />
        </svg>
      </motion.div>

      {/* Button Text */}
      <span
        className={`relative z-10 block transition-transform duration-300 ${
          isPrimary ? "text-black-pure" : "text-warm-white hover:text-electric-orange"
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
