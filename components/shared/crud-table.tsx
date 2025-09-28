/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
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
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useAdminStore((s) => s.isAdmin);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiPath);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(
          data.map((d: any) => ({
            id: d.id,
            primary: d[primaryLabel.toLowerCase()],
            secondary: d[secondaryLabel.toLowerCase()],
          }))
        );
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error(e);
      toast.error('Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [apiPath]);

  const handleAdd = async (newData: {
    primaryText: string;
    secondaryText: string;
  }) => {
    const body = {
      [primaryLabel.toLowerCase()]: newData.primaryText,
      [secondaryLabel.toLowerCase()]: newData.secondaryText,
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
      setItems((prev) => [
        ...prev,
        {
          id: created.id,
          primary: created[primaryLabel.toLowerCase()],
          secondary: created[secondaryLabel.toLowerCase()],
        },
      ]);
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
          [primaryLabel.toLowerCase()]: newData.primaryText,
          [secondaryLabel.toLowerCase()]: newData.secondaryText,
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

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                primary: newData.primaryText,
                secondary: newData.secondaryText,
              }
            : i
        )
      );

      toast.success('Обновлено!');
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const deleted = items.find((i) => i.id === id);
    if (!deleted) return;

    setItems((prev) => prev.filter((i) => i.id !== id));

    toast.success(`Удалено "${name}"`, {
      action: {
        label: 'Отменить',
        onClick: async () => {
          setItems((prev) => [...prev, deleted]);
          try {
            await fetch(apiPath, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: deleted.id,
                [primaryLabel.toLowerCase()]: deleted.primary,
                [secondaryLabel.toLowerCase()]: deleted.secondary,
              }),
            });
            toast.success('Удаление отменено');
          } catch (e) {
            toast.error('Ошибка при восстановлении');
            console.error(e);
          }
        },
      },
    });

    try {
      const res = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed delete');
    } catch (e) {
      console.error(e);
      setItems((prev) => [...prev, deleted]);
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
