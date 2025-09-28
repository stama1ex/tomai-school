'use client';

import { ReactNode, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddCardButtonProps {
  onAdd: (newData: {
    inputPrimary: string;
    inputSecondary: string;
    name: string;
    role: string;
  }) => Promise<void>;
  placeholder?: ReactNode;
  inputPrimary: string;
  inputSecondary: string;
}

export const AddCardButton: React.FC<AddCardButtonProps> = ({
  onAdd,
  placeholder,
  inputPrimary,
  inputSecondary,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleSave = async () => {
    try {
      await onAdd({
        inputPrimary: newRole || 'Должность',
        inputSecondary: newName || 'Новый сотрудник',
        name: newName || 'Новый сотрудник',
        role: newRole || 'Должность',
      });
      setIsPopoverOpen(false);
      setNewName('');
      setNewRole('');
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button>{placeholder || 'Добавить карточку'}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={inputPrimary}
          />
          <Input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder={inputSecondary}
          />
          <Button onClick={handleSave} size="sm">
            Сохранить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
