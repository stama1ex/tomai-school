'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SecurityForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'code'>('form');

  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newLogin.trim() && !newPassword) {
      setError('Укажите новый логин и/или новый пароль');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError('Пароль должен быть не короче 8 символов');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/credentials/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newLogin: newLogin.trim() || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Не удалось отправить код подтверждения');
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!verificationId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/credentials/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, code: code.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Неверный или истёкший код');
        return;
      }

      setDone(true);
      toast.success('Логин и/или пароль обновлены');
    } catch {
      setError('Не удалось связаться с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-lg border bg-card p-6 max-w-md">
        <p className="font-medium dark:text-white mb-1">Готово!</p>
        <p className="text-sm text-muted-foreground">
          Данные для входа обновлены. Все остальные сессии входа завершены —
          при следующем входе на других устройствах снова понадобится код
          подтверждения.
        </p>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <form onSubmit={handleVerify} className="flex flex-col gap-4 max-w-md">
        <p className="text-sm text-muted-foreground">
          Код отправлен на почту директора. Уточните его у неё и введите
          ниже — код действует 10 минут.
        </p>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Код из 6 цифр"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          autoFocus
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Проверка...' : 'Подтвердить'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStep('form');
              setCode('');
              setVerificationId(null);
              setError('');
            }}
          >
            Назад
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequest} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="text-sm font-medium dark:text-white mb-1 block">
          Новый логин
        </label>
        <Input
          value={newLogin}
          onChange={(e) => setNewLogin(e.target.value)}
          placeholder="Оставьте пустым, чтобы не менять"
        />
      </div>
      <div>
        <label className="text-sm font-medium dark:text-white mb-1 block">
          Новый пароль
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Оставьте пустым, чтобы не менять"
        />
      </div>
      {newPassword && (
        <div>
          <label className="text-sm font-medium dark:text-white mb-1 block">
            Повторите новый пароль
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" className="w-fit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка кода...' : 'Отправить код подтверждения'}
      </Button>
    </form>
  );
};
