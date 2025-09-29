'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { EditableTable } from '@/components/shared/editable-table';
import { Title } from '@/components/shared/title';

export default function Exams() {
  const [primaryData, setPrimaryData] = useState([]);
  const [graduationData, setGraduationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [primaryResponse, graduationResponse] = await Promise.all([
          fetch('/api/primary-exams'),
          fetch('/api/graduation-exams'),
        ]);

        if (!primaryResponse.ok || !graduationResponse.ok) {
          throw new Error('Ошибка при загрузке данных');
        }

        const primaryResult = await primaryResponse.json();
        const graduationResult = await graduationResponse.json();

        setPrimaryData(primaryResult);
        setGraduationData(graduationResult);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Banner
          image="/background.jpg"
          title="Экзамены - 2025"
          className="mb-4 sm:mb-8"
        />
        <div className="flex justify-center my-auto ">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Banner
        image="/background.jpg"
        title="Экзамены - 2025"
        className="mb-4 sm:mb-8"
      />
      <Container className="px-4 py-6 sm:py-8">
        <Title
          text="График национальных экзаменов в начальном образовании на 2023-2024 уч.г."
          size="md"
          className="dark:text-white font-bold text-center mb-6"
        />

        {primaryData.length === 0 ? (
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
        <Title
          text="График национальных выпускных экзаменов за гимназический цикл на 2023-2024 уч.г."
          size="md"
          className="dark:text-white font-bold text-center mb-6"
        />

        {graduationData.length === 0 ? (
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
      </Container>
    </>
  );
}
