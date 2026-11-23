type Json = Record<string, unknown>;
function object(value: unknown): Json {
  return value && typeof value === "object" ? (value as Json) : {};
}
async function request(path: string, query?: string) {
  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (!token) return null;
  const url = new URL("https://api.themoviedb.org/3/" + path);
  url.searchParams.set("language", "ru-RU");
  if (query) url.searchParams.set("query", query);
  try {
    const response = await fetch(url, {
      headers: { Authorization: "Bearer " + token },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    });
    return response.ok ? object(await response.json()) : null;
  } catch {
    return null;
  }
}
function movie(raw: unknown) {
  const data = object(raw);
  if (
    typeof data.id !== "number" ||
    !Number.isSafeInteger(data.id) ||
    data.id < 1 ||
    typeof data.title !== "string" ||
    !data.title.trim()
  )
    return null;
  const year =
    typeof data.release_date === "string"
      ? Number(data.release_date.slice(0, 4)) || null
      : null;
  const genres = Array.isArray(data.genres)
    ? data.genres
        .map((g) => object(g).name)
        .filter((g) => typeof g === "string")
    : [];
  return {
    tmdbId: data.id,
    title: data.title,
    year,
    genre: genres.join(", ") || "Кино",
    summary:
      (typeof data.overview === "string" && data.overview.trim()) ||
      "Описание пока не добавлено.",
    poster:
      typeof data.poster_path === "string" &&
      /^\/[\w.-]+$/.test(data.poster_path)
        ? "https://image.tmdb.org/t/p/w500" + data.poster_path
        : null,
  };
}
export async function discover(query: string) {
  const data = await request(query ? "search/movie" : "movie/popular", query);
  if (!Array.isArray(data?.results)) return null;
  return data.results.map(movie).filter((m) => m !== null);
}
export async function tmdbMovie(id: number) {
  return movie(await request("movie/" + id));
}
