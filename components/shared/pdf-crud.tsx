/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Pdf } from '@/components/shared/pdf';
import { AddCardButton } from '@/components/shared/add-card-button';
import { toast } from 'sonner';
import { useAdminStore } from '@/store/admin';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';
import { Plus } from 'lucide-react';

interface PdfDocument {
  id: string;
  title: string;
  pdfUrl: string;
}

interface Props {
  apiPath: string;
  title?: string;
}

export const PdfCrud: React.FC<Props> = ({ apiPath, title }) => {
  const [docs, setDocs] = useState<PdfDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useAdminStore((s) => s.isAdmin);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(apiPath);
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const mappedDocs = data.map((doc: any) => ({
            id: doc.id,
            title: doc.title || 'Без названия',
            pdfUrl: doc.pdf_url || '',
          }));
          setDocs(mappedDocs);
        } else {
          setDocs([]);
          toast.error('Полученные данные не являются массивом');
        }
      } catch (e: unknown) {
        const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
        console.error('Ошибка загрузки документов:', error);
        toast.error(`Не удалось загрузить документы: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, [apiPath]);

  const handleAdd = async (
    data: { inputPrimary: string; inputSecondary: string },
    setIsPopoverOpen: (open: boolean) => void
  ) => {
    const newDoc = {
      title: data.inputPrimary.trim(),
      pdf_url: data.inputSecondary.trim(),
    };

    if (!newDoc.title || !newDoc.pdf_url) {
      toast.error('Название и URL PDF обязательны');
      return;
    }

    // Basic URL validation
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
      setDocs((prev) => [
        ...prev,
        {
          id: created.id,
          title: created.title,
          pdfUrl: created.pdf_url,
        },
      ]);
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
      pdf_url: data.pdfUrl.trim(),
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

      setDocs((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? { ...doc, title: data.title, pdfUrl: data.pdfUrl }
            : doc
        )
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
    const deleted = docs.find((doc) => doc.id === id);
    if (!deleted) return;

    setDocs((prev) => prev.filter((doc) => doc.id !== id));

    toast.success(`Документ "${docTitle}" удален`, {
      action: {
        label: 'Отменить',
        onClick: async () => {
          const restoreDoc = {
            id: deleted.id,
            title: deleted.title,
            pdf_url: deleted.pdfUrl,
          };
          try {
            const res = await fetch(apiPath, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(restoreDoc),
            });
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              throw new Error(
                errorData.details ||
                  errorData.error ||
                  'Не удалось восстановить'
              );
            }
            setDocs((prev) => [...prev, deleted]);
            toast.success('Удаление отменено');
          } catch (e: unknown) {
            const error =
              e instanceof Error ? e : new Error('Неизвестная ошибка');
            console.error('Ошибка восстановления:', error);
            toast.error(
              `Ошибка при восстановлении документа: ${error.message}`
            );
            setDocs((prev) => prev.filter((doc) => doc.id !== id));
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
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || 'Не удалось удалить'
        );
      }
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      console.error('Ошибка удаления:', error);
      setDocs((prev) => [...prev, deleted]);
      toast.error(`Ошибка при удалении документа: ${error.message}`);
    }
  };

  return (
    <Container className="px-4">
      <Title
        text={title || 'Документы'}
        size="md"
        className="text-primary font-bold text-center mb-6"
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
        <p className="text-center text-primary/70">Документы отсутствуют</p>
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
