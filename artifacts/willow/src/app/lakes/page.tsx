import type { Metadata } from "@/lib/next/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { LakesShowcase } from "@/components/lakes/LakesShowcase";
import { CTASection } from "@/components/home/CTASection";
import { getLakes } from "@/lib/store/content";

export const metadata: Metadata = {
  title: "The Lakes — Willow, Oak & Pine",
  description:
    "Explore Willow Garth's three lakes: Willow for coarse & match fishing, Oak for specimen carp & predator fishing, and Pine for wood-fired sauna & natural cold-water dip.",
};



export default async function LakesPage() {
  const items = await getLakes();
  return (
    <>
      <PageHero
        variant="split"
        eyebrow="The three lakes"
        title="Three lakes,"
        accent="one escape."
        subtitle="From pleasure angling to specimen carp and cold-water wellness — three distinct waters across six acres of South Yorkshire countryside, each with its own rhythm."
        image="/images/fishing-home.jpg"
        imageAlt="An angler with rod and landing net at a misty Oak Lake, Willow Garth Country Park"
        imagePosition="center 70%"
        chips={["Coarse & Match", "Specimen Carp to 30lb", "Sauna & Plunge"]}
        stat={{ value: "03", label: "Distinct lakes" }}
        cta={{ label: "Make a Booking", href: "/book" }}
        secondaryCta={{ label: "Plan Your Visit", href: "/contact" }}
      />
      <LakesShowcase items={items} />
      <CTASection />
    </>
  );
}
