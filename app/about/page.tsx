import fs from 'fs';
import path from 'path';
import {
  Download,
  Eye,
  Heart,
  Landmark,
  ListChecks,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getSiteSettings } from '@/lib/settings';
import { pluralizeRu } from '@/lib/pluralize';

const PRESENTATION_FILE = 'development-project-presentation.pptx';
const PRESENTATION_URL = `/${PRESENTATION_FILE}`;

function getPresentationSizeMb(): string | null {
  try {
    const filePath = path.join(process.cwd(), 'public', PRESENTATION_FILE);
    const { size } = fs.statSync(filePath);
    return (size / (1024 * 1024)).toFixed(1);
  } catch {
    return null;
  }
}

const TRIGGER_CLASS = 'text-base sm:text-lg font-semibold dark:text-white';
const CONTENT_CLASS = 'text-base flex flex-col gap-4 dark:text-white/90';

const values = [
  'Качественное образование.',
  'Уважение к личности каждого ребёнка.',
  'Безопасность и благополучие участников образовательного процесса.',
  'Профессионализм и ответственность педагогов.',
  'Партнёрство семьи, школы и общества.',
  'Честность, открытость и взаимное уважение.',
  'Равные возможности для каждого обучающегося.',
  'Сохранение национальных, культурных и духовных традиций.',
  'Гражданственность, патриотизм и социальная ответственность.',
  'Стремление к развитию, инновациям и непрерывному совершенствованию.',
];

const tasks = [
  'обеспечение высокого качества образовательного процесса в соответствии с национальными образовательными стандартами;',
  'создание безопасной, инклюзивной и благоприятной образовательной среды;',
  'развитие интеллектуального, творческого, физического и духовно-нравственного потенциала учащихся;',
  'внедрение современных образовательных технологий и инновационных методов обучения;',
  'повышение профессионального мастерства педагогических работников;',
  'развитие сотрудничества с родителями, местным сообществом и социальными партнёрами;',
  'воспитание уважения к национальным, культурным и общечеловеческим ценностям, формирование гражданской ответственности и культуры здорового образа жизни;',
  'укрепление материально-технической базы гимназии и создание условий для устойчивого развития учреждения.',
  'повышение имиджа гимназии с.Томай.',
];

export default async function About() {
  const s = await getSiteSettings();
  const presentationSizeMb = getPresentationSizeMb();

  const studentsWord = pluralizeRu(s.studentsTotal, [
    'учащийся',
    'учащихся',
    'учащихся',
  ]);
  const teachersWord = pluralizeRu(s.teachersTotal, [
    'педагог',
    'педагога',
    'педагогов',
  ]);
  const classroomsWord = pluralizeRu(s.classroomsTotal, [
    'кабинет',
    'кабинета',
    'кабинетов',
  ]);
  const computersWord = pluralizeRu(s.computersItRoom, [
    'компьютер',
    'компьютера',
    'компьютеров',
  ]);
  const techStaffWord = pluralizeRu(s.staffTechnical, [
    'человек',
    'человека',
    'человек',
  ]);
  const librarianWord = pluralizeRu(s.staffLibrarian, [
    'библиотекарь',
    'библиотекаря',
    'библиотекарей',
  ]);
  const nurseWord = pluralizeRu(s.staffNurse, [
    'медсестра',
    'медсестры',
    'медсестёр',
  ]);

  return (
    <>
      <Banner image="/background.jpg" title={'О школе'} className="mb-8" />
      <Container className="px-4 py-8">
        <Accordion
          type="multiple"
          defaultValue={['history']}
          className="max-w-3xl mx-auto"
        >
          <AccordionItem value="history">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary shrink-0" />
                История школы
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <p>
                История школы села Томай берёт своё начало с середины XVIII
                века. Вначале это была церковно-приходская школа, затем
                начальная, а в 1946 году была открыта семилетка и существовала
                она на базе школы-интерната до 1952 года. После расформирования
                интерната давала семилетнее образование. В августе 1959 года
                было принято решение Управления Образования о переименовании в
                восьмилетку. А с 1964 года наша школа стала средней и
                просуществовала до 2005 года.
              </p>
              <p>
                За 40 лет существования средней школой выпущено 1944 ученика,
                среди выпускников нашего лицея есть учёные:{' '}
                <strong>Стамат Иван Павлович</strong> (обладатель 1 серебряной
                медали 1968 г. в Томайской СШ) — проживал в Санкт-Петербурге,
                работал преподавателем физики в Политехническом институте; в
                Академии Наук Молдовы работают{' '}
                <strong>Сырф Виталий Иванович</strong> (обладатель 1 золотой
                медали 1981 г. в Томайской СШ) и{' '}
                <strong>Чимпоеш Любовь Степановна</strong>, которые занимаются
                изучением этнографических проблем гагаузов;{' '}
                <strong>Недов Пантелей Петрович</strong> работает преподавателем
                в Харьковском политехническом институте;{' '}
                <strong>Констандогло Юрий Владимирович</strong> (обладатель 2
                золотых медалей 1982 г. в Томайской СШ) живёт в Москве, работает
                в МГУ.
              </p>
              <p>
                Первый набор в лицей был осуществлён в 2005–2006 учебном году. В
                2007–2008 учебном году состоялся первый выпуск лицеистов — 46
                выпускников. Каждый из них выбрал свою дорогу в жизни. С
                сентября 2020 года лицей был переименован в гимназию. С апреля
                2022 года учебное заведение имеет статус — Публичное Учреждение
                Гимназия села Томай.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="today">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary shrink-0" />
                Гимназия сегодня
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <p>
                На сегодняшний день в гимназии {s.studentsTotal} {studentsWord},
                из них в начальном звене – {s.studentsPrimary}, в среднем –{' '}
                {s.studentsSecondary}. По национальному составу у нас есть
                русские, украинцы, болгары, молдаване, но основной контингент –
                это гагаузы, более {s.gagauzPercent}%.
              </p>
              <p>
                Их обучает {s.teachersTotal} {teachersWord}. Из них{' '}
                {s.teachersFirstDegree} имеют 1-ю дидактическую степень,{' '}
                {s.teachersSecondDegree} – 2-ю дидактическую степень.
              </p>
              <p>
                На обслуживании в гимназии работают {s.staffTechnical}{' '}
                {techStaffWord} техперсонала, {s.staffLibrarian} {librarianWord}{' '}
                и {s.staffNurse} {nurseWord}. Наша гимназия неплохо сохранила
                материальную базу средней школы.
              </p>
              <p>
                Функционируют {s.classroomsTotal} {classroomsWord}. Из них в
                кабинетах физики, химии, биологии, географии неплохо сохранены
                учителями наглядные пособия тридцатилетней давности, но так
                необходимые сегодня на уроках. Летом 2020 года был проведён
                интернет по всему периметру гимназии.
              </p>
              <p>
                Функционирует кабинет информатики, в котором имеются{' '}
                {s.computersItRoom} {computersWord}.
              </p>
              <p>
                В гимназии обучение ведётся на {s.language || 'русском'} языке;
                изучается государственный – молдавский, родной – гагаузский и
                иностранные языки (английский или немецкий по выбору учащихся и
                родителей).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="extracurricular">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary shrink-0" />
                Внеурочная деятельность
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <p>
                Во внеурочное время учащиеся активно занимаются в спортивных
                секциях и кружках, включая секции по баскетболу, волейболу и
                футболу.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mission">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary shrink-0" />
                Миссия гимназии
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <p>
                Создание безопасной, современной и открытой образовательной
                среды, в которой каждый ребёнок получает качественное
                образование, раскрывает свои способности, учится самостоятельно
                мыслить, уважать родной и государственный языки, культуру и
                традиции, быть ответственным, активным и успешным членом
                общества.
              </p>
              <p>
                Гимназия стремится объединять усилия педагогов, родителей,
                учащихся и социальных партнёров для всестороннего развития
                личности ребёнка, поддержки его инициативы, творчества и
                гражданской ответственности, обеспечивая равные возможности для
                обучения, воспитания и самореализации каждого учащегося.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="vision">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary shrink-0" />
                Видение развития учреждения
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <p>
                Мы видим ПУ Гимназию с. Томай современным, безопасным и открытым
                образовательным пространством, где каждый ребёнок получает
                качественное образование, раскрывает свой потенциал, развивается
                в атмосфере уважения, сотрудничества и равных возможностей, а
                коллектив стремится к постоянному профессиональному росту и
                внедрению инноваций.
              </p>
              <a
                href={PRESENTATION_URL}
                download
                className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:bg-accent transition-colors w-fit max-w-full"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Download className="h-5 w-5" />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-medium dark:text-white">
                    Презентация проекта развития гимназии
                  </span>
                  <span className="text-sm text-muted-foreground">
                    PPTX
                    {presentationSizeMb ? ` · ${presentationSizeMb} МБ` : ''} —
                    скачать
                  </span>
                </span>
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="values">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary shrink-0" />
                Ценности гимназии
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <ul className="list-disc pl-6 flex flex-col gap-1.5">
                {values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="goals">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary shrink-0" />
                Основные цели и задачи
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <div>
                <p className="font-medium dark:text-white mb-1">Цель:</p>
                <p>
                  Обеспечение качественного, доступного и современного
                  образования, создание условий для всестороннего развития
                  личности каждого учащегося, формирования ключевых компетенций,
                  гражданской ответственности и готовности к успешной
                  самореализации в современном обществе.
                </p>
              </div>
              <div>
                <p className="font-medium dark:text-white mb-1">
                  Основные задачи:
                </p>
                <ul className="list-disc pl-6 flex flex-col gap-1.5">
                  {tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Container>
    </>
  );
}
