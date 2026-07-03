"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GsapInitializer registers the ScrollTrigger plugin on client-side mount.
 * This guarantees that components attempting to run scroll-driven animations 
 * do so only after GSAP's plugins are fully loaded.
 */
export default function GsapInitializer() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  return null;
}
