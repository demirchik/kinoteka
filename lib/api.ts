import { viewer } from "./auth";
export async function authorizeWrite(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    return Response.json({ error: "Недопустимый источник" }, { status: 403 });
  if (!(await viewer()))
    return Response.json({ error: "Требуется вход" }, { status: 401 });
  return null;
}
export const invalidMovie = () =>
  Response.json(
    { error: "Проверьте название, жанр, год и описание" },
    { status: 400 },
  );
export const missingMovie = () =>
  Response.json({ error: "Фильм не найден" }, { status: 404 });
