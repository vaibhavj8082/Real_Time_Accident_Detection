'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/streams':
      return 'Live Streams';
    case '/upload':
      return 'Upload & Analyze Video';
    case '/settings':
      return 'System Settings';
    default:
      return 'AlertWatch';
  }
};

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="h-9 w-9 border">
          <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="Admin" data-ai-hint="user avatar" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}