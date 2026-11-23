import { localCatalog } from "@/lib/catalog";
import { movieInput } from "@/lib/movie-input";
import { authorizeWrite, invalidMovie } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  return Response.json(await localCatalog(new URL(req.url).searchParams.get("q") ?? ""));
}
export async function POST(req: Request) {
  const denied = await authorizeWrite(req);
  if (denied) return denied;
  const data = movieInput(await req.json().catch(() => null));
  if (!data) return invalidMovie();
  return Response.json(await db.movie.create({data}), {status:201});
}
