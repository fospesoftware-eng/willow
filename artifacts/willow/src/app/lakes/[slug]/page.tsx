import type { Metadata } from "@/lib/next/metadata";
import { notFound } from "@/lib/next/navigation";
import { lakes } from "@/data/site";
import { getLake } from "@/lib/store/content";
import { entityMetadata } from "@/lib/store/pages";
import { LakeDetail } from "@/components/lakes/LakeDetail";
import { CTASection } from "@/components/home/CTASection";




export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lake = await getLake(slug);
  if (!lake) return { title: "Lake not found" };
  return entityMetadata(
    `/lakes/${slug}`,
    `${lake.name} — ${lake.tagline}`,
    lake.description,
    {
      seoTitle: lake.seoTitle,
      seoDescription: lake.seoDescription,
      ogImage: lake.ogImage,
      fallbackImage: lake.image,
    }
  );
}

export default async function LakePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lake = await getLake(slug);
  if (!lake) notFound();
  return (
    <>
      <LakeDetail lake={lake} />
      <CTASection />
    </>
  );
}
