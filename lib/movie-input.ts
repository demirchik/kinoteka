export function movieInput(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const fields = raw as Record<string, unknown>;
  function text(key: string) {
    return typeof fields[key] === "string" ? fields[key].trim() : "";
  }
  const title = text("title"), genre = text("genre"), summary = text("summary");
  const input = fields.year;
  if (input != null && typeof input !== "number" && typeof input !== "string") return null;
  const year = input == null || input === "" ? null : Number(input);
  if (!title || title.length > 200 || !genre || genre.length > 150 || !summary || summary.length > 5000) return null;
  if (year !== null && (!Number.isInteger(year) || year < 1888 || year > 2100)) return null;
  return { title, year, genre, summary };
}
