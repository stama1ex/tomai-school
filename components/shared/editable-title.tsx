/* eslint-disable @typescript-eslint/no-unused-vars */
// components/shared/editable-title.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/shared/title';
import { useAdminStore } from '@/store/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EditableTitleProps {
  apiPath: string;
  type: string; // 'primary' или 'graduation'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

export function EditableTitle({
  apiPath,
  type,
  size = 'md',
  className,
}: EditableTitleProps) {
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminStore();

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiPath}?type=${type}`);
        if (!response.ok) throw new Error('Ошибка при загрузке заголовка');
        const result = await response.json();
        if (result && result.length > 0) {
          setText(result[0].text);
          setId(result[0].id);
          setEditedText(result[0].text);
        }
      } catch (error) {
        toast.error('Не удалось загрузить заголовок');
      } finally {
        setLoading(false);
      }
    };
    fetchTitle();
  }, [apiPath, type]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  const handleSave = async () => {
    if (!id || !isAdmin) return;

    try {
      setText(editedText);
      setEditing(false);

      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newData: { text: editedText } }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при сохранении');
      }
      toast.success('Заголовок обновлен!');
    } catch (error) {
      toast.error('Ошибка при обновлении заголовка');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto mb-6 animate-pulse h-8 w-3/4 bg-primary/10 rounded" />
    );
  }

  return (
    <div className="flex flex-col items-center md:flex-row md:items-center md:justify-center gap-4 mb-6">
      {editing && isAdmin ? (
        <>
          <Input
            value={editedText}
            onChange={handleChange}
            className={cn(
              'flex-1 text-center font-bold dark:text-white leading-tight h-10',
              className
            )}
          />
          <Button size="sm" onClick={handleSave} className="mt-2 md:mt-0 h-10">
            Сохранить
          </Button>
        </>
      ) : (
        <>
          <Title
            text={text}
            size={size}
            className={cn('text-center leading-tight', className)}
          />
          {isAdmin && !editing && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="mt-2 md:mt-0 h-10"
            >
              Изменить заголовок
            </Button>
          )}
        </>
      )}
    </div>
  );
}
