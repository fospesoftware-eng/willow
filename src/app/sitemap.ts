import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const routes = [
    "",
    "/about",
    "/health-safety",
    "/events",
    "/experiences",
    "/lakes",
    "/lakes/willow",
    "/lakes/oak",
    "/lakes/pine",
    "/experiences/fishing",
    "/experiences/sauna-dip",
    "/experiences/camping",
    "/book/sauna",
    "/book/swim",
    "/sentinal",
    "/book",
    "/contact",
    "/privacy",
    "/cookies",
    "/terms",
  ];
  const now = new Date();
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
