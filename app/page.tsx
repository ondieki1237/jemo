"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { FloatingStats } from "@/components/floating-stats"
import Link from "next/link"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  const featuredServices = [
    {
      id: 1,
      title: "Event Planning",
      description: "Full-service event coordination from concept to execution.",
      image: "/luxury-event-planning-african-celebration.jpg",
      href: "/services#event-planning",
    },
    {
      id: 2,
      title: "Sound Systems",
      description: "Professional audio engineering for venues of any size.",
      image: "/professional-sound-system-concert-stage.jpg",
      href: "/services#sound-systems",
    },
    {
      id: 3,
      title: "Stage Lighting",
      description: "Stunning visual experiences with cutting-edge lighting design.",
      image: "/stage-lighting-production-concert.jpg",
      href: "/services#lighting",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 -z-20">
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background" />

          {/* Animated accent orbs */}
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float opacity-50" />
          <div
            className="absolute bottom-32 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float opacity-30"
            style={{ animationDelay: "-3s" }}
          />

          {/* Decorative lines */}
          <div className="absolute top-1/3 right-0 w-1 h-48 bg-gradient-to-b from-accent/30 to-transparent opacity-30" />
          <div className="absolute bottom-1/3 left-0 w-1 h-48 bg-gradient-to-b from-transparent to-accent/30 opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: "0s" }}>
              {/* Badge */}
              <div className="hero-badge w-fit">
                <Sparkles className="w-4 h-4" />
                <span>Premium Events</span>
              </div>

              {/* Main Heading with gradient */}
              <div className="space-y-4">
                <h1 className="leading-tight text-balance">
                  Unforgettable <span className="inline-block">Moments,</span>
                  <br />
                  <span className="text-gradient">Flawlessly Executed</span>
                </h1>

                {/* Description */}
                <p className="text-lg text-foreground/70 max-w-lg leading-relaxed">
                  Transform your vision into reality with Africa's most trusted event production company. From intimate
                  gatherings to spectacular productions, we deliver excellence.
                </p>
              </div>

              {/* CTA Buttons with improved interactions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/request-service"
                  aria-label="Request a service"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "inline-flex items-center justify-center shadow-lg hover:shadow-2xl transform transition-all duration-300 focus-visible:ring-4"
                  )}
                >
                  <span className="flex items-center gap-2">
                    Request a Service
                    <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  href="/gallery"
                  aria-label="View our work gallery"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "inline-flex items-center justify-center border-2 border-accent shadow-sm transition-all duration-300 hover:scale-[1.02]"
                  )}
                >
                  <span className="flex items-center gap-2">
                    View Our Work
                    <ArrowRight className="ml-1 w-5 h-5 transition-transform translate-x-0 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              {/* Stats with floating animation */}
              <div className="pt-8">
                <FloatingStats />
              </div>
            </div>

            {/* Image Carousel Side */}
            <div className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              <HeroCarousel />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-scroll-indicator">
          <span className="text-xs uppercase tracking-widest text-foreground/50 font-semibold">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-accent" />
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Our Services</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Comprehensive event solutions tailored to your vision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link key={service.id} href={service.href}>
                <div
                  className="cursor-pointer space-y-4 transform transition-all duration-400 hover:-translate-y-2 hover:shadow-xl rounded-lg"
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="relative h-64 rounded-lg overflow-hidden luxury-border bg-secondary/5">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out ${
                        hoveredService === service.id ? "scale-105 rotate-0" : "scale-100"
                      }`}
                    />
                    {/* subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60 mix-blend-multiply" />
                  </div>
                  <h3
                    className={cn(
                      "text-2xl transition-colors",
                      hoveredService === service.id ? "text-accent" : "text-foreground"
                    )}
                  >
                    {service.title}
                  </h3>
                  <p className="text-foreground/60">{service.description}</p>

                  <div className="pt-2">
                    <Link
                      href={service.href}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }),
                        "inline-flex items-center gap-2 text-accent font-semibold px-0 py-0")}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      <span className="flex items-center gap-2">
                        Learn More
                        <ArrowRight
                          className={`ml-1 w-4 h-4 transition-transform ${
                            hoveredService === service.id ? "translate-x-2" : ""
                          }`}
                        />
                      </span>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-primary-foreground mb-6">Ready to Create Something Extraordinary?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let's discuss your event vision and create an unforgettable experience for your guests.
          </p>
          <Link
            href="/request-service"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
