"use server";
import { redirect } from "next/navigation";
import { demoAccounts, startSession, endSession } from "@/lib/auth";

export async function login(form: FormData) {
  const account = demoAccounts.find(a => a.login === form.get("login") && a.password === form.get("password"));
  if (!account) redirect("/login?error=1");
  await startSession(account.author);
  redirect("/");
}
export async function logout() {
  await endSession();
  redirect("/");
}
