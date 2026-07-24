import { BookOpen, GraduationCap, Landmark, Users } from 'lucide-react';
import { Container } from '@/components/shared/container';
import type { SiteSettings } from '@/lib/settings';

interface Props {
  settings: SiteSettings;
}

export const StatsStrip: React.FC<Props> = ({ settings }) => {
  const stats = [
    { icon: Users, value: String(settings.studentsTotal), label: 'учащихся' },
    {
      icon: GraduationCap,
      value: String(settings.teachersTotal),
      label: 'педагогов',
    },
    {
      icon: BookOpen,
      value: String(settings.classroomsTotal),
      label: 'учебных кабинета',
    },
    { icon: Landmark, value: 'с XVIII века', label: 'история школы' },
  ].filter((s) => s.value && s.value !== '0');

  if (stats.length === 0) return null;

  return (
    <div className="bg-primary/5 border-y border-border">
      <Container className="px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-2"
          >
            <Icon className="h-7 w-7 text-primary" />
            <span className="text-xl md:text-2xl font-bold dark:text-white">
              {value}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </Container>
    </div>
  );
};
