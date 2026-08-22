import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  Inbox,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatusBadge, statusTone } from "@/components/common/StatusBadge";
import { RequestLeaveDialog } from "@/components/leave/RequestLeaveDialog";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  leaveBalances,
  leaveRequests,
  type LeaveStatus,
} from "@/data/employee";

export const Route = createFileRoute("/leave")({
  head: () => ({
    meta: [
      { title: "Leave · Dayflow HRMS" },
      {
        name: "description",
        content:
          "View leave balances and manage paid, sick and unpaid leave requests in Dayflow.",
      },
      {
        property: "og:title",
        content: "Leave · Dayflow HRMS",
      },
      {
        property: "og:description",
        content:
          "Leave balances, requests and approval status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: LeavePage,
});

const barTone: Record<string, string> = {
  primary: "[&>div]:bg-primary",
  warning: "[&>div]:bg-warning",
  success: "[&>div]:bg-success",
};

const tabIcon = {
  pending: Clock3,
  approved: CheckCircle2,
  rejected: XCircle,
} as const;

function RequestList({
  status,
}: {
  status: LeaveStatus;
}) {
  const items = leaveRequests.filter(
    (request) => request.status === status,
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="h-5 w-5" />
        </span>

        <p className="text-sm font-medium text-foreground">
          No {status} requests
        </p>

        <p className="max-w-xs text-xs text-muted-foreground">
          Requests you submit will appear here with their
          approval status.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((request) => (
        <li
          key={request.id}
          className="grid gap-3 py-4 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {request.type}
              </p>

              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground num">
                {request.id}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground num">
              {request.from} → {request.to} ·{" "}
              {request.days} day
              {request.days > 1 ? "s" : ""} · applied{" "}
              {request.appliedOn}
            </p>

            <p className="mt-1.5 text-xs text-muted-foreground">
              {request.reason}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <StatusBadge
              tone={statusTone[request.status] ?? "neutral"}
            >
              <span className="capitalize">
                {request.status}
              </span>
            </StatusBadge>

            <span className="hidden text-xs text-muted-foreground sm:block">
              {request.approver}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function LeavePage() {
  const totalAvailable = leaveBalances.reduce(
    (sum, balance) =>
      sum + (balance.total - balance.used),
    0,
  );

  return (
    <AppShell>
      <PageHeader
        title="Leave"
        subtitle={`You have ${totalAvailable} days of leave available this year.`}
        actions={<RequestLeaveDialog />}
      />

      {/* LEAVE BALANCES */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leaveBalances.map((balance) => {
          const available =
            balance.total - balance.used;

          return (
            <div
              key={balance.type}
              className="surface p-5 transition-shadow duration-200 hover:shadow-raised"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {balance.type}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground num">
                    {balance.used} used of{" "}
                    {balance.total}
                  </p>
                </div>

                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <CalendarDays className="h-[18px] w-[18px]" />
                </span>
              </div>

              <p className="mt-4 text-[26px] font-bold leading-none tracking-tight num">
                {available}

                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  days left
                </span>
              </p>

              <Progress
                value={
                  balance.total > 0
                    ? (balance.used / balance.total) *
                      100
                    : 0
                }
                className={`mt-4 h-1.5 ${barTone[balance.tone] ?? ""}`}
              />
            </div>
          );
        })}
      </div>

      {/* REQUESTS */}
      <SectionCard
        className="mt-6"
        title="My requests"
        description="Paid, sick and unpaid leave requests"
        bodyClassName="p-5 sm:p-6 pt-4"
      >
        <Tabs defaultValue="pending">
          <TabsList className="w-full sm:w-auto">
            {(
              [
                "pending",
                "approved",
                "rejected",
              ] as LeaveStatus[]
            ).map((status) => {
              const Icon = tabIcon[status];

              const count =
                leaveRequests.filter(
                  (request) =>
                    request.status === status,
                ).length;

              return (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="flex-1 gap-1.5 capitalize sm:flex-none"
                >
                  <Icon className="h-3.5 w-3.5" />

                  {status}

                  <span className="num text-muted-foreground">
                    ({count})
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(
            [
              "pending",
              "approved",
              "rejected",
            ] as LeaveStatus[]
          ).map((status) => (
            <TabsContent
              key={status}
              value={status}
              className="mt-2"
            >
              <RequestList status={status} />
            </TabsContent>
          ))}
        </Tabs>
      </SectionCard>
    </AppShell>
  );
}