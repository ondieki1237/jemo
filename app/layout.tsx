import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Boom Audio Visuals - Kisumu & Nationwide AV Services",
  description:
    "Boom Audio Visuals — professional audio-visual production based in Kisumu, Kenya. Sound systems, lighting, staging, and full event production across all Kenyan counties.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/boom-icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/boom-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: "/boom-icon-180.png",
    shortcut: "/boom-icon-32.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect + non-blocking font load for Google Fonts to reduce render blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Load Google Fonts (preconnect + stylesheet). Avoid passing event handlers from a Server Component. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {/* Main landmark to satisfy accessibility Lighthouse check */}
        <main id="content" className="min-h-screen">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
