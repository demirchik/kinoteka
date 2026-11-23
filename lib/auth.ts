import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";

export const demoAccounts = [
  { login: "lira", password: "kinolira", author: "Лира" },
  { login: "kadr", password: "kinokadr", author: "Кадр" }
];
const cookieName = "kinoteka_session";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export async function viewer() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { digest: digest(token) } });
  return session && session.expiresAt > new Date() ? session.author : null;
}
export async function requireViewer() {
  return (await viewer()) ?? redirect("/login");
}
export async function startSession(author: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 8 * 3600000);
  await db.session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  await db.session.create({ data: { digest: digest(token), author, expiresAt: expires } });
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", path: "/", expires });
}
export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) await db.session.deleteMany({ where: { digest: digest(token) } });
  jar.delete(cookieName);
}
