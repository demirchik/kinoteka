import { db } from "./db";
import { notFound } from "next/navigation";
export type Route = { params: Promise<{ id: string }> };
export type Search = {
  searchParams: Promise<{ q?: string; source?: string; error?: string }>;
};
export function numericId(value: string) {
  const id = Number(value);
  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(id) ||
    id < 1 ||
    id > 2147483647
  )
    notFound();
  return id;
}
export async function localMovie(id: number) {
  const film = await db.movie.findUnique({
    where: { id },
    include: { reviews: { orderBy: { id: "desc" } } },
  });
  if (!film) notFound();
  return film;
}
export async function localCatalog(query: string) {
  const films = await db.movie.findMany({
    orderBy: { id: "asc" },
    include: { reviews: { select: { rating: true } } },
  });
  const term = query.trim().toLocaleLowerCase("ru");
  return films.filter((m) => m.title.toLocaleLowerCase("ru").includes(term));
}
