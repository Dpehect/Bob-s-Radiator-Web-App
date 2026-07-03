"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="border-t-2 border-white bg-black px-6 py-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
        
        {/* Left Column: Big Brand Text (Serif) */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-serif font-black leading-[0.9] text-white tracking-[-0.04em] mb-6">
              BOB&apos;S <br />
              RADIATOR.
            </h2>
            <p className="text-xs font-sans font-extralight tracking-[0.15em] text-white/50 max-w-sm uppercase leading-relaxed">
              Crafting premium thermal sculptures and raw digital brutality since 2026.
            </p>
          </div>
          
          <div className="mt-12 hidden md:block">
            <span className="text-[10px] font-mono text-white/30 tracking-widest block">
              DESIGN SYSTEM // DIGITAL BRUTALISM
            </span>
          </div>
        </div>

        {/* Right Columns: Links Blocks */}
        <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
          
          {/* Navigation */}
          <div>
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] text-accent mb-6">
              INDEX
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-sans font-extralight tracking-wider">
              {["EXPERIENCE", "THE BENTO", "SPECIFICATIONS", "CONTACT"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-white hover:text-accent hover:underline transition-colors duration-300"
                    data-cursor="snap"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] text-accent mb-6">
              CONNECT
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-sans font-extralight tracking-wider">
              {[
                { name: "GITHUB", href: "https://github.com" },
                { name: "DRIBBBLE", href: "https://dribbble.com" },
                { name: "AWARDS", href: "https://awwwards.com" },
                { name: "TWITTER", href: "https://twitter.com" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors duration-300 flex items-center gap-1 group"
                    data-cursor="snap"
                  >
                    {link.name}{" "}
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location / Meta */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-sans font-semibold tracking-[0.2em] text-accent mb-6">
              METRIC
            </h4>
            <div className="text-xs font-sans font-extralight tracking-wider leading-relaxed text-white/70">
              BOB&apos;S RADIATOR CORP <br />
              METALLIC LABS 7 <br />
              MILAN, IT
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-white/20 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono text-white/40 tracking-wider">
        <div>
          © 2026 BOB&apos;S RADIATOR. ALL PERFORMANCES MONITORED.
        </div>
        
        {/* Back to top scroll button */}
        <button
          onClick={scrollToTop}
          className="border border-white/40 hover:border-accent hover:text-accent px-4 py-2 transition-colors duration-300 flex items-center gap-2"
          data-cursor="snap"
        >
          BACK TO TOP [↑]
        </button>
      </div>
    </footer>
  );
}
