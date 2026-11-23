"use server";
import { redirect, notFound } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { localMovie } from "@/lib/catalog";
import { db } from "@/lib/db";
import { movieInput } from "@/lib/movie-input";
import { tmdbMovie } from "@/lib/tmdb";

function field(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}
export async function saveMovie(id: number | null, form: FormData) {
  await requireViewer();
  const data = movieInput(Object.fromEntries(form));
  if (!data) {
    redirect((id ? "/movies/" + id + "/edit" : "/movies/new") + "?error=1");
  }
  if (id) await localMovie(id);
  const saved = id
    ? await db.movie.update({ where: { id }, data })
    : await db.movie.create({ data });
  redirect("/movies/" + saved.id);
}
export async function removeMovie(id: number) {
  await requireViewer();
  await db.movie.deleteMany({ where: { id } });
  redirect("/");
}
export async function saveReview(movieId: number, form: FormData) {
  const author = await requireViewer();
  await localMovie(movieId);
  const body = field(form, "body"),
    rating = Number(field(form, "rating"));
  if (
    !body ||
    body.length > 2000 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 10
  )
    redirect("/movies/" + movieId + "?error=1#review");
  await db.review.upsert({
    where: { movieId_author: { movieId, author } },
    update: { body, rating },
    create: { movieId, author, body, rating },
  });
  redirect("/movies/" + movieId + "#reviews");
}
export async function removeReview(movieId: number) {
  const author = await requireViewer();
  await db.review.deleteMany({ where: { movieId, author } });
  redirect("/movies/" + movieId + "#reviews");
}
export async function importMovie(tmdbId: number) {
  await requireViewer();
  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) notFound();
  const existing = await db.movie.findUnique({ where: { tmdbId } });
  if (existing) redirect("/movies/" + existing.id);
  const data = await tmdbMovie(tmdbId);
  if (!data) redirect("/tmdb/" + tmdbId + "?error=1");
  const saved = await db.movie.upsert({
    where: { tmdbId },
    update: {},
    create: data,
  });
  redirect("/movies/" + saved.id);
}
