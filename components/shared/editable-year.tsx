/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Title } from './title';

interface EditableYearProps {
  apiPath: string;
  className?: string;
  onYearChange?: (newYear: string) => void;
}

export function EditableYear({
  apiPath,
  className,
  onYearChange,
}: EditableYearProps) {
  const [year, setYear] = useState('2025');
  const [editing, setEditing] = useState(false);
  const [editedYear, setEditedYear] = useState('');
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminStore();

  useEffect(() => {
    const fetchYear = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiPath);
        if (!response.ok) throw new Error('Ошибка при загрузке года');
        const result = await response.json();
        if (result && result.length > 0) {
          setYear(result[0].year);
          setId(result[0].id);
          setEditedYear(result[0].year);
          if (onYearChange) onYearChange(result[0].year);
        }
      } catch (error) {
        toast.error('Не удалось загрузить год');
      } finally {
        setLoading(false);
      }
    };
    fetchYear();
  }, [apiPath, onYearChange]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedYear(e.target.value);
  };

  const handleSave = async () => {
    if (!id || !isAdmin) return;

    try {
      setYear(editedYear);
      if (onYearChange) onYearChange(editedYear);
      setEditing(false);

      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newData: { year: editedYear } }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при сохранении');
      }
      toast.success('Год обновлен!');
    } catch (error) {
      toast.error('Ошибка при обновлении года');
    }
  };

  if (loading) {
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
