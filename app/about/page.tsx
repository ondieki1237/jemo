"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Award, Users, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">About Boom Audio Visuals</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Boom Audio Visuals is an audio-visual production company based in Kisumu, Kenya — delivering professional
            sound, lighting, staging and creative production for events of all sizes across the country.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="mb-6">Our Story</h2>
              <p className="text-lg text-foreground/70 mb-4">
                Founded to bring world-class audio-visual experiences to East Africa, Boom Audio Visuals started in Kisumu
                and has grown into a trusted partner for corporate, cultural and private events across Kenya.
              </p>
              <p className="text-lg text-foreground/70 mb-4">
                Today, we produce over 500 events annually, from intimate gatherings to large-scale productions with
                thousands of attendees. Our commitment to excellence, innovation, and client satisfaction remains
                unwavering.
              </p>
              <p className="text-lg text-foreground/70">
                We pride ourselves on combining technical expertise with creative vision, delivering experiences that
                exceed expectations and create lasting memories. We operate nationwide — proudly serving every Kenyan
                county including Nairobi, Mombasa, Kwale, Kilifi, Tana River, Lamu, Taita-Taveta, Garissa, Wajir, Mandera,
                Marsabit, Isiolo, Meru, Tharaka-Nithi, Embu, Kitui, Machakos, Makueni, Nyandarua, Nyeri, Kirinyaga,
                Murang'a, Kiambu, Turkana, West Pokot, Samburu, Trans-Nzoia, Uasin Gishu, Elgeyo-Marakwet, Nandi,
                Baringo, Laikipia, Nakuru, Narok, Kajiado, Kericho, Bomet, Kakamega, Vihiga, Bungoma, Busia, Siaya,
                Kisumu, Homa Bay, Migori, Kisii and Nyamira.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden luxury-border">
                <Image src="/placeholder.svg?key=about1" alt="Boom Audio Visuals team" fill className="object-cover" />
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Award className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Excellence</h3>
              <p className="text-foreground/70">
                We maintain the highest standards in every aspect of event production, from technical execution to
                creative delivery.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Users className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Partnership</h3>
              <p className="text-foreground/70">
                We view every client as a partner, collaborating closely to bring your vision to life with creativity
                and dedication.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Target className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Innovation</h3>
              <p className="text-foreground/70">
                We continuously adopt cutting-edge technology and creative approaches to deliver unique and memorable
                events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-accent mb-2">15+</div>
              <p className="text-lg text-primary-foreground/80">Years of Excellence</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">500+</div>
              <p className="text-lg text-primary-foreground/80">Events Produced</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">100+</div>
              <p className="text-lg text-primary-foreground/80">Team Members</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">50K+</div>
              <p className="text-lg text-primary-foreground/80">Happy Guests</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
