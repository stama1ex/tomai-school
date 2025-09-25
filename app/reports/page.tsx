import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Pdf } from '@/components/shared/pdf';
import { PdfDocument } from '@/types';

const reports: PdfDocument[] = [
  {
    title: 'Отчет 1',
    pdfUrl:
      'https://drive.google.com/file/d/1TrV8EV6exPW4spWC3JUsDkpODZaOwjZh/preview',
  },
  {
    title: 'Отчет 2',
    pdfUrl:
      'https://drive.google.com/file/d/1b98Pf05UzZvsIdX75XI6CEzhgiQVWxJl/preview',
  },
  {
    title: 'Отчет 3',
    pdfUrl:
      'https://drive.google.com/file/d/115QZ1Hc54X9Oqn1InfxGo9dKNWNbABx7/preview',
  },
];

export default function Reports() {
  return (
    <>
      <Banner image="/background.jpg" title="Отчёты" className="mb-8" />
      <Container className="px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="flex flex-col border rounded-lg overflow-hidden"
            >
              <Pdf url={report.pdfUrl} title={report.title} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
