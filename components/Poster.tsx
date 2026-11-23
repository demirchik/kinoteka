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
    <img
      src={src}
      alt={"Постер фильма «" + title + "»"}
      onError={() => setFailed(src)}
    />
  ) : (
    <div className="placeholder" aria-label="Постер отсутствует">
      ◧
    </div>
  );
}
