
"use client";

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import SidebarNavItems from './sidebar-nav-items';
import AppHeader from './app-header';
import { useAppContext } from '@/context/app-context';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { brandingConfig } = useAppContext();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4 flex flex-col items-center">
          {brandingConfig.logoUrl ? (
            <Image
              key={brandingConfig.logoUrl} 
              src={brandingConfig.logoUrl}
              alt={brandingConfig.companyName ? `${brandingConfig.companyName} Logo` : 'Company Logo'}
              width={120} // Provide a base width for the original image for aspect ratio
              height={50} // Provide a base height for the original image for aspect ratio
              className="object-contain h-10 w-auto max-w-[120px] group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 transition-all"
              data-ai-hint="logo company"
              priority // Preload logo if it's important for LCP
            />
          ) : (
            <ShieldCheck className="h-10 w-10 text-sidebar-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all" />
          )}
          <h1
            className="text-xl font-semibold text-sidebar-foreground mt-2 group-data-[collapsible=icon]:hidden transition-opacity duration-200"
          >
            {brandingConfig.companyName}
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavItems />
        </SidebarContent>
        <SidebarFooter className="p-4 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden transition-opacity duration-200">
          © {new Date().getFullYear()} {brandingConfig.companyName}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
