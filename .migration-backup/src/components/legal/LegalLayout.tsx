import type { ReactNode } from "react";
import Link from "next/link";
import { contact } from "@/data/site";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Link
          href="/"
          className="text-[12px] uppercase tracking-[0.18em] text-forest-600 hover:text-forest-900"
        >
          ← Back to Willow Garth
        </Link>
        <h1 className="mt-8 font-serif text-4xl md:text-5xl text-forest-900 leading-tight">
          {title}
        </h1>
        {updated && (
          <p className="mt-3 text-sm text-forest-600">Last updated: {updated}</p>
        )}
        <div className="mt-10 space-y-8 text-forest-800 leading-relaxed">
          {children}
        </div>
        <div className="mt-16 p-6 bg-gold/10 border-l-4 border-gold">
          <p className="text-sm text-earth-700">
            Questions about this policy? Contact us at{" "}
            <a
              href={contact.general.emailHref}
              className="font-medium underline"
            >
              {contact.general.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
