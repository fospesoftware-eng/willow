import type { Metadata } from "@/lib/next/metadata";
import { notFound } from "@/lib/next/navigation";
import { getExperience } from "@/lib/store/content";
import { entityMetadata } from "@/lib/store/pages";
import { ExperienceDetail } from "@/components/experiences/ExperienceDetail";

type Params = { params: Promise<{ slug: string }> };






export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperience(slug);
  if (!experience) return {};
  return entityMetadata(
    `/experiences/${slug}`,
    `${experience.name} — Willow Garth Country Park`,
    experience.description,
    {
      seoTitle: experience.seoTitle,
      seoDescription: experience.seoDescription,
      ogImage: experience.ogImage,
      fallbackImage: experience.image,
    }
  );
}

export default async function ExperiencePage({ params }: Params) {
  const { slug } = await params;
  const experience = await getExperience(slug);
  if (!experience || experience.slug === "events") notFound();
  return <ExperienceDetail experience={experience} />;
}
