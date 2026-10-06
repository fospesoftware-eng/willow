import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Experiences } from "@/components/home/Experiences";
import { CTASection } from "@/components/home/CTASection";
import { getExperiences } from "@/lib/store/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Experiences · Fishing, Sauna & Dip, Camping & Events",
  description:
    "Discover everything to do at Willow Garth Country Park — pleasure and specimen fishing, wood-fired sauna & cold-water plunge, wild camping and lakeside events.",
  alternates: { canonical: "/experiences" },
};

export default async function ExperiencesIndexPage() {
  const items = await getExperiences();
  return (
    <>
      <PageHero
        variant="cinematic"
        eyebrow="What we offer"
        title="Experiences"
        accent="at Willow Garth."
        subtitle="From dawn fishing on a misty lake to the clarity of a cold-water plunge, a night under canvas or a gathering in the Geo-dome — four ways to spend your day (or night) with us."
        image="/images/sauna-home.jpg"
        imageAlt="Sauna and natural dip lake at Willow Garth Country Park"
        chips={["Fishing three lakes", "Sauna & cold plunge", "Wild camping", "Events & retreats"]}
        cta={{ label: "Make a Booking", href: "/book" }}
        secondaryCta={{ label: "Plan Your Visit", href: "/contact" }}
      />
      <Experiences
        items={items}
        anchor={false}
        eyebrow="Four ways to unwind"
        title="Pick your"
        accent="kind of escape."
        intro="Angling, wellness, overnight stays and gatherings — every experience is rooted in these six quiet acres of South Yorkshire countryside."
      />
      <CTASection />
    </>
  );
}
