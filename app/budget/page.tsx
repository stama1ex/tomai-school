import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { PdfCrud } from '@/components/shared/pdf-crud';

export default function Budget() {
  return (
    <>
      <Banner image="/background.jpg" title="Бюджет" className="mb-8" />
      <Container className="px-4 py-8">
        <PdfCrud apiPath="/api/budget" />
      </Container>
    </>
  );
}
