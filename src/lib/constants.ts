/* ─── Brand ─── */
export const BRAND = {
  name: "82°",
  tagline: "The Heat That Remembers",
  founded: "Est. 1952",
  location: "Karaköy, Istanbul",
  fullName: "82° — The Heat That Remembers",
} as const;

/* ─── Navigation ─── */
export const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Collection", href: "#collection" },
  { label: "The Forge", href: "#forge" },
  { label: "The Kiln", href: "#kiln" },
  { label: "Heritage", href: "#heritage" },
] as const;

/* ─── Radiator Types ─── */
export type RadiatorType = "classic" | "wave" | "tower";
export type RadiatorSurface = "brass" | "black" | "terracotta" | "copper";
export type RadiatorHeight = "low" | "mid" | "tall";

export const RADIATOR_TYPES: { id: RadiatorType; label: string; description: string }[] = [
  { id: "classic", label: "Classic", description: "Timeless column design" },
  { id: "wave", label: "Wave", description: "Flowing, organic form" },
  { id: "tower", label: "Tower", description: "Vertical elegance" },
];

export const RADIATOR_SURFACES: { id: RadiatorSurface; label: string; hex: string }[] = [
  { id: "brass", label: "Raw Brass", hex: "#C3AC5B" },
  { id: "black", label: "Cast Iron", hex: "#1A1A1C" },
  { id: "terracotta", label: "Red Earth", hex: "#8D3E31" },
  { id: "copper", label: "Aged Copper", hex: "#B2694E" },
];

export const RADIATOR_HEIGHTS: { id: RadiatorHeight; label: string; spec: string }[] = [
  { id: "low", label: "Low", spec: "450mm" },
  { id: "mid", label: "Mid", spec: "600mm" },
  { id: "tall", label: "Tall", spec: "900mm" },
];

/* ─── Collection Products ─── */
export const PRODUCTS = [
  {
    id: "kulyutan",
    name: "Külyutan",
    subtitle: "The Ash Bearer",
    description: "Cast in heavy raw iron. A monumental radiator carrying the first embers of Mehmet Boran's 1952 legacy.",
    specs: { columns: 5, height: "450mm", output: "680W" },
    color: "#FF4500",
  },
  {
    id: "fisilti",
    name: "Fısıltı",
    subtitle: "The Whisper",
    description: "Slim vertical columns in raw brushed brass. Sings quiet thermal waves into high ceilings.",
    specs: { columns: 9, height: "900mm", output: "1200W" },
    color: "#FF4500",
  },
  {
    id: "kalitim",
    name: "Kalıtım",
    subtitle: "The Inheritance",
    description: "Passed down through generations. An copper-layered block holding timeless heat parameters.",
    specs: { columns: 7, height: "600mm", output: "920W" },
    color: "#FF4500",
  },
  {
    id: "kiziltoprak",
    name: "Kızıltoprak",
    subtitle: "The Red Earth",
    description: "Toughened clay finish. Grounded earth-ware texture conveying warm local soil heritage.",
    specs: { columns: 6, height: "500mm", output: "780W" },
    color: "#FF4500",
  },
  {
    id: "sessizalev",
    name: "Sessiz Alev",
    subtitle: "The Silent Flame",
    description: "A dark graphite masterpiece holding precise heating geometries under structured outlines.",
    specs: { columns: 8, height: "700mm", output: "1050W" },
    color: "#FF4500",
  },
] as const;

/* ─── Timeline Milestones ─── */
export const TIMELINE = [
  {
    year: "1952",
    title: "Casting the First Iron",
    description:
      "Mehmet Boran founds the Karaköy shop. By controlling iron casting ratios manually, he sets the water temperature to 82°C — the point where heat bonds with physical memory.",
  },
  {
    year: "1968",
    title: "The Workshop Expansion",
    description:
      "Three master craft apprentices join the foundry, building custom horizontal columns by eye, ears, and visual light assessments.",
  },
  {
    year: "1985",
    title: "Brass and Copper Coats",
    description:
      "Ali Boran introduces raw brass finishing. Heating objects shift from industrial utilities to visual centerpieces for modern architectures.",
  },
  {
    year: "2003",
    title: "Digital Forge Geometries",
    description:
      "Computer-aided modeling is introduced to guide iron molds. Traditional metallurgical craft meets digital alignment constraints.",
  },
  {
    year: "2025",
    title: "The Living Kiln Release",
    description:
      "82° releases its live configurator feed, giving users complete agency over custom structures, surface textures, and heat coefficients.",
  },
] as const;
