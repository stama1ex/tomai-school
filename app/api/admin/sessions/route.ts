import { NextRequest, NextResponse } from 'next/server';
import {
  deleteSessionById,
  listSessions,
  requireAdmin,
  SESSION_COOKIE,
  unauthorized,
} from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const sessions = await listSessions(token);
  return NextResponse.json(sessions);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'id обязателен' }, { status: 400 });
  }

  await deleteSessionById(id);
  return NextResponse.json({ success: true });
}
