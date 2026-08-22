import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Building2,
  BadgeCheck,
  UserRound,
  Briefcase,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import {
  PageHeader,
  SectionCard,
} from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

import { currentUser } from "@/data/employee";
import { requireAuth } from "@/lib/auth-guard";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => requireAuth(),
  head: () => ({
    meta: [
      { title: "My Profile · Dayflow HRMS" },
      {
        name: "description",
        content:
          "View your personal and employment information in Dayflow.",
      },
      {
        property: "og:title",
        content: "My Profile · Dayflow HRMS",
      },
      {
        property: "og:description",
        content:
          "Personal and employment information.",
      },
      { property: "og:type", content: "profile" },
    ],
  }),

  component: ProfilePage,
});

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>

        <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
          {value || "Not provided"}
        </dd>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <AppShell>
      <PageHeader
        title="My Profile"
        subtitle="Your personal and employment information at Dayflow."
        actions={
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            Edit profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PROFILE SUMMARY */}
        <div className="surface p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-2xl font-bold text-primary">
              {currentUser.initials}
            </span>

            <h2 className="mt-4 text-lg font-bold tracking-tight">
              {currentUser.name}
            </h2>

            <p className="text-sm text-muted-foreground">
              {currentUser.jobTitle}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <StatusBadge tone="success">
                Active
              </StatusBadge>

              <StatusBadge tone="primary" dot={false}>
                Employee
              </StatusBadge>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-success" />

              <div>
                <p className="text-sm font-semibold">
                  Employee account
                </p>

                <p className="text-xs text-muted-foreground">
                  Active Dayflow employee profile
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Field
              icon={Mail}
              label="Email"
              value={currentUser.email}
            />

            <Field
              icon={Phone}
              label="Phone"
              value={currentUser.phone}
            />

            <Field
              icon={BadgeCheck}
              label="Employee ID"
              value={currentUser.employeeId}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Employment details"
            description="Information maintained by HR"
          >
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                icon={BadgeCheck}
                label="Employee ID"
                value={currentUser.employeeId}
              />

              <Field
                icon={Briefcase}
                label="Designation"
                value={currentUser.jobTitle}
              />

              <Field
                icon={Building2}
                label="Department"
                value={currentUser.department}
              />

              <Field
                icon={CalendarDays}
                label="Joining date"
                value={currentUser.joinedOn}
              />

              <Field
                icon={ShieldCheck}
                label="Account status"
                value="Active"
              />

              <Field
                icon={UserRound}
                label="Role"
                value="EMPLOYEE"
              />
            </dl>
          </SectionCard>

          <SectionCard
            title="Personal information"
            description="Information associated with your employee record"
          >
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                icon={UserRound}
                label="Full name"
                value={currentUser.name}
              />

              <Field
                icon={Mail}
                label="Email"
                value={currentUser.email}
              />

              <Field
                icon={Phone}
                label="Phone"
                value={currentUser.phone}
              />

              <Field
                icon={MapPin}
                label="Address"
                value="Address not provided"
              />
            </dl>
          </SectionCard>

          <SectionCard
            title="Employee information"
            description="Fields available in the Dayflow employee record"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Department
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {currentUser.department}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Designation
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {currentUser.jobTitle}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Joining date
                </p>

                <p className="mt-1 text-sm font-semibold num">
                  {currentUser.joinedOn}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 text-sm font-semibold text-success">
                  Active
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}