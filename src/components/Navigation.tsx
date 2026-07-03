"use client";

import React, { useState } from "react";
// motion allows us to add physics and spring effects to elements
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Disc } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // Define spring settings for menu item hovers
  const hoverSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 15,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050510]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo with interactive spring scale on hover */}
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={hoverSpring}
          className="text-xl font-serif tracking-[-0.04em] text-white hover:text-cyanAccent transition-colors duration-300 flex items-center gap-2"
          data-cursor="pointer"
        >
          <Disc className="text-cyanAccent animate-spin [animation-duration:10s]" size={18} />
          BOB&apos;S RADIATOR
        </motion.a>

        {/* Desktop navigation - interactive bouncing capsules */}
        <nav className="hidden md:flex items-center gap-6">
          {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item, idx) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              whileHover={{ 
                scale: 1.08,
                backgroundColor: idx === 3 ? "#ff6b6b" : "rgba(0, 245, 255, 0.15)",
                color: idx === 3 ? "#ffffff" : "#00f5ff"
              }}
              whileTap={{ scale: 0.95 }}
              transition={hoverSpring}
              className={`px-5 py-2 rounded-full text-xs font-sans tracking-[0.15em] font-medium text-white transition-colors duration-200 ${
                idx === 3 ? "bg-cyanAccent text-[#050510] font-semibold" : "bg-white/5"
              }`}
              data-cursor="pointer"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white bg-white/5 rounded-full hover:bg-white/10"
          aria-label="Toggle navigation"
          data-cursor="pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile drawer with slide-in animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="md:hidden border-t border-white/10 bg-[#050510] overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.98 }}
                  className={`py-4 px-6 rounded-xl text-sm font-serif tracking-wider text-white ${
                    idx === 3 ? "bg-coralAccent text-white" : "bg-white/5"
                  }`}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
