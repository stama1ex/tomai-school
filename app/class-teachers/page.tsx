'use client';

import { useEffect, useState } from 'react';
import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';
import { Card } from '@/components/ui/card';
import { useAdminStore } from '@/store/admin';
import { AddCardButton } from '@/components/shared/add-card-button';
import { toast } from 'sonner';

interface Teacher {
  id: string;
  class: string;
  name: string;
}

export default function ClassTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const isAdmin = useAdminStore((s) => s.isAdmin);

  useEffect(() => {
    fetch('/api/class-teachers')
      .then((res) => res.json())
      .then(setTeachers);
  }, []);

  const handleEdit = async (id: string, newData: Teacher) => {
    try {
      const response = await fetch('/api/class-teachers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newData }),
      });
      if (response.ok) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === id ? { ...newData, id } : t))
        );
      } else {
        throw new Error('Failed to update teacher');
      }
    } catch (error) {
      toast.error('Ошибка при обновлении классного руководителя');
      console.error('Error updating teacher:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const deletedItem = teachers.find((t) => t.id === id);
    if (!deletedItem) return;

    setTeachers((prev) => prev.filter((t) => t.id !== id));

    toast(`Классный руководитель "${name}" удален`, {
      action: {
        label: 'Отменить',
        onClick: async () => {
          setTeachers((prev) =>
            [...prev, deletedItem].sort((a, b) => a.id.localeCompare(b.id))
          );
        },
      },
      duration: 5000,
      onAutoClose: async () => {
        try {
          const response = await fetch('/api/class-teachers', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          if (!response.ok) {
            setTeachers((prev) =>
              [...prev, deletedItem].sort((a, b) => a.id.localeCompare(b.id))
            );
            toast.error('Ошибка при удалении классного руководителя');
          }
        } catch (error) {
          setTeachers((prev) =>
            [...prev, deletedItem].sort((a, b) => a.id.localeCompare(b.id))
          );
          toast.error('Ошибка при удалении классного руководителя');
          console.error('Error deleting teacher:', error);
        }
      },
    });
  };

  const handleAdd = async (newData: { name: string; role: string }) => {
    const newItem: Teacher = {
      id: '',
      class: newData.role,
      name: newData.name,
    };
    try {
      const response = await fetch('/api/class-teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const createdItem = await response.json();
        setTeachers((prev) => [...prev, createdItem]);
        toast.success('Классный руководитель добавлен!');
      } else {
        throw new Error('Failed to add teacher');
      }
    } catch (error) {
      toast.error('Ошибка при добавлении классного руководителя');
      console.error('Error adding teacher:', error);
    }
  };

  return (
    <>
      <Banner
        image="/background.jpg"
        title="Классные руководители"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <Title
          text="Список классных руководителей на 2024 – 2025 учебный год"
          size="md"
          className="text-primary font-bold text-center mb-6"
        />
        <hr className="mb-6" />

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <AddCardButton
              inputPrimary="Имя"
              inputSecondary="Класс"
              placeholder="Добавить классного руководителя"
              onAdd={handleAdd}
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <Card
              key={teacher.id}
              primaryText={teacher.class}
              secondaryText={teacher.name}
              onEdit={(newData) =>
                handleEdit(teacher.id, {
                  class: newData.primaryText,
                  name: newData.secondaryText,
                  id: teacher.id,
                })
              }
              onDelete={() => handleDelete(teacher.id, teacher.name)}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
