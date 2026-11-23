import Link from "next/link";
import type { Metadata } from "next";
import { viewer } from "@/lib/auth";
import { logout } from "./account";
import "./globals.css";
export const metadata: Metadata = {
  title: "Кинотека · Каталог фильмов",
  description: "Коллекция фильмов и зрительских отзывов",
};
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const author = await viewer();
  return (
    <html lang="ru">
      <body>
        <header>
          <nav className="wrap nav">
            <Link href="/" className="brand">
              <i aria-hidden="true">◧</i> Кинотека
            </Link>
            <span className="grow" />
            {author ? (
              <>
                <Link href="/movies/new">Добавить фильм</Link>
                <form action={logout}>
                  <button type="submit" className="pill">Выйти · {author}</button>
                </form>
              </>
            ) : (
              <Link className="pill" href="/login">
                Войти
              </Link>
            )}
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="wrap">
          Кинотека <span>Учебный каталог · УП.01</span>
        </footer>
      </body>
    </html>
  );
}
