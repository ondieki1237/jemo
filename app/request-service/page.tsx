"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { ArrowRight, Upload } from "lucide-react"

const services = [
  { id: "event-planning", label: "Event Planning" },
  { id: "sound-systems", label: "Sound Systems" },
  { id: "acoustic-treatments", label: "Acoustic Treatments" },
  { id: "dj-services", label: "DJ Services" },
  { id: "live-bands", label: "Live Bands & Musicians" },
  { id: "led-screens", label: "LED Screens & Displays" },
  { id: "lighting", label: "Stage Lighting" },
  { id: "sound-engineering", label: "Sound Engineering" },
]

export default function RequestServicePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    city: "",
    country: "",
    attendees: "",
    selectedServices: [] as string[],
    eventDescription: "",
    specialRequirements: "",
    budget: "",
    attachments: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: Array.from(e.target.files || []),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // TODO: Submit to API endpoint
    alert("Request submitted! We will contact you within 24 hours.")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Request a Service</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">
            Tell us about your event and we'll create a custom quotation for you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      s <= step ? "bg-accent text-accent-foreground" : "bg-border text-foreground/50"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && <div className={`w-20 h-1 mx-2 ${s < step ? "bg-accent" : "bg-border"}`} />}
                </div>
              ))}
            </div>
            <div className="text-center">
              {step === 1 && <p className="text-lg font-semibold">Contact Information</p>}
              {step === 2 && <p className="text-lg font-semibold">Event Details</p>}
              {step === 3 && <p className="text-lg font-semibold">Services & Description</p>}
              {step === 4 && <p className="text-lg font-semibold">Review & Submit</p>}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-lg space-y-6">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Company/Organization</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Event Date *</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Event Time *</label>
                    <input
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Venue Name *</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="Venue name or address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Expected Attendees *</label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="Number of attendees"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Services & Description */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium">Select Services *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center space-x-3 p-3 border border-border rounded cursor-pointer hover:bg-accent/5 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-5 h-5 accent-accent rounded"
                        />
                        <span className="text-sm">{service.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Event Description *</label>
                  <textarea
                    name="eventDescription"
                    value={formData.eventDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="Tell us about your event, theme, vision, and any specific requirements..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Special Requirements</label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                    placeholder="Any special requests or additional details..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Budget (Optional)</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="Provide a budget or leave blank"
                    className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Attachments</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors">
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Upload venue floor plan, mood boards, or references</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, images up to 10MB</p>
                    </label>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.attachments.map((file, idx) => (
                        <p key={idx} className="text-xs text-accent">
                          {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-accent/5 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60">Contact</p>
                    <p className="font-medium">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {formData.email} • {formData.phone}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-foreground/60">Event</p>
                    <p className="font-medium">
                      {new Date(formData.eventDate).toLocaleDateString()} at {formData.eventTime}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {formData.venue}, {formData.city}
                    </p>
                    <p className="text-sm text-foreground/70">{formData.attendees} attendees</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-foreground/60">Services</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return (
                          <span
                            key={serviceId}
                            className="bg-accent/20 text-accent px-3 py-1 rounded text-xs font-medium"
                          >
                            {service?.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    By submitting this request, you agree to our terms and privacy policy. We'll send you a custom
                    quotation within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-border">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-3 border-2 border-border text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors"
              >
                Previous
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center"
                >
                  Next <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center"
                >
                  Submit Request <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
