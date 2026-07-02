"use client";

import React, { useRef, useState, useMemo } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { Flame, ArrowRight, Move } from "lucide-react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import ArchiveModal from "./ArchiveModal";

// Deterministic PRNG to avoid hydration issues
const seededRand = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const ArchiveMiniCanvas = dynamic(() => import("./ArchiveMiniCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border border-[#C45C26]/20 border-t-[#C45C26] animate-spin" />
    </div>
  ),
});

interface ArchiveCardData {
  type: "kulyutan" | "fisilti" | "kalitim" | "kiziltoprak" | "sessizalev";
  title: string;
  subtitle: string;
  description: string;
  story: string;
  spec: string;
  weight: string;
  bobsNote: string;
}

const CARDS_DATA: ArchiveCardData[] = [
  {
    type: "kulyutan",
    title: "Kül Yutan",
    subtitle: "Kömür tozu ve kaba döküm.",
    description: "Soba küllerini yutan atölyenin en kaba eseri. Kalın döküm demir gövde.",
    story: "1952 kışında Karaköy limanında bir dökümhaneden kalan kömür cürufları Bob'un elinde eridi. Kül Yutan, isli havası ve devasa kütlesiyle Bob'un ürettiği en sert, en kaba ama ısıyı en sadık tutan parçadır.",
    spec: "Gri Dökme Demir Alaşım (Ham)",
    weight: "142 kg",
    bobsNote: "Bu parça ateşi yutar, saatlerce bırakmaz. Onunla konuşurken sesiniz yankılanır.",
  },
  {
    type: "fisilti",
    title: "Fısıltı",
    subtitle: "Zarif gümüş kolonlar.",
    description: "Zarif, incecik gövdesiyle havayı sessizce ısıtan endüstriyel şiir.",
    story: "Metal fısıldar mı? Bob bu modeli tasarlarken boruların içindeki suyun sesini dinledi. İnce alaşımlı gümüş-nikel borular, genleşirken tıpkı rüzgarın fısıltısı gibi hafif melodiler çıkarır.",
    spec: "Nikel-Gümüş Alaşım (Saten)",
    weight: "38 kg",
    bobsNote: "Sessiz salonlar için. Genleşme sesi o kadar narindir ki, sadece gece yarısı duyulabilir.",
  },
  {
    type: "kalitim",
    title: "Kalıtım",
    subtitle: "Fırınlanmış saf bakır.",
    description: "Bob'un babasından kalan döküm teknikleriyle şekillenen bakır başyapıt.",
    story: "Bob, babasının döküm kalıplarını bulduğunda yıl 1987'ydi. O kalıpları modern ısı kanallarıyla birleştirerek bakır alaşımlı bu efsanevi ısı anıtını yarattı. Kalıtım, geçmişin döküm ağırlığını taşır.",
    spec: "Oksitlenmiş Elektrolitik Bakır",
    weight: "84 kg",
    bobsNote: "Bu radyatör bir aile yadigarı gibi nesiller boyu ısınacak metal hafızaya sahip.",
  },
  {
    type: "kiziltoprak",
    title: "Kızıl Toprak",
    subtitle: "Pişmiş toprak rengi demir.",
    description: "Killi toprak ve demir oksitin birleştiği kaba, gözenekli tasarım.",
    story: "Anadolu seyahatinden dönen Bob, killi kızıl toprakların renginden büyülendi. Demir alaşımını toprak pigmentleriyle birleştirerek pürüzlü, mat ve topraksı bir doku elde etti. Kızıl Toprak, doğanın sıcaklığıdır.",
    spec: "Toprak Pigmentli Demir Oksit",
    weight: "96 kg",
    bobsNote: "Dokunduğunuzda bir heykele dokunmuş gibi pürüzlü bir toprak hissi verir.",
  },
  {
    type: "sessizalev",
    title: "Sessiz Alev",
    subtitle: "Siyah grafit ve kor.",
    description: "Karanlıkta parlayan kor yataklarını andıran yüksek ısı kolonları.",
    story: "Bob'un son tasarımlarından biri olan Sessiz Alev, fırın içindeki korların karanlıktaki dansını temsil eder. Grafit kaplı ince kolonlar ısıyı emdikçe, merkezindeki yarıklardan kızıl bir ışıltı yayılır.",
    spec: "Fırçalanmış Grafit & Titanyum",
    weight: "54 kg",
    bobsNote: "Atölyenin en sıcak eseri. Sadece ısınmak için değil, karanlığı aydınlatmak için tasarlandı.",
  },
];

// Heat-reactive ascending particles rendered behind the section
function HeatParticles({ count }: { count: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${seededRand(i * 7) * 96 + 2}%`,
      size: 2 + seededRand(i * 13) * 3,
      duration: 4 + seededRand(i * 19) * 6,
      delay: seededRand(i * 31) * 5,
      opacity: 0.12 + seededRand(i * 41) * 0.22,
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: `rgba(196, 92, 38, ${p.opacity})`,
            animation: `particleAscend ${p.duration}s ${p.delay}s infinite linear`,
            boxShadow: `0 0 ${p.size * 2}px rgba(196, 92, 38, ${p.opacity * 0.5})`,
          }}
        />
      ))}
    </div>
  );
}

interface CardProps {
  card: ArchiveCardData;
  onOpen: () => void;
}

function ArchiveCard({ card, onOpen }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Multi-layer parallax tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const tiltX = (y / (rect.height / 2)) * -5;
    const tiltY = (x / (rect.width / 2)) * 5;
    cardRef.current.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.022, 1.022, 1.022)`;

    // Move spotlight glow with mouse
    if (glowRef.current) {
      const pct_x = ((e.clientX - rect.left) / rect.width) * 100;
      const pct_y = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${pct_x}% ${pct_y}%, rgba(196,92,38,0.09) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    if (glowRef.current) glowRef.current.style.background = "none";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-[310px] md:w-[350px] h-[480px] md:h-[530px] flex-shrink-0 border bg-[#14110F] flex flex-col justify-between p-6 relative select-none cursor-grab active:cursor-grabbing rounded-none overflow-hidden"
      style={{
        transition: "transform 0.45s cubic-bezier(0.25,1,0.5,1), box-shadow 0.45s cubic-bezier(0.25,1,0.5,1), border-color 0.35s ease",
        boxShadow: isHovered
          ? "0 28px 60px -15px rgba(0,0,0,0.65), 0 0 28px rgba(196,92,38,0.10), inset 0 0 20px rgba(0,0,0,0.12)"
          : "0 10px 30px -15px rgba(0,0,0,0.35)",
        borderColor: isHovered ? "rgba(196,92,38,0.32)" : "rgba(255,255,255,0.05)",
      }}
    >
      {/* Mouse-following spotlight */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none z-0 transition-none" />
      {/* Corner indicators */}
      <div
        className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l z-10 pointer-events-none transition-colors duration-300"
        style={{ borderColor: isHovered ? "rgba(196,92,38,0.5)" : "rgba(255,255,255,0.12)" }}
      />
      <div
        className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r z-10 pointer-events-none transition-colors duration-300"
        style={{ borderColor: isHovered ? "rgba(196,92,38,0.5)" : "rgba(255,255,255,0.12)" }}
      />

      {/* Card Header */}
      <div className="flex flex-col items-start w-full">
        <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/40 mb-1">
          Hafıza Serisi
        </span>
        <h4 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
          {card.title}
        </h4>
        <span className="font-sans text-[11px] text-[#E8D9C8]/60 mt-1 font-light italic">
          {card.subtitle}
        </span>
      </div>

      {/* Mini 3D Preview inside Card */}
      <div className="w-full h-[220px] my-2 bg-black/10 border border-white/[0.02] flex items-center justify-center overflow-hidden">
        <ArchiveMiniCanvas type={card.type} isHovered={isHovered} />
      </div>

      {/* Card Footer & Trigger */}
      <div className="flex flex-col gap-4 w-full">
        <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
          {card.description}
        </p>

        <div className="h-10 relative overflow-hidden w-full">
          <AnimatePresence initial={false}>
            {isHovered ? (
              <motion.button
                key="btn"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="w-full h-full bg-[#C45C26] hover:bg-[#d56b33] transition-colors text-[#E8D9C8] font-sans text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-1.5 cursor-pointer rounded-none"
              >
                <Flame size={12} />
                Bu Hafızayı Yak
              </motion.button>
            ) : (
              <motion.div
                key="hint"
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full flex items-center justify-between border-t border-white/5 pt-3"
              >
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30">
                  Model No. 0{card.type.charCodeAt(0) % 9}
                </span>
                <ArrowRight size={14} className="text-white/20" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function TheArchive() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<ArchiveCardData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);
  const heatLevel = useHeatStore((state) => state.heatLevel);

  // Scale particle count with heat: 0 at cold, 30 at full heat
  const particleCount = Math.round((heatLevel / 100) * 30);

  // Translate vertical wheel scroll to horizontal track scroll
  // Once the track is fully scrolled, vertical scroll passes through
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || e.deltaY === 0) return;

    const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 5;
    const isAtStart = container.scrollLeft <= 5;

    // Scroll horizontally if we're not at the bounds
    if ((e.deltaY > 0 && !isAtEnd) || (e.deltaY < 0 && !isAtStart)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY * 0.9;
    }
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    startX.current = e.pageX - container.offsetLeft;
    scrollLeftVal.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!isDragging || !container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5; // speed multiplier
    container.scrollLeft = scrollLeftVal.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleModalClose = (localSliderValue: number) => {
    setSelectedCard(null);
    // Modal kapatılırken global heatLevel artsın (sliderValue * 2 kadar ısı salınır)
    increaseHeat(localSliderValue * 2);
  };

  return (
    <section
      id="archive"
      className="w-full min-h-screen bg-[#0C0A09] py-24 md:py-32 flex flex-col justify-center relative overflow-hidden select-none border-t border-white/5"
    >
      {/* Heat-reactive rising particles */}
      {particleCount > 0 && <HeatParticles count={particleCount} />}

      {/* Background ambient glow (grows with heat) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 90%, rgba(196, 92, 38, ${0.02 + (heatLevel / 100) * 0.06}) 0%, transparent 70%)`,
        }}
      />

      {/* Header Info */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="flex flex-col items-start">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C45C26] font-semibold mb-3">
            Koleksiyon
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white">
            The Archive
          </h2>
        </div>
        <p className="font-sans text-sm text-white/50 max-w-sm font-light leading-relaxed">
          Bob&apos;un farklı yıllarda özel siparişler üzerine tasarladığı döküm radyatörlerin 
          hafızası. Kartları kaydırarak geçmişe dokunun ve üzerlerine tıklayarak ısılarını hissedin.
        </p>
      </div>

      {/* Drag & Scroll instruction hint */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-4 flex items-center gap-2 text-[9px] font-sans tracking-[0.2em] uppercase text-white/30">
        <Move size={10} /> Kaydırın veya Sürükleyin
      </div>

      {/* Horizontal Scroll Track Container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full overflow-x-auto scrollbar-none flex gap-8 py-4 px-6 md:px-12 cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollBehavior: isDragging ? "auto" : "smooth",
        }}
      >
        {CARDS_DATA.map((card, i) => (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px -100px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: i * 0.08 }}
          >
            <ArchiveCard
              card={card}
              onOpen={() => setSelectedCard(card)}
            />
          </motion.div>
        ))}
      </div>

      {/* Modals Overlay */}
      <AnimatePresence>
        {selectedCard && (
          <ArchiveModal
            card={selectedCard}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
