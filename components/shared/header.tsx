// header.tsx
import { Container } from './container';
import { cn } from '@/lib/utils';
import { NavigationMenuDemo } from './nav-menu';
import { ThemeToggleButton } from './theme-toggle-button';
import Link from 'next/link';
import { MobileNavMenu } from './mobile-nav-menu';
import { getSiteSettings } from '@/lib/settings';

interface Props {
  className?: string;
}

export async function Header({ className }: Props) {
  const settings = await getSiteSettings();

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
            'flex items-center justify-center w-full sm:w-auto text-center text-base sm:text-xl font-medium px-2',
            'sm:justify-start sm:px-0'
          )}
          href="/"
        >
          {settings.shortName || 'ПУ Гимназия с. Томай'}
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
}
