import { db } from "@/lib/db";
import { authorizeWrite, missingMovie, invalidMovie } from "@/lib/api";
import { movieInput } from "@/lib/movie-input";
import type { Route } from "@/lib/catalog";
async function idOf(route: Route) {
  const { id } = await route.params;
  return /^\d+$/.test(id) && Number(id) <= 2147483647 ? Number(id) : 0;
}
export async function GET(_: Request, route: Route) {
  const film = await db.movie.findUnique({
    where: { id: await idOf(route) },
    include: { reviews: true },
  });
  return film ? Response.json(film) : missingMovie();
}
export async function PUT(req: Request, route: Route) {
  const denied = await authorizeWrite(req);
  if (denied) return denied;
  const data = movieInput(await req.json().catch(() => null));
  if (!data) return invalidMovie();
  const updated = await db.movie.updateMany({
    where: { id: await idOf(route) },
    data,
  });
  return updated.count ? new Response(null, { status: 204 }) : missingMovie();
}
export async function DELETE(req: Request, route: Route) {
  const denied = await authorizeWrite(req);
  if (denied) return denied;
  const deleted = await db.movie.deleteMany({
    where: { id: await idOf(route) },
  });
  return deleted.count ? new Response(null, { status: 204 }) : missingMovie();
}
