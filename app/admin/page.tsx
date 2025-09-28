'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/admin';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/shared/admin-button';

export default function AdminLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: adminLogin } = useAdminStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await adminLogin(login, password);
    if (success) {
      router.push('/');
    } else {
      setError('Неверный логин или пароль');
    }
  };

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
        <Button type="submit" className="w-full">
          Войти
        </Button>
        <AdminButton />
      </form>
    </Container>
  );
}
