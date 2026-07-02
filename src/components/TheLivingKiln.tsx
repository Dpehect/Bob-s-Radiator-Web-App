"use client";

import React, { useState } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import dynamic from "next/dynamic";
import { Flame, Sparkles, Download, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ConfiguratorCanvas = dynamic(() => import("./ConfiguratorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-black/10">
      <div className="w-10 h-10 rounded-full border border-[#C45C26]/20 border-t-[#C45C26] animate-spin" />
    </div>
  ),
});

type RadType = "classic" | "wave" | "tower";
type RadSurface = "brass" | "black" | "terracotta" | "copper";
type RadHeight = "low" | "mid" | "tall";

const TYPE_LABELS: Record<RadType, { name: string; desc: string }> = {
  classic: { name: "Classic", desc: "Foundry cast" },
  wave: { name: "Wave", desc: "Organic form" },
  tower: { name: "Tower", desc: "Slim vertical" },
};

const SURFACE_LABELS: Record<RadSurface, { name: string; hex: string }> = {
  brass: { name: "Raw Brass", hex: "#C3AC5B" },
  black: { name: "Matte Cast Iron", hex: "#202022" },
  terracotta: { name: "Red Earth", hex: "#8D3E31" },
  copper: { name: "Aged Copper", hex: "#B2694E" },
};

const HEIGHT_LABELS: Record<RadHeight, { name: string; sub: string }> = {
  low: { name: "1.5m", sub: "Low" },
  mid: { name: "2.2m", sub: "Standard" },
  tall: { name: "3.3m", sub: "Tall" },
};

// Luxurious selector button with hover micro-animation
function SelectorBtn({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={`relative py-2.5 px-3 text-[10px] uppercase tracking-[0.18em] font-sans border transition-none rounded-none cursor-pointer font-medium overflow-hidden group ${
        active
          ? "border-[#C45C26]/70 text-[#C45C26] bg-[#C45C26]/[0.04]"
          : "border-white/8 text-white/45 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {/* Active glow line at bottom */}
      {active && (
        <motion.span
          layoutId="selector-active-line"
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C45C26]"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        />
      )}

      {/* Hover fill sweep */}
      <span className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Color swatch for surface options */}
      {accent && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle border border-white/10"
          style={{ backgroundColor: accent }}
        />
      )}
      {children}
    </motion.button>
  );
}

export default function TheLivingKiln() {
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const updateGlobalHeat = useHeatStore((state) => state.updateGlobalHeat);

  const [type, setType] = useState<RadType>("classic");
  const [surface, setSurface] = useState<RadSurface>("brass");
  const [height, setHeight] = useState<RadHeight>("mid");
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [designerName, setDesignerName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Heavy-weighted certificate generator
  const handleGenerateCertificate = () => {
    if (!designerName.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1040;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setIsGenerating(false); return; }

      // ── 1. Background ────────────────────────────────────────────────────
      // Parchment gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#F5EDE2");
      bgGrad.addColorStop(1, "#EDE0D4");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle texture dots overlay
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(28, 24, 20, ${Math.random() * 0.025})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // ── 2. Borders ────────────────────────────────────────────────────────
      // Outer thick border
      ctx.strokeStyle = "#1C1814";
      ctx.lineWidth = 6;
      ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

      // Inner thin border
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(28, 24, 20, 0.35)";
      ctx.strokeRect(46, 46, canvas.width - 92, canvas.height - 92);

      // Orange inner accent border
      ctx.strokeStyle = "rgba(196, 92, 38, 0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

      // ── 3. Corner Ornaments ───────────────────────────────────────────────
      const cornerLen = 60;
      const corners = [
        [50, 50, 1, 1],
        [canvas.width - 50, 50, -1, 1],
        [50, canvas.height - 50, 1, -1],
        [canvas.width - 50, canvas.height - 50, -1, -1],
      ] as [number, number, number, number][];

      for (const [cx, cy, dx, dy] of corners) {
        ctx.strokeStyle = "#C45C26";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + dx * cornerLen, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * cornerLen);
        ctx.stroke();
        // Small filled square at corner
        ctx.fillStyle = "#C45C26";
        ctx.fillRect(cx - 3 * Math.abs(dx) * dx, cy - 3 * Math.abs(dy) * dy, 5 * dx, 5 * dy);
      }

      // ── 4. Header ─────────────────────────────────────────────────────────
      // Foundry name — small caps
      ctx.textAlign = "center";
      ctx.fillStyle = "#3D2B1F";
      ctx.font = "500 18px sans-serif";
      ctx.letterSpacing = "0.35em";
      ctx.fillText("BOB'S RADIATOR  ·  EST 1952  ·  KARAKÖY, ISTANBUL", canvas.width / 2, 112);

      // Thin horizontal rule
      ctx.beginPath();
      ctx.moveTo(200, 138); ctx.lineTo(canvas.width - 200, 138);
      ctx.strokeStyle = "rgba(28, 24, 20, 0.15)"; ctx.lineWidth = 1;
      ctx.stroke();

      // ── 5. Certificate Title ──────────────────────────────────────────────
      ctx.font = "italic bold 76px serif";
      ctx.fillStyle = "#C45C26";
      ctx.letterSpacing = "-0.01em";
      ctx.fillText("Heat & Heritage Certificate", canvas.width / 2, 240);

      // Number label
      const certNumber = `#${String(Math.floor(Math.random() * 90000 + 10000))}`;
      ctx.font = "400 14px sans-serif";
      ctx.fillStyle = "rgba(28,24,20,0.35)";
      ctx.letterSpacing = "0.15em";
      ctx.fillText(certNumber, canvas.width / 2, 272);

      // ── 6. Body Text ──────────────────────────────────────────────────────
      ctx.font = "400 22px serif";
      ctx.fillStyle = "#3D2B1F";
      ctx.letterSpacing = "0.01em";
      ctx.fillText(
        "This certifies that the original thermal sculpture described below, cast from",
        canvas.width / 2, 340
      );
      ctx.fillText(
        "Bob's foundry moulds and registered with unique specifications, is hereby verified.",
        canvas.width / 2, 375
      );

      // ── 7. Designer name ─────────────────────────────────────────────────
      ctx.font = "italic bold 52px serif";
      ctx.fillStyle = "#1C1814";
      ctx.letterSpacing = "0.02em";
      ctx.fillText(`" ${designerName.toUpperCase()} "`, canvas.width / 2, 460);

      ctx.beginPath();
      ctx.moveTo(500, 490); ctx.lineTo(canvas.width - 500, 490);
      ctx.strokeStyle = "#C45C26"; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.font = "400 16px sans-serif";
      ctx.fillStyle = "rgba(28,24,20,0.45)";
      ctx.letterSpacing = "0.25em";
      ctx.fillText("DESIGNER · HEAT PARTNER", canvas.width / 2, 518);

      // ── 8. Specification Grid ─────────────────────────────────────────────
      const specY = 600;
      const cols = [
        { label: "BODY MODEL", value: TYPE_LABELS[type].name + " — " + TYPE_LABELS[type].desc },
        { label: "SURFACE FINISH", value: SURFACE_LABELS[surface].name },
        { label: "SCULPTURE SIZE", value: HEIGHT_LABELS[height].name + " (" + HEIGHT_LABELS[height].sub + ")" },
        { label: "HEAT INDEX", value: `${heatLevel}° heat` },
      ];

      const colW = canvas.width / 4;
      ctx.lineWidth = 1;
      for (let i = 0; i < cols.length; i++) {
        const x = colW * i + colW / 2;

        // Column divider
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(colW * i, specY - 30);
          ctx.lineTo(colW * i, specY + 90);
          ctx.strokeStyle = "rgba(28,24,20,0.12)";
          ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.font = "600 11px sans-serif";
        ctx.fillStyle = "#C45C26";
        ctx.letterSpacing = "0.2em";
        ctx.fillText(cols[i].label, x, specY);

        ctx.font = "400 17px serif";
        ctx.fillStyle = "#1C1814";
        ctx.letterSpacing = "0.02em";
        ctx.fillText(cols[i].value, x, specY + 36);
      }

      // Thick separator
      ctx.beginPath();
      ctx.moveTo(80, specY + 68); ctx.lineTo(canvas.width - 80, specY + 68);
      ctx.strokeStyle = "rgba(28,24,20,0.1)"; ctx.lineWidth = 1; ctx.stroke();

      // ── 9. Stamp Circle ───────────────────────────────────────────────────
      const stampX = canvas.width / 2;
      const stampY = canvas.height - 165;
      const stampR = 72;

      ctx.beginPath();
      ctx.arc(stampX, stampY, stampR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196, 92, 38, 0.5)";
      ctx.lineWidth = 2; ctx.stroke();

      ctx.beginPath();
      ctx.arc(stampX, stampY, stampR - 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196, 92, 38, 0.2)";
      ctx.lineWidth = 1; ctx.stroke();

      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = "#C45C26";
      ctx.letterSpacing = "0.1em";
      ctx.textAlign = "center";
      ctx.fillText("BOB'S", stampX, stampY - 10);
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("RADIATOR", stampX, stampY + 8);
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "rgba(196,92,38,0.65)";
      ctx.fillText("HERITAGE 1952", stampX, stampY + 26);

      // ── 10. Footer Date ───────────────────────────────────────────────────
      ctx.font = "400 13px sans-serif";
      ctx.fillStyle = "rgba(28,24,20,0.3)";
      ctx.letterSpacing = "0.12em";
      ctx.fillText(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), canvas.width / 2, canvas.height - 56);

      // ── Trigger Download ──────────────────────────────────────────────────
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Bob_Radiator_Certificate_${designerName.replace(/\s+/g, "_")}.png`;
      link.href = dataURL;
      link.click();

      // Save to localStorage for Embers Wall
      const newDesign = {
        id: Date.now().toString(),
        name: designerName,
        type, surface, height, heatLevel,
        timestamp: new Date().toLocaleDateString("en-US"),
      };
      const existing = localStorage.getItem("bobs_embers");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newDesign);
      localStorage.setItem("bobs_embers", JSON.stringify(list));
      window.dispatchEvent(new Event("embersUpdated"));

      setIsGenerating(false);
      setIsSuccess(true);
      setTimeout(() => {
        setShowNamingModal(false);
        setIsSuccess(false);
        setDesignerName("");
      }, 2200);
    }, 1600);
  };

  return (
    <section
      id="kiln"
      className="w-full min-h-screen py-24 md:py-32 flex flex-col justify-center relative overflow-hidden select-none border-t border-white/5"
      style={{ backgroundColor: "#100E0D" }}
    >
      {/* Dynamic ambient glow behind section — grows with heat */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 65% 50%, rgba(196, 92, 38, ${0.03 + (heatLevel / 100) * 0.07}) 0%, transparent 70%)`,
        }}
      />

      {/* Title */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start mb-14 relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#C45C26] font-semibold mb-4"
        >
          Configurator — Light Your Own Fire
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
          className="heading-dynamic font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-5"
        >
          Heat is in
          <span className="text-[#C45C26]"> Your Hands</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
          className="font-sans text-sm md:text-base text-white/45 font-light leading-relaxed max-w-lg"
        >
          Choose your foundry casting mould, decide on the metal&apos;s finish and height.
          Turn up the heat dial, fire the metal — and inscribe this design into Bob&apos;s legacy.
        </motion.p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 items-stretch">

        {/* ── Left Controls Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
          className="lg:col-span-5 flex flex-col justify-between p-8 border border-white/[0.07] relative"
          style={{
            backgroundColor: "rgba(16, 12, 10, 0.85)",
            boxShadow: `inset 0 0 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03)`,
          }}
        >
          {/* Corner Trims */}
          {[["top-0 left-0 border-t border-l"], ["top-0 right-0 border-t border-r"], ["bottom-0 left-0 border-b border-l"], ["bottom-0 right-0 border-b border-r"]].map((cls, i) => (
            <div key={i} className={`absolute w-3 h-3 border-white/15 ${cls[0]}`} />
          ))}

          <div className="flex flex-col gap-8 w-full">

            {/* 1. Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-white/35">
                  01 — Body Type
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(TYPE_LABELS) as [RadType, { name: string; desc: string }][]).map(([t, lbl]) => (
                  <SelectorBtn key={t} active={type === t} onClick={() => setType(t)}>
                    <span className="block">{lbl.name}</span>
                    <span className="block text-[8px] tracking-[0.1em] opacity-50 normal-case mt-0.5">{lbl.desc}</span>
                  </SelectorBtn>
                ))}
              </div>
            </div>

            {/* 2. Surface */}
            <div>
              <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-white/35 block mb-3">
                02 — Surface Finish
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(SURFACE_LABELS) as [RadSurface, { name: string; hex: string }][]).map(([s, lbl]) => (
                  <SelectorBtn key={s} active={surface === s} onClick={() => setSurface(s)} accent={lbl.hex}>
                    {lbl.name}
                  </SelectorBtn>
                ))}
              </div>
            </div>

            {/* 3. Height */}
            <div>
              <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-white/35 block mb-3">
                03 — Height
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(HEIGHT_LABELS) as [RadHeight, { name: string; sub: string }][]).map(([h, lbl]) => (
                  <SelectorBtn key={h} active={height === h} onClick={() => setHeight(h)}>
                    <span className="block">{lbl.name}</span>
                    <span className="block text-[8px] opacity-50 normal-case mt-0.5">{lbl.sub}</span>
                  </SelectorBtn>
                ))}
              </div>
            </div>

            {/* 4. Heat Slider */}
            <div className="pt-5 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-white/35 flex items-center gap-1.5">
                  <Flame size={10} className="text-[#C45C26]" />
                  04 — Heat Intensity
                </span>
                <motion.span
                  key={heatLevel}
                  initial={{ scale: 1.2, color: "#FF7034" }}
                  animate={{ scale: 1, color: "#C45C26" }}
                  transition={{ duration: 0.4 }}
                  className="font-serif text-2xl font-bold tabular-nums"
                >
                  {heatLevel}°
                </motion.span>
              </div>

              {/* Custom heat slider */}
              <div className="relative w-full h-6 flex items-center">
                <div
                  className="absolute inset-y-0 left-0 rounded pointer-events-none transition-all duration-200"
                  style={{
                    width: `${heatLevel}%`,
                    background: `linear-gradient(to right, #3D2B1F, #C45C26 60%, #FF6B35)`,
                    boxShadow: heatLevel > 20 ? `0 0 ${8 + heatLevel * 0.12}px rgba(196,92,38,${0.2 + heatLevel * 0.004})` : "none",
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heatLevel}
                  onChange={(e) => updateGlobalHeat(parseInt(e.target.value))}
                  className="relative w-full h-1 bg-white/[0.07] rounded appearance-none cursor-pointer focus:outline-none z-10"
                  style={{
                    accentColor: "#C45C26",
                  }}
                />
              </div>

              {/* Heat description */}
              <p className="font-sans text-[9px] text-white/25 italic mt-2.5 leading-relaxed">
                Heat rises with bloom intensity, ascending particles and room aura redness.
              </p>
            </div>

          </div>

          {/* CTA Button */}
          <motion.button
            onClick={() => setShowNamingModal(true)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className="relative w-full mt-10 py-4 overflow-hidden group rounded-none cursor-pointer border border-[#C45C26]/40 hover:border-[#C45C26] transition-colors duration-300"
            style={{ backgroundColor: "rgba(196, 92, 38, 0.08)" }}
          >
            {/* Sliding fill background */}
            <span className="absolute inset-0 bg-[#C45C26] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />
            <span className="relative flex items-center justify-center gap-2.5 font-sans text-xs tracking-[0.22em] uppercase text-[#C45C26] group-hover:text-[#F3ECE6] font-semibold transition-colors duration-300">
              <Sparkles size={13} />
              Inscribe This Design into the Legacy
            </span>
          </motion.button>
        </motion.div>

        {/* ── Right 3D Canvas ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.25 }}
          className="lg:col-span-7 h-[450px] lg:h-auto min-h-[500px] border border-white/[0.06] bg-[#0C0A09] relative rounded-none flex items-stretch"
          style={{
            boxShadow: `inset 0 0 80px rgba(0,0,0,0.5), 0 0 ${20 + heatLevel * 0.4}px rgba(196,92,38,${0.02 + heatLevel * 0.001})`,
          }}
        >
          {/* Corner boundaries */}
          {[["top-0 left-0 border-t border-l"], ["top-0 right-0 border-t border-r"], ["bottom-0 left-0 border-b border-l"], ["bottom-0 right-0 border-b border-r"]].map((cls, i) => (
            <div key={i} className={`absolute w-3 h-3 border-white/18 z-10 pointer-events-none ${cls[0]}`} />
          ))}

          {/* 3D Canvas */}
          <div
            className="w-full h-full relative"
            data-cursor="3d"
            style={{
              filter: heatLevel > 15 ? "url(#heat-haze-filter)" : "none",
              transition: "filter 0.5s ease",
            }}
          >
            <ConfiguratorCanvas type={type} surface={surface} height={height} />
          </div>

          {/* Studio label */}
          <div className="absolute bottom-4 left-4 text-[8px] font-sans tracking-[0.28em] uppercase text-white/25 pointer-events-none z-10">
            Foundry Studio — Explore & Rotate
          </div>
          {/* Heat indicator */}
          <div
            className="absolute bottom-4 right-4 text-[8px] font-sans tracking-[0.2em] uppercase pointer-events-none z-10 transition-all duration-500"
            style={{ color: `rgba(196, 92, 38, ${0.3 + heatLevel * 0.007})` }}
          >
            {heatLevel}° active
          </div>
        </motion.div>
      </div>

      {/* ── Naming Modal ── */}
      <AnimatePresence>
        {showNamingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/88 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="max-w-md w-full border border-white/[0.09] p-9 flex flex-col relative"
              style={{
                backgroundColor: "#13100E",
                boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.2)",
              }}
            >
              {/* Corner trims */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

              <button
                onClick={() => setShowNamingModal(false)}
                className="absolute top-5 right-5 text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                disabled={isGenerating}
              >
                Close
              </button>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#C45C26] block mb-4">
                      Registration & Legacy
                    </span>
                    <h4 className="font-serif text-2xl font-bold mb-3 text-white">
                      Heritage Certificate
                    </h4>
                    <p className="font-sans text-xs text-white/50 leading-relaxed mb-7 font-light">
                      Enter your name or workshop signature for the certificate.
                      This design will be added to Bob&apos;s digital legacy.
                    </p>

                    <input
                      type="text"
                      maxLength={30}
                      placeholder="Designer Name or Workshop Signature"
                      value={designerName}
                      onChange={(e) => setDesignerName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerateCertificate()}
                      className="w-full bg-white/[0.04] border border-white/[0.09] focus:border-[#C45C26]/60 p-3.5 text-sm text-white focus:outline-none rounded-none mb-6 font-sans font-light tracking-wide transition-colors duration-200"
                      disabled={isGenerating}
                      autoFocus
                    />

                    <motion.button
                      onClick={handleGenerateCertificate}
                      disabled={isGenerating || !designerName.trim()}
                      whileHover={!isGenerating && designerName.trim() ? { scale: 1.01, y: -1 } : {}}
                      whileTap={!isGenerating && designerName.trim() ? { scale: 0.99 } : {}}
                      className="w-full py-3.5 bg-[#C45C26] hover:bg-[#d56b33] disabled:opacity-35 font-sans text-xs tracking-[0.22em] uppercase text-[#F3ECE6] font-bold rounded-none cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          Printing Certificate...
                        </>
                      ) : (
                        <>
                          <Download size={12} />
                          Print Certificate & Save Legacy
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                      className="w-14 h-14 rounded-full border border-[#C45C26]/30 bg-[#C45C26]/10 flex items-center justify-center text-[#C45C26] mb-5"
                    >
                      <Check size={22} />
                    </motion.div>
                    <h5 className="font-serif text-xl font-bold text-white mb-2">Registration Successful</h5>
                    <p className="font-sans text-xs text-white/45 font-light">
                      Your certificate has been downloaded and your design added to the &ldquo;Embers&rdquo; wall.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
