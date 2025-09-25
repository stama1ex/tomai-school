import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Pdf } from '@/components/shared/pdf';
import { PdfDocument } from '@/types';

const docs: PdfDocument[] = [
  {
    pdfUrl:
      'https://drive.google.com/file/d/1ercM0ALp7i123bbAiDODEwq1S1RXyiij/preview',
  },
];

export default function Budget() {
  return (
    <>
      <Banner image="/background.jpg" title="Бюджет" className="mb-8" />
      <Container className="px-4 py-8">
        <div className="flex flex-col gap-8">
          {docs.map((doc, idx) => (
            <div
              key={idx}
              className="flex flex-col border rounded-lg overflow-hidden"
            >
              <Pdf url={doc.pdfUrl} title={doc.title} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
