'use client';

import { ExternalLink } from 'lucide-react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { PdfCrud } from '@/components/shared/pdf-crud';

const LONG_TERM_PLANS_URL =
  'https://mec.gov.md/ro/content/proiecte-didactice-de-lunga-durata';

export default function Plans() {
  return (
    <>
      <Banner image="/background.jpg" title="Планы" className="mb-8" />
      <Container className="px-4 py-8">
        <div className="mb-8 flex justify-center">
          <a
            href={LONG_TERM_PLANS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:bg-accent transition-colors w-fit max-w-full"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ExternalLink className="h-5 w-5" />
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-medium dark:text-white">
                Проекты долгосрочного планирования (MEC)
              </span>
              <span className="text-sm text-muted-foreground">
                mec.gov.md — открыть
              </span>
            </span>
          </a>
        </div>
        <PdfCrud apiPath="/api/plans" />
      </Container>
    </>
  );
}
