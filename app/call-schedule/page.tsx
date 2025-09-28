import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';

const schedule = [
  { lesson: 1, time: '8.00 - 8.45' },
  { lesson: 2, time: '8.55 - 9.40' },
  { lesson: 3, time: '10.00 - 10.45' },
  { lesson: 4, time: '10.55 - 11.40' },
  { lesson: 5, time: '12.00 - 12.45' },
  { lesson: 6, time: '12.55 - 13.40' },
  { lesson: 7, time: '13.45 - 14.30' },
];

export default function CallSchedule() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title="Расписание звонков"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <Title
          text="Расписание звонков на 2024-2025 учебный год"
          size="md"
          className="dark:text-white font-bold text-center mb-6"
        />

        <div className="overflow-x-auto">
          <table className="mx-auto md:min-w-full bg-background border border-primary/20 rounded-lg">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-6 py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20">
                  № урока
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold dark:text-white uppercase tracking-wider border-b border-primary/20">
                  Время
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {schedule.map((item) => (
                <tr
                  key={item.lesson}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    {item.lesson}
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-white/80">
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}
