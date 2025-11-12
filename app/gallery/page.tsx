"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useState } from "react"

const galleryItems = [
  {
    id: 1,
    title: "African Music Festival 2024",
    category: "festivals",
    image: "/placeholder.svg?key=gal1",
    description: "Large-scale outdoor festival production",
  },
  {
    id: 2,
    title: "Corporate Gala Event",
    category: "corporate",
    image: "/placeholder.svg?key=gal2",
    description: "Elegant corporate networking event",
  },
  {
    id: 3,
    title: "Wedding Reception",
    category: "weddings",
    image: "/placeholder.svg?key=gal3",
    description: "Luxury wedding celebration",
  },
  {
    id: 4,
    title: "Concert Production",
    category: "concerts",
    image: "/placeholder.svg?key=gal4",
    description: "Professional concert stage setup",
  },
  {
    id: 5,
    title: "Product Launch",
    category: "corporate",
    image: "/placeholder.svg?key=gal5",
    description: "High-impact product launch event",
  },
  {
    id: 6,
    title: "Festival Stage Design",
    category: "festivals",
    image: "/placeholder.svg?key=gal6",
    description: "Custom stage and lighting design",
  },
  {
    id: 7,
    title: "Live Band Performance",
    category: "concerts",
    image: "/placeholder.svg?key=gal7",
    description: "Professional live music production",
  },
  {
    id: 8,
    title: "Intimate Ceremony",
    category: "weddings",
    image: "/placeholder.svg?key=gal8",
    description: "Boutique event production",
  },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const categories = ["all", "festivals", "corporate", "weddings", "concerts"]

  const filtered =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-top-bg text-secondary-foreground">
        <div className="hero-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Our Work</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Explore our portfolio of stunning events and productions across Africa.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 font-medium capitalize transition-all ${
                  activeCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "border-2 border-border text-foreground hover:border-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative h-64 rounded-lg overflow-hidden luxury-border bg-secondary/5 mb-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredItem === item.id ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${
                      hoveredItem === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="text-center">
                      <h3 className="text-white font-serif text-lg">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
