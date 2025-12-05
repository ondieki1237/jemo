"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react"

interface BlogPost {
  _id: string
  title: string
  content: string
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

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()

      if (data.success && data.post) {
        setPost(data.post)
      } else {
        setError(true)
      }
      setLoading(false)
    } catch (err) {
      console.error("Error fetching blog post:", err)
      setError(true)
      setLoading(false)
    }
  }

  const isValidImageUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Article Not Found</h1>
            <p className="text-foreground/60 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero section */}
      <section className="pt-32 pb-16 hero-top-bg text-secondary-foreground">
        <div className="hero-inner max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-secondary-foreground/80 max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Back link and meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center flex-wrap gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views} views</span>
            </div>
          </div>
        </div>

        <article className="space-y-8">
          {/* Featured Image */}
          {isValidImageUrl(post.featuredImage) && (
            <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden luxury-border">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <section className="prose prose-lg max-w-none text-foreground">
            <div
              className="blog-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </section>
        </article>

        {/* Share / CTA */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-foreground/60">Enjoyed this article? Share it with others!</p>
            <Link
              href="/contact"
              className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
