import type { Metadata } from "@/lib/next/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { BookingHub } from "@/components/booking/BookingHub";
import { getPage, pageMetadata } from "@/lib/store/pages";
import { heroProps } from "@/lib/cms/render";



export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("book"), "/book");
}

export default async function BookPage() {
  const page = await getPage("book");
  return (
    <>
      <PageHero {...heroProps(page.content.hero as never)} />
      <BookingHub c={page.content.hub as never} />
    </>
  );
}
