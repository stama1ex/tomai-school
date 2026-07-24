'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Title } from './title';

interface ExamYearRow {
  id: string;
  year: string;
}

interface EditableYearProps {
  apiPath: string;
  className?: string;
}

export function EditableYear({ apiPath, className }: EditableYearProps) {
  const { data, isLoading } = useSWR<ExamYearRow[]>(apiPath);
  const [editing, setEditing] = useState(false);
  const [editedYear, setEditedYear] = useState('');
  const { isAdmin } = useAdminStore();

  const current = data?.[0];
  const year = current?.year ?? '2025';

  const handleEdit = () => {
    setEditedYear(year);
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedYear(e.target.value);
  };

  const handleSave = async () => {
    if (!current || !isAdmin) return;

    const newYear = editedYear;
    setEditing(false);
    mutate(apiPath, [{ ...current, year: newYear }], { revalidate: false });

    try {
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.id, newData: { year: newYear } }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при сохранении');
      }
      toast.success('Год обновлен!');
    } catch {
      toast.error('Ошибка при обновлении года');
      mutate(apiPath);
    }
  };

  if (isLoading) {
    return <span className="animate-pulse">Загрузка года...</span>;
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-4',
        className
      )}
    >
      {editing && isAdmin ? (
        <>
          <Input
            placeholder="Введите нынешний год"
            value={editedYear}
            onChange={handleChange}
            className="w-24 text-center"
          />
          <Button size="sm" onClick={handleSave}>
            Сохранить
          </Button>
        </>
      ) : (
        <>
          <Title
            text={`Экзамены - ${year}`}
            size="4xl"
            className="text-white font-bold hidden md:block"
          />
          <Title
            text={`Экзамены - ${year}`}
            size="xl"
            className="text-white font-bold md:hidden"
          />
          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="mt-2 md:mt-0 not-dark:text-black"
            >
              Изменить год
            </Button>
          )}
        </>
      )}
    </div>
  );
}
