import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/container';
import { Card } from '@/components/ui/card';

const staff = [
  {
    name: 'Христева Валентина Дмитриевна',
    role: 'директор гимназии',
  },
  {
    name: 'Топчу Варвара Георгиевна',
    role: 'зам. директора по УВР',
  },
  {
    name: 'Гарчу Василиса Александровна',
    role: 'зам. директора по ВР',
  },
  {
    name: 'Топчу Елена Петровна',
    role: 'зам. директора по ВР',
  },
  {
    name: 'Топчу Мария Пантелеевна',
    role: 'зам. директора по АХЧ',
  },
];

export default function Staffing() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title={'Кадровый состав'}
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <Title
          text={'Администрация ПУ Гимназия с. Томай'}
          size="md"
          className="text-primary font-bold text-center mb-6"
        />
        <hr className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {staff.map((member, index) => (
            <Card
              key={index}
              primaryText={member.name}
              secondaryText={member.role}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
