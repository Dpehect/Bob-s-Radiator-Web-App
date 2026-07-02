"use client";

import { useEffect, useRef, useState } from "react";
import { useHeatStore } from "@/store/useHeatStore";
import gsap from "gsap";

export default function LoadingIgnition() {
  const setLoaded = useHeatStore((state) => state.setLoaded);
  const setHeatLevel = useHeatStore((state) => state.setHeatLevel);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const lineColdRef = useRef<HTMLDivElement>(null);
  const lineHotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ignitionComplete, setIgnitionComplete] = useState(false);

  useEffect(() => {
    // 1. Particle System Setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle structure
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 20;

    // Line bounds in canvas coordinates
    // Line is centered horizontally, height is 30vh (roughly 240px)
    const getLineBounds = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const lineHeight = height * 0.35;
      const startY = centerY + lineHeight / 2;
      const endY = centerY - lineHeight / 2;
      return { centerX, startY, endY, lineHeight };
    };

    const spawnParticle = (progress: number) => {
      const { centerX, startY, lineHeight } = getLineBounds();
      // Only spawn particles up to the currently heated height
      const currentHeatedY = startY - lineHeight * progress;
      
      particles.push({
        x: centerX + (Math.random() - 0.5) * 6,
        y: startY - Math.random() * (startY - currentHeatedY),
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.8 + 0.4),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 80 + 40,
      });
    };

    // 2. GSAP Animation Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Transition / Morph
        
        // Morph the line: expand it horizontally, fade the background, and transition to site
        gsap.timeline()
          .to(lineHotRef.current, {
            width: "12vw",
            height: "100vh",
            opacity: 0.15,
            filter: "blur(24px)",
            backgroundColor: "#C45C26",
            duration: 1.5,
            ease: "power2.out",
          })
          .to(lineColdRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          }, 0)
          .to(containerRef.current, {
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            pointerEvents: "none",
            duration: 1.2,
            ease: "power3.inOut",
          }, 0.3)
          .to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              setLoaded(true);
              setIgnitionComplete(true);
              // Set initial heat level to start the ambient warmth
              gsap.to({}, {
                duration: 1,
                onUpdate: function() {
                  setHeatLevel(Math.round(this.progress() * 15)); // starts at 15% warmth
                }
              });
            }
          }, 0.8);
      }
    });

    // Animate the line filling with heat
    tl.to(lineHotRef.current, {
      height: "100%",
      duration: 3.5,
      ease: "custom-ease", // standard organic cubic bezier
    });

    // Custom cubic bezier curve for natural physical heat expansion
    gsap.registerEase("custom-ease", (t: number) => {
      // similar to custom cubic-bezier(.22, 1, .36, 1)
      return 1 - Math.pow(1 - t, 3.5);
    });

    // 3. Render loop
    const progressObj = { val: 0 };
    gsap.to(progressObj, {
      val: 1,
      duration: 3.5,
      ease: "custom-ease",
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn particles based on progress
      if (Math.random() < 0.25 && particles.length < maxParticles) {
        spawnParticle(progressObj.val);
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.05) * 0.2; // organic sway
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // glowing heat particle color
        ctx.fillStyle = `rgba(232, 217, 200, ${p.alpha * 0.75})`;
        ctx.shadowColor = "#C45C26";
        ctx.shadowBlur = 4;
        ctx.fill();
      }

      // Clear shadow properties for next cycles
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, [setLoaded, setHeatLevel]);

  if (ignitionComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0A09] pointer-events-auto"
      style={{ mixBlendMode: "normal" }}
    >
      {/* Background canvas for rising heat sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* The Central Radiator Pipe Line */}
      <div
        ref={lineContainerRef}
        className="relative flex flex-col justify-end w-[1.5px] h-[35vh]"
      >
        {/* Cold pipe representation */}
        <div
          ref={lineColdRef}
          className="absolute inset-0 w-full bg-[#1C1814] opacity-40 border-l border-white/5"
        />

        {/* Heated pipe filling upwards */}
        <div
          ref={lineHotRef}
          className="relative w-full h-0 bg-gradient-to-t from-[#C45C26] via-[#E8D9C8] to-[#FFFFFF] rounded-full shadow-[0_0_15px_rgba(232,217,200,0.8),0_0_5px_rgba(196,92,38,0.9)]"
        />
      </div>
    </div>
  );
}
