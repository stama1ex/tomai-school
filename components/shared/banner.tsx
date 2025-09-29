'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { Title } from './title';

interface Props {
  className?: string;
  image: string;
  title: ReactNode;
}

export const Banner: React.FC<Props> = ({ className, image, title }) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className={cn(className, 'relative w-full h-[300px] overflow-hidden')}
      >
        <Image
          src={image}
          alt="banner"
          fill
          priority
          style={{
            transform: `translateY(${offsetY * 0.3}px)`,
          }}
          className="object-cover object-center will-change-transform"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <Title
            text={title}
            size="4xl"
            className="text-white font-bold hidden md:block"
          />
          <Title
            text={title}
            size="xl"
            className="text-white font-bold md:hidden"
          />
        </div>
      </div>
    </>
  );
};
