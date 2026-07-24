'use client';

import useSWR from 'swr';
import { toast } from 'sonner';
import { Check, Mail, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Appeal {
  id: string;
  name: string;
  contact: string;
  message: string;
  is_reviewed: boolean;
  created_at: string;
}

const API_PATH = '/api/appeals';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const AppealsInbox: React.FC = () => {
  const { data, isLoading, mutate } = useSWR<Appeal[]>(API_PATH);
  const items = data ?? [];

  const toggleReviewed = async (id: string, isReviewed: boolean) => {
    mutate(
      (current) =>
        (current ?? []).map((i) =>
          i.id === id ? { ...i, is_reviewed: isReviewed } : i
        ),
      { revalidate: false }
    );
    try {
      const res = await fetch(API_PATH, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isReviewed }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Не удалось обновить статус');
      mutate();
    }
  };

  const remove = async (id: string) => {
    const deleted = items.find((i) => i.id === id);
    mutate((current) => (current ?? []).filter((i) => i.id !== id), {
      revalidate: false,
    });
    try {
      const res = await fetch(API_PATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Не удалось удалить');
      if (deleted) {
        mutate((current) => [...(current ?? []), deleted], {
          revalidate: false,
        });
      }
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
    return <p className="text-muted-foreground">Обращений пока нет</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'rounded-lg border bg-card p-4 flex flex-col gap-2',
            item.is_reviewed && 'opacity-60'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium dark:text-white">
                <User className="h-4 w-4" /> {item.name}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> {item.contact}
              </span>
              <span>{formatDate(item.created_at)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={item.is_reviewed ? 'outline' : 'default'}
                onClick={() => toggleReviewed(item.id, !item.is_reviewed)}
              >
                <Check className="h-4 w-4" />
                {item.is_reviewed ? 'Просмотрено' : 'Отметить просмотренным'}
              </Button>
              <Button size="icon" variant="outline" onClick={() => remove(item.id)}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <p className="text-sm whitespace-pre-line dark:text-white/90">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
};
