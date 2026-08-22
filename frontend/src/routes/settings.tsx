import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  Lock,
  Palette,
  UserCog,
  Loader2,
  Check,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import {
  PageHeader,
  SectionCard,
} from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { currentUser } from "@/data/employee";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Dayflow HRMS" },
      {
        name: "description",
        content:
          "Manage your Dayflow account and workspace preferences.",
      },
      {
        property: "og:title",
        content: "Settings · Dayflow HRMS",
      },
      {
        property: "og:description",
        content:
          "Account and workspace preferences.",
      },
      { property: "og:type", content: "website" },
    ],
  }),

  component: SettingsPage,
});

const notificationPrefs = [
  {
    id: "leave",
    label: "Leave updates",
    desc: "Receive updates when your leave request status changes.",
    on: true,
  },
  {
    id: "payroll",
    label: "Payroll updates",
    desc: "Receive notifications about payroll processing.",
    on: true,
  },
  {
    id: "attendance",
    label: "Attendance reminders",
    desc: "Receive reminders related to your attendance.",
    on: false,
  },
];

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
}

function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      toast.success("Preferences saved", {
        description:
          "Changes are currently shown locally and will be persisted when the backend is connected.",
      });

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }, 600);
  };

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and Dayflow workspace preferences."
        actions={
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : null}

            {saving
              ? "Saving…"
              : saved
                ? "Saved"
                : "Save changes"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ACCOUNT */}
        <SectionCard
          title="Account"
          description="Basic account information"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="set-name">
                Full name
              </Label>

              <Input
                id="set-name"
                defaultValue={currentUser.name}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="set-email">
                Work email
              </Label>

              <Input
                id="set-email"
                type="email"
                defaultValue={currentUser.email}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="set-phone">
                Phone
              </Label>

              <Input
                id="set-phone"
                defaultValue={currentUser.phone}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="set-role">
                Account role
              </Label>

              <Input
                id="set-role"
                value="EMPLOYEE"
                readOnly
                className="mt-1.5"
              />
            </div>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserCog className="h-3.5 w-3.5" />

              Employment information is managed by HR.
            </p>
          </div>
        </SectionCard>

        {/* NOTIFICATIONS */}
        <SectionCard
          title="Notification preferences"
          description="Choose which Dayflow updates you want to receive"
          bodyClassName="px-5 sm:px-6"
        >
          <div className="divide-y divide-border">
            {notificationPrefs.map((preference) => (
              <Row
                key={preference.id}
                title={preference.label}
                description={preference.desc}
              >
                <Switch
                  defaultChecked={preference.on}
                  aria-label={preference.label}
                />
              </Row>
            ))}
          </div>

          <Separator />

          <div className="py-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Bell className="h-3.5 w-3.5" />

              Notification preferences will be persisted
              when the backend is connected.
            </p>
          </div>
        </SectionCard>

        {/* APPEARANCE */}
        <SectionCard
          title="Appearance"
          description="Customize how Dayflow looks"
          bodyClassName="px-5 sm:px-6"
        >
          <div className="divide-y divide-border">
            <Row
              title="Theme"
              description="Choose the appearance of your workspace."
            >
              <Select defaultValue="light">
                <SelectTrigger
                  className="w-36"
                  aria-label="Theme"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="light">
                    Light
                  </SelectItem>

                  <SelectItem value="system">
                    System
                  </SelectItem>
                </SelectContent>
              </Select>
            </Row>

            <Row
              title="Compact tables"
              description="Reduce row height in data tables."
            >
              <Switch aria-label="Compact tables" />
            </Row>

            <Row
              title="Show weekends"
              description="Include Saturday and Sunday in attendance views."
            >
              <Switch
                defaultChecked
                aria-label="Show weekends"
              />
            </Row>

            <Row
              title="Reduced motion"
              description="Reduce transitions and animations."
            >
              <Switch aria-label="Reduced motion" />
            </Row>
          </div>

          <p className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />

            Appearance preferences are currently local.
          </p>
        </SectionCard>

        {/* SECURITY */}
        <SectionCard
          title="Security"
          description="Account security information"
          bodyClassName="px-5 sm:px-6"
        >
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                <div>
                  <p className="text-sm font-semibold">
                    Account protected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your Dayflow account uses role-based
                    access. Employees can access their own
                    records while HR administrators can
                    manage company records.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="pw-current">
                Current password
              </Label>

              <Input
                id="pw-current"
                type="password"
                placeholder="Enter current password"
                className="mt-1.5"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="pw-new">
                  New password
                </Label>

                <Input
                  id="pw-new"
                  type="password"
                  placeholder="New password"
                  className="mt-1.5"
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="pw-confirm">
                  Confirm password
                </Label>

                <Input
                  id="pw-confirm"
                  type="password"
                  placeholder="Confirm password"
                  className="mt-1.5"
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />

              <p className="text-xs text-muted-foreground">
                Password management will be connected to
                the authentication backend.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled
            >
              Update password
            </Button>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}