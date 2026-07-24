import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { AppealsInbox } from '@/components/admin/appeals-inbox';

export default async function AdminAppealsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect('/admin');

  return (
    <Container className="px-4 py-8">
      <Title
        text="Обращения граждан"
        size="md"
        className="dark:text-white font-bold mb-6"
      />
      <AppealsInbox />
    </Container>
  );
}
