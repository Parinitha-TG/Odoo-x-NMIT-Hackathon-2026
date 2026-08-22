import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Banknote,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Separator } from "@/components/ui/separator";

import { payrollSummary } from "@/data/employee";
import { requireAuth } from "@/lib/auth-guard";

export const Route = createFileRoute("/payroll")({
  beforeLoad: () => requireAuth(),
  head: () => ({
    meta: [
      { title: "Payroll · Dayflow HRMS" },
      {
        name: "description",
        content:
          "View your salary, allowances, deductions and net salary in Dayflow.",
      },
      {
        property: "og:title",
        content: "Payroll · Dayflow HRMS",
      },
      {
        property: "og:description",
        content:
          "Employee payroll and salary information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),

  component: PayrollPage,
});

const inr = (amount: number) =>
  `₹ ${amount.toLocaleString("en-IN")}`;

function PayrollPage() {
  /*
   * Frontend demo values.
   *
   * These will later be replaced by:
   * payrolls.base_salary
   * payrolls.allowances
   * payrolls.deductions
   * payrolls.net_salary
   * payrolls.bank_account_details
   * payrolls.payment_frequency
   */

  const baseSalary = payrollSummary.grossMonthly;
  const allowances = Math.round(baseSalary * 0.1);
  const deductions = Math.round(
    payrollSummary.grossMonthly * 0.08,
  );
  const netSalary =
    baseSalary + allowances - deductions;

  return (
    <AppShell>
      <PageHeader
        title="Payroll"
        subtitle="View your salary, allowances, deductions and payment details."
        actions={
          <StatusBadge tone="success">
            Monthly payroll
          </StatusBadge>
        }
      />

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Base salary"
          value={inr(baseSalary)}
          icon={Wallet}
          tone="primary"
          footer={
            <span>
              Monthly base salary
            </span>
          }
        />

        <StatCard
          label="Allowances"
          value={inr(allowances)}
          icon={TrendingUp}
          tone="success"
          footer={
            <span>
              Additional monthly earnings
            </span>
          }
        />

        <StatCard
          label="Deductions"
          value={inr(deductions)}
          icon={TrendingDown}
          tone="destructive"
          footer={
            <span>
              Total monthly deductions
            </span>
          }
        />

        <StatCard
          label="Net salary"
          value={inr(netSalary)}
          icon={Banknote}
          tone="warning"
          footer={
            <span>
              Amount after deductions
            </span>
          }
        />
      </div>

      {/* PAYROLL DETAILS */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Salary breakdown"
          description="Current monthly payroll"
        >
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Base salary
              </dt>

              <dd className="text-sm font-semibold num">
                {inr(baseSalary)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Allowances
              </dt>

              <dd className="text-sm font-semibold text-success num">
                + {inr(allowances)}
              </dd>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm font-medium text-foreground">
                Gross earnings
              </dt>

              <dd className="text-sm font-bold num">
                {inr(baseSalary + allowances)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Deductions
              </dt>

              <dd className="text-sm font-semibold text-destructive num">
                − {inr(deductions)}
              </dd>
            </div>

            <Separator />

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    Net salary
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Final amount after deductions
                  </p>
                </div>

                <p className="text-xl font-bold tracking-tight num sm:text-2xl">
                  {inr(netSalary)}
                </p>
              </div>
            </div>
          </dl>
        </SectionCard>

        {/* PAYMENT DETAILS */}
        <SectionCard
          title="Payment details"
          description="Payroll payment information"
        >
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Payment frequency
              </dt>

              <dd className="text-sm font-semibold">
                Monthly
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Next payroll
              </dt>

              <dd className="text-sm font-semibold num">
                {payrollSummary.nextPayrollDate}
              </dd>
            </div>

            <Separator />

            <div>
              <dt className="text-sm text-muted-foreground">
                Bank account
              </dt>

              <dd className="mt-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-medium num">
                {payrollSummary.account}
              </dd>
            </div>

            <div className="rounded-lg border border-border bg-primary-soft/50 p-4">
              <div className="flex items-start gap-3">
                <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Payroll schedule
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your salary is processed according to
                    the company's monthly payroll schedule.
                  </p>
                </div>
              </div>
            </div>
          </dl>
        </SectionCard>
      </div>

      {/* INFORMATION */}
      <SectionCard
        className="mt-6"
        title="Payroll information"
        description="About your current payroll record"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">
              Base salary
            </p>

            <p className="mt-2 text-lg font-semibold num">
              {inr(baseSalary)}
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">
              Allowances
            </p>

            <p className="mt-2 text-lg font-semibold num">
              {inr(allowances)}
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">
              Net salary
            </p>

            <p className="mt-2 text-lg font-semibold num">
              {inr(netSalary)}
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Salary figures shown here are demo values until the
          payroll database is connected.
        </p>
      </SectionCard>
    </AppShell>
  );
}