// header.tsx
import React from 'react';
import { Container } from './container';
import { cn } from '@/lib/utils';
import { NavigationMenuDemo } from './nav-menu';
import { ThemeToggleButton } from './theme-toggle-button';
import Link from 'next/link';
import { MobileNavMenu } from './mobile-nav-menu';

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header
      className={cn(
        'border-b border-border sticky top-0 z-10 dark:backdrop-blur-xl not-dark:bg-background',
        className
      )}
    >
      <Container className="flex items-center justify-between p-4 gap-4 relative">
        <MobileNavMenu />

        <Link
          className={cn(
            'flex items-center justify-center w-full sm:w-auto text-xl font-medium',
            'sm:justify-start'
          )}
          href="/"
        >
          ПУ Гимназия с. Томай
        </Link>
        <div className="flex gap-4 items-center">
          <div className="hidden md:block">
            <NavigationMenuDemo />
          </div>
          <div className="md:hidden block">
            <ThemeToggleButton />
          </div>
          <div className="md:block hidden">
            <ThemeToggleButton />
          </div>
        </div>
      </Container>
    </header>
  );
};
