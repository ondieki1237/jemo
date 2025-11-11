"use client"

import { useState } from "react"

interface FloatingStatProps {
  value: string
  label: string
  delay: number
}

function FloatingStat({ value, label, delay }: FloatingStatProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="animate-fade-in-up relative flex flex-col items-center space-y-1"
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`text-3xl md:text-4xl font-bold text-accent transition-transform duration-300 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
      >
        {value}
      </div>
      <p className="text-xs md:text-sm text-foreground/60 uppercase tracking-wider font-medium">{label}</p>
      <div
        className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}

export function FloatingStats() {
  return (
    <div className="grid grid-cols-3 gap-6 md:gap-8">
      <FloatingStat value="500+" label="Events Produced" delay={0.2} />
      <FloatingStat value="50K+" label="Happy Guests" delay={0.4} />
      <FloatingStat value="15+" label="Years Experience" delay={0.6} />
    </div>
  )
}
