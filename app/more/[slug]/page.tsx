import { notFound } from 'next/navigation';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { PdfCrud } from '@/components/shared/pdf-crud';
import { getCustomPageBySlug } from '@/lib/custom-pages';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <Banner image="/background.jpg" title={page.title} className="mb-8" />
      <Container className="px-4 py-8">
        <PdfCrud
          apiPath={`/api/custom-page-documents?page_id=${page.id}`}
          extraFields={{ page_id: page.id }}
        />
      </Container>
    </>
  );
}
