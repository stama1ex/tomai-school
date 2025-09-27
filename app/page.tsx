import { Banner } from '@/components/shared/banner';
import { Title } from '@/components/shared/title';

export default function Home() {
  return (
    <>
      <Banner image="/background2.jpg" title={'Главная'} className="mb-16" />
      <div className="px-8">
        <Title
          text={'Добро пожаловать на официальный сайт ПУ Гимназия села Томай!'}
          size="md"
          className="text-primary font-bold text-center mb-8"
        />

        <Title
          text={
            'Bine ați venit pe site-ul oficial al IP Gimnaziul din satul Tomai!'
          }
          size="md"
          className="text-primary font-bold text-center mb-8"
        />

        <Title
          text={'Hoș geldiniz Publik kurumu Tomay gimnaziyasının saytına!'}
          size="md"
          className="text-primary font-bold text-center mb-8"
        />
      </div>
    </>
  );
}
