"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { FloatingStats } from "@/components/floating-stats";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------
   Animated Orb Canvas (GPU-accelerated, only 2 layers)
   ------------------------------------------------------------- */
const OrbCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs = [
      { x: 0.75, y: 0.2, r: 180, hue: 200, speed: 0.8 },
      { x: 0.25, y: 0.7, r: 150, hue: 260, speed: 1.2 },
    ];

    let animId: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((o, i) => {
        const phase = t * 0.001 * o.speed + i * 3;
        const offsetX = Math.sin(phase) * 30;
        const offsetY = Math.cos(phase * 0.7) * 30;
        const grad = ctx.createRadialGradient(
          canvas.offsetWidth * o.x + offsetX,
          canvas.offsetHeight * o.y + offsetY,
          0,
          canvas.offsetWidth * o.x + offsetX,
          canvas.offsetHeight * o.y + offsetY,
          o.r
        );
        grad.addColorStop(0, `hsla(${o.hue}, 70%, 60%, 0.12)`);
        grad.addColorStop(1, `hsla(${o.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      animId = requestAnimationFrame(draw);
    };
    draw(0);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};

/* -------------------------------------------------------------
   Main Component
   ------------------------------------------------------------- */
export function HomeHero() {
  const shouldReduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // GSAP ScrollTrigger for subtle parallax on decorative lines
  useEffect(() => {
    if (shouldReduce) return;
    const lines = sectionRef.current?.querySelectorAll(".decor-line");
    lines?.forEach((line, i) => {
      gsap.to(line, {
        yPercent: i % 2 === 0 ? -30 : 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });
  }, [shouldReduce]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-20"
    >
      {/* Canvas Orbs */}
      <OrbCanvas />

      {/* Decorative vertical lines (parallax) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="decor-line absolute top-1/3 right-0 w-px h-48 bg-gradient-to-b from-accent/30 to-transparent opacity-30" />
        <div className="decor-line absolute bottom-1/3 left-0 w-px h-48 bg-gradient-to-b from-transparent to-accent/30 opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ---------- LEFT CONTENT ---------- */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hero-badge w-fit flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Premium Events</span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="space-y-4"
            >
              <h1 className="leading-tight text-balance text-5xl sm:text-6xl lg:text-7xl font-bold">
                Unforgettable{" "}
                <span className="inline-block">Moments,</span>
                <br />
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent/80 to-primary">
                  Flawlessly Executed
                </span>
              </h1>

              <p className="text-lg text-foreground/70 max-w-lg leading-relaxed">
                Transform your vision into reality with Africa's most trusted event production company. From intimate gatherings to spectacular productions, we deliver excellence.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="/request-service"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-accent/50"
                )}
              >
                <span className="flex items-center gap-2">
                  Request a Service
                  <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>

              <Link
                href="/gallery"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group border-2 border-accent shadow-sm transition-all duration-300 hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-accent/50"
                )}
              >
                <span className="flex items-center gap-2">
                  View Our Work
                  <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="pt-8"
            >
              <FloatingStats />
            </motion.div>
          </motion.div>

          {/* ---------- RIGHT CAROUSEL ---------- */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <HeroCarousel />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={shouldReduce ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs uppercase tracking-widest text-foreground/50 font-semibold">
          Scroll to explore
        </span>
        <ChevronDown className="w-5 h-5 text-accent" />
      </motion.div>
    </section>
  );
}