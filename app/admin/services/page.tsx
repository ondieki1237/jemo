"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

interface Service {
  _id?: string
  id: string
  title: string
  description: string
  features: string[]
  category: string
  active: boolean
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const [formData, setFormData] = useState<Service>({
    id: "",
    title: "",
    description: "",
    features: [],
    category: "audio-visual",
    active: true,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services")
      const data = await res.json()
      setServices(data.services || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching services:", error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const url = editingService ? `/api/services/${formData.id}` : "/api/services"
      const method = editingService ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert(editingService ? "Service updated!" : "Service created!")
        setEditingService(null)
        setIsAdding(false)
        setFormData({
          id: "",
          title: "",
          description: "",
          features: [],
          category: "audio-visual",
          active: true,
        })
        fetchServices()
      } else {
        alert("Error saving service")
      }
    } catch (error) {
      console.error("Error saving service:", error)
      alert("Error saving service")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" })
      if (res.ok) {
        alert("Service deleted!")
        fetchServices()
      }
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData(service)
    setIsAdding(false)
  }

  const handleCancel = () => {
    setEditingService(null)
    setIsAdding(false)
    setFormData({
      id: "",
      title: "",
      description: "",
      features: [],
      category: "audio-visual",
      active: true,
    })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Services Management</h1>
            <p className="text-foreground/60 mt-1">Add and manage your audio-visual services</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingService(null)
              setFormData({
                id: "",
                title: "",
                description: "",
                features: [],
                category: "audio-visual",
                active: true,
              })
            }}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {/* Form */}
        {(isAdding || editingService) && (
          <div className="bg-card border border-border p-6 rounded-lg">
            <h2 className="font-serif text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Service ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="event-planning"
                  className="w-full px-4 py-2 bg-background border border-border rounded"
                  disabled={!!editingService}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event Planning"
                  className="w-full px-4 py-2 bg-background border border-border rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive event coordination from concept to execution"
                  className="w-full px-4 py-2 bg-background border border-border rounded h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded"
                >
                  <option value="audio-visual">Audio-Visual</option>
                  <option value="planning">Planning</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Features (comma-separated)</label>
                <input
                  type="text"
                  value={formData.features.join(", ")}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value.split(",").map((f) => f.trim()) })
                  }
                  placeholder="Setup, Support, Equipment"
                  className="w-full px-4 py-2 bg-background border border-border rounded"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors rounded-lg"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 border border-border hover:bg-secondary/5 transition-colors rounded-lg"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Features</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                      Loading services...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                      No services yet. Click "Add Service" to create one.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{service.id}</td>
                      <td className="px-6 py-4 font-semibold">{service.title}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70 max-w-xs truncate">{service.description}</td>
                      <td className="px-6 py-4">
                        <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">{service.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{service.features.length} features</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-accent hover:text-accent/80 text-sm font-semibold inline-flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <span className="text-foreground/30">•</span>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
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
    </div>
  )
}
