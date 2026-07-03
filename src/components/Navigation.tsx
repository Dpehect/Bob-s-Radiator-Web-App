"use client";

import React from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b-2 border-white">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo in Serif, tight tracking */}
        <a 
          href="#" 
          className="text-2xl font-serif tracking-[-0.05em] text-white hover:text-accent transition-colors duration-300 flex items-center gap-2"
          data-cursor="snap"
        >
          BOB&apos;S RADIATOR
        </a>

        {/* Desktop navigation - asymmetrical blocks */}
        <nav className="hidden md:flex items-center">
          <div className="flex border-l-2 border-white h-20">
            {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item, idx) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className={`flex items-center justify-center px-8 border-r-2 border-white text-xs font-sans tracking-[0.15em] font-extralight text-white hover:bg-white hover:text-black transition-colors duration-300 h-full ${
                  idx === 3 ? "bg-accent text-white hover:bg-white hover:text-black border-r-0" : ""
                }`}
                data-cursor="snap"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-300"
          aria-label="Toggle navigation"
          data-cursor="pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer (brutalist block overlay) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-black border-t-2 border-white z-40 flex flex-col justify-between animate-fade-in-up">
          <div className="flex flex-col">
            {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item, idx) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setIsOpen(false)}
                className={`py-8 px-8 border-b-2 border-white text-xl font-serif tracking-[-0.02em] text-white hover:bg-white hover:text-black transition-colors duration-300 ${
                  idx === 3 ? "bg-accent hover:bg-white hover:text-black border-b-0" : ""
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="p-8 border-t-2 border-white bg-black">
            <p className="text-xs text-white/50 tracking-[0.1em]">© 2026 BOB&apos;S RADIATOR</p>
          </div>
        </div>
      )}
    </header>
  );
}
