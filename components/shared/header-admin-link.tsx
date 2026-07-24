'use client';

import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/admin';

export function HeaderAdminLink() {
  const isAdmin = useAdminStore((s) => s.isAdmin);

  if (!isAdmin) return null;

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/admin">
        <LayoutDashboard />
        <span className="hidden sm:inline">Админка</span>
      </Link>
    </Button>
  );
}
