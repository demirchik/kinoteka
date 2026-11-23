import Link from "next/link";
export default function Missing() {
  return (
    <section className="sheet">
      <h1>Страница не найдена</h1>
      <Link href="/" className="pill">
        В каталог
      </Link>
    </section>
  );
}
