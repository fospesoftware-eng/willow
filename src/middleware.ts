import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLISHABLE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Refreshes the Supabase auth session cookies on every request so Server
 * Components and Route Handlers always see a valid session.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!URL || !PUBLISHABLE) return response;

  const sb = createServerClient(URL, PUBLISHABLE, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await sb.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and image files
    "/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
