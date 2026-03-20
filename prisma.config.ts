// Prisma configuration
// Loads DATABASE_URL from .env.local (Next.js convention)
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL (port 5432) for migrations; fall back to DATABASE_URL
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
