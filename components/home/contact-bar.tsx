import { Building2, Clock, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { toTelHref, type SiteSettings } from '@/lib/settings';

interface Props {
  settings: SiteSettings;
}

export const ContactBar: React.FC<Props> = ({ settings }) => {
  const items = [
    {
      icon: Building2,
      label: 'Учреждение',
      value: settings.fullName || settings.shortName,
    },
    { icon: MapPin, label: 'Адрес', value: settings.address },
    {
      icon: Phone,
      label: 'Телефон',
      value: settings.phone,
      href: settings.phone ? `tel:${toTelHref(settings.phone)}` : undefined,
    },
    { icon: Clock, label: 'Режим работы', value: settings.workHours },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <div className="px-4 py-6">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-xl border bg-border shadow-lg overflow-hidden">
          {items.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="flex items-start gap-3 bg-card p-4 h-full">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-medium dark:text-white break-words">
                    {value}
                  </span>
                </span>
              </div>
            );

            return href ? (
              <a key={label} href={href} className="hover:bg-accent transition-colors">
                {content}
              </a>
            ) : (
              <div key={label}>{content}</div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
