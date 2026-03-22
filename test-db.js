const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_3zjRYQGk9qid@ep-flat-mud-abw8cmbt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' });
  await client.connect();
  
  try {
    const hash = await bcrypt.hash('password123', 10);
    await client.query('UPDATE users SET password_hash = $1', [hash]);
    const res = await client.query('SELECT role, email FROM users');
    console.log('Successfully updated passwords to password123!');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();
