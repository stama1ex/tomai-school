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
  const [newPrimary, setNewPrimary] = useState('');
  const [newSecondary, setNewSecondary] = useState('');

  const handleSave = async () => {
    try {
      await onAdd({
        inputPrimary: newPrimary || 'Новый сотрудник',
        inputSecondary: newSecondary || 'Должность',
      });
      setIsPopoverOpen(false);
      setNewPrimary('');
      setNewSecondary('');
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
            value={newPrimary}
            onChange={(e) => setNewPrimary(e.target.value)}
            placeholder={inputPrimary}
          />
          <Input
            value={newSecondary}
            onChange={(e) => setNewSecondary(e.target.value)}
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
