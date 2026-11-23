import { login } from "../account";
import { demoAccounts, viewer } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Search } from "@/lib/catalog";
export default async function Login({ searchParams }: Search) {
  if (await viewer()) redirect("/");
  return (
    <section className="sheet">
      <p className="eyebrow">Кинотека</p>
      <h1>Вход</h1>
      {(await searchParams).error && (
        <p role="alert" className="notice">
          Проверьте логин и пароль.
        </p>
      )}
      <form className="stack" action={login}>
        <label>
          Логин
          <input required autoComplete="username" name="login" />
        </label>
        <label>
          Пароль
          <input
            required
            type="password"
            autoComplete="current-password"
            name="password"
          />
        </label>
        <button className="primary">Войти</button>
      </form>
      <details open>
        <summary>Учебные аккаунты</summary>
        {demoAccounts.map((a) => (
          <p key={a.login}>
            {a.author} ·{" "}
            <code>
              {a.login} / {a.password}
            </code>
          </p>
        ))}
      </details>
    </section>
  );
}
