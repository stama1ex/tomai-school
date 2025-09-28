import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL);

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

async function seed() {
  try {
    console.log('Создание таблиц...');
    await sql`
      CREATE TABLE IF NOT EXISTS staffing (
        id UUID PRIMARY KEY,
        full_name TEXT NOT NULL,
        position TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('Таблица staffing создана');

    await sql`
      CREATE TABLE IF NOT EXISTS class_teachers (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        class_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('Таблица class_teachers создана');

    console.log('Очистка таблиц...');
    await sql`DELETE FROM staffing`;
    await sql`DELETE FROM class_teachers`;
    console.log('Таблицы очищены');

    const staff = [
      { full_name: 'Иванов Иван Иванович', position: 'Директор' },
      {
        full_name: 'Петрова Мария Сергеевна',
        position: 'Заместитель директора',
      },
      { full_name: 'Сидоров Алексей Павлович', position: 'Учитель математики' },
    ];

    console.log('Вставка данных в staffing...');
    for (const s of staff) {
      await sql`
        INSERT INTO staffing (id, full_name, position)
        VALUES (${uuidv4()}, ${s.full_name}, ${s.position})
      `;
    }
    console.log('Данные в staffing вставлены');

    const teachers = [
      { name: 'Анна Кузнецова', class_id: '5А' },
      { name: 'Дмитрий Смирнов', class_id: '6Б' },
      { name: 'Ольга Попова', class_id: '7В' },
    ];

    console.log('Вставка данных в class_teachers...');
    for (const t of teachers) {
      await sql`
        INSERT INTO class_teachers (id, name, class_id)
        VALUES (${uuidv4()}, ${t.name}, ${t.class_id})
      `;
    }
    console.log('Данные в class_teachers вставлены');

    console.log('✅ Сиды успешно загружены в Neon!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка при сидировании:', err);
    process.exit(1);
  }
}

seed();
