import { useLocation } from "wouter";

export class NotFoundSignal extends Error {
  constructor() {
    super("PAGE_NOT_FOUND");
  }
}
export function notFound(): never {
  throw new NotFoundSignal();
}
export function usePathname(): string {
  return useLocation()[0];
}
export function useRouter() {
  const [, nav] = useLocation();
  return {
    push: (to: string) => nav(to),
    replace: (to: string) => nav(to, { replace: true }),
    refresh: () => {},
    back: () => window.history.back(),
  };
}
