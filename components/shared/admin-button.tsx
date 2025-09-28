'use client';

import { useAdminStore } from '@/store/admin';
import { Button } from '@/components/ui/button';

export function AdminButton() {
  const { isAdmin, logout } = useAdminStore();

  if (!isAdmin) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      onClick={logout}
      className="w-full max-w-md mx-auto mt-4"
    >
      Выйти
    </Button>
  );
}
