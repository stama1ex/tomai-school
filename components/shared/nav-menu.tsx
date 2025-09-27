/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function NavigationMenuDemo() {
  const pathname = usePathname(); // Get current route

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {/* Главная */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'dark:bg-transparent',
              pathname === '/' && 'font-bold text-primary'
            )}
          >
            Главная
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    href="/"
                    className={cn(
                      'relative flex h-full w-full flex-col justify-end rounded-md overflow-hidden select-none focus:shadow-md p-6',
                      pathname === '/' && 'font-bold'
                    )}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-120"
                      style={{ backgroundImage: "url('/background.jpg')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative mt-4 mb-2 text-2xl font-medium text-white">
                      {pathname === '/'
                        ? 'Добро пожаловать!'
                        : 'На главную страницу'}
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/regulations-on-functioning"
                title="Положение о функционировании"
                className={cn(
                  pathname === '/regulations-on-functioning' &&
                    'font-bold bg-muted'
                )}
              >
                Документ, регулирующий организацию и работу учебного заведения.
              </ListItem>
              <ListItem
                href="/charter"
                title="Устав учебного заведения"
                className={cn(pathname === '/charter' && 'font-bold bg-muted')}
              >
                Основные правила, права и обязанности участников
                образовательного процесса.
              </ListItem>
              <ListItem
                href="/regulations-on-assessment"
                title="Положение об оценивании"
                className={cn(
                  pathname === '/regulations-on-assessment' &&
                    'font-bold bg-muted'
                )}
              >
                Описание системы контроля знаний и критериев выставления оценок.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* О школе */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              'dark:bg-transparent',
              pathname === '/about' && 'font-bold'
            )}
          >
            <Link href="/about">О школе</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Учителя */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'dark:bg-transparent',
              (pathname === '/staffing' || pathname === '/class-teachers') &&
                'font-bold'
            )}
          >
            Учителя
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/staffing"
                    className={cn(
                      pathname === '/staffing' && 'font-bold bg-muted'
                    )}
                  >
                    Кадровый состав
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/class-teachers"
                    className={cn(
                      pathname === '/class-teachers' && 'font-bold bg-muted'
                    )}
                  >
                    Классные руководители
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Для родителей */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'dark:bg-transparent',
              (pathname === '/exams' ||
                pathname === '/first-grade-admission') &&
                'font-bold'
            )}
          >
            Для родителей
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/exams"
                    className={cn(
                      pathname === '/exams' && 'font-bold bg-muted'
                    )}
                  >
                    Экзамены 2025
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/first-grade-admission"
                    className={cn(
                      pathname === '/first-grade-admission' &&
                        'font-bold bg-muted'
                    )}
                  >
                    О приёме в первый класс
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Планы */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'dark:bg-transparent',
              (pathname === '/lessons-schedule' ||
                pathname === '/call-schedule' ||
                pathname === '/plans') &&
                'font-bold'
            )}
          >
            Планы
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/lessons-schedule"
                    className={cn(
                      pathname === '/lessons-schedule' && 'font-bold bg-muted'
                    )}
                  >
                    Расписание уроков
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/call-schedule"
                    className={cn(
                      pathname === '/call-schedule' && 'font-bold bg-muted'
                    )}
                  >
                    Расписание звонков
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/plans"
                    className={cn(
                      pathname === '/plans' && 'font-bold bg-muted'
                    )}
                  >
                    Планы
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Отчёты */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'dark:bg-transparent',
              (pathname === '/reports' || pathname === '/budget') && 'font-bold'
            )}
          >
            Отчёты
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/reports"
                    className={cn(
                      pathname === '/reports' && 'font-bold bg-muted'
                    )}
                  >
                    Отчёты
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/budget"
                    className={cn(
                      pathname === '/budget' && 'font-bold bg-muted'
                    )}
                  >
                    Бюджет
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Контакты */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              'dark:bg-transparent',
              pathname === '/contacts' && 'font-bold'
            )}
          >
            <Link href="/contacts">Контакты</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  className,
}: React.ComponentPropsWithoutRef<'li'> & {
  href: string;
  className?: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn('block p-2 hover:bg-muted rounded', className)}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
