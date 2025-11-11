"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react"
import Image from "next/image"

const upcomingEvents = [
  {
    id: 1,
    title: "Summer Music Festival 2025",
    date: "2025-06-15",
    location: "Nairobi National Park",
    attendees: "5000+",
    image: "/placeholder.svg?key=evt1",
    description: "Three-day music festival featuring international and local artists",
    tickets: [
      { tier: "Early Bird", price: 3500, quantity: 1000 },
      { tier: "Regular", price: 5000, quantity: 2000 },
      { tier: "VIP", price: 10000, quantity: 500 },
    ],
  },
  {
    id: 2,
    title: "Tech Africa Conference 2025",
    date: "2025-07-22",
    location: "Kenyatta Convention Centre",
    attendees: "2000+",
    image: "/placeholder.svg?key=evt2",
    description: "Premier technology and innovation conference for African leaders",
    tickets: [
      { tier: "Standard", price: 2500, quantity: 1500 },
      { tier: "Premium", price: 5000, quantity: 400 },
      { tier: "Executive", price: 12000, quantity: 100 },
    ],
  },
  {
    id: 3,
    title: "Art & Culture Expo",
    date: "2025-08-10",
    location: "Nairobi Exhibition Centre",
    attendees: "3000+",
    image: "/placeholder.svg?key=evt3",
    description: "Celebration of African art, culture, and creativity",
    tickets: [
      { tier: "General Admission", price: 1500, quantity: 2500 },
      { tier: "Artist Pass", price: 3000, quantity: 400 },
      { tier: "Patron", price: 8000, quantity: 100 },
    ],
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Upcoming Events</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Join us for unforgettable experiences curated by Africa's leading event production company.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-border last:border-b-0"
              >
                {/* Image */}
                <div className="relative h-64 lg:h-auto rounded-lg overflow-hidden luxury-border">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>

                {/* Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-3xl mb-4">{event.title}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3 text-foreground/70">
                        <Calendar className="w-5 h-5 text-accent" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-foreground/70">
                        <MapPin className="w-5 h-5 text-accent" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-foreground/70">
                        <Users className="w-5 h-5 text-accent" />
                        <span>{event.attendees} expected attendees</span>
                      </div>
                    </div>

                    <p className="text-foreground/70 text-lg mb-6">{event.description}</p>
                  </div>

                  {/* Ticket Options */}
                  <div className="bg-accent/5 p-6 rounded-lg">
                    <h4 className="font-serif font-bold text-lg mb-4">Ticket Options</h4>
                    <div className="space-y-3">
                      {event.tickets.map((ticket, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0"
                        >
                          <span className="text-sm text-foreground/70">{ticket.tier}</span>
                          <span className="font-bold text-accent">KES {ticket.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all"
                  >
                    Buy Tickets
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
