import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const iconTones = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  destructive: "bg-destructive-soft text-destructive",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  footer,
  loading,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof iconTones;
  footer?: ReactNode;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="surface p-5">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="mt-4 h-3 w-24" />
        <Skeleton className="mt-3 h-7 w-32" />
        <Skeleton className="mt-4 h-3 w-full" />
      </div>
    );
  }

  return (
    <div className="surface p-5 transition-shadow duration-200 hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", iconTones[tone])}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        {hint}
      </div>
      <p className="mt-4 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-foreground num">
        {value}
      </p>
      {footer && <div className="mt-3 text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}
