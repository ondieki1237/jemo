"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CreditCard, Smartphone, Check } from "lucide-react"

interface PaymentDetails {
  invoiceId: string
  amount: number
  clientName: string
  dueDate: string
}

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "mpesa" | null>(null)
  const [step, setStep] = useState<"method" | "processing" | "success">("method")

  // Mock invoice data - in reality, this would come from URL params or API
  const mockInvoice: PaymentDetails = {
    invoiceId: "INV-001-2025",
    amount: 58000,
    clientName: "Jane Smith",
    dueDate: "2025-02-10",
  }

  const handleStripePayment = () => {
    setPaymentMethod("stripe")
    setStep("processing")
    // In production, integrate with Stripe API
    setTimeout(() => setStep("success"), 2000)
  }

  const handleMpesaPayment = () => {
    setPaymentMethod("mpesa")
    setStep("processing")
    // In production, integrate with M-Pesa API
    setTimeout(() => setStep("success"), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 pt-32 pb-20 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Invoice Summary */}
          <div className="mb-12 bg-card border border-border rounded-lg p-8">
            <h1 className="font-serif text-3xl font-bold mb-6">Complete Payment</h1>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-foreground/60">Invoice ID</span>
                <span className="font-bold text-accent">{mockInvoice.invoiceId}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-foreground/60">Client</span>
                <span className="font-bold">{mockInvoice.clientName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-foreground/60">Due Date</span>
                <span className="font-bold">{new Date(mockInvoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-4 bg-accent/10 px-4 rounded-lg">
                <span className="font-serif font-bold text-lg">Total Amount</span>
                <span className="font-serif font-bold text-2xl text-accent">
                  KES {mockInvoice.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {step === "method" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold">Select Payment Method</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stripe */}
                <button
                  onClick={handleStripePayment}
                  className="p-6 border-2 border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-8 h-8 text-accent" />
                    <span className="text-xs font-semibold text-accent">Recommended</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Stripe</h3>
                    <p className="text-sm text-foreground/60">Credit Card, Debit Card</p>
                  </div>
                  <p className="text-xs text-foreground/50">Secure payment via Stripe</p>
                </button>

                {/* M-Pesa */}
                <button
                  onClick={handleMpesaPayment}
                  className="p-6 border-2 border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left space-y-4"
                >
                  <div className="flex items-center">
                    <Smartphone className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">M-Pesa</h3>
                    <p className="text-sm text-foreground/60">Mobile Money</p>
                  </div>
                  <p className="text-xs text-foreground/50">Pay via M-Pesa prompt</p>
                </button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                <p className="font-semibold mb-2">Secure Payment</p>
                <p>All payments are processed securely. Your payment information is encrypted and protected.</p>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin">
                  <CreditCard className="w-12 h-12 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold mb-2">Processing Payment</h2>
                <p className="text-foreground/60">
                  {paymentMethod === "stripe" ? "Redirecting to Stripe..." : "Sending M-Pesa prompt..."}
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-green-600 mb-2">Payment Successful</h2>
                <p className="text-foreground/60 mb-4">
                  Your payment of KES {mockInvoice.amount.toLocaleString()} has been received.
                </p>
                <p className="text-sm text-foreground/50 mb-6">A receipt has been sent to your email address.</p>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Invoice ID</span>
                  <span className="font-bold">{mockInvoice.invoiceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Payment Method</span>
                  <span className="font-bold capitalize">{paymentMethod}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Amount Paid</span>
                  <span className="text-accent">KES {mockInvoice.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/"
                  className="px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors text-center"
                >
                  Return to Home
                </a>
                <a
                  href="/quote-status"
                  className="px-6 py-3 border-2 border-border font-semibold hover:bg-secondary/5 transition-colors text-center"
                >
                  View Quote Status
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
