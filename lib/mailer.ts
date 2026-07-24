import nodemailer from 'nodemailer';

const ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'stanin81@gmail.com';

export class MailerNotConfiguredError extends Error {
  constructor() {
    super(
      'Отправка почты не настроена: задайте SMTP_USER и SMTP_PASS в переменных окружения.'
    );
    this.name = 'MailerNotConfiguredError';
  }
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendVerificationCodeEmail(params: {
  code: string;
  purpose: 'login' | 'credentials';
  displayName?: string;
  userAgent?: string;
}): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    throw new MailerNotConfiguredError();
  }

  const purposeText =
    params.purpose === 'login'
      ? 'вход в панель администратора'
      : 'смену логина/пароля администратора';

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: `"ПУ Гимназия с. Томай" <${from}>`,
    to: ALERT_EMAIL,
    subject: `Код подтверждения: ${purposeText}`,
    text: [
      `Кто-то запросил ${purposeText} на сайте гимназии.`,
      params.displayName ? `Имя, которое указали: ${params.displayName}` : null,
      params.userAgent ? `Устройство/браузер: ${params.userAgent}` : null,
      '',
      `Код подтверждения: ${params.code}`,
      '',
      'Код действителен 10 минут. Если вы не ожидаете этот запрос — просто проигнорируйте письмо, никому код не сообщайте.',
    ]
      .filter(Boolean)
      .join('\n'),
  });

  // Полезно только для тестовых аккаунтов ethereal.email — в проде всегда false.
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Verification email preview:', previewUrl);
  }
}
