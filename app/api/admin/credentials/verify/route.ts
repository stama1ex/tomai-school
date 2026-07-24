import { NextRequest, NextResponse } from 'next/server';
import {
  consumeVerification,
  deleteOtherSessions,
  requireAdmin,
  SESSION_COOKIE,
  unauthorized,
  updateAdminCredentials,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { verificationId, code } = await req.json();
  if (!verificationId || !code) {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const verification = await consumeVerification(verificationId, code, 'credentials');

  if (!verification || verification.admin_id !== session.adminId) {
    return NextResponse.json(
      { error: 'Неверный или истёкший код' },
      { status: 401 }
    );
  }

  await updateAdminCredentials(session.adminId, {
    username: verification.pending_username ?? undefined,
    passwordHash: verification.pending_password_hash ?? undefined,
  });

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  await deleteOtherSessions(token);

  return NextResponse.json({ success: true });
}
