'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { SiteSettings, SocialLink } from '@/lib/settings';

interface Props {
  initial: SiteSettings;
}

const FIELD_LABEL_CLASS = 'text-sm font-medium dark:text-white mb-1 block';

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className={FIELD_LABEL_CLASS}>{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  );
}

export const SettingsForm: React.FC<Props> = ({ initial }) => {
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [isSaving, setIsSaving] = useState(false);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, ...patch } : link
      ),
    }));
  };

  const addSocialLink = () =>
    setSettings((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: '', url: '' }],
    }));

  const removeSocialLink = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cleanedSocialLinks = settings.socialLinks
        .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
        .filter((l) => l.label && l.url);

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, socialLinks: cleanedSocialLinks }),
      });
      if (!res.ok) throw new Error();
      toast.success('Настройки сохранены');
    } catch {
      toast.error('Не удалось сохранить настройки');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold dark:text-white">
          Основные данные
        </h2>
        <div>
          <label className={FIELD_LABEL_CLASS}>Полное наименование</label>
          <Input
            value={settings.fullName}
            onChange={(e) => set('fullName', e.target.value)}
          />
        </div>
        <div>
          <label className={FIELD_LABEL_CLASS}>Краткое наименование</label>
          <Input
            value={settings.shortName}
            onChange={(e) => set('shortName', e.target.value)}
          />
        </div>
        <div>
          <label className={FIELD_LABEL_CLASS}>Адрес</label>
          <Input
            value={settings.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={FIELD_LABEL_CLASS}>Телефон</label>
            <Input
              value={settings.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
          <div>
            <label className={FIELD_LABEL_CLASS}>Email</label>
            <Input
              value={settings.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={FIELD_LABEL_CLASS}>График работы</label>
            <Input
              value={settings.workHours}
              onChange={(e) => set('workHours', e.target.value)}
            />
          </div>
          <div>
            <label className={FIELD_LABEL_CLASS}>Язык обучения</label>
            <Input
              value={settings.language}
              onChange={(e) => set('language', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={FIELD_LABEL_CLASS}>ФИО директора</label>
          <Input
            value={settings.directorName}
            onChange={(e) => set('directorName', e.target.value)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold dark:text-white">
          Соцсети
        </h2>
        {settings.socialLinks.map((link, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Название (Facebook, Instagram...)"
              value={link.label}
              onChange={(e) => updateSocialLink(i, { label: e.target.value })}
              className="sm:max-w-48"
            />
            <div className="flex gap-2">
              <Input
                placeholder="Ссылка"
                value={link.url}
                onChange={(e) => updateSocialLink(i, { url: e.target.value })}
              />
              <Button
                size="icon"
                variant="outline"
                className="shrink-0"
                onClick={() => removeSocialLink(i)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-fit" onClick={addSocialLink}>
          <Plus /> Добавить ссылку
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold dark:text-white">
          Учащиеся и педагоги
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumberField
            label="Учащихся всего"
            value={settings.studentsTotal}
            onChange={(v) => set('studentsTotal', v)}
          />
          <NumberField
            label="В начальном звене"
            value={settings.studentsPrimary}
            onChange={(v) => set('studentsPrimary', v)}
          />
          <NumberField
            label="В среднем звене"
            value={settings.studentsSecondary}
            onChange={(v) => set('studentsSecondary', v)}
          />
          <NumberField
            label="Педагогов всего"
            value={settings.teachersTotal}
            onChange={(v) => set('teachersTotal', v)}
          />
          <NumberField
            label="1-я дид. степень"
            value={settings.teachersFirstDegree}
            onChange={(v) => set('teachersFirstDegree', v)}
          />
          <NumberField
            label="2-я дид. степень"
            value={settings.teachersSecondDegree}
            onChange={(v) => set('teachersSecondDegree', v)}
          />
          <NumberField
            label="Техперсонал"
            value={settings.staffTechnical}
            onChange={(v) => set('staffTechnical', v)}
          />
          <NumberField
            label="Библиотекарей"
            value={settings.staffLibrarian}
            onChange={(v) => set('staffLibrarian', v)}
          />
          <NumberField
            label="Медсестёр"
            value={settings.staffNurse}
            onChange={(v) => set('staffNurse', v)}
          />
          <NumberField
            label="Учебных кабинетов"
            value={settings.classroomsTotal}
            onChange={(v) => set('classroomsTotal', v)}
          />
          <NumberField
            label="Компьютеров в каб. информатики"
            value={settings.computersItRoom}
            onChange={(v) => set('computersItRoom', v)}
          />
          <NumberField
            label="Доля гагаузов, %"
            value={settings.gagauzPercent}
            onChange={(v) => set('gagauzPercent', v)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold dark:text-white">
          Гражданские обращения
        </h2>
        <div>
          <label className={FIELD_LABEL_CLASS}>
            Текст на странице «Обращения граждан»
          </label>
          <Textarea
            value={settings.appealsNote}
            onChange={(e) => set('appealsNote', e.target.value)}
          />
        </div>
        <div>
          <label className={FIELD_LABEL_CLASS}>
            Текст на странице «Сообщить о насилии/буллинге» (проверьте контакты!)
          </label>
          <Textarea
            value={settings.concernNote}
            onChange={(e) => set('concernNote', e.target.value)}
          />
        </div>
      </section>

      <Button onClick={handleSave} disabled={isSaving} className="w-fit">
        {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
      </Button>
    </div>
  );
};
