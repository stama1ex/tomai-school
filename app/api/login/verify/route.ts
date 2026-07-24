import { NextRequest, NextResponse } from 'next/server';
import {
  consumeVerification,
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  const { verificationId, code } = await req.json();

  if (!verificationId || !code) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const verification = await consumeVerification(verificationId, code, 'login');

  if (!verification) {
    return NextResponse.json(
      { error: 'Неверный или истёкший код' },
      { status: 401 }
    );
  }

  const adminResult = await sql<{ username: string }>`
    SELECT username FROM admins WHERE id = ${verification.admin_id}
  `;
  const username = adminResult.rows[0]?.username;

  if (!username) {
    return NextResponse.json({ error: 'Аккаунт не найден' }, { status: 401 });
  }

  const token = await createSession(verification.admin_id, {
    displayName: verification.display_name ?? undefined,
    userAgent: verification.user_agent ?? undefined,
  });

  const res = NextResponse.json({ success: true, username });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
