'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const ConcernForm: React.FC = () => {
  const [reporterName, setReporterName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Опишите, пожалуйста, ситуацию');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/concern-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterName, contact, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Не удалось отправить сообщение');

      setIsSent(true);
      setReporterName('');
      setContact('');
      setMessage('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка отправки');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="font-medium dark:text-white">Сообщение отправлено.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Спасибо, что не остались равнодушны. Администрация гимназии
          рассмотрит его в приоритетном порядке.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsSent(false)}
        >
          Отправить ещё одно сообщение
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Поля «имя» и «контакт» необязательны — сообщение можно отправить
        анонимно.
      </p>
      <Input
        placeholder="Ваше имя (необязательно)"
        value={reporterName}
        onChange={(e) => setReporterName(e.target.value)}
      />
      <Input
        placeholder="Телефон или email (необязательно)"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <Textarea
        placeholder="Опишите ситуацию"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-32"
      />
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
      </Button>
    </form>
  );
};
