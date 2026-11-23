import MovieForm from "@/components/MovieForm";
import { requireViewer } from "@/lib/auth";
import type { Search } from "@/lib/catalog";
export default async function Create({ searchParams }: Search) {
  await requireViewer();
  return <MovieForm error={(await searchParams).error} />;
}
