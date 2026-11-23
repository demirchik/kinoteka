const { closeSync, openSync } = require("node:fs");
const { join } = require("node:path");
// На Windows migrate deploy ожидает, что файл SQLite уже существует.
// Флаг a создаёт отсутствующий файл и сохраняет данные существующего.
closeSync(openSync(join(__dirname, "dev.db"), "a"));
