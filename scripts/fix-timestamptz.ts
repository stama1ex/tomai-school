// Разовый скрипт: переводит колонки с датами в auth-таблицах на TIMESTAMPTZ.
// Причина: TIMESTAMP (без тайм-зоны) на "холодном" подключении Neon может
// на короткое время получить NOW() в неправильной сессионной тайм-зоне
// (наблюдалось расхождение ровно в 3 часа), из-за чего короткоживущие коды
// подтверждения (10 минут) мгновенно "истекали". TIMESTAMPTZ хранит
// абсолютный момент времени и не зависит от сессионной тайм-зоны.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

async function run() {
  console.log('Перевод колонок дат на TIMESTAMPTZ...');

  await sql`ALTER TABLE admins ALTER COLUMN locked_until TYPE TIMESTAMPTZ USING locked_until AT TIME ZONE 'UTC'`;
  await sql`ALTER TABLE admins ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;

  await sql`ALTER TABLE admin_sessions ALTER COLUMN expires_at TYPE TIMESTAMPTZ USING expires_at AT TIME ZONE 'UTC'`;
  await sql`ALTER TABLE admin_sessions ALTER COLUMN last_active_at TYPE TIMESTAMPTZ USING last_active_at AT TIME ZONE 'UTC'`;
  await sql`ALTER TABLE admin_sessions ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;

  await sql`ALTER TABLE login_verifications ALTER COLUMN expires_at TYPE TIMESTAMPTZ USING expires_at AT TIME ZONE 'UTC'`;
  await sql`ALTER TABLE login_verifications ALTER COLUMN consumed_at TYPE TIMESTAMPTZ USING consumed_at AT TIME ZONE 'UTC'`;
  await sql`ALTER TABLE login_verifications ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;

  console.log('✅ Готово.');
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  });
