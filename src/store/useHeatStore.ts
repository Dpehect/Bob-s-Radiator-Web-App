import { create } from "zustand";

interface HeatState {
  heatLevel: number; // 0 to 100
  accumulatedHeat: number; // overall clicks / scrolls / interactions
  isLoaded: boolean;
  forgeProgress: number; // 0 to 1 representing scroll in The Forge section
  logoClickCount: number; // logo clicks for easter egg
  setHeatLevel: (level: number) => void;
  increaseHeat: (amount: number) => void;
  setLoaded: (loaded: boolean) => void;
  setForgeProgress: (val: number) => void;
  setLogoClickCount: (count: number) => void;
  incrementLogoClick: () => void;
}

export const useHeatStore = create<HeatState>((set) => ({
  heatLevel: 0,
  accumulatedHeat: 0,
  isLoaded: false,
  forgeProgress: 0,
  logoClickCount: 0,
  setHeatLevel: (level) =>
    set(() => {
      const clamped = Math.max(0, Math.min(100, level));
      return { heatLevel: clamped };
    }),
  increaseHeat: (amount) =>
    set((state) => {
      const nextLevel = Math.min(100, state.heatLevel + amount);
      return {
        heatLevel: nextLevel,
        accumulatedHeat: state.accumulatedHeat + amount,
      };
    }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setForgeProgress: (val) => set({ forgeProgress: val }),
  setLogoClickCount: (count) => set({ logoClickCount: count }),
  incrementLogoClick: () => set((state) => ({ logoClickCount: state.logoClickCount + 1 })),
}));
