import Link from "next/link";
import FilmDetail from "@/components/FilmDetail";
import { numericId, localMovie, type Route, type Search } from "@/lib/catalog";
import { viewer } from "@/lib/auth";
import { saveReview, removeReview } from "../actions";
export default async function Detail({params,searchParams}: Route & Search) {
  const id = numericId((await params).id);
  const movie = await localMovie(id), author = await viewer();
  const mine = movie.reviews.find(r => r.author === author);
  return <><FilmDetail movie={movie}>{author && <Link className="pill" href={"/movies/"+id+"/edit"}>Редактировать фильм</Link>}</FilmDetail>
    <section className="reviews" id="reviews"><h2>Отзывы <small>{movie.reviews.length}</small></h2>
    {movie.reviews.map(r => <article key={r.id}><strong>{r.author}</strong><span className="rating">★ {r.rating}/10</span><p>{r.body}</p></article>)}
    {!movie.reviews.length && <p>У этого фильма пока нет отзывов.</p>}
    {author ? <div id="review"><h3>{mine ? "Редактировать свой отзыв" : "Оставить отзыв"}</h3>{(await searchParams).error && <p role="alert">Введите текст отзыва и оценку от 1 до 10.</p>}
    <form action={saveReview.bind(null,id)} className="stack"><label>Ваша оценка<select name="rating" defaultValue={mine?.rating ?? 8}>{Array.from({length:10},(_,i)=><option key={i}>{i+1}</option>)}</select></label>
    <label>Текст отзыва<textarea name="body" required maxLength={2000} rows={4} defaultValue={mine?.body}/></label><button className="primary">Сохранить отзыв</button></form>
    {mine && <form action={removeReview.bind(null,id)}><button className="quiet">Удалить свой отзыв</button></form>}</div> : <Link href="/login" className="pill">Войти, чтобы оставить отзыв</Link>}</section></>;
}
