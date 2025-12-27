'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, Settings, Upload, Video } from 'lucide-react';
import { AlertWatchLogo } from '@/components/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border bg-sidebar"
      >
        <SidebarHeader>
          <div className="flex items-center gap-2.5">
            <AlertWatchLogo className="size-7 text-sidebar-primary-foreground group-data-[collapsible=icon]:size-6" />
            <h1 className="text-lg font-semibold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
              AlertWatch
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/streams'}
                tooltip={{ children: 'Live Streams' }}
              >
                <Link href="/streams">
                  <Video />
                  <span>Live Streams</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/upload'}
                tooltip={{ children: 'Upload Video' }}
              >
                <Link href="/upload">
                  <Upload />
                  <span>Upload Video</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip={{ children: 'Settings' }}
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col bg-background">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
