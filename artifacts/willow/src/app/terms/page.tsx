import type { Metadata } from "@/lib/next/metadata";
import { LegalContent } from "@/components/legal/LegalContent";
import { getPage, pageMetadata } from "@/lib/store/pages";



export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("terms"), "/terms");
}

export default async function TermsPage() {
  const page = await getPage("terms");
  return <LegalContent data={page.content as never} />;
}
