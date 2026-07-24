import { Mail, MapPin, Phone } from 'lucide-react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { AppealForm } from '@/components/forms/appeal-form';
import { getSiteSettings, toTelHref } from '@/lib/settings';

export default async function AppealsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Banner
        image="/background.jpg"
        title="Обращения граждан"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Title
              text="Оставить обращение"
              size="md"
              className="dark:text-white font-bold mb-4"
            />
            <AppealForm />
          </div>

          <div className="flex flex-col gap-4">
            {settings.appealsNote && (
              <p className="text-muted-foreground">{settings.appealsNote}</p>
            )}
            <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
              <h3 className="font-semibold dark:text-white">
                Также можно обратиться напрямую:
              </h3>
              {settings.address && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  {settings.address}
                </p>
              )}
              {settings.phone && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a
                    href={`tel:${toTelHref(settings.phone)}`}
                    className="hover:text-foreground"
                  >
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings.email && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-foreground"
                  >
                    {settings.email}
                  </a>
                </p>
              )}
              {settings.directorName && (
                <p className="text-sm text-muted-foreground">
                  Директор: {settings.directorName}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
