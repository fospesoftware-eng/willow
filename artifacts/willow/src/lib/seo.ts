import type { Metadata } from "@/lib/next/metadata";
import { getSettingsSync } from "@/lib/store/content";
import { absoluteUrl } from "@/lib/store/pages";

export function getDefaultMetadata(): Metadata {
  const s = getSettingsSync();
  const og = absoluteUrl(s.seoOgImage);
  return {
    title: { default: s.seoTitle, template: "%s · Willow Garth Country Park" },
    description: s.seoDescription,
    keywords: [
      "Willow Garth Country Park",
      "country park Doncaster",
      "fishing Doncaster",
      "fishing lakes Doncaster",
      "sauna Doncaster",
      "cold water swimming Doncaster",
      "sauna and dip Doncaster",
      "events Doncaster",
      "Arksey Doncaster",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: "https://willowgarthcountrypark.co.uk",
      siteName: "Willow Garth Country Park",
      title: s.seoTitle,
      description: s.seoDescription,
      ...(og ? { images: [{ url: og, width: 1200, height: 630, alt: s.seoTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle,
      description: s.seoDescription,
      ...(og ? { images: [og] } : {}),
    },
  };
}
