import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CTASection } from "@/components/home/CTASection";
import { PineLakeShowcase } from "@/components/lakes/pine/PineLakeShowcase";
import { getLake } from "@/lib/store/content";
import { entityMetadata } from "@/lib/store/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const lake = await getLake("pine");
  if (!lake) return { title: "Pine Lake — Willow Garth Country Park" };
  return entityMetadata(
    "/lakes/pine",
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

export default async function PineLakePage() {
  const lake = await getLake("pine");
  if (!lake) return null;

  return (
    <>
      <PageHero
        variant="cinematic"
        eyebrow="Lake 03 · Sauna & Plunge Lake"
        title="Pine Lake"
        accent="sauna & plunge."
        subtitle="Hot wood-fired sauna or a bracing natural plunge — we have it all. Pine Lake is our wellness water, with a barrel sauna on its own jetty, open-water bathing seven days a week and membership passes for regular dippers."
        image="/images/sauna-whatsapp.jpeg"
        imageAlt="The Geo-dome and wood-fired barrel sauna beside Pine Lake at Willow Garth Country Park"
        imagePosition="center 60%"
        chips={[
          "Sauna & plunge £10 · plunge only £5",
          "Bathing 7am–7pm · seven days",
          "Sauna Thursday · Saturday · Sunday",
          "Weekly £20 · monthly £60",
        ]}
        cta={{
          label: "Book Now",
          href: "/book/sauna",
          external: false,
        }}
        secondaryCta={{ label: "Explore All Lakes", href: "/lakes" }}
      />
      <PineLakeShowcase lake={lake} />
      <CTASection />
    </>
  );
}
