import type { Movie } from "@prisma/client";
import { saveMovie, removeMovie } from "@/app/movies/actions";
import Link from "next/link";
export default function MovieForm({
  movie,
  error,
}: {
  movie?: Movie;
  error?: string;
}) {
  return (
    <section className="sheet">
      <Link href={movie ? "/movies/" + movie.id : "/"}>‹ Назад</Link>
      <h1>{movie ? "Редактировать фильм" : "Новый фильм"}</h1>
      {error && (
        <p role="alert" className="notice">
          Проверьте название, жанр, описание и год (1888–2100).
        </p>
      )}
      <form className="stack" action={saveMovie.bind(null, movie?.id ?? null)}>
        <label>
          Название
          <input
            name="title"
            required
            maxLength={200}
            defaultValue={movie?.title}
          />
        </label>
        <label>
          Год выпуска
          <input
            name="year"
            type="number"
            min={1888}
            max={2100}
            defaultValue={movie?.year ?? ""}
          />
        </label>
        <label>
          Жанр
          <input
            name="genre"
            required
            maxLength={150}
            defaultValue={movie?.genre}
          />
        </label>
        <label>
          Описание
          <textarea
            rows={5}
            name="summary"
            required
            maxLength={5000}
            defaultValue={movie?.summary}
          />
        </label>
        <button className="primary">Сохранить фильм</button>
      </form>
      {movie && (
        <details>
          <summary>Удалить фильм</summary>
          <p>Фильм и все его отзывы будут удалены.</p>
          <form action={removeMovie.bind(null, movie.id)}>
            <button className="danger">Подтвердить удаление</button>
          </form>
        </details>
      )}
    </section>
  );
}
