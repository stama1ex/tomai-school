import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin, unauthorized } from '@/lib/auth';

// Публичная подача обращения (POST), просмотр/модерация — только для администратора.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  // Honeypot: скрытое поле, которое заполняют только боты.
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ success: true });
  }

  const name = String(body.name ?? '').trim().slice(0, 200);
  const contact = String(body.contact ?? '').trim().slice(0, 200);
  const message = String(body.message ?? '').trim().slice(0, 5000);

  if (!name || !contact || !message) {
    return NextResponse.json(
      { error: 'Заполните имя, контакт для связи и текст обращения' },
      { status: 400 }
    );
  }

  try {
    await sql`
      INSERT INTO appeals (id, name, contact, message)
      VALUES (${uuidv4()}, ${name}, ${contact}, ${message})
    `;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось отправить обращение' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  try {
    const result = await sql`SELECT * FROM appeals ORDER BY created_at DESC`;
    return NextResponse.json(result.rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id, isReviewed } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'id обязателен' }, { status: 400 });
  }

  try {
    await sql`UPDATE appeals SET is_reviewed = ${!!isReviewed} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'id обязателен' }, { status: 400 });
  }

  try {
    await sql`DELETE FROM appeals WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
