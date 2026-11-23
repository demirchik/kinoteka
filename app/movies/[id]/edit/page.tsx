import MovieForm from "@/components/MovieForm";
import { requireViewer } from "@/lib/auth";
import { numericId, localMovie, type Route, type Search } from "@/lib/catalog";
export default async function Edit({ params, searchParams }: Route & Search) {
  await requireViewer();
  return <MovieForm movie={await localMovie(numericId((await params).id))} error={(await searchParams).error}/>;
}
