import type { Metadata } from "@/lib/next/metadata";
import { LegalContent } from "@/components/legal/LegalContent";
import { getPage, pageMetadata } from "@/lib/store/pages";



export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("privacy"), "/privacy");
}

export default async function PrivacyPage() {
  const page = await getPage("privacy");
  return <LegalContent data={page.content as never} />;
}
