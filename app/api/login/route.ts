import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  createSession,
  findAdminByUsername,
  isLockedOut,
  recordFailedAttempt,
  resetFailedAttempts,
  sessionCookieOptions,
  verifyPassword,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { login, password } = await req.json();

  if (!login || !password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const admin = await findAdminByUsername(login);

  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (isLockedOut(admin)) {
    return NextResponse.json(
      { error: 'Аккаунт временно заблокирован из-за неудачных попыток входа' },
      { status: 423 }
    );
  }

  const passwordValid = await verifyPassword(password, admin.password_hash);

  if (!passwordValid) {
    await recordFailedAttempt(admin);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await resetFailedAttempts(admin.id);

  const token = await createSession(admin.id);

  const res = NextResponse.json({ success: true, username: admin.username });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
