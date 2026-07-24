import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { SecurityForm } from '@/components/admin/security-form';

export default async function AdminSecurityPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect('/admin');

  return (
    <Container className="px-4 py-8">
      <Title
        text="Логин и пароль"
        size="md"
        className="dark:text-white font-bold mb-2"
      />
      <p className="text-muted-foreground mb-6 max-w-md">
        Смена логина или пароля подтверждается кодом, который придёт на
        почту директора.
      </p>
      <SecurityForm />
    </Container>
  );
}
