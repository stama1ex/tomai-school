'use client';

import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Card } from '@/components/ui/card';
import React from 'react';

const teachers = [
  {
    class: '1 "А" класс',
    name: 'Баку Анастасия Николаевна',
  },
  {
    class: '1 "Б" класс',
    name: 'Чимпоеш Алена Павловна',
  },
  {
    class: '2 "А" класс',
    name: 'Гарчу Евдокия Дмитриевна',
  },
  {
    class: '3 "А" класс',
    name: 'Душкова Таисия Константиновна',
  },
  {
    class: '3 "Б" класс',
    name: 'Гарчу Надежда Петровна',
  },
  {
    class: '4 "А" класс',
    name: 'Танасогло Татьяна Георгиевна',
  },
  {
    class: '4 "Б" класс',
    name: 'Карабаджак Наталья Ильинична',
  },
  {
    class: '5 "А" класс',
    name: 'Карабаджак Владимир Дмитриевич',
  },
  {
    class: '6 "А" класс',
    name: 'Таукчу Валентина Константиновна',
  },
  {
    class: '6 "Б" класс',
    name: 'Топчу Светлана Викторовна',
  },
  {
    class: '7 "А" класс',
    name: 'Констандогло Иванна Владимировна',
  },
  {
    class: '7 "Б" класс',
    name: 'Бабова Татьяна Дмитриевна',
  },
  {
    class: '8 "А" класс',
    name: 'Топчу Елена Петровна',
  },
  {
    class: '9 "А" класс',
    name: 'Топчу Елена Давидовна',
  },
  {
    class: '9 "Б" класс',
    name: 'Сариогло Мария Ивановна',
  },
];

export default function ClassTeachers() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title={'Классные руководители'}
        className="mb-8"
      />

      <Container className="px-4 py-8">
        <h2 className="text-center text-2xl font-bold text-primary mb-6">
          Список классных руководителей <br /> на 2024 – 2025 учебный год
        </h2>
        <hr className="mb-6" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, index) => (
            <Card
              key={index}
              primaryText={teacher.class}
              secondaryText={teacher.name}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
