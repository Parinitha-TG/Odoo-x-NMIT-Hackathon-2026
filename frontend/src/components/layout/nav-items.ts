import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Wallet,
  UserRound,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export const employeeNav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Attendance", to: "/attendance", icon: CalendarCheck },
  { label: "Leave", to: "/leave", icon: CalendarDays, badge: "1" },
  { label: "Payroll", to: "/payroll", icon: Wallet },
  { label: "My Profile", to: "/profile", icon: UserRound },
  { label: "Settings", to: "/settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: "HR Overview", to: "/admin", icon: Users, badge: "9" },
];

export const pageMeta: Record<string, { title: string; section: string }> = {
  "/": { title: "Dashboard", section: "Workspace" },
  "/attendance": { title: "Attendance", section: "Workspace" },
  "/leave": { title: "Leave", section: "Workspace" },
  "/payroll": { title: "Payroll", section: "Workspace" },
  "/profile": { title: "My Profile", section: "Account" },
  "/settings": { title: "Settings", section: "Account" },
  "/admin": { title: "HR Overview", section: "Administration" },
};
