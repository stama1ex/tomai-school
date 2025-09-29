/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/store/admin';
import { toast } from 'sonner';

export interface Column<T> {
  key: keyof T | 'index';
  label: string;
  editable?: boolean;
}

interface EditableTableProps<T extends { id?: string }> {
  data: T[];
  columns: Column<T>[];
  apiPath?: string;
  className?: string;
}

export function EditableTable<T extends { id?: string }>({
  data,
  columns,
  apiPath,
  className,
}: EditableTableProps<T>) {
  const [rows, setRows] = useState<T[]>(data);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(apiPath ? true : false);
  const { isAdmin } = useAdminStore();

  useEffect(() => {
    const fetchData = async () => {
      if (apiPath) {
        try {
          setLoading(true);
          const response = await fetch(apiPath);
          if (!response.ok) throw new Error('Ошибка при загрузке данных');
          const result = await response.json();
          setRows(result);
        } catch (error) {
          toast.error('Не удалось загрузить данные');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [apiPath]);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleEdit = (row: T) => {
    setEditingRow(row.id ?? '');
    setEditedRow(row);
  };

  const handleChange = (key: keyof T | 'index', value: any) => {
    if (key !== 'index') {
      setEditedRow((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    if (!editingRow || !isAdmin) return;

    try {
      const updated = rows.map((r) =>
        r.id === editingRow ? { ...r, ...editedRow } : r
      );
      setRows(updated);
      setEditingRow(null);

      if (apiPath) {
        const response = await fetch(apiPath, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingRow, newData: editedRow }),
        });
        if (!response.ok) {
          throw new Error('Ошибка при сохранении');
        }
        toast.success('Обновлено!');
      }
    } catch (error) {
      toast.error('Ошибка при обновлении');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!rows.length) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full bg-background border border-primary/20 rounded-lg">
        <thead>
          <tr className="bg-primary/10">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left text-xs font-bold uppercase border-b border-primary/20 dark:text-white"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-2 border-b border-primary/20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {rows.map((row, index) => (
            <tr key={row.id ?? JSON.stringify(row)}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-2 text-sm dark:text-white/80"
                >
                  {col.key === 'index' ? (
                    <span>{index + 1}</span>
                  ) : editingRow === row.id && col.editable && isAdmin ? (
                    <Input
                      value={String(
                        (editedRow[col.key as keyof T] as string) ??
                          row[col.key as keyof T] ??
                          ''
                      )}
                      onChange={(e) => handleChange(col.key, e.target.value)}
                    />
                  ) : (
                    <span>{String(row[col.key as keyof T])}</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-2 text-sm">
                {editingRow === row.id && isAdmin ? (
                  <Button size="sm" onClick={handleSave}>
                    Сохранить
                  </Button>
                ) : isAdmin ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(row)}
                  >
                    Изменить
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
