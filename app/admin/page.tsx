'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inbox, MessageSquareWarning, Settings } from 'lucide-react';
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
];

export default function AdminLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: adminLogin, isAdmin, hydrated, username } = useAdminStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await adminLogin(login, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Неверный логин или пароль');
    }
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

  return (
    <Container className="px-4 py-8">
      <Title
        text="Вход для администратора"
        size="lg"
        className="dark:text-white font-bold text-center mb-6"
      />
      <form
        onSubmit={handleSubmit}
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
        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </Container>
  );
}
