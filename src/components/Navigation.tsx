"use client";

import React, { useState } from "react";
// motion helps build playful spring physical transitions for layout tags
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Smile } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // High-stiffness spring configuration for toy-like snappiness
  const menuSpring = {
    type: "spring" as const,
    stiffness: 450,
    damping: 18,
  };

  return (
    <header className="sticky top-6 z-50 w-full px-6">
      <div className="max-w-7xl mx-auto bg-[#faf5ef]/90 backdrop-blur-md border border-[#3f2218]/15 rounded-full px-8 h-18 flex items-center justify-between shadow-pillow">
        
        {/* Playful logo with spring scaling on tap/hover */}
        <motion.a
          href="#"
          whileHover={{ scale: 1.06, rotate: 3 }}
          whileTap={{ scale: 0.94, rotate: -3 }}
          transition={menuSpring}
          className="text-lg font-serif font-black tracking-tight text-[#3f2218] hover:text-[#ff7da0] flex items-center gap-2"
          data-cursor="pointer"
        >
          <Smile className="text-yellowAccent animate-bounce [animation-duration:2s]" size={20} />
          BOB&apos;S RADIATOR
        </motion.a>

        {/* Desktop Navigation - Squishy spring buttons */}
        <nav className="hidden md:flex items-center gap-4">
          {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item, idx) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              // Playful "squish and stretch" on hover
              whileHover={{ 
                scaleX: 1.08,
                scaleY: 0.94,
                backgroundColor: idx === 3 ? "#ff8052" : "#ff7da0",
                color: "#ffffff"
              }}
              whileTap={{ scale: 0.92, scaleY: 1.08 }}
              transition={menuSpring}
              className={`px-5 py-2.5 rounded-full text-xs font-sans tracking-[0.1em] font-bold text-[#3f2218] transition-colors duration-200 ${
                idx === 3 ? "bg-pinkAccent text-white" : "bg-[#3f2218]/5"
              }`}
              data-cursor="pointer"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Mobile menu toggle button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#3f2218] bg-[#3f2218]/5 rounded-full hover:bg-[#3f2218]/10"
          aria-label="Toggle navigation"
          data-cursor="pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile drawer with squishy spring slide down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="md:hidden mt-2 border border-[#3f2218]/15 bg-[#faf5ef] rounded-[24px] overflow-hidden shadow-pillow"
          >
            <div className="flex flex-col p-6 gap-3">
              {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.97 }}
                  className={`py-4 px-6 rounded-2xl text-sm font-serif font-black tracking-wide text-[#3f2218] ${
                    idx === 3 ? "bg-orangeAccent text-white" : "bg-[#3f2218]/5"
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
