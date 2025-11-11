import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent/20 rounded-sm flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-accent">B</span>
              </div>
              <span className="font-serif text-lg font-bold">Boom Audio Visuals</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional audio-visual production based in Kisumu — serving all Kenyan counties.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#event-planning" className="hover:text-accent transition-colors">
                  Event Planning
                </Link>
              </li>
              <li>
                <Link href="/services#sound-systems" className="hover:text-accent transition-colors">
                  Sound Systems
                </Link>
              </li>
              <li>
                <Link href="/services#lighting" className="hover:text-accent transition-colors">
                  Stage Lighting
                </Link>
              </li>
              <li>
                <Link href="/services#dj-services" className="hover:text-accent transition-colors">
                  DJ Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-accent transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:+254742412650" className="hover:text-accent transition-colors">
                  +254 742 412650
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:boomaudiovisuals254@gmail.com" className="hover:text-accent transition-colors">
                  boomaudiovisuals254@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-accent mt-1" />
                <span>Kisumu, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Boom Audio Visuals. All rights reserved. — boomaudiovisuals.co.ke</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
