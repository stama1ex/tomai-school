// MobileNavMenu.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Menu } from 'lucide-react';

export function MobileNavMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <Accordion type="single" collapsible className="w-full">
          {/* Главная */}
          <AccordionItem value="main" className="mt-8 px-4">
            <AccordionTrigger>Главная</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/"
                    className="block p-2 hover:bg-muted rounded font-medium"
                  >
                    На главную страницу
                  </Link>
                </li>
                <li>
                  <Link
                    href="/regulations-on-functioning"
                    className="block p-2 hover:bg-muted rounded"
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
                    className="block p-2 hover:bg-muted rounded"
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
                    className="block p-2 hover:bg-muted rounded"
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
            className="block p-4 hover:bg-muted rounded border-b font-medium text-sm"
          >
            О школе
          </Link>

          {/* Учителя */}
          <AccordionItem value="teachers" className="px-4">
            <AccordionTrigger>Учителя</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/staffing"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Кадровый состав
                  </Link>
                </li>
                <li>
                  <Link
                    href="/class-teachers"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Классные руководители
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Для родителей */}
          <AccordionItem value="parents" className="px-4">
            <AccordionTrigger>Для родителей</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/exams"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Экзамены 2025
                  </Link>
                </li>
                <li>
                  <Link
                    href="/first-grade-admission"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    О приёме в первый класс
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Планы */}
          <AccordionItem value="plans" className="px-4">
            <AccordionTrigger>Планы</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/lessons-schedule"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Расписание уроков
                  </Link>
                </li>
                <li>
                  <Link
                    href="/call-schedule"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Расписание звонков
                  </Link>
                </li>
                <li>
                  <Link
                    href="/plans"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Планы
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Отчёты */}
          <AccordionItem value="reports" className="px-4">
            <AccordionTrigger>Отчёты</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-4">
                <li>
                  <Link
                    href="/reports"
                    className="block p-2 hover:bg-muted rounded"
                  >
                    Отчёты
                  </Link>
                </li>
                <li>
                  <Link
                    href="/budget"
                    className="block p-2 hover:bg-muted rounded"
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
            className="block p-4 hover:bg-muted rounded border-b font-medium text-sm"
          >
            Контакты
          </Link>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
