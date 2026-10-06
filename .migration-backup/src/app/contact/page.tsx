import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactContent } from "@/components/contact/ContactContent";
import { getPage, pageMetadata } from "@/lib/store/pages";
import { heroProps } from "@/lib/cms/render";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("contact"), "/contact");
}

export default async function ContactPage() {
  const page = await getPage("contact");
  return (
    <>
      <PageHero {...heroProps(page.content.hero as never)} />
      <ContactContent c={page.content.panel as never} />
    </>
  );
}
