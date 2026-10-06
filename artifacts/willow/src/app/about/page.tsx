import type { Metadata } from "@/lib/next/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { AboutContent } from "@/components/about/AboutContent";
import { getPage, pageMetadata } from "@/lib/store/pages";
import { heroProps } from "@/lib/cms/render";



export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("about"), "/about");
}

export default async function AboutPage() {
  const page = await getPage("about");
  return (
    <>
      <PageHero {...heroProps(page.content.hero as never)} />
      <AboutContent c={page.content as never} />
    </>
  );
}
