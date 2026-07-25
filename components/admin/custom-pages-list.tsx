'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { toast } from 'sonner';
import { ExternalLink, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CustomPageRow {
  id: string;
  slug: string;
  title: string;
  order: number;
}

const API_PATH = '/api/custom-pages';

export const CustomPagesList: React.FC = () => {
  const { data, isLoading, mutate } = useSWR<CustomPageRow[]>(API_PATH);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const pages = data ?? [];

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) {
      toast.error('Укажите название страницы');
      return;
    }

    try {
      const res = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const created = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(created.error || 'Не удалось создать страницу');
      }

      mutate((current) => [...(current ?? []), created], { revalidate: false });
      setNewTitle('');
      setIsAddOpen(false);
      toast.success('Страница создана');
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      toast.error(error.message);
    }
  };

  const handleRename = async (id: string) => {
    const title = renameValue.trim();
    if (!title) {
      toast.error('Название не может быть пустым');
      return;
    }

    try {
      const res = await fetch(API_PATH, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title }),
      });
      const updated = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(updated.error || 'Не удалось переименовать страницу');
      }

      mutate(
        (current) =>
          (current ?? []).map((p) => (p.id === id ? { ...p, title } : p)),
        { revalidate: false }
      );
      setRenamingId(null);
      toast.success('Страница переименована');
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    mutate((current) => (current ?? []).filter((p) => p.id !== id), {
      revalidate: false,
    });
    setConfirmingId(null);

    try {
      const res = await fetch(API_PATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Страница «${title}» удалена вместе с документами`);
    } catch {
      toast.error('Не удалось удалить страницу');
      mutate();
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
        <PopoverTrigger asChild>
          <Button className="w-fit">
            <Plus /> Добавить страницу
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(20rem,calc(100vw-2rem))]">
          <div className="flex flex-col gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Название страницы"
              autoFocus
            />
            <Button onClick={handleAdd} size="sm">
              Создать
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!isLoading && pages.length === 0 && (
        <p className="text-muted-foreground">Дополнительных страниц пока нет</p>
      )}

      {!isLoading && pages.length > 0 && (
        <div className="flex flex-col gap-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-lg border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium dark:text-white">
                    {page.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    /more/{page.slug}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/more/${page.slug}`}>
                      <ExternalLink className="h-4 w-4" /> Открыть
                    </Link>
                  </Button>
                  <Popover
                    open={renamingId === page.id}
                    onOpenChange={(open) => {
                      setRenamingId(open ? page.id : null);
                      if (open) setRenameValue(page.title);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="outline">
                        Переименовать
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[min(20rem,calc(100vw-2rem))]">
                      <div className="flex flex-col gap-2">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          placeholder="Название страницы"
                          autoFocus
                        />
                        <Button
                          onClick={() => handleRename(page.id)}
                          size="sm"
                        >
                          Сохранить
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {confirmingId === page.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(page.id, page.title)}
                      >
                        Точно удалить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmingId(null)}
                      >
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmingId(page.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
