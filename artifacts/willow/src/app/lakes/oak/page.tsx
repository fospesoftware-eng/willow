import type { Metadata } from "@/lib/next/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { CTASection } from "@/components/home/CTASection";
import { OakLakeShowcase } from "@/components/lakes/oak/OakLakeShowcase";
import { getLake } from "@/lib/store/content";
import { entityMetadata } from "@/lib/store/pages";



export async function generateMetadata(): Promise<Metadata> {
  const lake = await getLake("oak");
  if (!lake) return { title: "Oak Lake — Willow Garth Country Park" };
  return entityMetadata(
    "/lakes/oak",
    `${lake.name} — ${lake.tagline}`,
    lake.description,
    {
      seoTitle: lake.seoTitle,
      seoDescription: lake.seoDescription,
      ogImage: lake.ogImage,
      fallbackImage: lake.image,
    }
  );
}

export default async function OakLakePage() {
  const lake = await getLake("oak");
  if (!lake) return null;

  return (
    <>
      <PageHero
        variant="cinematic"
        eyebrow="Lake 02 · Carp & Predator Fishing"
        title="Oak Lake"
        accent="carp & predator."
        subtitle="Our specimen water holds Common, Leather and Mirror carp to 30lb alongside pike to 28lb — a dedicated destination for anglers chasing big, careful fish. Remedial works continue on the outer pegs, with pegs 1–4 fishing beautifully right now."
        image="/images/boat-bg.jpg"
        imageAlt="Misty dawn across Oak Lake at Willow Garth Country Park"
        imagePosition="center"
        chips={[
          "Specimen carp to 30lb",
          "Pike to 28lb",
          "Pegs 1–4 now open",
          "Full reopening November 2026",
        ]}
        cta={{
          label: lake.bookingLabel ?? "Book on Swimbooker",
          href: lake.bookingUrl ?? "#",
          external: true,
        }}
        secondaryCta={{ label: "Explore All Lakes", href: "/lakes" }}
      />
      <OakLakeShowcase lake={lake} />
      <CTASection />
    </>
  );
}
