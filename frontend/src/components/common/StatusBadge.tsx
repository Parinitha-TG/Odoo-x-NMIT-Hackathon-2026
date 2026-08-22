import { cn } from "@/lib/utils";

export type Tone = "success" | "warning" | "destructive" | "primary" | "neutral" | "info";

const toneClasses: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning-foreground border-warning/30",
  destructive: "bg-destructive-soft text-destructive border-destructive/20",
  primary: "bg-primary-soft text-primary border-primary/20",
  info: "bg-info-soft text-info border-info/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  tone = "neutral",
  children,
  dot = true,
  className,
}: {
  tone?: Tone | undefined;
  children: React.ReactNode;
  dot?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />}
      {children}
    </span>
  );
}

export const statusTone: Record<string, Tone> = {
  present: "success",
  approved: "success",
  active: "success",
  pending: "warning",
  leave: "info",
  "on-leave": "info",
  rejected: "destructive",
  absent: "destructive",
  weekoff: "neutral",
  holiday: "primary",
};
