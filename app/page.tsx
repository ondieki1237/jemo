"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HomeHero } from "@/components/home-hero"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
      <HomeHero />

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
                  className="cursor-pointer space-y-4 transform transition-all duration-400 neu-card p-6"
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="relative h-64 rounded-lg overflow-hidden neu-pressed bg-secondary/5">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out ${
                        hoveredService === service.id ? "scale-105 rotate-0" : "scale-100"
                      }`}
                    />
                    {/* subtle gradient overlay with blue tint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-60 mix-blend-multiply" />
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
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-white mb-6">Ready to Create Something Extraordinary?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss your event vision and create an unforgettable experience for your guests.
          </p>
          <Link
            href="/request-service"
            className="inline-flex items-center justify-center px-8 py-4 neu-button bg-white text-primary font-semibold hover:scale-105 transition-all"
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
