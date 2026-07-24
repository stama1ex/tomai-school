import Link from 'next/link';
import {
  CalendarClock,
  DoorOpen,
  FileText,
  Info,
  Phone,
  Users,
} from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';

const links = [
  { href: '/about', label: 'О школе', description: 'История и сегодняшний день гимназии', icon: Info },
  {
    href: '/first-grade-admission',
    label: 'Приём в 1 класс',
    description: 'Документы и условия зачисления',
    icon: DoorOpen,
  },
  {
    href: '/lessons-schedule',
    label: 'Расписание уроков',
    description: 'Актуальное расписание занятий',
    icon: CalendarClock,
  },
  {
    href: '/exams',
    label: 'Экзамены',
    description: 'Даты и дисциплины итоговой аттестации',
    icon: FileText,
  },
  {
    href: '/staffing',
    label: 'Учителя',
    description: 'Кадровый состав и классные руководители',
    icon: Users,
  },
  {
    href: '/contacts',
    label: 'Контакты',
    description: 'Адрес, телефон и как нас найти',
    icon: Phone,
  },
];

export const QuickLinks: React.FC = () => {
  return (
    <Container className="px-4 py-12">
      <Title
        text="Основные разделы"
        size="md"
        className="dark:text-white font-bold text-center mb-8"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-lg border bg-card p-4 shadow-xs transition-colors hover:bg-accent"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium dark:text-white">{label}</span>
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
};
