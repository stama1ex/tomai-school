import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL);

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('❌ Нет DATABASE_URL или POSTGRES_URL в .env.local');
}

function loadJson(file: string) {
  const filePath = path.join(process.cwd(), 'data', file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Файл ${file} не найден`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) {
    console.warn(`⚠️ Файл ${file} пустой`);
    return [];
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error(`❌ Ошибка парсинга ${file}:`, e);
    return [];
  }
}

async function seed() {
  try {
    console.log('Создание таблиц...');

    // Удаляем старую таблицу exams
    await sql`DROP TABLE IF EXISTS exams`;

    // Создаем таблицы с полем order
    await sql`
      CREATE TABLE IF NOT EXISTS primary_exams (
        id UUID PRIMARY KEY,
        subject TEXT NOT NULL,
        date TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS graduation_exams (
        id UUID PRIMARY KEY,
        subject TEXT NOT NULL,
        date TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS call_schedule (
        id UUID PRIMARY KEY,
        lesson INT NOT NULL,
        time TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS staffing (
        id UUID PRIMARY KEY,
        full_name TEXT NOT NULL,
        position TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS class_teachers (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        class_id TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS charter (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS budget (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS first_grade_admission (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS lessons_schedule (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
  CREATE TABLE IF NOT EXISTS exam_titles (
    id UUID PRIMARY KEY,
    type TEXT NOT NULL,
    text TEXT NOT NULL,
    "order" INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`;
    await sql`
  CREATE TABLE IF NOT EXISTS exam_year (
    id UUID PRIMARY KEY,
    year TEXT NOT NULL,
    "order" INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`;

    console.log('Очистка таблиц...');
    await sql`DELETE FROM primary_exams`;
    await sql`DELETE FROM graduation_exams`;
    await sql`DELETE FROM call_schedule`;
    await sql`DELETE FROM staffing`;
    await sql`DELETE FROM class_teachers`;
    await sql`DELETE FROM reports`;
    await sql`DELETE FROM plans`;
    await sql`DELETE FROM charter`;
    await sql`DELETE FROM budget`;
    await sql`DELETE FROM first_grade_admission`;
    await sql`DELETE FROM lessons_schedule`;
    await sql`DELETE FROM exam_titles`;
    await sql`DELETE FROM exam_year`;

    console.log('Заполнение таблиц...');

    // Primary Exams и Graduation Exams
    const exams = loadJson('exams.json');
    let primaryOrder = 1;
    let graduationOrder = 1;
    for (const e of exams) {
      if (e.subject && e.date && e.type) {
        if (e.type === 'primary') {
          await sql`
            INSERT INTO primary_exams (id, subject, date, "order")
            VALUES (${uuidv4()}, ${e.subject}, ${e.date}, ${primaryOrder++})
          `;
        } else if (e.type === 'graduation') {
          await sql`
            INSERT INTO graduation_exams (id, subject, date, "order")
            VALUES (${uuidv4()}, ${e.subject}, ${e.date}, ${graduationOrder++})
          `;
        }
      }
    }

    // Call Schedule
    const calls = loadJson('call-schedule.json');
    let callOrder = 1;
    for (const c of calls) {
      if (c.lesson && c.time) {
        await sql`
          INSERT INTO call_schedule (id, lesson, time, "order")
          VALUES (${uuidv4()}, ${c.lesson}, ${c.time}, ${callOrder++})
        `;
      }
    }

    // Staffing
    const staff = loadJson('staffing.json');
    let staffOrder = 1;
    for (const s of staff) {
      if (s.name && s.role) {
        await sql`
          INSERT INTO staffing (id, full_name, position, "order")
          VALUES (${uuidv4()}, ${s.name}, ${s.role}, ${staffOrder++})
        `;
      }
    }

    // Class teachers
    const teachers = loadJson('class-teachers.json');
    let teacherOrder = 1;
    for (const t of teachers) {
      if (t.name && t.class) {
        await sql`
          INSERT INTO class_teachers (id, name, class_id, "order")
          VALUES (${uuidv4()}, ${t.name}, ${t.class}, ${teacherOrder++})
        `;
      }
    }

    // Reports
    const reports = loadJson('reports.json');
    let reportOrder = 1;
    for (const r of reports) {
      if (r.title && r.pdf_url) {
        await sql`
          INSERT INTO reports (id, title, pdf_url, "order")
          VALUES (${uuidv4()}, ${r.title}, ${r.pdf_url}, ${reportOrder++})
        `;
      }
    }

    // Plans
    const plans = loadJson('plans.json');
    let planOrder = 1;
    for (const p of plans) {
      if (p.title && p.pdf_url) {
        await sql`
          INSERT INTO plans (id, title, pdf_url, "order")
          VALUES (${uuidv4()}, ${p.title}, ${p.pdf_url}, ${planOrder++})
        `;
      }
    }

    // Charter
    const charter = loadJson('charter.json');
    let charterOrder = 1;
    for (const c of charter) {
      if (c.title && c.pdf_url) {
        await sql`
          INSERT INTO charter (id, title, pdf_url, "order")
          VALUES (${uuidv4()}, ${c.title}, ${c.pdf_url}, ${charterOrder++})
        `;
      }
    }

    // Budget
    const budget = loadJson('budget.json');
    let budgetOrder = 1;
    for (const b of budget) {
      if (b.title && b.pdf_url) {
        await sql`
          INSERT INTO budget (id, title, pdf_url, "order")
          VALUES (${uuidv4()}, ${b.title}, ${b.pdf_url}, ${budgetOrder++})
        `;
      }
    }

    // First Grade Admission
    const firstGrade = loadJson('first-grade-admission.json');
    let firstGradeOrder = 1;
    for (const f of firstGrade) {
      if (f.title && f.pdf_url) {
        await sql`
          INSERT INTO first_grade_admission (id, title, pdf_url, "order")
          VALUES (${uuidv4()}, ${f.title}, ${f.pdf_url}, ${firstGradeOrder++})
        `;
      }
    }

    // Lessons Schedule
    const lessonsSchedule = loadJson('lessons-schedule.json');
    let lessonsScheduleOrder = 1;
    for (const l of lessonsSchedule) {
      if (l.title && l.pdf_url) {
        await sql`
          INSERT INTO lessons_schedule (id, title, pdf_url, "order")
          VALUES (${uuidv4()}, ${l.title}, ${
          l.pdf_url
        }, ${lessonsScheduleOrder++})
        `;
      }
    }
    const titles = loadJson('exam-titles.json');
    let titleOrder = 1;
    for (const t of titles) {
      if (t.type && t.text) {
        await sql`
      INSERT INTO exam_titles (id, type, text, "order")
      VALUES (${uuidv4()}, ${t.type}, ${t.text}, ${titleOrder++})
    `;
      }
    }
    const years = loadJson('exam-year.json');
    let yearOrder = 1;
    for (const y of years) {
      if (y.year) {
        await sql`
      INSERT INTO exam_year (id, year, "order")
      VALUES (${uuidv4()}, ${y.year}, ${yearOrder++})
    `;
      }
    }

    console.log('✅ Сиды успешно загружены в Neon!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Ошибка при сидировании:', e);
    process.exit(1);
  }
}

seed();
