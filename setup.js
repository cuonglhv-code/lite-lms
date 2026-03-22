const { Client } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

async function main() {
  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_3zjRYQGk9qid@ep-flat-mud-abw8cmbt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' });
  await client.connect();
  
  try {
    console.log('Running lib/db/seed.sql...');
    const seedSql = fs.readFileSync('lib/db/seed.sql', 'utf8');
    await client.query(seedSql);
    console.log('Seed SQL executed successfully.');
    
    console.log('Updating user passwords...');
    const hash = await bcrypt.hash('password123', 10);
    await client.query('UPDATE users SET password_hash = $1', [hash]);
    console.log('Passwords updated to password123.');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });
console.log('Running database setup...');
main().then(() => {
  console.log('Running seed-default-center.ts...');
  execSync('npx tsx prisma/seed-default-center.ts', { stdio: 'inherit' });
  console.log('All setup complete!');
});
