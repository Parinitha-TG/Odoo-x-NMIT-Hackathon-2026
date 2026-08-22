import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  Clock,
  CalendarDays,
  Wallet,
  ArrowRight,
  LogOut,
  PartyPopper,
  CircleDot,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WeeklyAttendanceChart } from "@/components/dashboard/WeeklyAttendanceChart";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import {
  currentUser,
  holidays,
  leaveRequests,
  payrollSummary,
  todaySummary,
} from "@/data/employee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Dayflow HRMS" },
      {
        name: "description",
        content:
          "Dayflow employee dashboard for attendance, leave and payroll.",
      },
      { property: "og:title", content: "Dashboard · Dayflow HRMS" },
      {
        property: "og:description",
        content:
          "Employee workspace for attendance, leave and payroll.",
      },
      { property: "og:type", content: "website" },
    ],
  }),

  component: DashboardPage,
});

function fmt(mins: number) {
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
}

function DashboardPage() {
  const [checkedOut, setCheckedOut] = useState(false);

  const progress = Math.min(
    100,
    Math.round(
      (todaySummary.workedMinutes / todaySummary.targetMinutes) * 100
    )
  );

  const pending = leaveRequests.filter(
    (request) => request.status === "pending"
  );

  return (
    <AppShell>
      {/* HEADER */}
      <PageHeader
        title={
          <>
            Good morning, {currentUser.name.split(" ")[0]} 👋
          </>
        }
        subtitle="Here's your work overview for today."
        actions={
          checkedOut ? (
            <StatusBadge tone="neutral">
              Checked out
            </StatusBadge>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                setCheckedOut(true);

                toast.success("Checked out successfully", {
                  description: `Total worked today: ${fmt(
                    todaySummary.workedMinutes
                  )}`,
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              Check Out
            </Button>
          )
        }
      />

      {/* TOP STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance"
          value="Present"
          icon={CalendarCheck}
          tone="success"
          hint={
            <StatusBadge tone="success">
              On time
            </StatusBadge>
          }
          footer={
            <span>
              Check-in at {todaySummary.checkIn}
            </span>
          }
        />

        <StatCard
          label="Working hours"
          value={fmt(todaySummary.workedMinutes)}
          icon={Clock}
          tone="primary"
          hint={
            <span className="text-xs font-semibold text-muted-foreground num">
              {progress}%
            </span>
          }
          footer={
            <div className="space-y-1.5">
              <Progress value={progress} className="h-1.5" />

              <span>
                Target 8h ·{" "}
                {fmt(
                  Math.max(
                    0,
                    todaySummary.targetMinutes -
                      todaySummary.workedMinutes
                  )
                )}{" "}
                left
              </span>
            </div>
          }
        />

        <StatCard
          label="Leave available"
          value="26 days"
          icon={CalendarDays}
          tone="info"
          footer={
            <span>
              Paid · Sick · Unpaid leave
            </span>
          }
        />

        <StatCard
          label="Next payroll"
          value="5 days"
          icon={Wallet}
          tone="warning"
          footer={
            <span>
              Credited on {payrollSummary.nextPayrollDate}
            </span>
          }
        />
      </div>

      {/* ATTENDANCE + TODAY */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Weekly attendance"
          description="17 – 23 Aug 2026"
          action={
            <Button variant="outline" size="sm" asChild>
              <Link to="/attendance">
                View details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <WeeklyAttendanceChart />
        </SectionCard>

        <SectionCard
          title="Today's attendance"
          description="Current attendance status"
        >
          <div className="space-y-5">
            {/* CHECK IN */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary">
                  <CircleDot className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-medium">
                    Check-in
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Today's attendance
                  </p>
                </div>
              </div>

              <span className="text-sm font-medium num">
                {todaySummary.checkIn}
              </span>
            </div>

            {/* STATUS */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-success" />

                  <p className="text-sm font-medium">
                    {checkedOut
                      ? "Shift completed"
                      : "Currently working"}
                  </p>
                </div>

                <StatusBadge
                  tone={checkedOut ? "neutral" : "success"}
                >
                  {checkedOut ? "Completed" : "Working"}
                </StatusBadge>
              </div>

              {!checkedOut && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Your attendance is currently marked as
                  present.
                </p>
              )}
            </div>

            {/* WORKED TIME */}
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">
                Worked today
              </span>

              <span className="text-sm font-semibold num">
                {fmt(todaySummary.workedMinutes)}
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* LOWER SECTIONS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* HOLIDAYS */}
        <SectionCard
          title="Upcoming holidays"
          description="Company calendar"
        >
          <ul className="space-y-3">
            {holidays.map((holiday) => (
              <li
                key={holiday.name}
                className="flex items-center gap-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <PartyPopper className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {holiday.name}
                  </p>

                  <p className="text-xs text-muted-foreground num">
                    {holiday.date} · {holiday.day}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* LEAVE REQUEST */}
        <SectionCard
          title="Pending leave request"
          description="Awaiting manager approval"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/leave">Open</Link>
            </Button>
          }
        >
          {pending.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No pending leave requests.
            </p>
          ) : (
            pending.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold">
                    {request.type}
                  </p>

                  <StatusBadge tone="warning">
                    Pending
                  </StatusBadge>
                </div>

                <p className="mt-2 text-xs text-muted-foreground num">
                  {request.from} → {request.to} ·{" "}
                  {request.days} days
                </p>

                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {request.reason}
                </p>

                <p className="mt-3 text-[11px] text-muted-foreground">
                  Approver: {request.approver}
                </p>
              </div>
            ))
          )}
        </SectionCard>

        {/* PAYROLL */}
        <SectionCard
          title="Next payroll"
          description="Estimated credit"
        >
          <p className="text-[26px] font-bold tracking-tight num">
            ₹{" "}
            {payrollSummary.netMonthly.toLocaleString(
              "en-IN"
            )}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Net pay · sample data for demo purposes
          </p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                Pay date
              </dt>

              <dd className="font-medium num">
                {payrollSummary.nextPayrollDate}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                Account
              </dt>

              <dd className="font-medium num">
                {payrollSummary.account}
              </dd>
            </div>
          </dl>

          <Button
            variant="outline"
            className="mt-5 w-full"
            asChild
          >
            <Link to="/payroll">
              View payroll
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </SectionCard>
      </div>
    </AppShell>
  );
}