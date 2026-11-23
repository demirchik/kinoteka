const { PrismaClient } = require("@prisma/client");
const films = require("./demo.json");
const db = new PrismaClient();
const observations = [
  [
    "Звук радио заставляет вслушиваться даже в паузы.",
    "Сцена на леднике запомнилась больше всего.",
  ],
  [
    "У каждого пассажира свой ритм речи. Отличный ансамбль.",
    "После финала захотелось проехать маршрут ещё раз.",
  ],
  [
    "Отливы здесь задают ритм всей истории.",
    "Очень точно передано ощущение возвращения домой.",
  ],
  [
    "Тишина в открытом космосе звучит убедительно.",
    "Финальный разговор стоил всего ожидания.",
  ],
];
async function seed() {
  await db.$transaction(async (tx) => {
    for (const [index, [title, year, genre, summary, art]] of films.entries()) {
      const id = index + 1;
      await tx.movie.upsert({
        where: { id },
        update: {},
        create: {
          id,
          title,
          year,
          genre,
          summary,
          poster: "/posters/" + art + ".jpg",
        },
      });
      for (const [n, body] of observations[index].entries()) {
        const author = ["Лира", "Кадр"][n];
        await tx.review.upsert({
          where: { movieId_author: { movieId: id, author } },
          update: {},
          create: { movieId: id, author, body, rating: 7 + ((index + n) % 4) },
        });
      }
    }
  });
}
seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
