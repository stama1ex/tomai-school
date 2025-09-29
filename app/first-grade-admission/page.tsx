'use client';

import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { PdfCrud } from '@/components/shared/pdf-crud';

export default function FirstGradeAdmission() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title="О приеме в первый класс"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <PdfCrud apiPath="/api/first-grade-admission" />
      </Container>
    </>
  );
}
