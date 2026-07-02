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
  const linkRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!lineRef.current) return;

    gsap.killTweensOf(lineRef.current);
    // Step 1: reveal stroke from left to right
    gsap.fromTo(
      lineRef.current,
      { strokeDashoffset: 120, opacity: 1 },
      {
        strokeDashoffset: 0,
        duration: 0.42,
        ease: "power2.out",
      }
    );
    // Step 2: letter spacing micro-expansion
    if (linkRef.current) {
      gsap.to(linkRef.current, {
        letterSpacing: "0.22em",
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!lineRef.current) return;

    gsap.killTweensOf(lineRef.current);
    // Retract stroke from right to left (reverse direction)
    gsap.to(lineRef.current, {
      strokeDashoffset: -120,
      opacity: 0,
      duration: 0.32,
      ease: "power2.in",
      onComplete: () => {
        // Reset dashoffset for next hover
        gsap.set(lineRef.current, { strokeDashoffset: 120, opacity: 0 });
      },
    });
    if (linkRef.current) {
      gsap.to(linkRef.current, {
        letterSpacing: "0.15em",
        duration: 0.25,
        ease: "power2.in",
      });
    }
  };

  return (
    <a
      ref={linkRef}
      href={href}
      className="relative text-sm uppercase tracking-[0.15em] font-medium font-sans text-inherit/80 hover:text-inherit transition-colors duration-300 py-2 px-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}

      {/* GSAP-animated organic arc underline */}
      <svg
        className="absolute bottom-[-5px] left-0 w-full h-[10px] overflow-visible pointer-events-none"
        viewBox="0 0 120 10"
        preserveAspectRatio="none"
      >
        <path
          ref={lineRef}
          d="M 0,7 C 20,2 40,0 60,1 C 80,2 100,6 120,7"
          stroke="var(--color-hot-orange, #C45C26)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="120"
          strokeDashoffset="120"
          opacity="0"
        />
      </svg>

      {/* Active glow dot on hover */}
      <motion.span
        className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C45C26]"
        initial={{ opacity: 0, scale: 0 }}
        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.2, ease: "backOut" }}
      />
    </a>
  );
}

export default function Navbar() {
  const isLoaded = useHeatStore((state) => state.isLoaded);
  const increaseHeat = useHeatStore((state) => state.increaseHeat);
  const incrementLogoClick = useHeatStore((state) => state.incrementLogoClick);
  const setLogoClickCount = useHeatStore((state) => state.setLogoClickCount);
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    incrementLogoClick();
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2500);

    // Brief elastic logo bounce on each click
    if (logoRef.current) {
      gsap.killTweensOf(logoRef.current);
      gsap.fromTo(
        logoRef.current,
        { scale: 0.88 },
        { scale: 1, duration: 0.55, ease: "elastic.out(1.2, 0.4)" }
      );
    }
  };

  useEffect(() => {
    if (!isLoaded || !navbarRef.current) return;

    // GSAP ScrollTrigger for shrinking navbar on scroll
    const ctx = gsap.context(() => {
      gsap.to(navbarRef.current, {
        paddingTop: "14px",
        paddingBottom: "14px",
        backgroundColor: "rgba(28, 24, 20, 0.94)",
        borderColor: "rgba(232, 217, 200, 0.08)",
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
          className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-8 flex items-center justify-between border-b border-transparent transition-colors duration-500"
        >
          {/* Logo Brand */}
          <div
            ref={logoRef}
            onClick={handleLogoClick}
            className="flex flex-col select-none cursor-pointer"
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
              className="group relative px-5 py-2.5 overflow-hidden border border-inherit/20 hover:border-[#C45C26]/60 transition-colors duration-500 rounded-none bg-transparent cursor-pointer"
            >
              {/* Button sliding fill */}
              <span className="absolute inset-0 bg-[#C45C26] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />

              <span className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium font-sans group-hover:text-[#E8D9C8] transition-colors duration-300">
                <Flame size={12} className="text-[#C45C26] group-hover:text-inherit transition-colors duration-300" />
                Add Heat
              </span>
            </button>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
