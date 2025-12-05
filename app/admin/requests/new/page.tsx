"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, User, Mail, Phone, Calendar, MapPin, DollarSign, FileText, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const availableServices = [
    "Sound Systems",
    "Stage Lighting",
    "LED Screens",
    "Staging",
    "Event Planning",
    "DJ Services",
    "Photography",
    "Videography",
    "Decorations",
    "Tents & Canopies",
    "Generators",
    "Other"
]

export default function NewRequestPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventDate: "",
        venue: "",
        selectedServices: [] as string[],
        eventDescription: "",
        budget: "",
        attendees: "",
    })

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(service)
                ? prev.selectedServices.filter(s => s !== service)
                : [...prev.selectedServices, service]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    attendees: formData.attendees ? parseInt(formData.attendees) : undefined,
                }),
            })

            const data = await res.json()

            if (data.success || res.ok) {
                alert("Request created successfully!")
                router.push("/admin/requests")
            } else {
                alert(data.message || "Failed to create request")
            }
        } catch (error) {
            console.error("Error creating request:", error)
            alert("An error occurred while creating the request")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/requests">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Requests
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-2xl">Create New Request</CardTitle>
                    <CardDescription>
                        Manually create a service request on behalf of a client
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Client Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-accent" />
                                Client Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="+254 7XX XXX XXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-accent" />
                                Event Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Event Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.venue}
                                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Event venue or location"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Expected Attendees</label>
                                    <input
                                        type="number"
                                        value={formData.attendees}
                                        onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="100"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Budget Range
                                    </label>
                                    <select
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    >
                                        <option value="">Select budget range</option>
                                        <option value="Under KES 50,000">Under KES 50,000</option>
                                        <option value="KES 50,000 - 100,000">KES 50,000 - 100,000</option>
                                        <option value="KES 100,000 - 250,000">KES 100,000 - 250,000</option>
                                        <option value="KES 250,000 - 500,000">KES 250,000 - 500,000</option>
                                        <option value="KES 500,000 - 1,000,000">KES 500,000 - 1,000,000</option>
                                        <option value="Over KES 1,000,000">Over KES 1,000,000</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Services Selection */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-accent" />
                                Select Services *
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {availableServices.map((service) => (
                                    <button
                                        key={service}
                                        type="button"
                                        onClick={() => handleServiceToggle(service)}
                                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.selectedServices.includes(service)
                                                ? "border-accent bg-accent/10 text-accent"
                                                : "border-border bg-background hover:border-accent/50 hover:bg-accent/5"
                                            }`}
                                    >
                                        {service}
                                    </button>
                                ))}
                            </div>
                            {formData.selectedServices.length === 0 && (
                                <p className="text-sm text-yellow-600">Please select at least one service</p>
                            )}
                        </div>

                        {/* Event Description */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Event Description</h3>
                            <textarea
                                value={formData.eventDescription}
                                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                                placeholder="Describe the event, any special requirements, or additional notes..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                            <Link href="/admin/requests">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={loading || formData.selectedServices.length === 0}
                                className="gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Create Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
