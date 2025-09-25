import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';

export default function Contacts() {
  return (
    <>
      <Banner image="/background.jpg" title="Контакты" className="mb-8" />
      <Container className="px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Левая часть с текстом */}
          <div className="flex flex-col gap-4 text-primary/90">
            <h2 className="text-xl font-bold text-primary mb-4">
              Свяжитесь с нами
            </h2>
            <p>РМ Молдова</p>
            <p>АТО Гагаузия</p>
            <p>Чадыр - Лунгский р-н, с. Томай</p>
            <p>ул. Школьная 103а</p>
            <p>+373 291 51 289</p>
            <p>
              e-mail:{' '}
              <a
                href="mailto:tomailiceuteor@mail.ru"
                className="text-primary underline hover:text-primary/80 transition-colors"
              >
                tomailiceuteor@mail.ru
              </a>
            </p>
            <p>
              Вы можете задать нам любой вопрос по телефону:{' '}
              <span className="font-medium">
                +373 291 51 289 (с 8:00 до 17:00)
              </span>
            </p>
          </div>

          {/* Правая часть с картой */}
          <div className="w-full border rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2756.690123904907!2d28.7641211!3d46.187927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b62ecb53700ffb%3A0x82060177ffb32e58!2z0KLQtdC70LXRgNC90YvQuSDQm9Cw0YHRgdC60L7QuQ!5e0!3m2!1sru!2smd!4v1695678901!5m2!1sru!2smd"
              className="w-full h-[400px] md:h-[450px] lg:h-[500px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </Container>
    </>
  );
}
