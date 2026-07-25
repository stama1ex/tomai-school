import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { CustomPagesList } from '@/components/admin/custom-pages-list';

export default async function AdminCustomPagesPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect('/admin');

  return (
    <Container className="px-4 py-8">
      <Title
        text="Дополнительные страницы"
        size="md"
        className="dark:text-white font-bold mb-2"
      />
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Страницы, созданные здесь, появляются в разделе «Ещё» в шапке сайта.
        Документы на самой странице (как в «Отчётах») добавляются, редактируются
        и удаляются прямо на ней.
      </p>
      <CustomPagesList />
    </Container>
  );
}
