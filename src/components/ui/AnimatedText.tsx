"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { wordPop, staggerContainer } from "@/lib/motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  once?: boolean;
}

/**
 * Word-by-word staggered reveal text component matching the Editorial theme.
 */
export default function AnimatedText({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10%" });

  const words = text.split(" ");

  return (
    <Tag className={className} ref={ref as React.RefObject<HTMLHeadingElement>}>
      <motion.span
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ display: "inline" }}
        transition={{ delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              variants={wordPop}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
