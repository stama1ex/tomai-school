import { Clock, Mail, Phone, User } from 'lucide-react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Title } from '@/components/shared/title';
import { getSiteSettings, toTelHref } from '@/lib/settings';

const directorInfo = {
  subject: 'Учитель румынского языка и литературы',
  degree: 'II',
  experience: '23 года',
};

const deputies = [
  {
    name: 'Констандогло Иванна Владимировна',
    position:
      'Исполняющий обязанности заместителя директора по учебно-воспитательной работе',
    subject: 'Библиотекарь',
    degree: 'I',
    experience: '40 лет',
    duties: [
      'организация и координация учебно-воспитательного процесса;',
      'контроль качества образования и выполнения учебных программ;',
      'составление расписания учебных занятий;',
      'организация внутришкольного контроля и мониторинга качества образования;',
      'координация деятельности педагогических работников и методических объединений;',
      'сопровождение государственной итоговой аттестации и образовательных проектов;',
      'организация работы с учащимися и родителями по вопросам образовательного процесса.',
    ],
  },
  {
    name: 'Чеботарь Галина Семёновна',
    position:
      'Исполняющий обязанности заместителя директора по воспитательной работе',
    subject: 'Учитель гагаузского языка и литературы',
    degree: 'II',
    experience: '6 лет',
    duties: [
      'организация и координация воспитательной работы в гимназии;',
      'разработка и реализация плана воспитательной деятельности;',
      'координация работы классных руководителей, ученического совета и кружков;',
      'организация школьных, культурных, спортивных и общественно значимых мероприятий;',
      'профилактика правонарушений, буллинга, насилия и других форм рискованного поведения среди учащихся;',
      'организация работы по защите прав, безопасности и благополучию детей;',
      'взаимодействие с родителями, социальными службами, правоохранительными органами и партнёрами гимназии;',
      'развитие гражданского, патриотического, духовно-нравственного и экологического воспитания;',
      'поддержка ученических инициатив, волонтёрской деятельности и самоуправления;',
      'контроль посещаемости учащихся и организация профилактической работы с детьми, находящимися в ситуации риска.',
    ],
  },
  {
    name: 'Топчу Мария Пантелеевна',
    position: 'Заместитель директора по хозяйственной работе',
    duties: [
      'организация и обеспечение административно-хозяйственной деятельности гимназии;',
      'содержание зданий, сооружений и территории учреждения в надлежащем санитарном и техническом состоянии;',
      'организация текущего и капитального ремонта, контроль качества выполненных работ;',
      'обеспечение учреждения оборудованием, мебелью, инвентарём, хозяйственными и расходными материалами;',
      'организация работы технического и обслуживающего персонала;',
      'контроль соблюдения требований охраны труда, пожарной безопасности, гражданской защиты и санитарно-гигиенических норм;',
      'обеспечение безопасной эксплуатации зданий, инженерных сетей и оборудования;',
      'контроль рационального использования материальных ресурсов и сохранности имущества гимназии;',
      'участие в организации подготовки учреждения к новому учебному году и работе в осенне-зимний период;',
      'взаимодействие с подрядными организациями, поставщиками и коммунальными службами по вопросам хозяйственного обеспечения деятельности гимназии.',
    ],
  },
];

export default async function AdministrationPage() {
  const s = await getSiteSettings();

  return (
    <>
      <Banner image="/background.jpg" title="Администрация" className="mb-8" />
      <Container className="px-4 py-8 flex flex-col gap-8 max-w-3xl mx-auto">
        <section>
          <Title
            text="Руководство и структура управления"
            size="md"
            className="dark:text-white font-bold mb-4"
          />
          <div className="rounded-lg border bg-card p-5 flex flex-col gap-3">
            <div>
              <h3 className="text-lg font-semibold dark:text-white">
                {s.directorName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {s.directorPosition}
              </p>
              <p className="text-sm text-muted-foreground">
                {directorInfo.subject}
              </p>
              <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-1">
                <span>Дидактическая степень: {directorInfo.degree}</span>
                <span>Педагогический стаж: {directorInfo.experience}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {s.directorOfficeHours && (
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  Приёмные часы: {s.directorOfficeHours}
                </p>
              )}
              {s.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a
                    href={`tel:${toTelHref(s.phone)}`}
                    className="hover:text-foreground"
                  >
                    {s.phone}
                  </a>
                </p>
              )}
              {s.directorEmail && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href={`mailto:${s.directorEmail}`}
                    className="hover:text-foreground"
                  >
                    {s.directorEmail}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <Title
            text="Заместители директора"
            size="md"
            className="dark:text-white font-bold mb-4"
          />
          <div className="flex flex-col gap-4">
            {deputies.map((deputy) => (
              <div
                key={deputy.name}
                className="rounded-lg border bg-card p-5 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {deputy.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {deputy.position}
                    </p>
                    {deputy.subject && (
                      <p className="text-sm text-muted-foreground">
                        {deputy.subject}
                      </p>
                    )}
                    {(deputy.degree || deputy.experience) && (
                      <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-1">
                        {deputy.degree && (
                          <span>Дидактическая степень: {deputy.degree}</span>
                        )}
                        {deputy.experience && (
                          <span>Педагогический стаж: {deputy.experience}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white mb-1">
                    Направление работы:
                  </p>
                  <ul className="list-disc pl-6 flex flex-col gap-1 text-sm text-muted-foreground">
                    {deputy.duties.map((duty) => (
                      <li key={duty}>{duty}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
