'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Inbox,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAdminStore } from '@/store/admin';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/shared/admin-button';

const dashboardLinks = [
  { href: '/admin/settings', label: 'Настройки сайта', icon: Settings },
  { href: '/admin/appeals', label: 'Обращения граждан', icon: Inbox },
  {
    href: '/admin/concern-reports',
    label: 'Сообщения о насилии/буллинге',
    icon: MessageSquareWarning,
  },
  { href: '/admin/security', label: 'Логин и пароль', icon: ShieldCheck },
  { href: '/admin/sessions', label: 'Сессии входа', icon: History },
];

export default function AdminLogin() {
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setAuthenticated, isAdmin, hydrated, username } = useAdminStore();
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Укажите, как вас зовут');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, displayName: displayName.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Неверный логин или пароль');
        return;
      }

      setVerificationId(data.verificationId);
      setStep('code');
    } catch {
      setError('Не удалось связаться с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, code: code.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Неверный или истёкший код');
        return;
      }

      setAuthenticated(data.username);
      router.push('/admin');
    } catch {
      setError('Не удалось связаться с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('credentials');
    setCode('');
    setVerificationId(null);
    setError('');
  };

  if (!hydrated) {
    return null;
  }

  if (isAdmin) {
    return (
      <Container className="px-4 py-8">
        <Title
          text={`Панель администратора${username ? ` — ${username}` : ''}`}
          size="lg"
          className="dark:text-white font-bold text-center mb-8"
        />
        <div className="max-w-md mx-auto flex flex-col gap-3">
          {dashboardLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium dark:text-white">{label}</span>
            </Link>
          ))}
          <AdminButton />
        </div>
      </Container>
    );
  }

  if (step === 'code') {
    return (
      <Container className="px-4 py-8">
        <Title
          text="Код подтверждения"
          size="lg"
          className="dark:text-white font-bold text-center mb-6"
        />
        <p className="text-center text-muted-foreground max-w-md mx-auto mb-6">
          Код отправлен на почту директора. Уточните его у неё и введите
          ниже — код действует 10 минут.
        </p>
        <form
          onSubmit={handleCodeSubmit}
          className="max-w-md mx-auto flex flex-col gap-4"
        >
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Код из 6 цифр"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center text-lg tracking-widest"
            maxLength={6}
            autoFocus
          />
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Проверка...' : 'Подтвердить'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleBack}
          >
            Назад
          </Button>
        </form>
      </Container>
    );
  }

  return (
    <Container className="px-4 py-8">
      <Title
        text="Вход для администратора"
        size="lg"
        className="dark:text-white font-bold text-center mb-6"
      />
      <p className="text-center text-muted-foreground max-w-md mx-auto mb-6">
        Учётная запись общая — после ввода логина и пароля код подтверждения
        придёт на почту директора, уточните его у неё.
      </p>
      <form
        onSubmit={handleCredentialsSubmit}
        className="max-w-md mx-auto flex flex-col gap-4"
      >
        <div>
          <Input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Как вас зовут?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full"
          />
        </div>
        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка кода...' : 'Войти'}
        </Button>
      </form>
    </Container>
  );
}
