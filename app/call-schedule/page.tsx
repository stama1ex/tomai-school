'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { EditableTable } from '@/components/shared/editable-table';

export default function CallSchedule() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/call-schedule');
        if (!response.ok) throw new Error('Ошибка при загрузке данных');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Banner
        image="/background.jpg"
        title="Расписание звонков"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <EditableTable
          apiPath="/api/call-schedule"
          data={data}
          columns={[
            { key: 'lesson', label: '№ урока' },
            { key: 'time', label: 'Время', editable: true },
          ]}
        />
      </Container>
    </>
  );
}
