CREATE TABLE "Movie" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "tmdbId" INTEGER,
  "title" TEXT NOT NULL,
  "year" INTEGER,
  "genre" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "poster" TEXT
);
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");
CREATE TABLE "Review" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "movieId" INTEGER NOT NULL,
  "author" TEXT NOT NULL,
  "rating" INTEGER NOT NULL CHECK ("rating" BETWEEN 1 AND 10),
  "body" TEXT NOT NULL,
  FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Review_movieId_author_key" ON "Review"("movieId", "author");
CREATE TABLE "Session" (
  "digest" TEXT NOT NULL PRIMARY KEY,
  "author" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL
);
