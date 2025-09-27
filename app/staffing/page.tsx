'use client';

import { useEffect, useState } from 'react';
import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';
import { Card } from '@/components/ui/card';
import { useAdminStore } from '@/store/admin';
import { AddCardButton } from '@/components/shared/add-card-button';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export default function Staffing() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const isAdmin = useAdminStore((s) => s.isAdmin);

  useEffect(() => {
    fetch('/api/staffing')
      .then((res) => res.json())
      .then(setStaff);
  }, []);

  const handleEdit = async (id: string, newData: StaffMember) => {
    try {
      const response = await fetch('/api/staffing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newData }),
      });
      if (response.ok) {
        setStaff((prev) =>
          prev.map((m) => (m.id === id ? { ...newData, id } : m))
        );
      } else {
        throw new Error('Failed to update staff member');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const deletedItem = staff.find((m) => m.id === id);
    if (!deletedItem) return;

    setStaff((prev) => prev.filter((m) => m.id !== id));

    toast(`Сотрудник "${name}" удален`, {
      action: {
        label: 'Отменить',
        onClick: async () => {
          setStaff((prev) =>
            [...prev, deletedItem].sort((a, b) => a.id.localeCompare(b.id))
          );
        },
      },
      duration: 5000,
      onAutoClose: async () => {
        try {
          const response = await fetch('/api/staffing', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          if (!response.ok) {
            setStaff((prev) =>
              [...prev, deletedItem].sort((a, b) => a.id.localeCompare(b.id))
            );
            toast.error('Ошибка при удалении сотрудника');
          }
        } catch (error) {
          setStaff((prev) =>
            [...prev, deletedItem].sort((a, b) => a.id.localeCompare(b.id))
          );
          toast.error('Ошибка при удалении сотрудника');
          console.error('Error deleting staff:', error);
        }
      },
    });
  };

  const handleAdd = async (newData: { name: string; role: string }) => {
    const newItem: StaffMember = {
      id: '',
      name: newData.name,
      role: newData.role,
    };
    try {
      const response = await fetch('/api/staffing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const createdItem = await response.json();
        setStaff((prev) => [...prev, createdItem]);
      } else {
        throw new Error('Failed to add staff member');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  return (
    <>
      <Banner
        image="/background.jpg"
        title="Кадровый состав"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <Title
          text="Администрация ПУ Гимназия с. Томай"
          size="md"
          className="text-primary font-bold text-center mb-6"
        />
        <hr className="mb-6" />

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <AddCardButton
              inputPrimary="Имя"
              inputSecondary="Должность"
              placeholder="Добавить преподавателя"
              onAdd={handleAdd}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {staff.map((member) => (
            <Card
              key={member.id}
              primaryText={member.name}
              secondaryText={member.role}
              onEdit={(newData) =>
                handleEdit(member.id, {
                  name: newData.primaryText,
                  role: newData.secondaryText,
                  id: member.id,
                })
              }
              onDelete={() => handleDelete(member.id, member.name)}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
