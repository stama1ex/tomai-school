// components/shared/editable-title.tsx
'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/shared/title';
import { useAdminStore } from '@/store/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ExamTitleRow {
  id: string;
  type: string;
  text: string;
}

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
  const key = `${apiPath}?type=${type}`;
  const { data, isLoading } = useSWR<ExamTitleRow[]>(key);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const { isAdmin } = useAdminStore();

  const current = data?.[0];
  const text = current?.text ?? '';

  const handleEdit = () => {
    setEditedText(text);
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  const handleSave = async () => {
    if (!current || !isAdmin) return;

    const newText = editedText;
    setEditing(false);
    mutate(key, [{ ...current, text: newText }], { revalidate: false });

    try {
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.id, newData: { text: newText } }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при сохранении');
      }
      toast.success('Заголовок обновлен!');
    } catch {
      toast.error('Ошибка при обновлении заголовка');
      mutate(key);
    }
  };

  if (isLoading) {
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
