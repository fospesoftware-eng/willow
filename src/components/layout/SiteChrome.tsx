"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export function SiteChrome({
  children,
  footer,
  notice,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  notice?: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin");

  if (bare) {
    return <div className="min-h-full bg-cream">{children}</div>;
  }

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {footer}
      {notice}
    </>
  );
}
