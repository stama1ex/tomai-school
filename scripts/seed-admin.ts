import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../lib/auth';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

const username = process.argv[2] || process.env.ADMIN_LOGIN;
const password = process.argv[3] || process.env.ADMIN_PASS;

if (!username || !password) {
  throw new Error(
    '❌ Укажите логин и пароль: npm run db:seed-admin -- <login> <password>, либо задайте ADMIN_LOGIN/ADMIN_PASS в .env.local'
  );
}

async function seedAdmin() {
  const existing = await sql`SELECT id FROM admins WHERE username = ${username}`;

  if (existing.rows.length > 0) {
    console.log(`⚠️ Админ "${username}" уже существует, пропускаем.`);
    return;
  }

  const passwordHash = await hashPassword(password as string);

  await sql`
    INSERT INTO admins (id, username, password_hash)
    VALUES (${uuidv4()}, ${username}, ${passwordHash})
  `;

  console.log(`✅ Админ "${username}" создан.`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Ошибка создания админа:', e);
    process.exit(1);
  });
