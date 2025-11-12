"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const services = [
  {
    id: "event-planning",
    title: "Event Planning",
    description: "Comprehensive event coordination from concept to execution",
    basePrice: 5000,
    image: "/placeholder.svg?key=evt1",
    features: [
      "Venue selection & negotiation",
      "Budget management",
      "Vendor coordination",
      "Guest management",
      "Day-of coordination",
      "Post-event analysis",
    ],
  },
  {
    id: "sound-systems",
    title: "Sound System Rentals",
    description: "Professional audio engineering for indoor and outdoor venues",
    basePrice: 2000,
    image: "/placeholder.svg?key=snd1",
    features: [
      "Equipment setup & installation",
      "Sound check & calibration",
      "On-site technician",
      "Wireless microphones",
      "Monitor systems",
      "24/7 technical support",
    ],
  },
  {
    id: "acoustic-treatments",
    title: "Acoustic Treatments",
    description: "Soundproofing and acoustic optimization solutions",
    basePrice: 3000,
    image: "/placeholder.svg?key=aco1",
    features: [
      "Venue acoustic assessment",
      "Soundproofing installation",
      "Acoustic panel design",
      "Sound isolation solutions",
      "Consultation & planning",
      "Installation & testing",
    ],
  },
  {
    id: "dj-services",
    title: "DJ Services",
    description: "Professional DJs with extensive music libraries and equipment",
    basePrice: 1500,
    image: "/placeholder.svg?key=dj1",
    features: [
      "Professional DJ talent",
      "Custom playlists",
      "Equipment & setup",
      "MC services available",
      "Music production",
      "Event-specific mixes",
    ],
  },
  {
    id: "live-bands",
    title: "Live Bands & Musicians",
    description: "Professional live bands and individual musicians for all genres",
    basePrice: 3500,
    image: "/placeholder.svg?key=band1",
    features: [
      "Genre-specific talent",
      "Multiple band options",
      "Backup musicians",
      "Sound check included",
      "Professional equipment",
      "Custom setlists",
    ],
  },
  {
    id: "led-screens",
    title: "LED Screens & Displays",
    description: "High-definition LED displays for visual impact",
    basePrice: 2500,
    image: "/placeholder.svg?key=led1",
    features: [
      "Multiple screen sizes",
      "High-resolution displays",
      "Content management",
      "Live streaming capability",
      "Professional installation",
      "Real-time support",
    ],
  },
  {
    id: "lighting",
    title: "Stage Lighting Design",
    description: "Cutting-edge lighting solutions for stunning visual experiences",
    basePrice: 2200,
    image: "/placeholder.svg?key=light1",
    features: [
      "Lighting design consultation",
      "Professional fixtures",
      "Dynamic lighting effects",
      "Color coordination",
      "Installation & operation",
      "Technical support",
    ],
  },
  {
    id: "sound-engineering",
    title: "Sound Engineering",
    description: "Expert sound engineering and production services",
    basePrice: 1800,
    image: "/placeholder.svg?key=eng1",
    features: [
      "Audio mixing & mastering",
      "Live sound engineering",
      "Studio recording",
      "Post-production editing",
      "Quality assurance",
      "Equipment troubleshooting",
    ],
  },
]

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-top-bg text-secondary-foreground">
        <div className="hero-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-secondary-foreground mb-6">Our Services</h1>
            <p className="text-xl text-secondary-foreground/80">
              Comprehensive event production solutions. Choose services à la carte or combine them for a complete
              package.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service) => (
              <div
                key={service.id}
                className="space-y-6"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="relative h-72 rounded-lg overflow-hidden luxury-border bg-secondary/5">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredService === service.id ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl mb-2">{service.title}</h3>
                    <p className="text-foreground/60">{service.description}</p>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-sm text-foreground/70">Custom pricing available</p>
                    <p className="text-sm text-foreground/60">Contact us for a tailored quote</p>
                  </div>

                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/request-service"
                    className="inline-flex items-center text-accent font-semibold hover:text-accent/80 transition-colors pt-4"
                  >
                    Request Quote <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-primary-foreground mb-6">Custom Service Packages</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Need a combination of services? We create custom packages tailored to your event needs.
          </p>
          <Link
            href="/request-service"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all"
          >
            Request a Custom Quote
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
