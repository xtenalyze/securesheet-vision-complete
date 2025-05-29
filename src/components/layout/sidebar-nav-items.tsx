"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/constants/nav-links';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export default function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {NAV_LINKS.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
            tooltip={link.label}
            className={cn(
              "justify-start",
              (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href={link.href}>
              <link.icon className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate group-data-[collapsible=icon]:hidden">{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
