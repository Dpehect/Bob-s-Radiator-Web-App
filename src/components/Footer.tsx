"use client";

import React from "react";
// motion helps build bouncy hover springs for the links and buttons
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 14,
  };

  return (
    <footer
      id="contact"
      className="border-t border-[#3f2218]/10 bg-[#faf5ef] px-6 py-24 relative overflow-hidden"
    >
      {/* Background soft glow lamp */}
      <div className="ambient-glow-pink top-0 left-1/3" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 relative z-10">
        
        {/* Left Column: Brand Title (Serif, Cocoa text) */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-black leading-[0.95] text-[#3f2218] tracking-tight mb-6">
              BOB&apos;S <br />
              RADIATOR.
            </h2>
            <p className="text-xs font-sans font-bold tracking-[0.1em] text-[#ff8052] max-w-sm uppercase leading-relaxed">
              Design meets fusion. Bubbly 3D WebGL art and playful spring interactions.
            </p>
          </div>
          
          <div className="mt-12 hidden md:block">
            <span className="text-[10px] font-mono text-[#3f2218]/40 tracking-widest block">
              PLAYFUL CREATIVE LABS // PORTFOLIO 2026
            </span>
          </div>
        </div>

        {/* Right Columns: Rounded Capsule Links */}
        <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
          
          {/* Index Section */}
          <div>
            <h4 className="text-xs font-sans font-bold tracking-[0.15em] text-[#3f2218] mb-6">
              INDEX
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-sans font-bold tracking-wide">
              {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item) => (
                <li key={item}>
                  <motion.a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    whileHover={{ x: 8, color: "#ff7da0" }}
                    transition={linkSpring}
                    className="text-[#3f2218]/70 hover:text-pinkAccent transition-colors duration-300 block"
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
            <h4 className="text-xs font-sans font-bold tracking-[0.15em] text-[#3f2218] mb-6">
              CONNECT
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-sans font-bold tracking-wide">
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
                    whileHover={{ x: 8, color: "#ff8052" }}
                    transition={linkSpring}
                    className="text-[#3f2218]/70 hover:text-orangeAccent transition-colors duration-300 flex items-center gap-1 group"
                    data-cursor="pointer"
                  >
                    {link.name}{" "}
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-[#3f2218]/40 group-hover:text-orangeAccent" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Block */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-sans font-bold tracking-[0.15em] text-[#3f2218] mb-6">
              LOCATION
            </h4>
            <div className="text-xs font-sans font-light tracking-wide leading-relaxed text-[#3f2218]/75">
              CREATIVE LABS 12 <br />
              ISTANBUL, TR <br />
              MILAN, IT
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-[#3f2218]/10 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono text-[#3f2218]/40 tracking-wider relative z-10">
        <div>
          © 2026 BOB&apos;S RADIATOR. SYSTEM COMPILING IN PASTEL SHADES.
        </div>
        
        {/* Playful capsule scroll-to-top button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ 
            scaleX: 1.12, 
            scaleY: 0.88, 
            borderColor: "#ff7da0", 
            color: "#ff7da0",
            backgroundColor: "rgba(255, 125, 160, 0.05)"
          }}
          whileTap={{ scale: 0.9, scaleY: 1.15 }}
          transition={linkSpring}
          className="border border-[#3f2218]/20 rounded-full px-5 py-2.5 hover:border-pinkAccent text-[#3f2218] transition-colors duration-300 flex items-center gap-2 font-bold"
          data-cursor="pointer"
        >
          BACK TO TOP [↑]
        </motion.button>
      </div>
    </footer>
  );
}
