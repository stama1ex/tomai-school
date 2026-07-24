'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
      <Image
        src="/background2.jpg"
        alt="Гимназия села Томай"
        fill
        priority
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        className="object-cover object-center will-change-transform"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      <div className="relative h-full flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex flex-col gap-2 text-white">
          <p className="text-2xl md:text-4xl font-bold">
            Добро пожаловать на официальный сайт ПУ Гимназия села Томай!
          </p>
          <p className="text-base md:text-lg text-white/85">
            Bine ați venit pe site-ul oficial al IP Gimnaziul din satul Tomai!
          </p>
          <p className="text-base md:text-lg text-white/85">
            Hoș geldiniz Publik kurumu Tomay gimnaziyasının saytına!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/about">О школе</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white"
          >
            <Link href="/contacts">Связаться с нами</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
