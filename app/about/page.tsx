import fs from 'fs';
import path from 'path';
import {
  Building2,
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
  const classesWord = pluralizeRu(s.classesTotal, [
    'класс',
    'класса',
    'классов',
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
                История гимназии
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <p>
                История образовательного учреждения села Томай насчитывает
                более двух с половиной столетий и берёт своё начало с
                середины XVIII века, когда в селе была открыта
                церковно-приходская школа.
              </p>
              <p>
                В разные исторические периоды школа развивалась вместе с
                селом и системой образования страны. Сначала она
                функционировала как начальная школа, а в 1946 году была
                открыта семилетняя школа, которая до 1952 года действовала на
                базе школы-интерната. После расформирования интерната
                образовательное учреждение продолжило работу как
                самостоятельная семилетняя школа.
              </p>
              <p>
                В августе 1959 года решением органов управления образованием
                школа была преобразована в восьмилетнюю, а с 1964 года
                получила статус средней школы. На протяжении более сорока лет
                средняя школа села Томай являлась одним из ведущих
                образовательных учреждений региона, подготовив 1944
                выпускника, многие из которых добились значительных
                профессиональных успехов в науке, образовании, инженерии и
                других сферах деятельности.
              </p>
              <p>
                Среди выпускников школы — кандидаты и доктора наук,
                преподаватели высших учебных заведений, научные сотрудники,
                инженеры и руководители различных организаций, которые
                достойно представляют своё родное село как в Республике
                Молдова, так и за её пределами.
              </p>
              <p>
                Особую гордость гимназии составляют её выпускники:{' '}
                <strong>Стамат Иван Павлович</strong>, серебряный медалист
                1968 года, преподаватель физики Санкт-Петербургского
                политехнического института; <strong>Сырф Виталий Иванович</strong>,
                золотой медалист 1981 года, и{' '}
                <strong>Чимпоеш Любовь Степановна</strong> — научные
                сотрудники Академии наук Республики Молдова, посвятившие свою
                деятельность исследованию этнографии гагаузского народа;{' '}
                <strong>Недов Пантелей Петрович</strong> — преподаватель
                Харьковского политехнического института;{' '}
                <strong>Констандогло Юрий Владимирович</strong>, обладатель
                двух золотых медалей Томайской средней школы (1982 год),
                преподаватель Московского государственного университета.
              </p>
              <p>
                Их профессиональные достижения являются предметом гордости
                гимназии и служат вдохновляющим примером для нынешних
                поколений учащихся.
              </p>
              <p>
                Новый этап развития учреждения начался в 2005 году, когда был
                открыт лицейский цикл обучения. В 2007–2008 учебном году
                состоялся первый выпуск лицеистов.
              </p>
              <p>
                В соответствии с реформой системы образования Республики
                Молдова с 1 сентября 2020 года учреждение было реорганизовано
                в гимназию, а с апреля 2022 года официально функционирует как
                Публичное учреждение «Гимназия села Томай».
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
                Сегодня Публичное учреждение «Гимназия села Томай» — это
                современное общеобразовательное учреждение, обеспечивающее
                качественное образование, безопасную образовательную среду и
                всестороннее развитие личности каждого ребёнка.
              </p>
              <p>
                В гимназии обучаются {s.studentsTotal} {studentsWord} в{' '}
                {s.classesTotal} {classesWord}. Образовательный процесс
                обеспечивают {s.teachersTotal} {teachersWord}, большинство из
                которых имеют квалификационные дидактические степени и
                многолетний профессиональный опыт.
              </p>
              <p>
                В учреждении созданы необходимые условия для организации
                образовательного процесса. Функционируют {s.classroomsTotal}{' '}
                {classroomsWord}, кабинет информатики, библиотека, спортивный
                зал, две спортивные площадки, медицинский кабинет, столовая и
                другие помещения, обеспечивающие комфортное обучение и
                воспитание учащихся.
              </p>
              <p>
                В гимназии активно развивается цифровая образовательная
                среда. Учреждение полностью обеспечено доступом к сети
                Интернет, внедряются современные образовательные технологии и
                цифровые инструменты обучения.
              </p>
              <p>
                Образовательный процесс осуществляется на русском языке
                обучения. В соответствии с национальным учебным планом
                учащиеся изучают государственный (румынский) язык, родной
                (гагаузский) язык, а также один из иностранных языков —
                английский.
              </p>
              <p>
                Сегодня гимназия продолжает лучшие традиции, накопленные за
                многие десятилетия своей истории, сочетая их с современными
                подходами к обучению, воспитанию и развитию каждого ученика.
                Главной ценностью учреждения остаются дети, их успехи,
                безопасность, благополучие и подготовка к жизни в современном
                обществе.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general">
            <AccordionTrigger className={TRIGGER_CLASS}>
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary shrink-0" />
                Общие сведения об учреждении
              </span>
            </AccordionTrigger>
            <AccordionContent className={CONTENT_CLASS}>
              <div>
                <p className="font-medium dark:text-white mb-1">
                  Языки преподавания
                </p>
                <p>
                  Образовательный процесс в гимназии осуществляется на русском и
                  гагаузском языках обучения. Изучение государственного
                  (румынского) языка, а также иностранных языков организовано в
                  соответствии с требованиями учебного плана Республики Молдова.
                </p>
              </div>

              <div>
                <p className="font-medium dark:text-white mb-1">
                  Количество классов
                </p>
                <p>
                  В 2025–2026 учебном году в гимназии функционирует{' '}
                  {s.classesTotal} {classesWord}.
                </p>
              </div>

              <div>
                <p className="font-medium dark:text-white mb-1">
                  Общее количество учащихся
                </p>
                <p>
                  По состоянию на начало 2025–2026 учебного года в гимназии
                  обучается {s.studentsTotal} {studentsWord}.
                </p>
              </div>

              <div>
                <p className="font-medium dark:text-white mb-1">
                  Краткая характеристика материально-технической базы
                </p>
                <ul className="list-disc pl-6 flex flex-col gap-2">
                  <li>
                    <strong>Учебные кабинеты</strong> — гимназия располагает
                    оборудованными учебными кабинетами, предназначенными для
                    организации образовательного процесса по всем учебным
                    дисциплинам. Кабинеты обеспечены необходимой мебелью,
                    учебно-наглядными материалами и техническими средствами
                    обучения.
                  </li>
                  <li>
                    <strong>Библиотека</strong> — в учреждении функционирует
                    школьная библиотека, располагающая фондом учебной,
                    художественной, методической и справочной литературы.
                    Библиотека обеспечивает учащихся учебниками и способствует
                    развитию читательской культуры.
                  </li>
                  <li>
                    <strong>Спортивный зал</strong> — оборудован необходимым
                    спортивным инвентарём для проведения уроков физической
                    культуры, спортивных секций, соревнований и оздоровительных
                    мероприятий.
                  </li>
                  <li>
                    <strong>Столовая</strong> — обеспечивает учащихся горячим
                    питанием в соответствии с утверждённым меню и
                    санитарно-гигиеническими нормами. Пищеблок оснащён
                    необходимым технологическим оборудованием. Для приготовления
                    пищи и питья используется очищенная вода благодаря
                    установленной системе фильтрации.
                  </li>
                  <li>
                    <strong>Медицинский кабинет</strong> — предназначен для
                    оказания первой медицинской помощи, проведения
                    профилактических мероприятий, медицинского наблюдения за
                    состоянием здоровья учащихся и контроля соблюдения
                    санитарно-гигиенических требований.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium dark:text-white mb-1">
                  Материально-техническая база
                </p>
                <p className="mb-1">Компьютерная техника:</p>
                <ul className="list-disc pl-6 flex flex-col gap-1">
                  <li>интерактивные панели (доски) — 46 ед.;</li>
                  <li>проекторы — 10 ед.;</li>
                  <li>телевизоры — 14 ед.;</li>
                  <li>
                    стационарные компьютеры — 18 ед. (16 учебных, 1
                    административный, 1 серверный/служебный);
                  </li>
                  <li>ноутбуки — 32 ед.;</li>
                  <li>планшеты — 42 ед.;</li>
                  <li>принтеры и многофункциональные устройства — 9 ед.</li>
                </ul>
              </div>

              <div>
                <p className="font-medium dark:text-white mb-1">
                  Видеонаблюдение
                </p>
                <p>
                  Территория и помещения гимназии оборудованы системой
                  видеонаблюдения, обеспечивающей безопасность учащихся,
                  работников и сохранность имущества учреждения.
                </p>
              </div>

              <div>
                <p className="font-medium dark:text-white mb-1">
                  Доступность для детей с особыми образовательными потребностями
                  (ООП)
                </p>
                <ul className="list-disc pl-6 flex flex-col gap-1.5">
                  <li>
                    в гимназии создаются условия для обучения детей с особыми
                    образовательными потребностями в соответствии с действующим
                    законодательством Республики Молдова;
                  </li>
                  <li>
                    обеспечивается безбарьерный доступ (при наличии
                    соответствующей инфраструктуры);
                  </li>
                  <li>
                    организуется психолого-педагогическое сопровождение
                    учащихся;
                  </li>
                  <li>
                    осуществляется сотрудничество со Службой
                    психолого-педагогической помощи (SAP) и другими профильными
                    специалистами;
                  </li>
                  <li>
                    при необходимости разрабатываются и реализуются
                    индивидуализированные образовательные программы и
                    предоставляются разумные условия обучения.
                  </li>
                </ul>
              </div>
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
