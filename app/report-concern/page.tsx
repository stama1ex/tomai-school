import { Phone, ShieldAlert } from 'lucide-react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { ConcernForm } from '@/components/forms/concern-form';
import { getSiteSettings, toTelHref } from '@/lib/settings';

export default async function ReportConcernPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Banner
        image="/background.jpg"
        title="Сообщить о насилии или буллинге"
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Title
              text="Сообщить о случае"
              size="md"
              className="dark:text-white font-bold mb-4"
            />
            <ConcernForm />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-3">
              <h3 className="font-semibold dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                Важно
              </h3>
              {settings.concernNote && (
                <p className="text-sm text-muted-foreground">
                  {settings.concernNote}
                </p>
              )}
            </div>

            <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
              <h3 className="font-semibold dark:text-white">
                Прямые контакты гимназии
              </h3>
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
