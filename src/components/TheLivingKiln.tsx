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

export default function TheLivingKiln() {
  const heatLevel = useHeatStore((state) => state.heatLevel);
  const setHeatLevel = useHeatStore((state) => state.setHeatLevel);

  // Local configurator options
  const [type, setType] = useState<RadType>("classic");
  const [surface, setSurface] = useState<RadSurface>("brass");
  const [height, setHeight] = useState<RadHeight>("mid");

  // Name entry state for Certificate
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [designerName, setDesignerName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate Certificate Image via HTML Canvas & trigger download
  const handleGenerateCertificate = () => {
    if (!designerName.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      // Create offscreen canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 900;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Draw Background (matte warm cream #F3ECE6)
      ctx.fillStyle = "#F3ECE6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw outer double borders (dark steel #1C1814)
      ctx.strokeStyle = "#1C1814";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // 3. Draw Corner Accents
      const drawCorner = (x: number, y: number, rX: number, rY: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y + rY);
        ctx.lineTo(x, y);
        ctx.lineTo(x + rX, y);
        ctx.strokeStyle = "#C45C26";
        ctx.lineWidth = 3;
        ctx.stroke();
      };
      drawCorner(45, 45, 40, 40);
      drawCorner(canvas.width - 45, 45, -40, 40);
      drawCorner(45, canvas.height - 45, 40, -40);
      drawCorner(canvas.width - 45, canvas.height - 45, -40, -40);

      // 4. Draw Header
      ctx.fillStyle = "#1C1814";
      ctx.textAlign = "center";
      ctx.font = "italic 32px serif";
      ctx.fillText("BOB'S RADIATOR  •  EST 1952  •  KARAKÖY", canvas.width / 2, 130);

      // Divider line
      ctx.beginPath();
      ctx.moveTo(300, 160);
      ctx.lineTo(900, 160);
      ctx.strokeStyle = "rgba(28, 24, 20, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Certificate Title
      ctx.fillStyle = "#C45C26";
      ctx.font = "bold 64px serif";
      ctx.fillText("ISI VE MİRAS SERTİFİKASI", canvas.width / 2, 250);

      // Body text
      ctx.fillStyle = "#1C1814";
      ctx.font = "normal 24px sans-serif";
      ctx.fillText("Bu vesile ile Bob'un dökümhanesinden çıkan ve aşağıda parametreleri", canvas.width / 2, 340);
      ctx.fillText("belirtilen termal heykelin özgün tasarımı tescil edilmiştir.", canvas.width / 2, 385);

      // Designer name container
      ctx.fillStyle = "#1C1814";
      ctx.font = "bold italic 44px serif";
      ctx.fillText(`“ ${designerName.toUpperCase()} ”`, canvas.width / 2, 480);

      ctx.beginPath();
      ctx.moveTo(400, 510);
      ctx.lineTo(800, 510);
      ctx.strokeStyle = "#C45C26";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "rgba(28, 24, 20, 0.5)";
      ctx.font = "normal 16px sans-serif";
      ctx.fillText("Tasarımcı ve Isı Ortağı", canvas.width / 2, 540);

      // 5. Specs Grid
      const getSurfaceName = (s: string) => {
        switch (s) {
          case "brass": return "Ham Fırçalanmış Pirinç";
          case "black": return "Mat Döküm Demir";
          case "terracotta": return "Kızıl Toprak Pigment";
          default: return "Eskimiş Elektrolitik Bakır";
        }
      };

      const getTypeName = (t: string) => {
        switch (t) {
          case "wave": return "Organik Dalga Gövde";
          case "tower": return "İnce Dikey Kolon";
          default: return "Klasik Atölye Tipi";
        }
      };

      const getHeightName = (h: string) => {
        switch (h) {
          case "low": return "1.5 Metre (Alçak)";
          case "tall": return "3.3 Metre (Yüksek)";
          default: return "2.2 Metre (Standart)";
        }
      };

      ctx.fillStyle = "#1C1814";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "left";
      const startX = 220;
      
      ctx.fillText(`Yapı Modeli:  ${getTypeName(type)}`, startX, 640);
      ctx.fillText(`Yüzey Dokusu: ${getSurfaceName(surface)}`, startX, 690);
      ctx.fillText(`Heykel Boyutu: ${getHeightName(height)}`, startX, 740);

      ctx.textAlign = "right";
      const rightX = 980;
      ctx.fillText(`Enerji İndeksi:  ${heatLevel}°C`, rightX, 640);
      ctx.fillText(`Miras Kayıt No:  #${Math.floor(Math.random() * 90000 + 10000)}`, rightX, 690);
      ctx.fillText(`Tarih:           ${new Date().toLocaleDateString("tr-TR")}`, rightX, 740);

      // 6. Draw Signature Stamp (Emblem)
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 700, 60, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196, 92, 38, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#C45C26";
      ctx.textAlign = "center";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("BOB'S", canvas.width / 2, 690);
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("RADIATOR", canvas.width / 2, 705);
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("MIRAS 1952", canvas.width / 2, 720);

      // 7. Trigger download
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Bob_Radiator_Miras_Sertifikasi_${designerName.replace(/\s+/g, "_")}.png`;
      link.href = dataURL;
      link.click();

      // 8. Save design to localStorage for Embers Wall
      const newDesign = {
        id: Date.now().toString(),
        name: designerName,
        type,
        surface,
        height,
        heatLevel,
        timestamp: new Date().toLocaleDateString("tr-TR"),
      };

      const existingEmbers = localStorage.getItem("bobs_embers");
      const embersList = existingEmbers ? JSON.parse(existingEmbers) : [];
      embersList.unshift(newDesign); // add to top
      localStorage.setItem("bobs_embers", JSON.stringify(embersList));

      // Trigger standard Embers custom event to notify wall in real time
      window.dispatchEvent(new Event("embersUpdated"));

      setIsGenerating(false);
      setIsSuccess(true);
      
      // Reset naming form after success message
      setTimeout(() => {
        setShowNamingModal(false);
        setIsSuccess(false);
        setDesignerName("");
      }, 2000);
    }, 1500);
  };

  return (
    <section
      id="kiln"
      className="w-full min-h-screen bg-[#100E0D] py-24 md:py-32 flex flex-col justify-center relative overflow-hidden select-none border-t border-white/5"
    >
      <div className="absolute inset-0 bg-[#C45C26]/[0.005] blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start mb-12 relative z-10">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C45C26] font-semibold mb-3">
          Configurator
        </span>
        <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Kendi Ateşini Yak
        </h2>
        <p className="font-sans text-sm md:text-base text-white/50 font-light leading-relaxed max-w-xl">
          Bu radyatör seninle birlikte ısınsın. Atölye döküm kalıplarını seç, metalin dokusuna 
          ve yüksekliğine karar ver. Isı kadraniyla metali ateşle ve bu tasarımı mirasa kaydet.
        </p>
      </div>

      {/* Main Container Layout */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-stretch">
        
        {/* Left Column: UI Controls (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 border border-white/5 bg-black/10 relative">
          {/* Corner Trims */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/10" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/10" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/10" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/10" />

          {/* Option Groups */}
          <div className="flex flex-col gap-8 w-full">
            
            {/* 1. Radiator Type */}
            <div className="flex flex-col items-start w-full">
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 mb-3">
                1. Radyatör Tipi
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                {(["classic", "wave", "tower"] as RadType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 px-3 text-[10px] uppercase tracking-[0.15em] font-sans border transition-all rounded-none cursor-pointer font-medium ${
                      type === t
                        ? "border-[#C45C26] text-[#C45C26] bg-[#C45C26]/5"
                        : "border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {t === "classic" ? "Klasik" : t === "wave" ? "Dalga" : "Kule"}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Surface Coating */}
            <div className="flex flex-col items-start w-full">
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 mb-3">
                2. Yüzey Kaplaması
              </span>
              <div className="grid grid-cols-2 gap-2 w-full">
                {(["brass", "black", "terracotta", "copper"] as RadSurface[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSurface(s)}
                    className={`py-2 px-3 text-[10px] uppercase tracking-[0.15em] font-sans border transition-all rounded-none cursor-pointer font-medium ${
                      surface === s
                        ? "border-[#C45C26] text-[#C45C26] bg-[#C45C26]/5"
                        : "border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {s === "brass"
                      ? "Ham Pirinç"
                      : s === "black"
                      ? "Mat Siyah Demir"
                      : s === "terracotta"
                      ? "Kızıl Toprak"
                      : "Eskimiş Bakır"}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Height Configuration */}
            <div className="flex flex-col items-start w-full">
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 mb-3">
                3. Yükseklik Seviyesi
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                {(["low", "mid", "tall"] as RadHeight[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHeight(h)}
                    className={`py-2 px-3 text-[10px] uppercase tracking-[0.15em] font-sans border transition-all rounded-none cursor-pointer font-medium ${
                      height === h
                        ? "border-[#C45C26] text-[#C45C26] bg-[#C45C26]/5"
                        : "border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {h === "low" ? "1.5m (Alçak)" : h === "mid" ? "2.2m (Orta)" : "3.3m (Yüksek)"}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Heat slider (Global Heat index) */}
            <div className="flex flex-col items-start w-full pt-4 border-t border-white/5">
              <div className="flex items-center justify-between w-full mb-3">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 flex items-center gap-1.5">
                  <Flame size={11} className="text-[#C45C26]" /> 4. Isı Derecesi
                </span>
                <span className="font-serif text-lg font-bold text-[#C45C26]">
                  {heatLevel}°C
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={heatLevel}
                onChange={(e) => setHeatLevel(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C45C26] focus:outline-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #C45C26 0%, #C45C26 ${heatLevel}%, rgba(255,255,255,0.1) ${heatLevel}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <span className="font-sans text-[9px] text-white/30 italic mt-2">
                Isı arttıkça sistem bloom parlaması, yükselen partiküller ve oda aurası kızıllığı artar.
              </span>
            </div>

          </div>

          {/* Action Trigger Button */}
          <button
            onClick={() => setShowNamingModal(true)}
            className="w-full mt-10 py-3.5 bg-[#C45C26] hover:bg-[#d56b33] active:scale-98 transition-all font-sans text-xs tracking-[0.2em] uppercase text-[#E8D9C8] font-bold rounded-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Bu Tasarımı Mirasa Ekle
          </button>
        </div>

        {/* Right Column: 3D Studio Canvas viewport (7 Columns) */}
        <div className="lg:col-span-7 h-[450px] lg:h-auto min-h-[500px] border border-white/5 bg-[#0C0A09] relative rounded-none flex items-stretch">
          
          {/* Custom corner boundaries overlay */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 z-10 pointer-events-none" />

          {/* Interactive R3F canvas wrapper */}
          <div className="w-full h-full relative" data-cursor="3d">
            <ConfiguratorCanvas type={type} surface={surface} height={height} />
          </div>

          <div className="absolute bottom-4 left-4 text-[9px] font-sans tracking-[0.25em] uppercase text-white/30 pointer-events-none z-10">
            Döküm Stüdyosu (İncele & Çevir)
          </div>
        </div>

      </div>

      {/* Naming Modal Overlay */}
      <AnimatePresence>
        {showNamingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.4 }}
              className="max-w-md w-full bg-[#14110F] border border-white/10 p-8 flex flex-col relative"
            >
              {/* Corner Trims */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />

              <button
                onClick={() => setShowNamingModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer"
                disabled={isGenerating}
              >
                Kapat
              </button>

              <h4 className="font-serif text-2xl font-bold mb-4 text-white">Miras Sertifikası</h4>
              
              {!isSuccess ? (
                <>
                  <p className="font-sans text-xs text-white/60 leading-relaxed mb-6 font-light">
                    Radyatörünüzün özgün tasarım tescili için sertifika üzerine yazılacak adınızı veya atölye imzanızı belirtin.
                  </p>
                  
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="Tasarımcı Adı / Atölye"
                    value={designerName}
                    onChange={(e) => setDesignerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-[#C45C26] rounded-none mb-6 font-sans font-light"
                    disabled={isGenerating}
                  />

                  <button
                    onClick={handleGenerateCertificate}
                    disabled={isGenerating || !designerName.trim()}
                    className="w-full py-3 bg-[#C45C26] hover:bg-[#d56b33] disabled:opacity-40 transition-colors font-sans text-xs tracking-[0.2em] uppercase text-[#E8D9C8] font-bold rounded-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Sertifika Basılıyor...
                      </>
                    ) : (
                      <>
                        <Download size={12} />
                        Sertifikayı İndir ve Mirası Kaydet
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full border border-green-500/20 bg-green-500/10 flex items-center justify-center text-green-400 mb-4 animate-bounce">
                    <Check size={20} />
                  </div>
                  <h5 className="font-serif text-lg font-bold text-white mb-2">Tescil Başarılı</h5>
                  <p className="font-sans text-xs text-white/50 font-light">
                    Sertifikanız indirildi ve tasarımınız &ldquo;Embers&rdquo; duvarına eklendi.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
