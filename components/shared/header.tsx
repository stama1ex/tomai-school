import React from 'react';
import { Container } from './container';
import { cn } from '@/lib/utils';
import { NavigationMenuDemo } from './nav-menu';
import { ThemeToggleButton } from './theme-toggle-button';
import Link from 'next/link';

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
      <Container className="flex items-center justify-between py-4 gap-4 relative">
        <Link
          className="relative flex items-center justify-between w-full sm:w-auto text-xl font-medium"
          href="/"
        >
          ПУ Гимназия с. Томай
        </Link>
        <div className="flex gap-6">
          <NavigationMenuDemo />
          <ThemeToggleButton />
        </div>
      </Container>
    </header>
  );
};
