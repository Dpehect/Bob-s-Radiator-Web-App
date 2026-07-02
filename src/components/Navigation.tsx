'use client';

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

  /* ─── Scroll listener ─── */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
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
          px-[clamp(24px,5vw,80px)] py-5
          flex items-center justify-between
          transition-all duration-500 ease-out
          border-b
          ${
            scrolled
              ? 'bg-warm-white/80 backdrop-blur-xl border-charcoal/10 shadow-[0_1px_12px_rgba(28,24,20,0.04)]'
              : 'bg-transparent border-transparent'
          }
        `}
      >
        {/* ─── Brand Logo ─── */}
        <a
          href="#"
          className="
            font-display text-2xl md:text-3xl font-bold
            text-charcoal
            transition-transform duration-300 ease-out
            hover:scale-105
            select-none
          "
          aria-label="82° — Back to top"
        >
          82°
        </a>

        {/* ─── Desktop Links ─── */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                group relative
                text-sm tracking-wide uppercase font-sans
                text-charcoal/70
                hover:text-terracotta
                transition-colors duration-300
                overflow-hidden
                h-[1.3em] inline-flex items-center
              "
            >
              {/* Text-reveal hover: two stacked spans */}
              <span className="relative overflow-hidden inline-flex flex-col h-[1.3em]">
                <span
                  className="
                    inline-block
                    transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:-translate-y-full
                  "
                >
                  {link.label}
                </span>
                <span
                  className="
                    inline-block absolute top-full
                    transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:-translate-y-full
                    text-terracotta
                  "
                >
                  {link.label}
                </span>
              </span>
            </a>
          ))}

          {/* ─── CTA Button ─── */}
          <a
            href="#kiln"
            className="
              bg-terracotta text-cream
              px-6 py-2.5 rounded-full
              text-sm font-medium
              hover:bg-terracotta-light hover:scale-105
              transition-all duration-300
              shadow-lg hover:shadow-xl
              select-none
            "
          >
            Configure Yours
          </a>
        </div>

        {/* ─── Mobile Hamburger ─── */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center z-50"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="sr-only">{menuOpen ? 'Close' : 'Menu'}</span>
          <span
            className={`
              absolute left-1/2 -translate-x-1/2
              w-6 h-[2px] rounded-full
              transition-all duration-300 ease-out
              ${
                menuOpen
                  ? 'bg-cream rotate-45 translate-y-0'
                  : 'bg-charcoal -translate-y-2'
              }
            `}
          />
          <span
            className={`
              absolute left-1/2 -translate-x-1/2
              w-6 h-[2px] rounded-full
              transition-all duration-300 ease-out
              ${menuOpen ? 'bg-cream opacity-0 scale-x-0' : 'bg-charcoal opacity-100 scale-x-100'}
            `}
          />
          <span
            className={`
              absolute left-1/2 -translate-x-1/2
              w-6 h-[2px] rounded-full
              transition-all duration-300 ease-out
              ${
                menuOpen
                  ? 'bg-cream -rotate-45 translate-y-0'
                  : 'bg-charcoal translate-y-2'
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
              bg-charcoal
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
                      font-display text-3xl sm:text-4xl font-bold
                      text-cream/80
                      hover:text-terracotta
                      transition-colors duration-300
                      tracking-tight
                    "
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}

              {/* ─── Mobile CTA ─── */}
              <motion.li variants={menuItemVariants} className="mt-6">
                <a
                  href="#kiln"
                  onClick={closeMenu}
                  className="
                    inline-block
                    bg-terracotta text-cream
                    px-8 py-3 rounded-full
                    text-base font-medium
                    hover:bg-terracotta-light hover:scale-105
                    transition-all duration-300
                    shadow-lg hover:shadow-xl
                  "
                >
                  Configure Yours
                </a>
              </motion.li>
            </motion.ul>

            {/* ─── Mobile Footer Accent ─── */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3, transition: { delay: 0.6, duration: 0.5 } }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 text-cream/30 text-xs tracking-[0.3em] uppercase font-sans"
            >
              The Heat That Remembers
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
