import { pool } from "../src/shared/database/pool";

// export async function setup() {
//   await pool.query(`
//     DROP SCHEMA public CASCADE;
//     CREATE SCHEMA public;
//   `);

//   // Run migrations here
// }

export async function setup() {
  await pool.query("SELECT 1");
}

export async function teardown() {
  await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);

  await pool.end();
}
