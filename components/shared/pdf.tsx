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

interface PdfDocument {
  id: string;
  title: string;
  pdfUrl: string;
}

interface PdfItem {
  className?: string;
  url: string;
  title?: string;
  onEdit?: (
    newData: PdfDocument,
    setIsPopoverOpen: (open: boolean) => void
  ) => void;
  onDelete?: () => void;
}

export const Pdf: React.FC<PdfItem> = ({
  className,
  url,
  title,
  onEdit,
  onDelete,
}) => {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const [newTitle, setNewTitle] = useState(title || '');
  const [newPdfUrl, setNewPdfUrl] = useState(url);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSave = async () => {
    try {
      const newData: PdfDocument = {
        id: '',
        title: newTitle,
        pdfUrl: newPdfUrl,
      };
      onEdit?.(newData, setIsPopoverOpen);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div className={cn(className, 'relative')}>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-5">
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
                  placeholder="Название"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="URL (обязательно /preview)"
                  value={newPdfUrl}
                  onChange={(e) => setNewPdfUrl(e.target.value)}
                  className="border rounded p-2 text-sm"
                />
                <Button onClick={handleSave} size="sm">
                  Сохранить
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button size="icon" variant="destructive" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}

      {title && (
        <h3 className="bg-primary/10 dark:text-white font-semibold p-4 text-center">
          {title}
        </h3>
      )}

      {!title && isAdmin && (
        <h3 className="bg-primary/10 dark:text-white/70 font-semibold italic p-4 text-center">
          Без названия
        </h3>
      )}

      <div className="flex justify-center">
        <iframe src={url} className="w-full h-[50vh] md:h-[70vh]"></iframe>
      </div>
    </div>
  );
};
