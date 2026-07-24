import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

async function migrate() {
  console.log('Создание таблиц для системы авторизации...');

  // Даты — TIMESTAMPTZ (не TIMESTAMP): на "холодном" подключении Neon
  // сессионная тайм-зона может на мгновение отличаться от UTC, из-за чего
  // NOW() для обычного TIMESTAMP сохраняется со сдвигом. TIMESTAMPTZ хранит
  // абсолютный момент времени и не зависит от сессионной тайм-зоны.
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      failed_attempts INT NOT NULL DEFAULT 0,
      locked_until TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id UUID PRIMARY KEY,
      admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS admin_sessions_admin_id_idx
    ON admin_sessions(admin_id)
  `;

  await sql`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS display_name TEXT`;
  await sql`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS user_agent TEXT`;
  await sql`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW()`;

  console.log('Создание таблицы login_verifications...');

  await sql`
    CREATE TABLE IF NOT EXISTS login_verifications (
      id UUID PRIMARY KEY,
      admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      purpose TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      attempts INT NOT NULL DEFAULT 0,
      display_name TEXT,
      user_agent TEXT,
      pending_username TEXT,
      pending_password_hash TEXT,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS login_verifications_admin_id_idx
    ON login_verifications(admin_id)
  `;

  console.log('Создание таблицы announcements...');

  await sql`
    CREATE TABLE IF NOT EXISTS announcements (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      "order" INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_url TEXT`;

  console.log('Создание таблицы site_settings...');

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY DEFAULT 1,
      full_name TEXT NOT NULL DEFAULT '',
      short_name TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      work_hours TEXT NOT NULL DEFAULT '',
      director_name TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT '',
      social_links JSONB NOT NULL DEFAULT '[]',
      students_total INT NOT NULL DEFAULT 0,
      students_primary INT NOT NULL DEFAULT 0,
      students_secondary INT NOT NULL DEFAULT 0,
      teachers_total INT NOT NULL DEFAULT 0,
      teachers_first_degree INT NOT NULL DEFAULT 0,
      teachers_second_degree INT NOT NULL DEFAULT 0,
      staff_technical INT NOT NULL DEFAULT 0,
      staff_librarian INT NOT NULL DEFAULT 0,
      staff_nurse INT NOT NULL DEFAULT 0,
      classrooms_total INT NOT NULL DEFAULT 0,
      computers_it_room INT NOT NULL DEFAULT 0,
      gagauz_percent INT NOT NULL DEFAULT 0,
      appeals_note TEXT NOT NULL DEFAULT '',
      concern_note TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT site_settings_singleton CHECK (id = 1)
    )
  `;

  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS classes_total INT NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS director_position TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS director_office_hours TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS director_email TEXT NOT NULL DEFAULT ''`;

  await sql`
    INSERT INTO site_settings (
      id, full_name, short_name, address, phone, email, work_hours,
      director_name, language, social_links,
      students_total, students_primary, students_secondary,
      teachers_total, teachers_first_degree, teachers_second_degree,
      staff_technical, staff_librarian, staff_nurse,
      classrooms_total, computers_it_room, gagauz_percent,
      classes_total, director_position, director_office_hours, director_email,
      appeals_note, concern_note
    )
    VALUES (
      1,
      'Публичное Учреждение «Гимназия села Томай»',
      'ПУ «Гимназия с. Томай»',
      'Республика Молдова, АТО Гагаузия, Чадыр-Лунгский р-н, с. Томай, ул. Школьная, 103/А',
      '0 (291) 51-2-89',
      'tomailiceuteor@mail.ru',
      'с 8:00 до 17:00',
      'Стамат Нина Семёновна',
      'русский',
      '[]',
      319, 165, 186,
      35, 3, 22,
      24, 1, 1,
      24, 11, 85,
      15,
      'Директор Публичного учреждения «Гимназия с. Томай»',
      'понедельник, среда с 14:00–17:00',
      'liceytomay@gmail.com',
      'Обращения рассматриваются администрацией гимназии в порядке и сроки, установленные законодательством.',
      'Если вам известно о случае насилия, буллинга или нарушения прав ребёнка, сообщите об этом администрации гимназии через форму ниже или по бесплатной круглосуточной линии «Telefonul Copilului» — 116 111.'
    )
    ON CONFLICT (id) DO NOTHING
  `;

  console.log('Создание таблиц appeals и concern_reports...');

  await sql`
    CREATE TABLE IF NOT EXISTS appeals (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT NOT NULL,
      is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS concern_reports (
      id UUID PRIMARY KEY,
      reporter_name TEXT,
      contact TEXT,
      message TEXT NOT NULL,
      is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  console.log('✅ Миграция успешно выполнена.');
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Ошибка миграции:', e);
    process.exit(1);
  });
