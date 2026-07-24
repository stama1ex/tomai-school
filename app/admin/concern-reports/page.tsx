import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { ConcernInbox } from '@/components/admin/concern-inbox';

export default async function AdminConcernReportsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect('/admin');

  return (
    <Container className="px-4 py-8">
      <Title
        text="Сообщения о насилии и буллинге"
        size="md"
        className="dark:text-white font-bold mb-6"
      />
      <ConcernInbox />
    </Container>
  );
}
