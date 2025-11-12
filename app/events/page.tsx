"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Users, Star } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Event {
  _id: string
  title: string
  description: string
  eventDate: string
  endDate: string | null
  location: {
    venue: string
    address: string
    city: string
  }
  featuredImage: string
  category: string
  services: string[]
  published: boolean
  featured: boolean
  capacity: number
  ticketPrice: number
  status: string
  slug: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "wedding", "corporate", "concert", "conference", "party", "other"]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?published=true")
      const data = await res.json()
      if (data.success) {
        setEvents(data.events || [])
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching events:", error)
      setLoading(false)
    }
  }

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => event.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
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

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary/10 text-foreground hover:bg-secondary/20"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                {selectedCategory === "all"
                  ? "No events available yet. Check back soon!"
                  : `No events found in the "${selectedCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-border last:border-b-0"
                >
                  {/* Image */}
                  <div className="relative h-64 lg:h-auto rounded-lg overflow-hidden luxury-border">
                    {event.featuredImage ? (
                      <Image src={event.featuredImage} alt={event.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/20">
                        <span className="text-6xl font-serif font-bold text-accent/50">B</span>
                      </div>
                    )}
                    {event.featured && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-semibold">Featured</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-3xl font-serif font-bold">{event.title}</h3>
                        <span className="bg-accent/10 text-accent px-3 py-1 rounded text-sm font-medium capitalize">
                          {event.category}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-foreground/70">
                          <Calendar className="w-5 h-5 text-accent" />
                          <span>
                            {new Date(event.eventDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {event.endDate && (
                              <>
                                {" - "}
                                {new Date(event.endDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </>
                            )}
                          </span>
                        </div>
                        {event.location.venue && (
                          <div className="flex items-center space-x-3 text-foreground/70">
                            <MapPin className="w-5 h-5 text-accent" />
                            <span>
                              {event.location.venue}
                              {event.location.city && `, ${event.location.city}`}
                            </span>
                          </div>
                        )}
                        {event.capacity > 0 && (
                          <div className="flex items-center space-x-3 text-foreground/70">
                            <Users className="w-5 h-5 text-accent" />
                            <span>Capacity: {event.capacity} attendees</span>
                          </div>
                        )}
                      </div>

                      <p className="text-foreground/70 mb-6">{event.description}</p>

                      {event.services && event.services.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">Services Provided:</h4>
                          <div className="flex flex-wrap gap-2">
                            {event.services.map((service, i) => (
                              <span
                                key={i}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      {event.ticketPrice > 0 ? (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Starting from</p>
                          <p className="text-2xl font-bold text-accent">KES {event.ticketPrice.toLocaleString()}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-green-600">Free Event</p>
                        </div>
                      )}
                      <Link href="/contact">
                        <button className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-all flex items-center space-x-2">
                          <span>Inquire Now</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-primary-foreground mb-4">Want to Host Your Own Event?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Partner with Boom Audio Visuals to create an unforgettable experience for your guests.
          </p>
          <Link href="/contact">
            <button className="px-8 py-4 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all text-lg">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
