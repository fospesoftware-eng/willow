import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
import { getPage, pageMetadata } from "@/lib/store/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("terms"), "/terms");
}

export default async function TermsPage() {
  const page = await getPage("terms");
  return <LegalContent data={page.content as never} />;
}
