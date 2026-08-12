/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
require("dotenv/config");

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  dir: "src/infrastructure/database/migrations",
  direction: "up",
  migrationsTable: "pgmigrations",
  count: Infinity,
};

exports.up = (pgm) => {
  pgm.createExtension("pgcrypto", {
    ifNotExists: true,
  });
};

exports.down = (pgm) => {
  pgm.dropExtension("pgcrypto", {
    ifExists: true,
  });
};

// First database migration: npm run db:create -- initial_schema
// npm run db:migrate
