import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { EventsContent } from "@/components/events/EventsContent";
import { getPage, pageMetadata } from "@/lib/store/pages";
import { heroProps } from "@/lib/cms/render";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("events"), "/events");
}

export default async function EventsPage() {
  const page = await getPage("events");
  return (
    <>
      <PageHero {...heroProps(page.content.hero as never)} />
      <EventsContent c={page.content as never} />
    </>
  );
}
