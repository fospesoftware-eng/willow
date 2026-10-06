"use client";

import { usePathname } from "@/lib/next/navigation";
import { SiteHeader, type HeaderLake } from "@/components/navigation/SiteHeader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export function SiteChrome({
  children,
  footer,
  notice,
  lakes = [],
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  notice?: React.ReactNode;
  lakes?: HeaderLake[];
}) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin");

  if (bare) {
    return <div className="min-h-full bg-cream">{children}</div>;
  }

  return (
    <>
      <ScrollProgress />
      <SiteHeader lakes={lakes} />
      <main className="flex-1">{children}</main>
      {footer}
      {notice}
    </>
  );
}
