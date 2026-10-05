import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MapPanel } from "@/components/home/MapPanel";
import { CTASection } from "@/components/home/CTASection";
import { WillowLakeShowcase } from "@/components/lakes/willow/WillowLakeShowcase";
import { getLake } from "@/lib/store/content";
import { entityMetadata } from "@/lib/store/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const lake = await getLake("willow");
  if (!lake) return { title: "Willow Lake — Willow Garth Country Park" };
  return entityMetadata(
    "/lakes/willow",
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

export default async function WillowLakePage() {
  const lake = await getLake("willow");
  if (!lake) return null;

  return (
    <>
      <PageHero
        variant="cinematic"
        eyebrow="Lake 01 · Pleasure & Match Fishing"
        title="Willow Lake"
        accent="pleasure & matches."
        subtitle="Our match lake is stocked with seven coarse species and welcomes pleasure anglers, matches and junior coaching — with night fishing, wild camping and motorhome pitches steps from the water."
        image="/images/willow-lake-full.jpg"
        imageAlt="Anglers fishing a misty Willow Lake at Willow Garth Country Park"
        imagePosition="center 65%"
        chips={[
          "Pleasure & match fishing",
          "Carp · Tench · Bream & more",
          "£10 day · £20 night",
          "Camping & motorhome pitches",
        ]}
        cta={{
          label: lake.bookingLabel ?? "Book on Swimbooker",
          href: lake.bookingUrl ?? "#",
          external: true,
        }}
        secondaryCta={{ label: "Explore All Lakes", href: "/lakes" }}
      />
      <WillowLakeShowcase lake={lake} />
      <MapPanel />
      <CTASection />
    </>
  );
}
