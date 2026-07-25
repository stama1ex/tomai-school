import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { slugify } from '@/lib/custom-pages';
import { createCrudHandlers } from '../universalCrud';

const { GET, DELETE } = createCrudHandlers('custom_pages');

// ✅ POST: создание страницы с автогенерацией уникального slug из названия
const POST = async (req: NextRequest) => {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const body = await req.json();
  const title = String(body.title || '').trim();
  if (!title) {
    return NextResponse.json(
      { error: 'Название страницы обязательно' },
      { status: 400 }
    );
  }

  const baseSlug = slugify(title);
  if (!baseSlug) {
    return NextResponse.json(
      { error: 'Не удалось сформировать адрес страницы из названия' },
      { status: 400 }
    );
  }

  let slug = baseSlug;
  let suffix = 2;
  while (true) {
    const existing = await sql`SELECT id FROM custom_pages WHERE slug = ${slug}`;
    if (existing.rows.length === 0) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const maxOrderResult = await sql`SELECT MAX("order") as max_order FROM custom_pages`;
  const newOrder = (maxOrderResult.rows[0]?.max_order || 0) + 1;

  try {
    const result = await sql`
      INSERT INTO custom_pages (id, slug, title, "order")
      VALUES (${uuidv4()}, ${slug}, ${title}, ${newOrder})
      RETURNING *
    `;
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось создать страницу' },
      { status: 500 }
    );
  }
};

// ✅ PUT: переименование страницы (адрес /more/[slug] остаётся неизменным)
const PUT = async (req: NextRequest) => {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const body = await req.json();
  const { id } = body;
  const title = String(body.title ?? body.newData?.title ?? '').trim();

  if (!id || !title) {
    return NextResponse.json(
      { error: 'Некорректные данные' },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      UPDATE custom_pages SET title = ${title} WHERE id = ${id} RETURNING *
    `;
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось обновить страницу' },
      { status: 500 }
    );
  }
};

export { GET, POST, PUT, DELETE };
