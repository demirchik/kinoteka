import Poster from "./Poster";
import Link from "next/link";
type Film = {
  title: string;
  poster: string | null;
  year: number | null;
  genre: string;
  summary: string;
};
export default function FilmDetail({
  movie,
  children,
}: {
  movie: Film;
  children: React.ReactNode;
}) {
  return (
    <>
      <Link className="back" href="/">
        ‹ Каталог фильмов
      </Link>
      <section className="detail">
        <div className="detailCover">
          <Poster src={movie.poster} title={movie.title} />
        </div>
        <div>
          <p className="eyebrow">
            {[movie.year, movie.genre].filter(Boolean).join(" · ")}
          </p>
          <h1>{movie.title}</h1>
          <p className="synopsis">{movie.summary}</p>
          {children}
        </div>
      </section>
    </>
  );
}
