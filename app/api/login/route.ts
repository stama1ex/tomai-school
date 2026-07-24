import { NextRequest, NextResponse } from 'next/server';
import {
  createVerification,
  findAdminByUsername,
  isLockedOut,
  recordFailedAttempt,
  resetFailedAttempts,
  VerificationCooldownError,
  verifyPassword,
} from '@/lib/auth';
import { MailerNotConfiguredError, sendVerificationCodeEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const { login, password, displayName } = await req.json();

  if (!login || !password || !displayName?.trim()) {
    return NextResponse.json(
      { error: 'Заполните логин, пароль и укажите, как вас зовут' },
      { status: 400 }
    );
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

  const userAgent = req.headers.get('user-agent') || undefined;

  try {
    const { id, code } = await createVerification({
      adminId: admin.id,
      purpose: 'login',
      displayName: displayName.trim(),
      userAgent,
    });

    await sendVerificationCodeEmail({
      code,
      purpose: 'login',
      displayName: displayName.trim(),
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
