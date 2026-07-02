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
    description: "Born from the first fires of 1952. Heavy, honest, unapologetic warmth.",
    specs: { columns: 5, height: "450mm", output: "680W" },
    color: "#2E2A27",
  },
  {
    id: "fisilti",
    name: "Fısıltı",
    subtitle: "The Whisper",
    description: "Tall, slim, almost silent. Heat that arrives without announcement.",
    specs: { columns: 9, height: "900mm", output: "1200W" },
    color: "#8B8D8F",
  },
  {
    id: "kalitim",
    name: "Kalıtım",
    subtitle: "The Inheritance",
    description: "Passed from generation to generation. Copper-kissed and warm-hearted.",
    specs: { columns: 7, height: "600mm", output: "920W" },
    color: "#A85E3B",
  },
  {
    id: "kiziltoprak",
    name: "Kızıltoprak",
    subtitle: "The Red Earth",
    description: "Clay-toned and grounded. Warmth that feels like home soil.",
    specs: { columns: 6, height: "500mm", output: "780W" },
    color: "#8E3D2F",
  },
  {
    id: "sessizalev",
    name: "Sessiz Alev",
    subtitle: "The Silent Flame",
    description: "Dark graphite precision. Modern lines holding ancient heat.",
    specs: { columns: 8, height: "700mm", output: "1050W" },
    color: "#18191C",
  },
] as const;

/* ─── Timeline Milestones ─── */
export const TIMELINE = [
  {
    year: "1952",
    title: "The First Flame",
    description:
      "In a small Karaköy workshop, master ironworker Mehmet Boran casts his first radiator by hand. He sets the water temperature to 82°C — the exact point where heat becomes memory.",
  },
  {
    year: "1968",
    title: "The Workshop Grows",
    description:
      "Three apprentices join the workshop. Each learns the old way: by touch, by ear, by the color of the glowing metal. No two radiators are identical.",
  },
  {
    year: "1985",
    title: "The Brass Revolution",
    description:
      "Mehmet's son, Ali, introduces brushed brass finishing. The radiators stop being utilities and become objects of desire. Architects begin requesting them by name.",
  },
  {
    year: "2003",
    title: "Heritage Meets Innovation",
    description:
      "The third generation digitizes the workshop's knowledge while preserving its soul. Computer-aided design meets hand-finished surfaces.",
  },
  {
    year: "2025",
    title: "The Living Kiln",
    description:
      "82° launches its configurator — inviting the world to design their own warmth, choosing from materials and forms shaped by 70 years of craft.",
  },
] as const;
