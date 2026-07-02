"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

/**
 * Reusable section wrapper with scroll-triggered fade-up animation.
 */
export default function Section({ children, className = "", id, dark = false }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`
        relative w-full
        ${dark ? "bg-charcoal text-cream" : "bg-warm-white text-charcoal"}
        ${className}
      `}
    >
      {children}
    </motion.section>
  );
}
