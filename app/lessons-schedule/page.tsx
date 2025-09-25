'use client';

import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Pdf } from '@/components/shared/pdf';
import { PdfDocument } from '@/types';

const lessonsSchedule: PdfDocument = {
  pdfUrl:
    'https://drive.google.com/file/d/1jxVQzT7hknfTbX05IeDafstr5e31Sy4F/preview',
};

export default function LessonsSchedule() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title={'Расписание уроков'}
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <Pdf url={lessonsSchedule.pdfUrl} />
      </Container>
    </>
  );
}
