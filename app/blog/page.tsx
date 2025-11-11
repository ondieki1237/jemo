"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const blogPosts = [
  {
    id: 1,
    title: "The Art of Event Production: Key Trends for 2025",
    excerpt: "Discover the latest trends shaping the event production industry in Africa and beyond.",
    author: "Sarah Okonkwo",
    date: "2025-01-15",
    category: "Industry Insights",
    image: "/placeholder.svg?key=blog1",
    slug: "event-production-trends-2025",
  },
  {
    id: 2,
    title: "Sound Design Fundamentals for Event Professionals",
    excerpt: "A comprehensive guide to creating perfect acoustics for your next event.",
    author: "James Mwangi",
    date: "2025-01-08",
    category: "Technical Guide",
    image: "/placeholder.svg?key=blog2",
    slug: "sound-design-fundamentals",
  },
  {
    id: 3,
    title: "Creating Memorable Experiences: The Psychology of Event Design",
    excerpt: "Learn how to design events that create lasting impressions on your attendees.",
    author: "Dr. Amara Johnson",
    date: "2024-12-28",
    category: "Strategy",
    image: "/placeholder.svg?key=blog3",
    slug: "psychology-of-event-design",
  },
  {
    id: 4,
    title: "Sustainable Event Production: Going Green",
    excerpt: "Best practices for reducing environmental impact while maintaining event excellence.",
    author: "Kofi Asante",
    date: "2024-12-20",
    category: "Sustainability",
    image: "/placeholder.svg?key=blog4",
    slug: "sustainable-event-production",
  },
  {
    id: 5,
    title: "LED Technology Revolutionizing Visual Production",
    excerpt: "Explore how cutting-edge LED technology is transforming event visuals.",
    author: "Tech Team",
    date: "2024-12-12",
    category: "Technology",
    image: "/placeholder.svg?key=blog5",
    slug: "led-technology-visual-production",
  },
  {
    id: 6,
    title: "Building Your Event Production Dream Team",
    excerpt: "Tips and strategies for assembling the perfect team for your event.",
    author: "Helena Kimani",
    date: "2024-12-05",
    category: "Business",
    image: "/placeholder.svg?key=blog6",
    slug: "building-event-team",
  },
]

export default function BlogPage() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Blog</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Industry insights, expert tips, and event production trends from Boom Audio Visuals.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div
                  className="cursor-pointer h-full flex flex-col space-y-4"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div className="relative h-48 rounded-lg overflow-hidden luxury-border bg-secondary/5">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        hoveredPost === post.id ? "scale-105" : "scale-100"
                      }`}
                    />
                    <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded">
                      {post.category}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3
                      className={`font-serif text-xl font-bold mb-2 transition-colors ${
                        hoveredPost === post.id ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-4">{post.excerpt}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center space-x-4 text-xs text-foreground/60">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      Read More{" "}
                      <ArrowRight
                        className={`ml-2 w-4 h-4 transition-transform ${
                          hoveredPost === post.id ? "translate-x-1" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-primary-foreground mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Get exclusive insights, event tips, and industry updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-primary-foreground text-primary placeholder:text-primary/50 rounded border-0"
            />
            <button className="px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
