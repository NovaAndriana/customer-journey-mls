import { LayoutDashboard, Users, Bike, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Pipeline', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/motor-models', label: 'Motor Models', icon: Bike },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];