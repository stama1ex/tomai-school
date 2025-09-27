'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/admin';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AdminButton() {
  const [open, setOpen] = useState(false);
  const login = useAdminStore((s) => s.login);
  const logout = useAdminStore((s) => s.logout);
  const isAdmin = useAdminStore((s) => s.isAdmin);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="fixed bottom-4 right-4 z-5">
      {!isAdmin ? (
        <>
          <Button onClick={() => setOpen(true)}>Я админ</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Вход для администратора</DialogTitle>
              </DialogHeader>
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded p-2 w-full mb-2"
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded p-2 w-full mb-4"
              />
              <Button
                onClick={async () => {
                  const success = login(username, password);
                  if (await success) setOpen(false);
                  else alert('Неверный логин или пароль');
                }}
              >
                Войти
              </Button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Button variant="destructive" onClick={logout}>
          Выйти
        </Button>
      )}
    </div>
  );
}
