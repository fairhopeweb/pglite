import test from 'ava'
import { PGlite } from '../../dist/index.js'
import { tsm_system_time } from '../../dist/contrib/tsm_system_time.js'

test('tsm_system_time', async (t) => {
  const pg = new PGlite({
    extensions: {
      tsm_system_time,
    },
  })

  await pg.exec('CREATE EXTENSION IF NOT EXISTS tsm_system_time;')

  // crate test table with 10 rows
  await pg.exec(`
    CREATE TABLE test (
      id SERIAL PRIMARY KEY,
      name TEXT
    );
  `)

  await pg.exec(`
    INSERT INTO test (name)
    SELECT 'test' || i
    FROM generate_series(1, 10) AS i;
  `)

  // sample 5 rows
  const res = await pg.query(`
    SELECT *
    FROM test
    TABLESAMPLE SYSTEM_TIME(50);
  `)

  t.is(res.rows.length, 10)
})
