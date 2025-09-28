import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';

const primaryExams = [
  {
    subject:
      'Русский язык и литература (с предметным акцентом на русском языке) - итоговый тест',
    date: '15 мая (среда)',
  },
  { subject: 'Математика', date: '17 мая (пятница)' },
  { subject: 'Румынский язык', date: '21 мая (вторник)' },
  { subject: 'Родной язык (гагаузский)', date: '23 мая (четверг)' },
];

const graduationExams = [
  {
    subject: 'Румынский язык и литература (с преподаванием на русском языке)',
    date: '3 июня (понедельник)',
  },
  { subject: 'Математика', date: '6 июня (четверг)' },
  { subject: 'Язык обучения', date: '10 июня (понедельник)' },
  {
    subject: 'История румын и всеобщая история',
    date: '13 июня (четверг)',
  },
];

export default function Exams() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title="Экзамены - 2025"
        className="mb-4 sm:mb-8"
      />
      <Container className="px-4 py-6 sm:py-8">
        {/* Начальная школа */}
        <Title
          text="График национальных экзаменов в начальном образовании на 2023-2024 уч.г."
          size="md"
          className="dark:text-white font-bold text-center mb-4 sm:mb-6"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-primary/20 rounded-lg">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20 w-[10%]">
                  №
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20">
                  Профиль тестирования
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20 w-[30%]">
                  Дата
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {primaryExams.map((exam, num) => (
                <tr key={num} className="hover:bg-primary/5 transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium dark:text-white">
                    {num + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white/80">
                    {exam.subject}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm dark:text-white/80">
                    {exam.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Выпускные экзамены */}
        <Title
          text="График национальных выпускных экзаменов за гимназический цикл на 2023-2024 уч.г."
          size="md"
          className="dark:text-white font-bold text-center mb-4 sm:mb-6 mt-6 sm:mt-8"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-primary/20 rounded-lg">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20 w-[10%]">
                  №
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20">
                  Экзаменационная дисциплина
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20 w-[30%]">
                  Дата
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {graduationExams.map((exam, num) => (
                <tr key={num} className="hover:bg-primary/5 transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium dark:text-white">
                    {num + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white/80">
                    {exam.subject}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm dark:text-white/80">
                    {exam.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm dark:text-white/70">
          * Даты могут быть изменены в соответствии с официальными
          распоряжениями Министерства Просвещения. Следите за обновлениями на
          сайте гимназии.
        </p>
      </Container>
    </>
  );
}
