import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
import { getPage, pageMetadata } from "@/lib/store/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("cookies"), "/cookies");
}

export default async function CookiesPage() {
  const page = await getPage("cookies");
  return <LegalContent data={page.content as never} />;
}
