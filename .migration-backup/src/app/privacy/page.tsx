import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
import { getPage, pageMetadata } from "@/lib/store/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPage("privacy"), "/privacy");
}

export default async function PrivacyPage() {
  const page = await getPage("privacy");
  return <LegalContent data={page.content as never} />;
}
