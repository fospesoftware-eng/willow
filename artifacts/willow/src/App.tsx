import { useEffect } from "react";
import { Router as WouterRouter, useLocation } from "wouter";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { NoticeBanner } from "@/components/layout/NoticeBanner";
import { getLakes, getSettingsSync } from "@/lib/store/content";
import { getBootstrap } from "@/lib/store/bootstrap";
import { AppRoutes } from "@/routes";

function Shell() {
  const [loc] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc]);
  const settings = getSettingsSync();
  const lakes = (getBootstrap().lakes ?? null) as Awaited<ReturnType<typeof getLakes>> | null;
  return (
    <SiteChrome
      lakes={(lakes ?? STATIC_LAKES()).map((l) => ({ name: l.name, href: `/lakes/${l.slug}` }))}
      footer={<SiteFooter settings={settings} />}
      notice={<NoticeBanner enabled={settings.noticeEnabled} text={settings.noticeText} />}
    >
      <AppRoutes />
    </SiteChrome>
  );
}

import { lakes as staticLakes } from "@/data/site";
const STATIC_LAKES = () => staticLakes;

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Shell />
    </WouterRouter>
  );
}

export default App;
