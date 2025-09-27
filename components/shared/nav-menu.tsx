/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import * as React from 'react';
import Link from 'next/link';

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
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {/* Главная */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="dark:bg-transparent">
            Главная
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    href="/"
                    className="relative flex h-full w-full flex-col justify-end rounded-md overflow-hidden select-none focus:shadow-md p-6"
                  >
                    {/* фоновая картинка */}
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-120"
                      style={{ backgroundImage: "url('/background.jpg')" }}
                    ></div>

                    {/* затемнение */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* контент поверх */}
                    <div className="relative mt-4 mb-2 text-2xl font-medium text-white">
                      На главную страницу
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>

              <ListItem
                href="/regulations-on-functioning"
                title="Положение о функционировании"
              >
                Документ, регулирующий организацию и работу учебного заведения.
              </ListItem>

              <ListItem href="/charter" title="Устав учебного заведения">
                Основные правила, права и обязанности участников
                образовательного процесса.
              </ListItem>

              <ListItem
                href="/regulations-on-assessment"
                title="Положение об оценивании"
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
            className={cn(navigationMenuTriggerStyle(), 'dark:bg-transparent')}
          >
            <Link href="/about">О школе</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Учителя */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="dark:bg-transparent">
            Учителя
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/staffing">Кадровый состав</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/class-teachers">Классные руководители</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Для родителей */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="dark:bg-transparent">
            Для родителей
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/exams">Экзамены 2025</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/first-grade-admission">
                    О приёме в первый класс
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Планы */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="dark:bg-transparent">
            Планы
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/lessons-schedule">Расписание уроков</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/call-schedule">Расписание звонков</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/plans">Планы</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Отчеты */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="dark:bg-transparent">
            Отчёты
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/reports">Отчёты</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/budget">Бюджет</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Контакты */}

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), 'dark:bg-transparent')}
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
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
