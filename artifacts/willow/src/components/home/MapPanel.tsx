"use client";

import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { contact } from "@/data/site";

export function MapPanel() {
  return (
    <section className="bg-ivory pb-20 md:pb-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-sage-200 shadow-soft min-h-[560px] md:min-h-[640px]">
            {/* Map */}
            <iframe
              title="Willow Garth Country Park location map"
              src="https://www.google.com/maps?q=Marsh+Lane,+Arksey,+Doncaster,+DN5+0SH&output=embed"
              className="absolute inset-0 w-full h-full grayscale-[0.3] sepia-[0.15]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Floating contact card */}
            <div className="absolute top-5 left-5 md:top-10 md:left-10 w-[calc(100%-2.5rem)] sm:w-[400px] rounded-[1.5rem] bg-ivory/95 backdrop-blur-xl p-6 md:p-8 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-forest-600">
                  Contacts
                </span>
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-forest-950">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
              </div>

              <h3 className="font-display font-extrabold text-forest-900 text-2xl leading-tight">
                How to find us
              </h3>

              <address className="not-italic mt-4 space-y-3 text-sm text-forest-700">
                <div>
                  <p className="font-semibold text-forest-900">
                    Willow Garth Country Park
                  </p>
                  <p>{contact.address.line1}</p>
                  <p>{contact.address.line2}</p>
                  <p>{contact.address.postcode}</p>
                </div>
                <div>
                  <a
                    href={contact.phoneHref}
                    className="block hover:text-forest-900"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={contact.general.emailHref}
                    className="block text-forest-600 hover:text-forest-900 break-all"
                  >
                    {contact.general.email}
                  </a>
                </div>
              </address>

              {/* Thumbnails */}
              <div className="mt-6 flex gap-3">
                <span className="relative block w-28 h-20 rounded-xl overflow-hidden">
                  <OptimizedImage
                    src="/images/site-walks.jpg"
                    alt="Woodland site walk at Willow Garth"
                    sizes="112px"
                  />
                </span>
                <span className="relative block w-28 h-20 rounded-xl overflow-hidden">
                  <OptimizedImage
                    src="/images/sauna-home.jpg"
                    alt="Wood-fired barrel sauna at Willow Garth"
                    sizes="112px"
                  />
                </span>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-forest-700/70">
                From Doncaster, head north-east toward Bentley and follow signs
                for Arksey. Turn left after the Church and past Marsh Lane
                Community Centre.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-forest-900 text-ivory pl-5 pr-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-forest-700 transition-colors"
                >
                  Directions
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-ivory/15">
                    →
                  </span>
                </a>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-forest-900/20 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
