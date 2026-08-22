import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LifeBuoy, ChevronsUpDown, LogOut, Waves } from "lucide-react";
import { adminNav, employeeNav } from "./nav-items";
import { currentUser } from "@/data/employee";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const renderItems = (items: typeof employeeNav) =>
    items.map((item) => {
      const active = isActive(item.to);
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "absolute left-0 h-5 w-0.5 rounded-r-full bg-sidebar-primary transition-opacity",
              active ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
          <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
          <span className="min-w-0 truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary num">
              {item.badge}
            </span>
          )}
        </Link>
      );
    });

  // Determine display name — use auth user if available, else fallback to demo data
  const displayName = user?.email?.split("@")[0] ?? currentUser.name;
  const displayEmail = user?.email ?? currentUser.email;
  const displayRole = user?.role === "HR_ADMIN" ? "HR Admin" : "Employee";
  const displayInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Waves className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-tight text-foreground">Dayflow</p>
          <p className="truncate text-[11px] text-muted-foreground">HR Workspace</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <div className="space-y-0.5">{renderItems(employeeNav)}</div>

        {/* Only show admin nav if user has HR_ADMIN role */}
        {user?.role === "HR_ADMIN" && (
          <>
            <p className="px-3 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Administration
            </p>
            <div className="space-y-0.5">{renderItems(adminNav)}</div>
          </>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LifeBuoy className="h-[18px] w-[18px]" strokeWidth={1.8} />
          Help &amp; Support
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="mt-2 flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-[12px] font-bold text-primary">
              {displayInitials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-foreground">
                {displayName}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">{displayRole}</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {displayEmail}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">My profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

