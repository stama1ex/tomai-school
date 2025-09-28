'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { useAdminStore } from '@/store/admin';

interface CardItem {
  className?: string;
  primaryText: string;
  secondaryText: string;
  onEdit?: (newData: { primaryText: string; secondaryText: string }) => void;
  onDelete?: () => void;
}

export const Card: React.FC<CardItem> = ({
  className,
  primaryText,
  secondaryText,
  onEdit,
  onDelete,
}) => {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const [newPrimary, setNewPrimary] = useState(primaryText);
  const [newSecondary, setNewSecondary] = useState(secondaryText);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSave = async () => {
    try {
      onEdit?.({
        primaryText: newPrimary,
        secondaryText: newSecondary,
      });
      setIsPopoverOpen(false);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  return (
    <div
      className={cn(
        className,
        'relative bg-background p-4 rounded-lg border max-w-sm w-full'
      )}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="outline">
                <Pencil className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="ФИО"
                  value={newPrimary}
                  onChange={(e) => setNewPrimary(e.target.value)}
                  className="border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Должность или класс"
                  value={newSecondary}
                  onChange={(e) => setNewSecondary(e.target.value)}
                  className="border rounded p-2 text-sm"
                />
                <Button onClick={handleSave} size="sm">
                  Сохранить
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            size="icon"
            variant="outline"
            onClick={onDelete}
            className="bg-background"
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )}

      <div className="pr-16">
        <h3 className="text-lg font-semibold dark:text-white mb-2 break-words">
          {newPrimary ||
            (isAdmin ? <i className="dark:text-white/50">Без названия</i> : '')}
        </h3>
        <p className="dark:text-white/80 break-words">
          {newSecondary ||
            (isAdmin ? <i className="dark:text-white/50">Без описания</i> : '')}
        </p>
      </div>
    </div>
  );
};
