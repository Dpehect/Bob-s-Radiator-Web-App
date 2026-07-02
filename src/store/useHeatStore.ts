import { create } from "zustand";
import type { RadiatorType, RadiatorSurface, RadiatorHeight } from "@/lib/constants";

interface HeatState {
  /* Global heat level (0–100) */
  heatLevel: number;
  increaseHeat: (amount?: number) => void;

  /* Configurator state */
  radiatorType: RadiatorType;
  radiatorSurface: RadiatorSurface;
  radiatorHeight: RadiatorHeight;
  setRadiatorType: (type: RadiatorType) => void;
  setRadiatorSurface: (surface: RadiatorSurface) => void;
  setRadiatorHeight: (height: RadiatorHeight) => void;
  setHeatLevel: (level: number) => void;
}

export const useHeatStore = create<HeatState>((set) => ({
  heatLevel: 20,
  increaseHeat: (amount = 5) =>
    set((state) => ({ heatLevel: Math.min(100, state.heatLevel + amount) })),

  radiatorType: "classic",
  radiatorSurface: "brass",
  radiatorHeight: "mid",
  setRadiatorType: (type) => set({ radiatorType: type }),
  setRadiatorSurface: (surface) => set({ radiatorSurface: surface }),
  setRadiatorHeight: (height) => set({ radiatorHeight: height }),
  setHeatLevel: (level) => set({ heatLevel: Math.max(0, Math.min(100, level)) }),
}));
