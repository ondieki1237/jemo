"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Calendar, User, Tag } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  createdAt: string
  category: string
  featuredImage: string
  slug: string
  tags: string[]
  views: number
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "general", "events", "equipment", "tips", "news"]

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch("/api/blog?published=true")
      const data = await res.json()
      if (data.success) {
        setBlogPosts(data.posts || [])
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setLoading(false)
    }
  }

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-top-bg text-secondary-foreground">
        <div className="hero-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Blog</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Industry insights, expert tips, and event production trends from Boom Audio Visuals.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Blog Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                {selectedCategory === "all"
                  ? "No blog posts available yet. Check back soon!"
                  : `No posts found in the "${selectedCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`}>
                  <div
                    className="cursor-pointer h-full flex flex-col space-y-4"
                    onMouseEnter={() => setHoveredPost(post._id)}
                    onMouseLeave={() => setHoveredPost(null)}
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden luxury-border bg-secondary/5">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className={`object-cover transition-transform duration-500 ${
                            hoveredPost === post._id ? "scale-105" : "scale-100"
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/20">
                          <span className="text-4xl font-serif font-bold text-accent/50">B</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded">
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3
                        className={`font-serif text-xl font-bold mb-2 transition-colors ${
                          hoveredPost === post._id ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p className="text-foreground/60 text-sm mb-4">{post.excerpt}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
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
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-accent font-semibold text-sm">
                          Read More{" "}
                          <ArrowRight
                            className={`ml-2 w-4 h-4 transition-transform ${
                              hoveredPost === post._id ? "translate-x-1" : ""
                            }`}
                          />
                        </div>
                        <span className="text-xs text-foreground/40">{post.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
