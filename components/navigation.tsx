"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  // Detect scroll for subtle elevation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const linkClasses = (href: string) =>
    cn(
      "relative text-sm font-medium transition-colors duration-200",
      pathname === href ? "text-accent" : "text-foreground hover:text-accent"
    );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto max-w-7xl rounded-2xl px-4 transition-all duration-300",
        "neu-flat backdrop-blur-xl",
        scrolled && "blue-glow scale-[0.98]"
      )}
      style={{ transform: "translateZ(0)" }} // Force GPU layer
    >
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" aria-label="Boom Audio Visuals Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg neu-convex">
            <span className="font-serif text-lg font-bold text-accent">B</span>
          </div>
          <span className="hidden font-serif text-xl font-bold sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Boom Audio Visuals
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
              {link.label}
              {pathname === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-accent"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/request-service"
            className="neu-button px-5 py-2.5 font-medium text-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            Request Service
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent/10 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu – Animated Slide Down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-border/50 md:hidden"
          >
            <div className="space-y-1 px-2 pb-4 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-accent/5 hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/request-service"
                onClick={() => setIsOpen(false)}
                className="mt-3 block rounded-lg bg-accent px-4 py-2.5 text-center font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Request Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}