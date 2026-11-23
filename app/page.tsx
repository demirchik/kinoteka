import Link from "next/link";
import { discover } from "@/lib/tmdb";
import { localCatalog, type Search } from "@/lib/catalog";
import Poster from "@/components/Poster";
export default async function Catalog({ searchParams }: Search) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const remote = params.source === "tmdb";
  const local = await localCatalog(q);
  const external = remote ? await discover(q) : null;
  const cards = external
    ? external.map((m) => ({ ...m, href: "/tmdb/" + m.tmdbId, score: "" }))
    : local.map((m) => ({
        ...m,
        href: "/movies/" + m.id,
        score: m.reviews.length
          ? (
              m.reviews.reduce((sum, r) => sum + r.rating, 0) / m.reviews.length
            ).toFixed(1)
          : "",
      }));
  const feature = !q && !remote ? local[0] : null;
  const suffix = q ? "&q=" + encodeURIComponent(q) : "";
  return (
    <>
      {feature && (
        <section className="hero">
          <div className="heroart">
            <Poster src={feature.poster} title={feature.title} />
          </div>
          <div className="heroText">
            <p className="eyebrow">Фильм коллекции</p>
            <h1>{feature.title}</h1>
            <p>{feature.summary}</p>
            <Link className="primary" href={"/movies/" + feature.id}>
              О фильме
            </Link>
          </div>
        </section>
      )}
      <section className="catalog">
        <div className="toolbar">
          <h2>Каталог фильмов</h2>
          <form className="search">
            <input
              type="hidden"
              name="source"
              value={remote ? "tmdb" : "local"}
            />
            <input
              aria-label="Название фильма"
              name="q"
              defaultValue={q}
              maxLength={200}
              placeholder="Название фильма"
            />
            <button type="submit">Найти</button>
          </form>
        </div>
        <nav className="tabs" aria-label="Источник фильмов">
          <Link
            aria-current={!remote ? "page" : undefined}
            href={"/?source=local" + suffix}
          >
            Коллекция
          </Link>
          <Link
            aria-current={remote ? "page" : undefined}
            href={"/?source=tmdb" + suffix}
          >
            TMDB
          </Link>
        </nav>
        {remote && !external && (
          <output className="notice">
            TMDB недоступен. Показаны фильмы из локальной коллекции.
          </output>
        )}
        <div className="gridfilms">
          {cards.map((m) => (
            <Link className="film" href={m.href} key={m.href}>
              <div className="cover">
                <Poster src={m.poster} title={m.title} />
                {m.score && <b className="score">★ {m.score}</b>}
              </div>
              <h3>{m.title}</h3>
              <p>{[m.year, m.genre].filter(Boolean).join(" · ")}</p>
            </Link>
          ))}
        </div>
        {!cards.length && (
          <p className="notice">
            Фильмов не найдено. Попробуйте другое название.
          </p>
        )}
      </section>
    </>
  );
}
