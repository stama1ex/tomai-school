import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin, unauthorized } from '@/lib/auth';

// Публичное сообщение о насилии/буллинге (POST, можно анонимно), просмотр — только для администратора.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ success: true });
  }

  const reporterName = String(body.reporterName ?? '').trim().slice(0, 200);
  const contact = String(body.contact ?? '').trim().slice(0, 200);
  const message = String(body.message ?? '').trim().slice(0, 5000);

  if (!message) {
    return NextResponse.json(
      { error: 'Опишите, пожалуйста, ситуацию' },
      { status: 400 }
    );
  }

  try {
    await sql`
      INSERT INTO concern_reports (id, reporter_name, contact, message)
      VALUES (${uuidv4()}, ${reporterName || null}, ${contact || null}, ${message})
    `;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось отправить сообщение' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  try {
    const result = await sql`SELECT * FROM concern_reports ORDER BY created_at DESC`;
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
    await sql`UPDATE concern_reports SET is_reviewed = ${!!isReviewed} WHERE id = ${id}`;
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
    await sql`DELETE FROM concern_reports WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
