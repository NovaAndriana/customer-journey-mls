'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MobileNav } from './mobile-nav';

export function Header({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
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
          <p className="text-sm font-medium leading-tight">Siti Nurhaliza</p>
          <p className="text-xs text-muted-foreground">Salesperson</p>
        </div>
        <Avatar>
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}