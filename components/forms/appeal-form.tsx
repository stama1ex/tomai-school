'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const AppealForm: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast.error('Заполните имя, контакт и текст обращения');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Не удалось отправить обращение');

      setIsSent(true);
      setName('');
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
        <p className="font-medium dark:text-white">
          Спасибо! Ваше обращение отправлено.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Мы свяжемся с вами по указанным контактам.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsSent(false)}
        >
          Отправить ещё одно обращение
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Телефон или email для связи"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <Textarea
        placeholder="Текст обращения"
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
        {isSubmitting ? 'Отправка...' : 'Отправить обращение'}
      </Button>
    </form>
  );
};
