import Link from "@/lib/next/link";
import { contact, footerLinks, site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import type { SiteSettings } from "@/lib/store/content";

export function SiteFooter({ settings }: { settings?: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const phone = settings?.phone ?? contact.phone;
  const phoneHref = settings?.phoneHref ?? contact.phoneHref;
  const whatsappHref = settings?.whatsappHref ?? contact.whatsappHref;
  const address = settings?.address ?? contact.address.full;
  return (
    <footer className="bg-forest-950 text-ivory relative overflow-hidden">
      <div className="grain absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 pt-16 md:pt-20 pb-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-12 md:pb-16 border-b border-ivory/10">
          <div className="max-w-sm">
            <p className="font-serif text-2xl md:text-3xl leading-snug text-ivory">
              Your escape into
              <br />
              <span className="italic text-gold-light">the natural world.</span>
            </p>
          </div>

          {/* Pill nav */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Experiences", href: "/experiences" },
              { label: "Lakes", href: "/lakes" },
              { label: "About", href: "/about" },
              { label: "Events", href: "/events" },
              { label: "Safety", href: "/health-safety" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="rounded-full border border-ivory/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-200 hover:bg-ivory hover:text-forest-950 transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 py-12 md:py-16">
          <div className="col-span-2 md:col-span-4">
            <Link
              href="/"
              aria-label="Willow Garth Country Park — home"
              className="inline-block"
            >
              <Logo variant="white" className="h-20" />
            </Link>
            <p className="mt-4 text-sm text-sage-300 leading-relaxed max-w-xs">
              {site.complex}. Fishing, wellness and events in the South
              Yorkshire countryside.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.heading} className="md:col-span-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.26em] text-gold mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-sage-200 hover:text-ivory transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.26em] text-gold mb-5">
              Visit
            </h3>
            <address className="not-italic text-sm text-sage-200 leading-relaxed whitespace-pre-line">
              {address}
            </address>
            <a
              href={phoneHref}
              className="block mt-4 text-sm text-sage-200 hover:text-ivory transition-colors"
            >
              {phone}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-sm text-sage-200 hover:text-ivory transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="border-t border-ivory/10 pt-10">
          <h2 className="font-display font-extrabold uppercase text-ivory text-[15vw] md:text-[13vw] leading-[0.85] tracking-[-0.03em] text-center select-none">
            Willow Garth
          </h2>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-sage-400">
              © {year} {site.name}. All rights reserved.
            </p>
            <p className="text-[11px] text-sage-400/70">
              Photography © Colin Park, The Angling Trust, W. Carter, Peter
              Barr &amp; Bob Harvey via{" "}
              <a
                href="https://commons.wikimedia.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ivory"
              >
                Wikimedia Commons
              </a>{" "}
              /{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ivory"
              >
                CC BY-SA
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-xs text-sage-400">
            <Link href="/privacy" className="hover:text-ivory transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-ivory transition-colors">
              Cookies
            </Link>
            <Link href="/terms" className="hover:text-ivory transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
