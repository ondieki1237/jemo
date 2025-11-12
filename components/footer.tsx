import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="neu-flat text-foreground border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Mobile: 2-column grid | Desktop: 4-column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 neu-convex rounded-lg flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-accent">B</span>
              </div>
              <span className="font-serif text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Boom Audio Visuals</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional audio-visual production based in Kisumu — serving all Kenyan counties.
            </p>

            {/* Built by - Mobile & Tablet */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
              <span>Built & managed by</span>
              <Link
                href="https://codewithseth.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[var(--yellow)] transition-colors"
              >
                <Image
                  src="/seth.png"
                  alt="CodeWithSeth Logo"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span className="font-medium">codewithseth.co.ke</span>
                <span className="ml-1 inline-block w-2 h-2 rounded-full bg-[var(--yellow)]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base">Services</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { href: "/services#event-planning", label: "Event Planning" },
                { href: "/services#sound-systems", label: "Sound Systems" },
                { href: "/services#lighting", label: "Stage Lighting" },
                { href: "/services#dj-services", label: "DJ Services" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base">Company</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/gallery", label: "Gallery" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base">Contact</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href="tel:+254742412650"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  +254 742 412650
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href="mailto:boomaudiovisuals254@gmail.com"
                  className="text-muted-foreground hover:text-accent transition-colors break-all"
                >
                  boomaudiovisuals254@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Kisumu, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Bottom Row */}
        <div className="border-t border-border/30 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
            <p>
              &copy; {new Date().getFullYear()} Boom Audio Visuals. All rights reserved. —{" "}
              <Link
                href="https://boomaudiovisuals.co.ke"
                className="hover:text-accent transition-colors"
                target="_blank"
              >
                boomaudiovisuals.co.ke
              </Link>
            </p>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>

            {/* Built by - Desktop */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span>Built & managed by</span>
              <Link
                href="https://www.codewithseth.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[var(--yellow)] transition-colors"
              >
                <Image
                  src="/seth.png"
                  alt="CodeWithSeth Logo"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span className="font-medium">codewithseth.co.ke</span>
                <span className="ml-1 inline-block w-2 h-2 rounded-full bg-[var(--yellow)]" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}