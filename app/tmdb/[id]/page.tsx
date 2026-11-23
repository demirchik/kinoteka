import Link from "next/link";
import { redirect } from "next/navigation";
import { numericId, type Route } from "@/lib/catalog";
import { db } from "@/lib/db";
import { viewer } from "@/lib/auth";
import { tmdbMovie } from "@/lib/tmdb";
import { importMovie } from "@/app/movies/actions";
import FilmDetail from "@/components/FilmDetail";
export default async function Remote({ params }: Route) {
  const id = numericId((await params).id);
  const local = await db.movie.findUnique({ where: { tmdbId: id } });
  if (local) redirect("/movies/" + local.id);
  const movie = await tmdbMovie(id);
  if (!movie)
    return (
      <section className="sheet">
        <h1>Карточка TMDB недоступна</h1>
        <p>Проверьте подключение или выберите сохранённый фильм.</p>
        <Link className="pill" href="/">
          Открыть коллекцию
        </Link>
      </section>
    );
  return (
    <FilmDetail movie={movie}>
      {(await viewer()) ? (
        <form action={importMovie.bind(null, id)}>
          <button type="submit" className="primary">Сохранить в коллекцию</button>
        </form>
      ) : (
        <Link className="pill" href="/login">
          Войти для сохранения
        </Link>
      )}
    </FilmDetail>
  );
}
