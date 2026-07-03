import type { Variants, Transition } from "framer-motion";

/* ─── Shared Transitions ─── */
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 110,
  damping: 22,
  mass: 0.7,
};

export const snappyEase: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

export const slowReveal: Transition = {
  duration: 1.0,
  ease: [0.22, 1, 0.36, 1],
};

/* ─── Animation Variants ─── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...slowReveal },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...slowReveal },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

/* ─── Word-by-word staggered reveal ─── */
export const wordPop: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.5,
    },
  },
};
