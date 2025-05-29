import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, FileText, UserCog, Settings, BarChart3, ShieldAlert } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/incidents/report',
    label: 'Report Incident',
    icon: ShieldAlert,
  },
  {
    href: '/admin',
    label: 'Admin Configuration',
    icon: UserCog,
  },
  {
    href: '/reports/executive-summary',
    label: 'Executive Summary',
    icon: FileText,
  },
  // Setup link might be conditionally shown or accessed differently
  // For now, keeping it separate as it's a distinct flow.
  // {
  //   href: '/setup',
  //   label: 'System Setup',
  //   icon: Settings,
  // },
];
