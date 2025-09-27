// mobile-nav-menu.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';

export function MobileNavMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <DialogTitle className="text-lg font-medium hidden">
          Навигация по сайту
        </DialogTitle>
        <Accordion type="single" collapsible className="w-full">
          {/* Главная */}
          <AccordionItem value="main" className="mt-8 px-4">
            <AccordionTrigger className={cn(pathname === '/' && 'font-bold')}>
              Главная
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/"
                    className={cn(
                      'block p-2 hover:bg-muted rounded font-medium',
                      pathname === '/' && 'font-bold bg-muted'
                    )}
                  >
                    На главную страницу
                  </Link>
                </li>
                <li>
                  <Link
                    href="/regulations-on-functioning"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/regulations-on-functioning' &&
                        'font-bold bg-muted'
                    )}
                  >
                    <div className="font-medium">
                      Положение о функционировании
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Документ, регулирующий организацию и работу учебного
                      заведения.
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/charter"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/charter' && 'font-bold bg-muted'
                    )}
                  >
                    <div className="font-medium">Устав учебного заведения</div>
                    <p className="text-sm text-muted-foreground">
                      Основные правила, права и обязанности участников
                      образовательного процесса.
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/regulations-on-assessment"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/regulations-on-assessment' &&
                        'font-bold bg-muted'
                    )}
                  >
                    <div className="font-medium">Положение об оценивании</div>
                    <p className="text-sm text-muted-foreground">
                      Описание системы контроля знаний и критериев выставления
                      оценок.
                    </p>
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* О школе */}
          <Link
            href="/about"
            className={cn(
              'block p-4 hover:bg-muted rounded border-b font-medium text-sm',
              pathname === '/about' && 'font-bold bg-muted'
            )}
          >
            О школе
          </Link>

          {/* Учителя */}
          <AccordionItem value="teachers" className="px-4">
            <AccordionTrigger
              className={cn(
                (pathname === '/staffing' || pathname === '/class-teachers') &&
                  'font-bold'
              )}
            >
              Учителя
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/staffing"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/staffing' && 'font-bold bg-muted'
                    )}
                  >
                    Кадровый состав
                  </Link>
                </li>
                <li>
                  <Link
                    href="/class-teachers"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/class-teachers' && 'font-bold bg-muted'
                    )}
                  >
                    Классные руководители
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Для родителей */}
          <AccordionItem value="parents" className="px-4">
            <AccordionTrigger
              className={cn(
                (pathname === '/exams' ||
                  pathname === '/first-grade-admission') &&
                  'font-bold'
              )}
            >
              Для родителей
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/exams"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/exams' && 'font-bold bg-muted'
                    )}
                  >
                    Экзамены 2025
                  </Link>
                </li>
                <li>
                  <Link
                    href="/first-grade-admission"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/first-grade-admission' &&
                        'font-bold bg-muted'
                    )}
                  >
                    О приёме в первый класс
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Планы */}
          <AccordionItem value="plans" className="px-4">
            <AccordionTrigger
              className={cn(
                (pathname === '/lessons-schedule' ||
                  pathname === '/call-schedule' ||
                  pathname === '/plans') &&
                  'font-bold'
              )}
            >
              Планы
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/lessons-schedule"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/lessons-schedule' && 'font-bold bg-muted'
                    )}
                  >
                    Расписание уроков
                  </Link>
                </li>
                <li>
                  <Link
                    href="/call-schedule"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/call-schedule' && 'font-bold bg-muted'
                    )}
                  >
                    Расписание звонков
                  </Link>
                </li>
                <li>
                  <Link
                    href="/plans"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/plans' && 'font-bold bg-muted'
                    )}
                  >
                    Планы
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Отчёты */}
          <AccordionItem value="reports" className="px-4">
            <AccordionTrigger
              className={cn(
                (pathname === '/reports' || pathname === '/budget') &&
                  'font-bold'
              )}
            >
              Отчёты
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/reports"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/reports' && 'font-bold bg-muted'
                    )}
                  >
                    Отчёты
                  </Link>
                </li>
                <li>
                  <Link
                    href="/budget"
                    className={cn(
                      'block p-2 hover:bg-muted rounded',
                      pathname === '/budget' && 'font-bold bg-muted'
                    )}
                  >
                    Бюджет
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Контакты */}
          <Link
            href="/contacts"
            className={cn(
              'block p-4 hover:bg-muted rounded border-b font-medium text-sm',
              pathname === '/contacts' && 'font-bold bg-muted'
            )}
          >
            Контакты
          </Link>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
