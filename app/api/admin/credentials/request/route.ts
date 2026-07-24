import { NextRequest, NextResponse } from 'next/server';
import {
  createVerification,
  getSessionDisplayName,
  hashPassword,
  requireAdmin,
  SESSION_COOKIE,
  unauthorized,
  VerificationCooldownError,
} from '@/lib/auth';
import { MailerNotConfiguredError, sendVerificationCodeEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return unauthorized();

  const { newLogin, newPassword } = await req.json();

  const trimmedLogin = typeof newLogin === 'string' ? newLogin.trim() : '';
  const trimmedPassword = typeof newPassword === 'string' ? newPassword : '';

  if (!trimmedLogin && !trimmedPassword) {
    return NextResponse.json(
      { error: 'Укажите новый логин и/или новый пароль' },
      { status: 400 }
    );
  }

  if (trimmedPassword && trimmedPassword.length < 8) {
    return NextResponse.json(
      { error: 'Пароль должен быть не короче 8 символов' },
      { status: 400 }
    );
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const displayName = (await getSessionDisplayName(token)) ?? session.username;
  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    const { id, code } = await createVerification({
      adminId: session.adminId,
      purpose: 'credentials',
      displayName,
      userAgent,
      pendingUsername: trimmedLogin || undefined,
      pendingPasswordHash: trimmedPassword
        ? await hashPassword(trimmedPassword)
        : undefined,
    });

    await sendVerificationCodeEmail({
      code,
      purpose: 'credentials',
      displayName,
      userAgent,
    });

    return NextResponse.json({ verificationId: id });
  } catch (e) {
    if (e instanceof VerificationCooldownError) {
      return NextResponse.json({ error: e.message }, { status: 429 });
    }
    if (e instanceof MailerNotConfiguredError) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    console.error(e);
    return NextResponse.json(
      { error: 'Не удалось отправить код подтверждения' },
      { status: 500 }
    );
  }
}
