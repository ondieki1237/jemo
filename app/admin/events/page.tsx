"use client"

import { useState, useEffect } from "react"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"
import { Search, Plus, Edit, Trash2, Calendar, MapPin, Star } from "lucide-react"

interface Event {
  _id: string
  title: string
  slug: string
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
  createdAt: string
  updatedAt: string
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    eventDate: "",
    endDate: "",
    venue: "",
    address: "",
    city: "",
    featuredImage: "",
    category: "other",
    services: "",
    published: false,
    featured: false,
    capacity: 0,
    ticketPrice: 0,
  })

  const categories = ["wedding", "corporate", "concert", "conference", "party", "other"]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events")
      const data = await res.json()
      setEvents(data.events || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching events:", error)
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

        const uploadRes = await fetch("/api/upload", {
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

      const eventData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        eventDate: formData.eventDate,
        endDate: formData.endDate || null,
        location: {
          venue: formData.venue,
          address: formData.address,
          city: formData.city,
        },
        featuredImage: featuredImageUrl,
        category: formData.category,
        services: formData.services.split(",").map((s) => s.trim()).filter(Boolean),
        published: formData.published,
        featured: formData.featured,
        capacity: formData.capacity,
        ticketPrice: formData.ticketPrice,
      }

      if (editingEvent) {
        // Update existing event
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingEvent._id, ...eventData }),
        })
        const data = await res.json()

        if (data.success) {
          alert("Event updated successfully!")
          fetchEvents()
          resetForm()
        } else {
          alert(data.message || "Failed to update event")
        }
      } else {
        // Create new event
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })
        const data = await res.json()

        if (data.success) {
          alert("Event created successfully!")
          fetchEvents()
          resetForm()
        } else {
          alert("Failed to create event")
        }
      }
      setUploading(false)
    } catch (error) {
      console.error("Error saving event:", error)
      alert("An error occurred while saving the event")
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        alert("Event deleted successfully!")
        fetchEvents()
      } else {
        alert(data.message || "Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("An error occurred while deleting the event")
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      eventDate: event.eventDate.split("T")[0],
      endDate: event.endDate ? event.endDate.split("T")[0] : "",
      venue: event.location.venue,
      address: event.location.address,
      city: event.location.city,
      featuredImage: event.featuredImage,
      category: event.category,
      services: event.services.join(", "),
      published: event.published,
      featured: event.featured,
      capacity: event.capacity,
      ticketPrice: event.ticketPrice,
    })
    setImagePreview(event.featuredImage)
    setImageFile(null)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      eventDate: "",
      endDate: "",
      venue: "",
      address: "",
      city: "",
      featuredImage: "",
      category: "other",
      services: "",
      published: false,
      featured: false,
      capacity: 0,
      ticketPrice: 0,
    })
    setEditingEvent(null)
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

  const filtered = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.venue.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || event.category === filterCategory
    const matchesStatus = filterStatus === "all" || event.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-blue-600 bg-blue-100"
      case "ongoing":
        return "text-green-600 bg-green-100"
      case "completed":
        return "text-gray-600 bg-gray-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <AdminLayoutWrapper title="Events" description="Create and manage upcoming events">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Events</p>
            <p className="text-3xl font-bold text-accent">{events.length}</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600">
              {events.filter((e) => e.status === "upcoming").length}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {events.filter((e) => e.published).length}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Featured</p>
            <p className="text-3xl font-bold text-purple-600">
              {events.filter((e) => e.featured).length}
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
            {showForm ? "Cancel" : "New Event"}
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search events..."
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
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title *</label>
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
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Venue</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium mb-2">Services (comma-separated)</label>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="Sound System, Lighting, DJ"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ticket Price (KES)</label>
                  <input
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="published" className="text-sm font-medium">
                    Publish
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Feature on homepage
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : editingEvent ? "Update Event" : "Create Event"}
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

        {/* Events List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Date & Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-foreground/60">
                      Loading events...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-foreground/60">
                      {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                        ? "No events found matching your filters"
                        : "No events yet. Create your first event!"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((event) => (
                    <tr key={event._id} className="border-b border-border hover:bg-secondary/5">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {event.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-foreground/60 mt-1">
                              {event.description.slice(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-foreground/40" />
                            {new Date(event.eventDate).toLocaleDateString()}
                          </div>
                          {event.location.venue && (
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <MapPin className="w-4 h-4 text-foreground/40" />
                              {event.location.venue}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm capitalize">{event.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-accent hover:text-accent/80"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
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
