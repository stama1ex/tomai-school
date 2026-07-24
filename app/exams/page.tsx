'use client';

import useSWR from 'swr';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { EditableTitle } from '@/components/shared/editable-title';
import { EditableTable } from '@/components/shared/editable-table';
import { EditableYear } from '@/components/shared/editable-year';

interface ExamRow {
  id: string;
  subject: string;
  date: string;
}

export default function Exams() {
  const { data: primaryData, isLoading: primaryLoading } = useSWR<ExamRow[]>(
    '/api/primary-exams'
  );
  const { data: graduationData, isLoading: graduationLoading } = useSWR<
    ExamRow[]
  >('/api/graduation-exams');

  const loading = primaryLoading || graduationLoading;

  return (
    <>
      <Banner
        image="/background.jpg"
        title={<EditableYear apiPath="/api/exam-year" />}
        className="mb-4 sm:mb-8"
      />
      <Container className="px-4 py-6 sm:py-8">
        {loading ? (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            <EditableTitle
              apiPath="/api/exam-titles"
              type="primary"
              size="md"
              className="dark:text-white font-bold text-center mb-6"
            />

            {!primaryData?.length ? (
              <div>Нет данных для отображения</div>
            ) : (
              <EditableTable
                apiPath="/api/primary-exams"
                data={primaryData}
                columns={[
                  { key: 'index', label: '№' },
                  { key: 'subject', label: 'Дисциплина', editable: true },
                  { key: 'date', label: 'Дата', editable: true },
                ]}
                className="mb-8"
              />
            )}
            <EditableTitle
              apiPath="/api/exam-titles"
              type="graduation"
              size="md"
              className="dark:text-white font-bold text-center mb-6"
            />

            {!graduationData?.length ? (
              <div>Нет данных для отображения</div>
            ) : (
              <EditableTable
                apiPath="/api/graduation-exams"
                data={graduationData}
                columns={[
                  { key: 'index', label: '№' },
                  { key: 'subject', label: 'Дисциплина', editable: true },
                  { key: 'date', label: 'Дата', editable: true },
                ]}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}
