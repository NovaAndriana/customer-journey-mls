'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MobileNav } from './mobile-nav';

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Header({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const rawUser = Cookies.get('user');
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (error) {
        console.error('Failed to parse user session:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
    router.refresh();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b bg-background gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold leading-tight truncate">{title}</h1>
          {description && (
            <p className="text-xs md:text-sm text-muted-foreground truncate hidden sm:block">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        <div className="text-right hidden lg:block">
          <p className="text-sm font-medium leading-tight">{user?.name || 'Guest'}</p>
        </div>
        <Avatar>
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>

        <button
          onClick={handleLogout}
          className="text-xs px-2.5 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-colors cursor-pointer"
          title="Keluar aplikasi"
        >
          Logout
        </button>
      </div>
    </header>
  );
}