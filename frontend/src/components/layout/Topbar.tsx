import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronRight, Menu, Search, ChevronDown } from "lucide-react";
import { pageMeta } from "./nav-items";
import { currentUser, notifications } from "@/data/employee";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meta = pageMeta[pathname] ?? { title: "Dayflow", section: "Workspace" };
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <li className="hidden text-muted-foreground sm:block">{meta.section}</li>
              <li className="hidden sm:block" aria-hidden>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              </li>
              <li className="truncate text-[15px] font-semibold text-foreground sm:text-base">
                {meta.title}
              </li>
            </ol>
          </nav>
        </div>

        <div className="hidden justify-self-center md:block md:w-full md:max-w-sm">
          <label htmlFor="global-search" className="sr-only">
            Search people, requests and documents
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="global-search"
              type="search"
              placeholder="Search people, leave, payslips…"
              className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-14 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground hover:border-ring/40 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:block">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1 justify-self-end sm:gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
                <Bell className="h-[18px] w-[18px]" />
                {unread > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[19rem] p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="text-[11px] text-muted-foreground num">{unread} unread</span>
              </div>
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
                    <span
                      className={
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " +
                        (n.unread ? "bg-primary" : "bg-border")
                      }
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/80">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:border-border sm:bg-card sm:pr-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-[12px] font-bold text-primary">
                {currentUser.initials}
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block truncate text-[13px] font-semibold leading-tight">
                  {currentUser.name}
                </span>
                <span className="block truncate text-[11px] leading-tight text-muted-foreground">
                  Employee
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{currentUser.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">My profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[11px] font-normal uppercase tracking-wide text-muted-foreground">
                Switch view
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/">Employee workspace</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin">HR / Admin console</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
