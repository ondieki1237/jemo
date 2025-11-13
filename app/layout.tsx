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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
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
        {/* Use preload-as-style with onload trick to avoid blocking render */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          onLoad={(e) => {
            // convert the preload to a stylesheet once loaded
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(e.currentTarget as any).rel = 'stylesheet'
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
            rel="stylesheet"
          />
        </noscript>
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
