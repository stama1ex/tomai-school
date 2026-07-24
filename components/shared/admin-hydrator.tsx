'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/store/admin';

export function AdminHydrator() {
  const hydrate = useAdminStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
