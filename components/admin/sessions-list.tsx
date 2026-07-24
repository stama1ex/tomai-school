'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Clock, Laptop, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { describeUserAgent } from '@/lib/device';
import { useAdminStore } from '@/store/admin';

interface SessionItem {
  id: string;
  displayName: string | null;
  userAgent: string | null;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

const API_PATH = '/api/admin/sessions';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const SessionsList: React.FC = () => {
  const { data, isLoading, mutate } = useSWR<SessionItem[]>(API_PATH);
  const logout = useAdminStore((s) => s.logout);
  const router = useRouter();

  const items = data ?? [];

  const handleEnd = async (session: SessionItem) => {
    if (session.isCurrent) {
      await logout();
      router.push('/admin');
      return;
    }

    mutate((current) => (current ?? []).filter((s) => s.id !== session.id), {
      revalidate: false,
    });

    try {
      const res = await fetch(API_PATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: session.id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Сессия завершена');
    } catch {
      toast.error('Не удалось завершить сессию');
      mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground">Активных сессий нет</p>;
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {items.map((session) => (
        <div
          key={session.id}
          className={cn(
            'rounded-lg border bg-card p-4 flex flex-col gap-2',
            session.isCurrent && 'border-primary/40'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium dark:text-white">
              <User className="h-4 w-4 shrink-0" />
              {session.displayName || 'Без имени'}
              {session.isCurrent && (
                <span className="text-xs font-normal text-primary border border-primary/40 rounded px-1.5 py-0.5">
                  текущая сессия
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEnd(session)}
            >
              <Trash className="h-4 w-4 text-destructive" />
              Завершить
            </Button>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Laptop className="h-4 w-4 shrink-0" />
              {describeUserAgent(session.userAgent)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              Первый вход: {formatDate(session.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              Последняя активность: {formatDate(session.lastActiveAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
