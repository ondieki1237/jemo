"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const heroImages = [
  "/luxury-african-event-stage-production-concert-fest_optimized.webp",
  "/luxury-event-planning-african-celebration_optimized.webp",
  "/professional-sound-system-concert-stage_optimized.webp",
]

export function HeroCarousel() {
  const [activeImage, setActiveImage] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoplay])

  return (
    <div
      className="relative h-96 lg:h-[550px] rounded-lg overflow-hidden luxury-border"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Images */}
      <div className="relative w-full h-full">
        {heroImages.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeImage ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Event showcase ${idx + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveImage(idx)
              setIsAutoplay(false)
            }}
            className={`transition-all duration-300 ${idx === activeImage ? "w-8 bg-accent" : "w-3 bg-white/50 hover:bg-white/70"
              } h-2 rounded-full`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-5 pointer-events-none">
        <p className="text-sm md:text-base font-medium text-accent mb-2 animate-fade-in-up">
          Slide {activeImage + 1} of {heroImages.length}
        </p>
      </div>
    </div>
  )
}
