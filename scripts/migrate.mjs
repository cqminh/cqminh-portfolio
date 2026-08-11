import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const migrationsDir = path.join(import.meta.dirname, "..", "db", "migrations");

async function main() {
  await sql`CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  const applied = new Set((await sql`SELECT name FROM _migrations`).map((row) => row.name));
  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;

    const content = await readFile(path.join(migrationsDir, file), "utf8");
    const statements = content.split(";").map((s) => s.trim()).filter(Boolean);

    for (const statement of statements) {
      await sql.query(statement);
    }
    await sql`INSERT INTO _migrations (name) VALUES (${file})`;
    console.log(`Applied ${file}`);
  }

  console.log("Migrations up to date.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
