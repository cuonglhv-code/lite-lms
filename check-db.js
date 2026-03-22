const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_3zjRYQGk9qid@ep-flat-mud-abw8cmbt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' });
async function main() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  const tables = res.rows.map(r => r.table_name);
  console.log('Tables:', tables.join(', '));
  
  for (const table of tables) {
    try {
      const countRes = await client.query(`SELECT COUNT(*) FROM \"${table}\"`);
      console.log(`${table}: ${countRes.rows[0].count}`);
    } catch (e) {
      console.log(`${table}: Error counting - ${e.message}`);
    }
  }
  await client.end();
}
main().catch(console.error);
