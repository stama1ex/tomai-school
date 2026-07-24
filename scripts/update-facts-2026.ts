// Разовый скрипт: обновляет фактические данные гимназии на 2026–2027 уч. год.
// Не часть регулярной миграции — запускается один раз вручную.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

async function run() {
  await sql`
    UPDATE site_settings
    SET
      students_total = 319,
      classes_total = 15,
      director_position = 'Директор Публичного учреждения «Гимназия с. Томай»',
      director_office_hours = 'понедельник, среда с 14:00–17:00',
      director_email = 'liceytomay@gmail.com'
    WHERE id = 1
  `;

  console.log('✅ Данные на 2026–2027 уч. год обновлены.');
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Ошибка обновления:', e);
    process.exit(1);
  });
