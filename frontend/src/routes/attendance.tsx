import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge, statusTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  monthCalendar,
  monthlySummary,
  todaySummary,
  weeklyAttendance,
} from "@/data/employee";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance · Dayflow HRMS" },
      {
        name: "description",
        content:
          "Check in, check out and review your daily, weekly and monthly attendance in Dayflow.",
      },
      { property: "og:title", content: "Attendance · Dayflow HRMS" },
      {
        property: "og:description",
        content:
          "Daily check-in, check-out and attendance summary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: AttendancePage,
});

const fmt = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const dayClasses: Record<string, string> = {
  present: "bg-success-soft text-success border-success/20",
  leave: "bg-info-soft text-info border-info/20",
  absent: "bg-destructive-soft text-destructive border-destructive/20",
  holiday: "bg-primary-soft text-primary border-primary/20",
  weekoff: "bg-muted text-muted-foreground border-border",
};

function AttendancePage() {
  const [working, setWorking] = useState(true);

  const progress = Math.min(
    100,
    Math.round(
      (todaySummary.workedMinutes /
        todaySummary.targetMinutes) *
        100,
    ),
  );

  const handleCheckIn = () => {
    setWorking(true);

    toast.success("Checked in", {
      description: "Your attendance has been marked as present.",
    });
  };

  const handleCheckOut = () => {
    setWorking(false);

    toast.success("Checked out", {
      description: `Worked ${fmt(
        todaySummary.workedMinutes,
      )} today.`,
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Attendance"
        subtitle="Track your daily attendance and monthly performance."
        actions={
          <>
            <Button
              variant="outline"
              disabled={working}
              onClick={handleCheckIn}
            >
              <LogIn className="h-4 w-4" />
              Check In
            </Button>

            <Button
              disabled={!working}
              onClick={handleCheckOut}
            >
              <LogOut className="h-4 w-4" />
              Check Out
            </Button>
          </>
        }
      />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current status"
          value={working ? "Present" : "Checked out"}
          icon={CalendarCheck}
          tone={working ? "success" : "primary"}
          hint={
            <StatusBadge
              tone={working ? "success" : "neutral"}
            >
              {working ? "Working" : "Done"}
            </StatusBadge>
          }
          footer={
            <span>
              Check-in {todaySummary.checkIn}
            </span>
          }
        />

        <StatCard
          label="Working duration"
          value={fmt(todaySummary.workedMinutes)}
          icon={Clock}
          tone="primary"
          footer={
            <div className="space-y-1.5">
              <Progress
                value={progress}
                className="h-1.5"
              />

              <span>
                {progress}% of 8h target
              </span>
            </div>
          }
        />

        <StatCard
          label="Attendance status"
          value="Present"
          icon={CalendarCheck}
          tone="success"
          footer={
            <span>
              Attendance recorded for today
            </span>
          }
        />

        <StatCard
          label="On-time rate"
          value={`${monthlySummary.onTimeRate}%`}
          icon={TrendingUp}
          tone="info"
          footer={
            <span>
              Avg check-in {monthlySummary.avgCheckIn}
            </span>
          }
        />
      </div>

      {/* WEEKLY ATTENDANCE */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Weekly attendance"
          description="17 – 23 Aug 2026"
        >
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check in</TableHead>
                  <TableHead>Check out</TableHead>
                  <TableHead className="text-right">
                    Hours
                  </TableHead>
                  <TableHead className="text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {weeklyAttendance.map((day) => (
                  <TableRow
                    key={day.day}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {day.day}
                    </TableCell>

                    <TableCell className="text-muted-foreground num">
                      {day.date}
                    </TableCell>

                    <TableCell className="num">
                      {day.checkIn ?? "—"}
                    </TableCell>

                    <TableCell className="num">
                      {day.checkOut ?? "—"}
                    </TableCell>

                    <TableCell className="text-right num">
                      {day.hours
                        ? `${day.hours}h`
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <StatusBadge
                        tone={
                          statusTone[day.status] ??
                          "neutral"
                        }
                      >
                        <span className="capitalize">
                          {day.status === "weekoff"
                            ? "Week off"
                            : day.status}
                        </span>
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        {/* MONTHLY SUMMARY */}
        <SectionCard
          title="Monthly summary"
          description={monthlySummary.month}
        >
          <dl className="space-y-3.5">
            {[
              [
                "Working days",
                monthlySummary.workingDays,
              ],
              ["Present", monthlySummary.present],
              ["Leaves", monthlySummary.leaves],
              ["Absent", monthlySummary.absent],
              [
                "Average hours / day",
                monthlySummary.avgHours,
              ],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <dt className="text-muted-foreground">
                  {label}
                </dt>

                <dd className="font-semibold num">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Attendance rate</span>

              <span className="font-semibold num">
                {Math.round(
                  (monthlySummary.present /
                    monthlySummary.workingDays) *
                    100,
                )}
                %
              </span>
            </div>

            <Progress
              value={
                (monthlySummary.present /
                  monthlySummary.workingDays) *
                100
              }
              className="mt-2 h-1.5"
            />
          </div>
        </SectionCard>
      </div>

      {/* CALENDAR */}
      <SectionCard
        className="mt-6"
        title="Calendar view"
        description={monthlySummary.month}
      >
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {day.slice(0, 1)}
              <span className="hidden sm:inline">
                {day.slice(1)}
              </span>
            </div>
          ))}

          {monthCalendar.map((cell, index) =>
            cell === null ? (
              <div
                key={`pad-${index}`}
                aria-hidden
              />
            ) : (
              <div
                key={cell.day}
                className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition-transform duration-150 hover:scale-[1.03] ${
                  dayClasses[cell.status]
                }`}
                title={`${cell.day} Aug — ${cell.status}`}
              >
                <span className="font-semibold num">
                  {cell.day}
                </span>
              </div>
            ),
          )}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {[
            "present",
            "leave",
            "absent",
            "holiday",
            "weekoff",
          ].map((status) => (
            <li
              key={status}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span
                className={`h-3 w-3 rounded-[4px] border ${
                  dayClasses[status]
                }`}
                aria-hidden
              />

              <span className="capitalize">
                {status === "weekoff"
                  ? "Week off"
                  : status}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </AppShell>
  );
}