import Link from 'next/link';
import { MessageSquareWarning, Send } from 'lucide-react';
import { Container } from './container';

export const UtilityBar: React.FC = () => {
  return (
    <div className="bg-primary text-primary-foreground text-sm">
      <Container className="px-4 py-1.5 flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1">
        <Link
          href="/appeals"
          className="flex items-center gap-1.5 hover:underline underline-offset-2"
        >
          <Send className="h-3.5 w-3.5" />
          Обращения граждан
        </Link>
        <Link
          href="/report-concern"
          className="flex items-center gap-1.5 hover:underline underline-offset-2 font-medium"
        >
          <MessageSquareWarning className="h-3.5 w-3.5 shrink-0" />
          <span className="sm:hidden">Сообщить о насилии</span>
          <span className="hidden sm:inline">
            Сообщить о насилии, буллинге или нарушении прав ребёнка
          </span>
        </Link>
      </Container>
    </div>
  );
};
