import Link from 'next/link';
import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from 'lucide-react';
import { Container } from './container';
import { getSiteSettings, toTelHref } from '@/lib/settings';

const quickLinks = [
  { href: '/about', label: 'О школе' },
  { href: '/staffing', label: 'Кадровый состав' },
  { href: '/exams', label: 'Экзамены' },
  { href: '/first-grade-admission', label: 'Приём в 1 класс' },
  { href: '/reports', label: 'Отчёты' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/appeals', label: 'Обращения граждан' },
  { href: '/report-concern', label: 'Сообщить о насилии' },
];

function socialIcon(label: string) {
  const key = label.toLowerCase();
  if (key.includes('facebook')) return Facebook;
  if (key.includes('instagram')) return Instagram;
  if (key.includes('youtube')) return Youtube;
  if (key.includes('telegram')) return Send;
  return Globe;
}

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40 mt-16">
      <Container className="px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="font-semibold dark:text-white mb-3">
            {settings.shortName || 'ПУ Гимназия с. Томай'}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {settings.address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href={`tel:${toTelHref(settings.phone)}`}
                  className="hover:text-foreground"
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-foreground"
                >
                  {settings.email}
                </a>
              </li>
            )}
          </ul>

          {settings.socialLinks.length > 0 && (
            <div className="flex gap-3 mt-4">
              {settings.socialLinks.map((link) => {
                const Icon = socialIcon(link.label);
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold dark:text-white mb-3">Быстрые ссылки</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold dark:text-white mb-3">Режим работы</h3>
          <p className="text-sm text-muted-foreground">
            {settings.workHours && <>Приём звонков: {settings.workHours}</>}
            {settings.language && (
              <>
                <br />
                Обучение ведётся на русском языке.
              </>
            )}
          </p>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="px-4 py-4 text-center text-xs text-muted-foreground">
          © {year} {settings.shortName || 'ПУ Гимназия с. Томай'}. Все права
          защищены.
        </Container>
      </div>
    </footer>
  );
}
