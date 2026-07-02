import type { Variants, Transition } from "framer-motion";

/* ─── Shared Transitions ─── */
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export const gentleEase: Transition = {
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1],
};

export const slowReveal: Transition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1],
};

/* ─── Animation Variants ─── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...gentleEase },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...slowReveal },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...slowReveal },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...slowReveal },
  },
};

/* ─── Stagger Container ─── */
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
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/* ─── Word-by-word pop-in (matching Crav Burgers style) ─── */
export const wordPop: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.85,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      mass: 0.6,
    },
  },
};

/* ─── Card hover preset ─── */
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 20px rgba(28, 24, 20, 0.08)",
  },
  hover: {
    scale: 1.03,
    y: -8,
    boxShadow: "0 20px 60px rgba(28, 24, 20, 0.15)",
    transition: smoothSpring,
  },
};
