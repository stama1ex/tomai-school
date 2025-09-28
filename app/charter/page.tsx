import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { PdfCrud } from '@/components/shared/pdf-crud';

export default function Charter() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title="Устав учебного заведения"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <PdfCrud apiPath="/api/charter" title="Устав" />
      </Container>
    </>
  );
}
