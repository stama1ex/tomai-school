'use client';

import useSWR from 'swr';
import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';
import { Card } from '@/components/ui/card';
import { AddCardButton } from '@/components/shared/add-card-button';
import { toast } from 'sonner';
import { useAdminStore } from '@/store/admin';
import { Plus } from 'lucide-react';

export interface Item {
  id: string;
  primary: string;
  secondary: string;
}

interface RawRow {
  id: string;
  [key: string]: unknown;
}

interface CrudTableProps {
  apiPath: string;
  bannerImage?: string;
  bannerTitle?: string;
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryLabelDisplay?: string;
  secondaryLabelDisplay?: string;
}

export const CrudTable: React.FC<CrudTableProps> = ({
  apiPath,
  bannerImage = '/background.jpg',
  bannerTitle = '',
  title,
  primaryLabel,
  secondaryLabel,
  primaryLabelDisplay,
  secondaryLabelDisplay,
}) => {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const primaryKey = primaryLabel.toLowerCase();
  const secondaryKey = secondaryLabel.toLowerCase();

  const { data, isLoading, mutate } = useSWR<RawRow[]>(apiPath);

  const items: Item[] = Array.isArray(data)
    ? data.map((row) => ({
        id: row.id,
        primary: String(row[primaryKey] ?? ''),
        secondary: String(row[secondaryKey] ?? ''),
      }))
    : [];

  const handleAdd = async (newData: {
    primaryText: string;
    secondaryText: string;
  }) => {
    const body = {
      [primaryKey]: newData.primaryText,
      [secondaryKey]: newData.secondaryText,
    };

    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Server response:', text);
        throw new Error('Failed to add');
      }

      const created = await res.json();
      mutate((current) => [...(current ?? []), created], {
        revalidate: false,
      });
      toast.success('Добавлено!');
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при добавлении');
    }
  };

  const handleEdit = async (
    id: string,
    newData: { primaryText: string; secondaryText: string }
  ) => {
    try {
      const body = {
        id,
        newData: {
          [primaryKey]: newData.primaryText,
          [secondaryKey]: newData.secondaryText,
        },
      };

      const res = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('Failed to edit');
      }

      mutate(
        (current) =>
          (current ?? []).map((row) =>
            row.id === id
              ? {
                  ...row,
                  [primaryKey]: newData.primaryText,
                  [secondaryKey]: newData.secondaryText,
                }
              : row
          ),
        { revalidate: false }
      );

      toast.success('Обновлено!');
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const deleted = (data ?? []).find((row) => row.id === id);
    if (!deleted) return;

    mutate((current) => (current ?? []).filter((row) => row.id !== id), {
      revalidate: false,
    });

    toast.success(`Удалено "${name}"`);

    try {
      const res = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed delete');
    } catch (e) {
      console.error(e);
      mutate((current) => [...(current ?? []), deleted], {
        revalidate: false,
      });
      toast.error('Ошибка при удалении');
    }
  };

  return (
    <>
      <Banner
        image={bannerImage}
        title={bannerTitle || title}
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <Title
          text={title}
          size="md"
          className="dark:text-white font-bold text-center mb-6"
        />
        <hr className="mb-6" />

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <AddCardButton
              inputPrimary={primaryLabelDisplay || primaryLabel}
              inputSecondary={secondaryLabelDisplay || secondaryLabel}
              placeholder={
                <>
                  <Plus /> Добавить
                </>
              }
              onAdd={(data) =>
                handleAdd({
                  primaryText: data.inputPrimary,
                  secondaryText: data.inputSecondary,
                })
              }
            />
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mt-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => (
              <Card
                key={i.id}
                primaryText={i.primary}
                secondaryText={i.secondary}
                onEdit={(newData) =>
                  handleEdit(i.id, {
                    primaryText: newData.primaryText,
                    secondaryText: newData.secondaryText,
                  })
                }
                onDelete={() => handleDelete(i.id, i.primary)}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
};
