"use client";

import React from "react";
// motion allows us to add spring animations to hover/tap states on footer links
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hoverSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 15,
  };

  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#050510] px-6 py-24 relative overflow-hidden"
    >
      {/* Background glow lamp */}
      <div className="ambient-glow-coral top-0 left-1/3" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 relative z-10">
        
        {/* Left Column: Title (Serif) */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-black leading-[0.9] text-white tracking-[-0.04em] mb-6">
              BOB&apos;S <br />
              RADIATOR.
            </h2>
            <p className="text-xs font-sans font-light tracking-[0.15em] text-white/50 max-w-sm uppercase leading-relaxed">
              Design meets fusion. High-performance creative coding and WebGL art experiences.
            </p>
          </div>
          
          <div className="mt-12 hidden md:block">
            <span className="text-[10px] font-mono text-white/30 tracking-widest block">
              CREATIVE LABS // PORTFOLIO 2026
            </span>
          </div>
        </div>

        {/* Right Columns: Links */}
        <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
          
          {/* Index Section */}
          <div>
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] text-cyanAccent mb-6">
              INDEX
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-sans font-light tracking-wider">
              {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item) => (
                <li key={item}>
                  <motion.a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    whileHover={{ x: 6, color: "#00f5ff" }}
                    transition={hoverSpring}
                    className="text-white hover:text-cyanAccent transition-colors duration-300 block"
                    data-cursor="pointer"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] text-cyanAccent mb-6">
              CONNECT
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-sans font-light tracking-wider">
              {[
                { name: "GITHUB", href: "https://github.com" },
                { name: "DRIBBBLE", href: "https://dribbble.com" },
                { name: "AWARDS", href: "https://awwwards.com" },
                { name: "TWITTER", href: "https://twitter.com" },
              ].map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 6, color: "#ff6b6b" }}
                    transition={hoverSpring}
                    className="text-white hover:text-coralAccent transition-colors duration-300 flex items-center gap-1 group"
                    data-cursor="pointer"
                  >
                    {link.name}{" "}
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-white/50 group-hover:text-coralAccent" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Block */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] text-cyanAccent mb-6">
              LOCATION
            </h4>
            <div className="text-xs font-sans font-light tracking-wider leading-relaxed text-white/70">
              CREATIVE LABS 12 <br />
              ISTANBUL, TR <br />
              MILAN, IT
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono text-white/40 tracking-wider relative z-10">
        <div>
          © 2026 BOB&apos;S RADIATOR. SYSTEM STATUS: OPTIMAL.
        </div>
        
        {/* Scroll back to top with spring hover */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.05, borderColor: "#00f5ff", color: "#00f5ff" }}
          whileTap={{ scale: 0.95 }}
          transition={hoverSpring}
          className="border border-white/20 rounded-full px-5 py-2 hover:border-cyanAccent text-white/80 transition-colors duration-300 flex items-center gap-2"
          data-cursor="pointer"
        >
          BACK TO TOP [↑]
        </motion.button>
      </div>
    </footer>
  );
}
