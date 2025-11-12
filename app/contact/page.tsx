"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-top-bg text-secondary-foreground">
        <div className="hero-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Get In Touch</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif font-bold mb-1">Phone</h3>
                    <a href="tel:+254742412650" className="text-foreground/70 hover:text-accent transition-colors">
                      +254 742 412650
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif font-bold mb-1">Email</h3>
                    <a
                      href="mailto:boomaudiovisuals254@gmail.com"
                      className="text-foreground/70 hover:text-accent transition-colors"
                    >
                      boomaudiovisuals254@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif font-bold mb-1">Address</h3>
                    <p className="text-foreground/70">
                      Kisumu, Kenya
                      <br />
                      East Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif font-bold mb-1">Business Hours</h3>
                    <p className="text-foreground/70">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 border border-border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Message</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
