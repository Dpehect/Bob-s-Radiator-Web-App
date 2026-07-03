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
 * Reusable section container with fadeUp reveal and Editorial coloring modes.
 */
export default function Section({ children, className = "", id, dark = true }: SectionProps) {
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
        relative w-full overflow-visible
        ${dark ? "bg-black-pure text-warm-white" : "bg-warm-white text-black-pure"}
        ${className}
      `}
    >
      {children}
    </motion.section>
  );
}
