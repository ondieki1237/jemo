import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const BACKEND_URL = process.env.BACKEND_URL || "https://jemo.codewithseth.co.ke"

export default async function BlogPostPage(props: { params: { slug: string } } | { params: Promise<{ slug: string }> }) {
  // In Next's app router params can be a Promise in some runtime configs — await it to be safe
  // https://nextjs.org/docs/messages/sync-dynamic-apis
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { params } = props
  // params may be a Promise; await to unwrap
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { slug } = (await params) as { slug: string }

  try {
    // Fetch via the frontend proxy so we stay same-origin and can leverage Next caching
    const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } })
    if (res.status === 404) return notFound()

    const data = await res.json()

    if (!res.ok || !data.success || !data.post) {
      console.error("Unexpected response fetching post:", { status: res.status, data })
      return notFound()
    }

    const post = data.post

    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />

        {/* Hero section to match blog list styling */}
        <section className="pt-32 pb-16 hero-top-bg text-secondary-foreground">
          <div className="hero-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-serif font-bold">{post.title}</h1>
            {post.excerpt && <p className="text-secondary-foreground/80 mt-2 max-w-2xl">{post.excerpt}</p>}
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/blog" className="text-sm text-accent hover:underline mb-6 inline-block">
            ← Back to Blog
          </Link>

          <article className="space-y-6">
            <header>
              <div className="flex items-center gap-3 text-sm text-foreground/60 mt-3">
                <span>{post.author}</span>
                <span>•</span>
                <time>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <span>{post.views} views</span>
              </div>
            </header>

            {post.featuredImage && (post.featuredImage.startsWith('http://') || post.featuredImage.startsWith('https://')) && (
              <div className="w-full h-80 relative rounded-lg overflow-hidden">
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <section className="prose prose-invert max-w-none text-foreground">
              {/* content is stored as plain text in the admin; render as HTML if present */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </section>
          </article>
        </main>

        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return notFound()
  }
}
