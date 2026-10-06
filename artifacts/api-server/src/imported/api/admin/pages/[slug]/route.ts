import type { JsonRequest as Request } from "@/native-request";
import { revalidatePath, revalidateTag } from "@/cache";
import { requireAdmin } from "@/imported/lib/auth";
import { getPage, savePage } from "@/imported/lib/store/pages";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { slug } = await params;
  try {
    const page = await getPage(slug);
    return Response.json({ page });
  } catch {
    return Response.json({ error: "Unknown page" }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  try {
    await savePage(slug, {
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      ogImage: body.ogImage,
      content: body.content,
    });
    const path = slug === "home" ? "/" : `/${slug}`;
    revalidatePath(path, "page");
    revalidatePath(path, "layout");
    revalidateTag("site-settings", { expire: 0 });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
