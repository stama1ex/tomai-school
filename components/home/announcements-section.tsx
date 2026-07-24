'use client';

import { useRef, useState } from 'react';
import useSWR from 'swr';
import { ImagePlus, Megaphone, Pencil, Plus, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAdminStore } from '@/store/admin';
import { compressImage } from '@/lib/image';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const API_PATH = '/api/announcements';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

async function uploadImage(file: File): Promise<string | null> {
  try {
    const optimized = await compressImage(file);

    const formData = new FormData();
    formData.append('file', optimized);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(data.error || 'Не удалось загрузить изображение');
      return null;
    }

    return data.url as string;
  } catch (e) {
    console.error(e);
    toast.error('Не удалось загрузить изображение');
    return null;
  }
}

interface ImagePickerProps {
  imageUrl: string | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  imageUrl,
  onFileSelected,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      {imageUrl ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="w-full max-h-48 object-cover rounded-md border"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="absolute top-2 right-2 bg-background"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus /> Добавить изображение
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export const AnnouncementsSection: React.FC = () => {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const [isSaving, setIsSaving] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addContent, setAddContent] = useState('');
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR<Announcement[]>(API_PATH);

  const items: Announcement[] = Array.isArray(data)
    ? [...data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : [];

  const resetAddForm = () => {
    setAddTitle('');
    setAddContent('');
    setAddImageFile(null);
    setAddImagePreview(null);
  };

  const handleAdd = async () => {
    const title = addTitle.trim();
    const content = addContent.trim();
    if (!title || !content) {
      toast.error('Заполните заголовок и текст новости');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl: string | null = null;
      if (addImageFile) {
        imageUrl = await uploadImage(addImageFile);
        if (!imageUrl) return;
      }

      const res = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, image_url: imageUrl }),
      });
      if (!res.ok) throw new Error('Failed to add');

      const created = await res.json();
      mutate((current) => [created, ...(current ?? [])], {
        revalidate: false,
      });
      resetAddForm();
      setIsAddOpen(false);
      toast.success('Новость добавлена!');
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при добавлении новости');
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (item: Announcement) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditImageFile(null);
    setEditImagePreview(item.image_url);
  };

  const handleEdit = async () => {
    if (!editingId) return;
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title || !content) {
      toast.error('Заполните заголовок и текст новости');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = editImagePreview;
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
        if (!imageUrl) return;
      }

      const res = await fetch(API_PATH, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          newData: { title, content, image_url: imageUrl },
        }),
      });
      if (!res.ok) throw new Error('Failed to update');

      mutate(
        (current) =>
          (current ?? []).map((i) =>
            i.id === editingId
              ? { ...i, title, content, image_url: imageUrl }
              : i
          ),
        { revalidate: false }
      );
      setEditingId(null);
      toast.success('Новость обновлена!');
    } catch (e) {
      console.error(e);
      toast.error('Ошибка при обновлении новости');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const deleted = items.find((i) => i.id === id);
    if (!deleted) return;

    mutate((current) => (current ?? []).filter((i) => i.id !== id), {
      revalidate: false,
    });
    toast.success(`Новость "${title}" удалена`);

    try {
      const res = await fetch(API_PATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (e) {
      console.error(e);
      mutate((current) => [...(current ?? []), deleted], {
        revalidate: false,
      });
      toast.error('Ошибка при удалении новости');
    }
  };

  if (!isLoading && items.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <Container className="px-4 py-12">
      <div className="flex items-center justify-between mb-6 gap-4">
        <Title
          text="Новости и объявления"
          size="md"
          className="dark:text-white font-bold"
        />

        {isAdmin && (
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) resetAddForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus /> Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая новость</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Заголовок"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Текст новости"
                  value={addContent}
                  onChange={(e) => setAddContent(e.target.value)}
                />
                <ImagePicker
                  imageUrl={addImagePreview}
                  onFileSelected={(file) => {
                    setAddImageFile(file);
                    setAddImagePreview(URL.createObjectURL(file));
                  }}
                  onRemove={() => {
                    setAddImageFile(null);
                    setAddImagePreview(null);
                  }}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAdd} disabled={isSaving}>
                  {isSaving ? 'Публикация...' : 'Опубликовать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-center text-muted-foreground">
          Новостей пока нет
        </p>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col rounded-lg border bg-card shadow-xs overflow-hidden"
            >
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Dialog
                    open={editingId === item.id}
                    onOpenChange={(open) => !open && setEditingId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="bg-background"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать новость</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-3">
                        <Input
                          placeholder="Заголовок"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <Textarea
                          placeholder="Текст новости"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <ImagePicker
                          imageUrl={editImagePreview}
                          onFileSelected={(file) => {
                            setEditImageFile(file);
                            setEditImagePreview(URL.createObjectURL(file));
                          }}
                          onRemove={() => {
                            setEditImageFile(null);
                            setEditImagePreview(null);
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleEdit} disabled={isSaving}>
                          {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-background"
                    onClick={() => handleDelete(item.id, item.title)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}

              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  loading="lazy"
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="flex flex-col gap-2 p-4">
                {!item.image_url && <Megaphone className="h-5 w-5 text-primary" />}
                <h3 className="font-semibold dark:text-white pr-16 break-words">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                  {item.content}
                </p>
                <span className="text-xs text-muted-foreground mt-auto pt-2">
                  {formatDate(item.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};
