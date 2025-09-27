'use client';

import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Pdf } from '@/components/shared/pdf';
import { useEffect, useState } from 'react';

interface PdfDocument {
  title?: string;
  pdfUrl: string;
}

export default function Reports() {
  const [reports, setReports] = useState<PdfDocument[]>([]);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then(setReports);
  }, []);

  const handleEdit = async (idx: number, data: PdfDocument) => {
    await fetch('/api/reports', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: idx, data }),
    });
    const updated = [...reports];
    updated[idx] = data;
    setReports(updated);
  };

  const handleDelete = async (idx: number) => {
    await fetch('/api/reports', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: idx }),
    });
    setReports(reports.filter((_, i) => i !== idx));
  };

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
              <Pdf
                url={report.pdfUrl}
                title={report.title}
                onEdit={(data) =>
                  handleEdit(idx, { pdfUrl: data.url, title: data.title })
                }
                onDelete={() => handleDelete(idx)}
              />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
