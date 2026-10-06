import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { Statement } from "@/components/home/Statement";
import { FeaturePanel } from "@/components/home/FeaturePanel";
import { Experiences } from "@/components/home/Experiences";
import { LakesShowcase } from "@/components/lakes/LakesShowcase";
import { Faq } from "@/components/home/Faq";
import { MapPanel } from "@/components/home/MapPanel";
import { CTASection } from "@/components/home/CTASection";
import { getExperiences, getLakes } from "@/lib/store/content";
import { getPage, pageMetadata } from "@/lib/store/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("home"), "/");
}

export default async function HomePage() {
  const [page, items, lakes] = await Promise.all([
    getPage("home"),
    getExperiences(),
    getLakes(),
  ]);
  const c = page.content;

  return (
    <>
      <Hero c={c.hero as never} />
      <Statement c={c.statement as never} />
      <FeaturePanel c={c.feature as never} />
      <Experiences items={items} />
      <LakesShowcase items={lakes} />
      <Faq c={c.faq as never} />
      <MapPanel />
      <CTASection c={c.cta as never} />
    </>
  );
}
