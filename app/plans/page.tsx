import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Pdf } from '@/components/shared/pdf';
import { PdfDocument } from '@/types';

const plans: PdfDocument[] = [
  {
    title: 'План работы на 1 квартал',
    pdfUrl:
      'https://drive.google.com/file/d/1ekLNd7c23d5KkfdLEu3UjTCcncmEnMVl/preview',
  },
  {
    title: 'План мероприятий на год',
    pdfUrl:
      'https://drive.google.com/file/d/1h5WHpN1pCKO6UZlBZxecrD15gvx3yHNK/preview',
  },
  {
    title: 'Годовой учебный план',
    pdfUrl:
      'https://drive.google.com/file/d/1CXfK6p6zgX3v2sn6TBK1JxRorpKqCpAN/preview',
  },
];

export default function Plans() {
  return (
    <>
      <Banner image="/background.jpg" title="Планы" className="mb-8" />
      <Container className="px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="flex flex-col border rounded-lg overflow-hidden"
            >
              <Pdf url={plan.pdfUrl} title={plan.title} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
