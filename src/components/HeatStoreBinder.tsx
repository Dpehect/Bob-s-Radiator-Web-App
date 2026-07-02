"use client";

import { useEffect } from "react";
import { useHeatStore } from "@/store/useHeatStore";

export default function HeatStoreBinder() {
  const heatLevel = useHeatStore((state) => state.heatLevel);

  useEffect(() => {
    const ratio = heatLevel / 100;
    document.documentElement.style.setProperty("--heat-ratio", ratio.toString());
  }, [heatLevel]);

  return null;
}
