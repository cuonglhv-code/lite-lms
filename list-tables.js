const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_3zjRYQGk9qid@ep-flat-mud-abw8cmbt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' });
client.connect()
  .then(() => client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
  .then(res => console.log(res.rows.map(r => r.table_name)))
  .catch(console.error)
  .finally(() => client.end());
