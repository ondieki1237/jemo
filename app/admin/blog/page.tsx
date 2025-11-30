"use client"

import { useState, useEffect } from "react"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Calendar, Tag } from "lucide-react"

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  author: string
  category: string
  tags: string[]
  published: boolean
  publishedAt: string | null
  views: number
  createdAt: string
  updatedAt: string
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    author: "Boom Audio Visuals",
    category: "general",
    tags: "",
    published: false,
  })

  const categories = ["general", "events", "equipment", "tips", "news"]

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
      const res = await fetch(`${BACKEND_URL}/api/blog`)
      const data = await res.json()
      setPosts(data.posts || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setUploading(true)

      let featuredImageUrl = formData.featuredImage

      // Upload image if a new file is selected
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', imageFile)

        const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
        const uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
          method: "POST",
          body: imageFormData,
        })

        const uploadData = await uploadRes.json()

        if (uploadData.success) {
          featuredImageUrl = uploadData.imageUrl
        } else {
          alert("Failed to upload image: " + uploadData.message)
          setUploading(false)
          return
        }
      }

      const postData = {
        ...formData,
        featuredImage: featuredImageUrl,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      }

      if (editingPost) {
        // Update existing post
        const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
        const res = await fetch(`${BACKEND_URL}/api/blog/${editingPost._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        })
        const data = await res.json()

        if (data.success) {
          alert("Blog post updated successfully!")
          fetchPosts()
          resetForm()
        } else {
          alert(data.message || "Failed to update blog post")
        }
      } else {
        // Create new post
        const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
        const res = await fetch(`${BACKEND_URL}/api/blog`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        })
        const data = await res.json()

        if (data.success) {
          alert("Blog post created successfully!")
          fetchPosts()
          resetForm()
        } else {
          alert(data.message || "Failed to create blog post")
        }
      }
      setUploading(false)
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("An error occurred while saving the blog post")
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
      const res = await fetch(`${BACKEND_URL}/api/blog/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        alert("Blog post deleted successfully!")
        fetchPosts()
      } else {
        alert(data.message || "Failed to delete blog post")
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      alert("An error occurred while deleting the blog post")
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      author: post.author,
      category: post.category,
      tags: post.tags.join(", "),
      published: post.published,
    })
    setImagePreview(post.featuredImage)
    setImageFile(null)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      author: "Boom Audio Visuals",
      category: "general",
      tags: "",
      published: false,
    })
    setEditingPost(null)
    setShowForm(false)
    setImageFile(null)
    setImagePreview("")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = filterCategory === "all" || post.category === filterCategory
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && post.published) ||
      (filterStatus === "draft" && !post.published)

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <AdminLayoutWrapper title="Blog Posts" description="Create and manage blog content">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Posts</p>
            <p className="text-3xl font-bold text-accent">{posts.length}</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {posts.filter((p) => p.published).length}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Drafts</p>
            <p className="text-3xl font-bold text-orange-600">
              {posts.filter((p) => !p.published).length}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Views</p>
            <p className="text-3xl font-bold text-primary">
              {posts.reduce((sum, p) => sum + p.views, 0)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showForm ? "Cancel" : "New Blog Post"}
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  rows={2}
                  maxLength={300}
                  required
                />
                <p className="text-xs text-foreground/50 mt-1">{formData.excerpt.length}/300 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  rows={8}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                  {imagePreview && (
                    <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-foreground/50">Upload an image or use the URL field below</p>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => {
                      setFormData({ ...formData, featuredImage: e.target.value })
                      if (e.target.value) setImagePreview(e.target.value)
                    }}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    placeholder="Or paste image URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="audio, video, events"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : editingPost ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="px-6 py-2 bg-background border border-border rounded-lg hover:bg-secondary/5 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Post
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                      Loading blog posts...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                      {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                        ? "No posts found matching your filters"
                        : "No blog posts yet. Create your first post!"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((post) => (
                    <tr key={post._id} className="border-b border-border hover:bg-secondary/5">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{post.title}</p>
                          <p className="text-sm text-foreground/60 mt-1">{post.excerpt.slice(0, 100)}...</p>
                          {post.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {post.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm capitalize">{post.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {post.published ? (
                            <>
                              <Eye className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 text-orange-600" />
                              <span className="text-sm text-orange-600 font-medium">Draft</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{post.views}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-accent hover:text-accent/80"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  )
}
