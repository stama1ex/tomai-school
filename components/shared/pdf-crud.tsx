'use client';

import useSWR from 'swr';
import { Pdf } from '@/components/shared/pdf';
import { AddCardButton } from '@/components/shared/add-card-button';
import { toast } from 'sonner';
import { useAdminStore } from '@/store/admin';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';
import { Plus } from 'lucide-react';
import { normalizeDriveUrl } from '@/lib/utils';

interface RawDoc {
  id: string;
  title?: string;
  pdf_url?: string;
}

interface PdfDocument {
  id: string;
  title: string;
  pdfUrl: string;
}

interface Props {
  apiPath: string;
  title?: string;
  extraFields?: Record<string, string>;
}

export const PdfCrud: React.FC<Props> = ({ apiPath, title, extraFields }) => {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const { data, isLoading, mutate } = useSWR<RawDoc[]>(apiPath);

  const docs: PdfDocument[] = Array.isArray(data)
    ? data.map((doc) => ({
        id: doc.id,
        title: doc.title || 'Без названия',
        pdfUrl: doc.pdf_url || '',
      }))
    : [];

  const handleAdd = async (
    data: { inputPrimary: string; inputSecondary: string },
    setIsPopoverOpen: (open: boolean) => void
  ) => {
    const newDoc = {
      ...extraFields,
      title: data.inputPrimary.trim(),
      pdf_url: normalizeDriveUrl(data.inputSecondary.trim()),
    };

    if (!newDoc.title || !newDoc.pdf_url) {
      toast.error('Название и URL PDF обязательны');
      return;
    }

    try {
      new URL(newDoc.pdf_url);
    } catch {
      toast.error('Некорректный URL PDF');
      return;
    }

    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newDoc, id: crypto.randomUUID() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || 'Не удалось добавить документ'
        );
      }

      const created = await res.json();
      mutate((current) => [...(current ?? []), created], {
        revalidate: false,
      });
      setIsPopoverOpen(false);
      toast.success('Документ добавлен!');
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      console.error('Ошибка добавления:', error);
      toast.error(`Ошибка при добавлении документа: ${error.message}`);
    }
  };

  const handleEdit = async (
    id: string,
    data: PdfDocument,
    setIsPopoverOpen: (open: boolean) => void
  ) => {
    const updatedData = {
      title: data.title.trim(),
      pdf_url: normalizeDriveUrl(data.pdfUrl.trim()),
    };

    if (!updatedData.title || !updatedData.pdf_url) {
      toast.error('Название и URL PDF обязательны');
      return;
    }

    try {
      new URL(updatedData.pdf_url);
    } catch {
      toast.error('Некорректный URL PDF');
      return;
    }

    try {
      const res = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newData: updatedData }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || 'Не удалось обновить документ'
        );
      }

      mutate(
        (current) =>
          (current ?? []).map((doc) =>
            doc.id === id ? { ...doc, ...updatedData } : doc
          ),
        { revalidate: false }
      );
      setIsPopoverOpen(false);
      toast.success('Документ обновлен!');
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      console.error('Ошибка обновления:', error);
      toast.error(`Ошибка при обновлении документа: ${error.message}`);
    }
  };

  const handleDelete = async (id: string, docTitle: string) => {
    const deleted = (data ?? []).find((doc) => doc.id === id);
    if (!deleted) return;

    mutate((current) => (current ?? []).filter((doc) => doc.id !== id), {
      revalidate: false,
    });

    toast.success(`Документ "${docTitle}" удален`);

    try {
      const res = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || 'Не удалось удалить'
        );
      }
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      console.error('Ошибка удаления:', error);
      mutate((current) => [...(current ?? []), deleted], {
        revalidate: false,
      });
      toast.error(`Ошибка при удалении документа: ${error.message}`);
    }
  };

  return (
    <Container className="px-4">
      <Title
        text={title || 'Документы'}
        size="md"
        className="dark:text-white font-bold text-center mb-6"
      />
      <hr className="mb-6" />
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <AddCardButton
            inputPrimary="Название документа"
            inputSecondary="URL PDF"
            placeholder={
              <>
                <Plus /> Добавить документ
              </>
            }
            className="w-fit"
            onAdd={handleAdd}
          />
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center mt-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {!isLoading && docs.length === 0 && (
        <p className="text-center dark:text-white/70">Документы отсутствуют</p>
      )}
      {!isLoading && docs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col border rounded-lg overflow-hidden"
            >
              <Pdf
                url={doc.pdfUrl}
                title={doc.title}
                onEdit={handleEdit.bind(null, doc.id)}
                onDelete={() => handleDelete(doc.id, doc.title)}
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};
