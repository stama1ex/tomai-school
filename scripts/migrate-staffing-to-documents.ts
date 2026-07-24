// Разовый скрипт: переводит таблицу staffing с формата "список людей"
// (full_name, position) на формат документов (title, pdf_url), как у
// reports/plans/charter/budget. Старые записи о сотрудниках удаляются —
// подтверждено пользователем.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

async function run() {
  console.log('Очистка старых записей о сотрудниках...');
  await sql`DELETE FROM staffing`;

  console.log('Изменение схемы таблицы staffing...');
  await sql`ALTER TABLE staffing DROP COLUMN IF EXISTS full_name`;
  await sql`ALTER TABLE staffing DROP COLUMN IF EXISTS position`;
  await sql`ALTER TABLE staffing ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE staffing ADD COLUMN IF NOT EXISTS pdf_url TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE staffing ALTER COLUMN title DROP DEFAULT`;
  await sql`ALTER TABLE staffing ALTER COLUMN pdf_url DROP DEFAULT`;

  console.log('✅ Таблица staffing теперь в формате документов (title, pdf_url).');
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Ошибка миграции:', e);
    process.exit(1);
  });
