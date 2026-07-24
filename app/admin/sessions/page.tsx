import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { SessionsList } from '@/components/admin/sessions-list';

export default async function AdminSessionsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect('/admin');

  return (
    <Container className="px-4 py-8">
      <Title
        text="Сессии входа"
        size="md"
        className="dark:text-white font-bold mb-2"
      />
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Учётная запись общая, поэтому здесь видно, кто и когда заходил под
        ней — по имени, которое указали при входе.
      </p>
      <SessionsList />
    </Container>
  );
}
