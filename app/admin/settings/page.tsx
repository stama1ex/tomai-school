import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect('/admin');

  const settings = await getSiteSettings();

  return (
    <Container className="px-4 py-8">
      <Title
        text="Настройки сайта"
        size="md"
        className="dark:text-white font-bold mb-6"
      />
      <SettingsForm initial={settings} />
    </Container>
  );
}
