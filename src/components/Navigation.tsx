"use client";

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';

/* ─── Mobile Menu Framer Motion Variants ─── */
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn', when: 'afterChildren' },
  },
};

const menuContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  /* ─── Scroll listener ─── */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
    
    // Simple hash indicator tracking
    const hash = window.location.hash;
    if (hash) setActiveLink(hash);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run initial scroll check in next frame to prevent synchronous set-state-in-effect warning
    const frameId = requestAnimationFrame(handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, [handleScroll]);

  /* ─── Lock body scroll when mobile menu is open ─── */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 w-full z-50
          px-[5vw] py-5
          flex items-center justify-between
          transition-all duration-500 ease-out
          border-b
          ${
            scrolled
              ? 'bg-black-pure/90 backdrop-blur-xl border-electric-orange/10 shadow-[0_1px_12px_rgba(255,69,0,0.05)]'
              : 'bg-transparent border-transparent'
          }
        `}
      >
        {/* ─── Logo ─── */}
        <a
          href="#"
          className="font-display text-2xl md:text-3xl font-black text-warm-white tracking-tighter hover:text-electric-orange transition-colors"
        >
          82°
        </a>

        {/* ─── Links ─── */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const active = activeLink === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className="
                  group relative py-1
                  text-[11px] font-sans font-bold uppercase tracking-[0.25em]
                  text-editorial-gray hover:text-warm-white
                  transition-colors duration-300
                "
              >
                <span className="relative overflow-hidden inline-block leading-normal">
                  {/* Sliding original text */}
                  <span
                    className="
                      block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:-translate-y-full
                      text-editorial-gray group-hover:text-warm-white
                    "
                  >
                    {link.label}
                  </span>
                  {/* Sliding duplicate text */}
                  <span
                    className="
                      inline-block absolute top-full left-0
                      transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:-translate-y-full
                      text-electric-orange
                    "
                  >
                    {link.label}
                  </span>
                </span>
                
                {/* Electric Orange Active Dot */}
                {active && (
                  <motion.span
                    layoutId="navDot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-electric-orange"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </a>
            );
          })}

          {/* ─── Organic CTA Button ─── */}
          <motion.a
            href="#kiln"
            whileHover="hover"
            whileTap="tap"
            className="
              relative py-2 px-5
              font-sans font-bold tracking-wider text-[10px] uppercase
              select-none outline-none border-none bg-transparent cursor-pointer
              animate-cta-pulse rounded-full
            "
          >
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              variants={{
                hover: {
                  scale: 1.06,
                  rotate: -1,
                  transition: { type: "spring", stiffness: 250, damping: 15 },
                },
                tap: {
                  scale: 0.96,
                },
              }}
            >
              <svg
                viewBox="0 0 140 40"
                className="w-full h-full drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
                preserveAspectRatio="none"
              >
                <path
                  d="M 6,3 
                     C 38,1 88,3 128,3 
                     C 134,3 136,10 135,20 
                     C 134,30 132,37 126,37 
                     C 96,36 38,39 8,37 
                     C 3,37 1,30 1,20 
                     C 0,10 1,3 6,3 Z"
                  fill="var(--color-electric-orange)"
                  className="transition-colors duration-300"
                />
              </svg>
            </motion.div>

            <span className="relative z-10 block text-black-pure">
              <span className="relative overflow-hidden inline-block group">
                <span className="block transition-all duration-300 group-hover:-translate-y-full">
                  Configure
                </span>
                <span
                  className="block absolute inset-0 w-full h-full transition-all duration-300 translate-y-full group-hover:translate-y-0"
                  aria-hidden="true"
                >
                  Configure
                </span>
              </span>
            </span>
          </motion.a>
        </div>

        {/* ─── Mobile Hamburger ─── */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="sr-only">{menuOpen ? 'Close' : 'Menu'}</span>
          <span
            className={`
              absolute left-1/2 -translate-x-1/2
              w-6 h-[1.5px] rounded-full
              transition-all duration-300 ease-out
              ${
                menuOpen
                  ? 'bg-warm-white rotate-45 translate-y-0'
                  : 'bg-warm-white -translate-y-1.5'
              }
            `}
          />
          <span
            className={`
              absolute left-1/2 -translate-x-1/2
              w-6 h-[1.5px] rounded-full
              transition-all duration-300 ease-out
              ${menuOpen ? 'bg-warm-white opacity-0 scale-x-0' : 'bg-warm-white opacity-100 scale-x-100'}
            `}
          />
          <span
            className={`
              absolute left-1/2 -translate-x-1/2
              w-6 h-[1.5px] rounded-full
              transition-all duration-300 ease-out
              ${
                menuOpen
                  ? 'bg-warm-white -rotate-45 translate-y-0'
                  : 'bg-warm-white translate-y-1.5'
              }
            `}
          />
        </button>
      </nav>

      {/* ─── Mobile Fullscreen Overlay ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              fixed inset-0 z-40
              bg-black-pure
              flex flex-col items-center justify-center
              px-8
            "
          >
            <motion.ul
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-6"
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={menuItemVariants}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="
                      font-display text-4xl font-black tracking-tighter text-editorial-gray hover:text-electric-orange transition-colors
                      uppercase block py-2
                    "
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            {/* Bottom brand info in mobile overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-editorial-gray/40">
                82° — The Heat That Remembers
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
