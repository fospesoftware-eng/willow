import type { Metadata } from "@/lib/next/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { SafetyContent } from "@/components/safety/SafetyContent";
import { getPage, pageMetadata } from "@/lib/store/pages";
import { heroProps } from "@/lib/cms/render";



export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("health-safety"), "/health-safety");
}

export default async function HealthSafetyPage() {
  const page = await getPage("health-safety");
  return (
    <>
      <PageHero {...heroProps(page.content.hero as never)} />
      <SafetyContent c={page.content as never} />
    </>
  );
}
