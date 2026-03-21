import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sql = neon(process.env.POSTGRES_URL);

function splitSQL(content) {
  // Remove comment lines, split on semicolons, keep non-empty
  return content
    .replace(/--[^\n]*/g, '')        // strip -- comments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function run(file) {
  const content = readFileSync(join(__dirname, '../lib/db/', file), 'utf8');
  const statements = splitSQL(content);
  console.log(`Running ${statements.length} statements from ${file}...`);

  for (const stmt of statements) {
    try {
      await sql(stmt);
    } catch (err) {
      if (err.code === '23505') {
        console.log(`  ↳ skipped duplicate`);
      } else {
        console.error(`  ✗ Error: ${err.message}`);
        console.error(`    Statement: ${stmt.substring(0, 100)}`);
        throw err;
      }
    }
  }
  console.log(`✓ ${file} complete`);
}

try {
  await run('schema.sql');
  await run('seed.sql');

  const counts = await sql`
    SELECT 'users' as tbl, COUNT(*)::int as n FROM users
    UNION ALL SELECT 'courses', COUNT(*) FROM courses
    UNION ALL SELECT 'classes', COUNT(*) FROM classes
    UNION ALL SELECT 'students', COUNT(*) FROM students
    UNION ALL SELECT 'enrolments', COUNT(*) FROM enrolments
    UNION ALL SELECT 'homework', COUNT(*) FROM homework
    UNION ALL SELECT 'assessments', COUNT(*) FROM assessments
    UNION ALL SELECT 'attendance', COUNT(*) FROM attendance
  `;
  console.log('\n── Row counts ──');
  counts.forEach(r => console.log(`  ${r.tbl.padEnd(12)} ${r.n}`));
  console.log('\n✅ Database ready!');
} catch (err) {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
}
