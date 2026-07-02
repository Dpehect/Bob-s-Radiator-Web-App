"use client";

import { useEffect, useRef, useState } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavLinkProps {
  text: string;
  href: string;
}

function NavLink({ text, href }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative text-sm uppercase tracking-[0.15em] font-medium font-sans text-inherit/80 hover:text-inherit transition-colors duration-300 py-2 px-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      
      {/* Custom Arc Underline */}
      <svg
        className="absolute bottom-[-4px] left-0 w-full h-[8px] overflow-visible pointer-events-none"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 0,8 Q 50,0 100,8"
          stroke="var(--color-hot-orange)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isHovered ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        />
      </svg>
    </a>
  );
}

export default function Navbar() {
  const isLoaded = useHeatStore((state) => state.isLoaded);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);
  const incrementLogoClick = useHeatStore((state) => state.incrementLogoClick);
  const setLogoClickCount = useHeatStore((state) => state.setLogoClickCount);
  const navbarRef = useRef<HTMLElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    incrementLogoClick();
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2500);
  };

  useEffect(() => {
    if (!isLoaded || !navbarRef.current) return;

    // GSAP ScrollTrigger for shrinking navbar on scroll
    const ctx = gsap.context(() => {
      gsap.to(navbarRef.current, {
        paddingTop: "16px",
        paddingBottom: "16px",
        backgroundColor: "rgba(28, 24, 20, 0.92)",
        borderColor: "rgba(232, 217, 200, 0.08)",
        shadow: "0 10px 30px -10px rgba(0,0,0,0.3)",
        scrollTrigger: {
          trigger: "body",
          start: "top +=20",
          end: "top +=120",
          scrub: 0.5,
        },
      });
    }, navbarRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.header
          ref={navbarRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-8 flex items-center justify-between border-b border-transparent transition-all duration-500"
        >
          {/* Logo Brand */}
          <div
            onClick={handleLogoClick}
            className="flex flex-col select-none cursor-pointer active:scale-95 transition-transform duration-300"
          >
            <span className="font-serif text-lg md:text-xl tracking-[0.1em] font-semibold text-inherit">
              BOB&apos;S RADIATOR
            </span>
            <span className="font-sans text-[9px] tracking-[0.3em] text-inherit/50 mt-0.5">
              EST 1952
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <NavLink text="The Forge" href="#forge" />
            <NavLink text="The Archive" href="#archive" />
            <NavLink text="The Kiln" href="#kiln" />
            <NavLink text="Embers" href="#embers" />
          </nav>

          {/* Right Action Call (Isı Bırak Button) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => increaseHeat(10)}
              className="group relative px-5 py-2.5 overflow-hidden border border-inherit/20 hover:border-inherit/40 transition-colors duration-500 rounded-none bg-transparent cursor-pointer"
            >
              {/* Button sliding fill */}
              <span className="absolute inset-0 bg-[#C45C26] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
              
              <span className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium font-sans group-hover:text-[#E8D9C8] transition-colors duration-300">
                <Flame size={12} className="text-[#C45C26] group-hover:text-inherit transition-colors duration-300" />
                Isı Bırak
              </span>
            </button>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
