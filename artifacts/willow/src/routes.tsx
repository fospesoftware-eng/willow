import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Route, Switch, useSearch } from "wouter";
import { NotFoundSignal } from "@/lib/next/navigation";
import { applyMetadata, type Metadata } from "@/lib/next/metadata";
import { getDefaultMetadata } from "@/lib/seo";
import NotFound from "@/app/not-found";

type Params = Record<string, string>;
type Props = { params: Promise<Params>; searchParams: Promise<Record<string, string>> };
type Mod = {
  default: (p: Props) => unknown;
  generateMetadata?: (p: Props) => Promise<Metadata> | Metadata;
  metadata?: Metadata;
};

function isAsync(fn: unknown) {
  return (fn as { constructor: { name: string } }).constructor.name === "AsyncFunction";
}

function Loader({ mod, params }: { mod: Mod; params: Params }) {
  const search = useSearch();
  const [out, setOut] = useState<{ el?: ReactNode; nf?: boolean; err?: unknown }>({});
  const key = JSON.stringify(params);

  useEffect(() => {
    let off = false;
    const props: Props = {
      params: Promise.resolve(params),
      searchParams: Promise.resolve(Object.fromEntries(new URLSearchParams(search))),
    };
    (async () => {
      try {
        const md = mod.generateMetadata ? await mod.generateMetadata(props) : mod.metadata;
        const el = isAsync(mod.default) ? ((await mod.default(props)) as ReactNode) : undefined;
        if (off) return;
        applyMetadata(md, getDefaultMetadata());
        setOut({ el, nf: false });
      } catch (e) {
        if (off) return;
        if (e instanceof NotFoundSignal) setOut({ nf: true });
        else setOut({ err: e });
      }
    })();
    return () => {
      off = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod, key, search]);

  if (out.err) throw out.err;
  if (out.nf) return <NotFound />;
  if (!isAsync(mod.default)) {
    const C = mod.default as unknown as ComponentType<Props>;
    return <C {...({ params: Promise.resolve(params), searchParams: Promise.resolve({}) } as Props)} />;
  }
  return <>{out.el ?? null}</>;
}

const mk = (mod: Mod) => ({ params }: { params: Params }) => <Loader mod={mod} params={params ?? {}} />;

import * as home from "@/app/page";
import * as about from "@/app/about/page";
import * as adminLogin from "@/app/admin/login/page";
import * as admin from "@/app/admin/page";
import * as book from "@/app/book/page";
import * as saunaCancelled from "@/app/book/sauna/cancelled/page";
import * as saunaConfirmation from "@/app/book/sauna/confirmation/page";
import * as bookSauna from "@/app/book/sauna/page";
import * as bookSwim from "@/app/book/swim/page";
import * as contact from "@/app/contact/page";
import * as cookies from "@/app/cookies/page";
import * as events from "@/app/events/page";
import * as experience from "@/app/experiences/[slug]/page";
import * as experiences from "@/app/experiences/page";
import * as healthSafety from "@/app/health-safety/page";
import * as lake from "@/app/lakes/[slug]/page";
import * as oak from "@/app/lakes/oak/page";
import * as lakes from "@/app/lakes/page";
import * as pine from "@/app/lakes/pine/page";
import * as willow from "@/app/lakes/willow/page";
import * as privacy from "@/app/privacy/page";
import * as sentinal from "@/app/sentinal/page";
import * as terms from "@/app/terms/page";

const table: [string, Mod][] = [
  ["/", home],
  ["/about", about],
  ["/admin/login", adminLogin],
  ["/admin", admin],
  ["/book", book],
  ["/book/sauna/cancelled", saunaCancelled],
  ["/book/sauna/confirmation", saunaConfirmation],
  ["/book/sauna", bookSauna],
  ["/book/swim", bookSwim],
  ["/contact", contact],
  ["/cookies", cookies],
  ["/events", events],
  ["/experiences", experiences],
  ["/experiences/:slug", experience],
  ["/health-safety", healthSafety],
  ["/lakes", lakes],
  ["/lakes/oak", oak],
  ["/lakes/pine", pine],
  ["/lakes/willow", willow],
  ["/lakes/:slug", lake],
  ["/privacy", privacy],
  ["/sentinal", sentinal],
  ["/terms", terms],
] as unknown as [string, Mod][];

const comps = table.map(([path, m]) => [path, mk(m)] as const);

export function AppRoutes() {
  return (
    <Switch>
      {comps.map(([path, C]) => (
        <Route key={path} path={path} component={C} />
      ))}
      <Route component={NotFoundRoute} />
    </Switch>
  );
}

function NotFoundRoute() {
  useEffect(() => {
    applyMetadata({ title: { absolute: "Page not found · Willow Garth Country Park" } });
  }, []);
  return <NotFound />;
}
