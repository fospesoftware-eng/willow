import { AsyncLocalStorage } from "node:async_hooks";
import type { Request, Response } from "express";

export const requestContext = new AsyncLocalStorage<{ req: Request; res: Response }>();

export async function cookies() {
  const ctx = requestContext.getStore();
  if (!ctx) throw new Error("Cookies require a request context");
  return {
    getAll: () => Object.entries(ctx.req.cookies ?? {}).map(([name, value]) => ({ name, value: String(value) })),
    set: (name: string, value: string, options: Record<string, unknown> = {}) => {
      ctx.req.cookies[name] = value;
      const { maxAge, ...rest } = options;
      ctx.res.cookie(name, value, { ...rest, ...(typeof maxAge === "number" ? { maxAge: maxAge * 1000 } : {}) });
    },
  };
}
