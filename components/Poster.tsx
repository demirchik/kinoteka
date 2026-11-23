"use client";
import { useState } from "react";
export default function Poster({
  src,
  title,
}: {
  src: string | null;
  title: string;
}) {
  const [failed, setFailed] = useState("");
  return src && src !== failed ? (
    // biome-ignore lint/performance/noImgElement: Offline posters and optional TMDB images load directly and fall back on error.
    <img
      src={src}
      alt={"Постер фильма «" + title + "»"}
      onError={() => setFailed(src)}
    />
  ) : (
    <div role="img" className="placeholder" aria-label="Постер отсутствует">
      ◧
    </div>
  );
}
