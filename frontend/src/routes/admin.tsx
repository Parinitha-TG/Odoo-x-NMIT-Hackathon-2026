import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  UserX,
  Search,
  Eye,
  Wallet,
  SlidersHorizontal,
  SearchX,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import {
  PageHeader,
  SectionCard,
} from "@/components/common/PageHeader";
import {
  StatusBadge,
} from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireHR } from "@/lib/auth-guard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  adminStats,
  departments,
  orgEmployees,
  pendingApprovals,
} from "@/data/org";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => requireHR(),
  head: () => ({
    meta: [
      { title: "HR Overview · Dayflow HRMS" },
      {
        name: "description",
        content:
          "HR administration dashboard for employee, attendance, leave and payroll management.",
      },
      {
        property: "og:title",
        content: "HR Overview · Dayflow HRMS",
      },
      {
        property: "og:description",
        content:
          "Company-wide employee and HR management.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),

  component: AdminPage,
});

function AdminPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");

  const [addEmployeeOpen, setAddEmployeeOpen] =
    useState(false);

  const [employeeDetailsOpen, setEmployeeDetailsOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<(typeof orgEmployees)[number] | null>(null);

  const [approvalState, setApprovalState] =
    useState<
      Record<string, "approved" | "rejected">
    >({});

  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    address: "",
  });

  const rows = useMemo(
    () =>
      orgEmployees.filter((employee) => {
        const search = query.trim().toLowerCase();

        const matchesQuery =
          !search ||
          employee.name
            .toLowerCase()
            .includes(search) ||
          employee.email
            .toLowerCase()
            .includes(search) ||
          employee.id
            .toLowerCase()
            .includes(search);

        const matchesDepartment =
          dept === "all" ||
          employee.department === dept;

        const matchesStatus =
          status === "all" ||
          employee.status === status;

        return (
          matchesQuery &&
          matchesDepartment &&
          matchesStatus
        );
      }),
    [query, dept, status],
  );

  const resetEmployeeForm = () => {
    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joiningDate: "",
      address: "",
    });
  };

  const handleCreateEmployee = () => {
    if (
      !newEmployee.firstName.trim() ||
      !newEmployee.lastName.trim() ||
      !newEmployee.email.trim() ||
      !newEmployee.department.trim() ||
      !newEmployee.designation.trim()
    ) {
      toast.error(
        "Please complete all required fields.",
      );
      return;
    }

    toast.success("Employee details ready", {
      description:
        "The record is ready for backend creation.",
    });

    setAddEmployeeOpen(false);
    resetEmployeeForm();
  };

  const handleApprove = (
    id: string,
    name: string,
    days: number,
  ) => {
    setApprovalState((current) => ({
      ...current,
      [id]: "approved",
    }));

    toast.success("Leave approved", {
      description: `${name} · ${days} day${
        days > 1 ? "s" : ""
      }`,
    });
  };

  const handleReject = (
    id: string,
    name: string,
  ) => {
    setApprovalState((current) => ({
      ...current,
      [id]: "rejected",
    }));

    toast.success("Leave rejected", {
      description: name,
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="HR Overview"
        subtitle="Manage employees, attendance, leave and payroll information."
        actions={
          <Button
            onClick={() =>
              setAddEmployeeOpen(true)
            }
          >
            <UserPlus className="h-4 w-4" />
            Add employee
          </Button>
        }
      />

      {/* COMPANY SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total employees"
          value={adminStats.totalEmployees}
          icon={Users}
          tone="primary"
          footer={
            <span>
              {adminStats.headcountChange}
            </span>
          }
        />

        <StatCard
          label="Present today"
          value={adminStats.presentToday}
          icon={UserCheck}
          tone="success"
          hint={
            <StatusBadge tone="success">
              Active
            </StatusBadge>
          }
          footer={
            <span>
              Current attendance
            </span>
          }
        />

        <StatCard
          label="On leave"
          value={adminStats.onLeave}
          icon={CalendarDays}
          tone="info"
          footer={
            <span>
              {adminStats.pendingLeaves} pending
              requests
            </span>
          }
        />

        <StatCard
          label="Absent"
          value={adminStats.absent}
          icon={UserX}
          tone="destructive"
          footer={
            <span>
              Attendance status
            </span>
          }
        />
      </div>

      {/* ATTENDANCE + PAYROLL */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Attendance overview"
          description="Company-wide attendance information"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-success" />
                <p className="text-xs text-muted-foreground">
                  Present
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold num">
                {adminStats.presentToday}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Employees marked PRESENT
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-info" />
                <p className="text-xs text-muted-foreground">
                  Leave
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold num">
                {adminStats.onLeave}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Employees on approved leave
              </p>
            </div>

            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-2">
                <UserX className="h-4 w-4 text-destructive" />
                <p className="text-xs text-muted-foreground">
                  Absent
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold num">
                {adminStats.absent}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Employees marked ABSENT
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  Attendance records
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Attendance is maintained separately from
                  employee information.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info(
                    "Attendance management",
                    {
                      description:
                        "Attendance records will be connected to the attendances table.",
                    },
                  )
                }
              >
                View attendance
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Payroll"
          description="Company payroll information"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <Wallet className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-semibold">
                Employee payroll
              </p>

              <p className="text-xs text-muted-foreground">
                Salary records are linked to employees.
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <dt className="text-muted-foreground">
                Employees on payroll
              </dt>

              <dd className="font-semibold num">
                {adminStats.totalEmployees}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <dt className="text-muted-foreground">
                Frequency
              </dt>

              <dd className="font-semibold">
                Monthly
              </dd>
            </div>
          </dl>

          <Button
            variant="outline"
            className="mt-5 w-full"
            onClick={() =>
              toast.info("Payroll", {
                description:
                  "Payroll records will be connected to the payrolls table.",
              })
            }
          >
            Review payroll
          </Button>
        </SectionCard>
      </div>

      {/* LEAVE REQUESTS */}
      <SectionCard
        className="mt-6"
        title="Leave requests"
        description="Review pending employee leave requests"
      >
        {pendingApprovals.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-medium">
              No pending requests
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApprovals.map((request) => {
              const decision =
                approvalState[request.id];

              return (
                <div
                  key={request.id}
                  className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {request.initials}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {request.name}
                      </p>

                      {decision && (
                        <StatusBadge
                          tone={
                            decision === "approved"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {decision}
                        </StatusBadge>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground num">
                      {request.type} ·{" "}
                      {request.range} ·{" "}
                      {request.days} day
                      {request.days > 1
                        ? "s"
                        : ""}
                    </p>
                  </div>

                  {!decision && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleApprove(
                            request.id,
                            request.name,
                            request.days,
                          )
                        }
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleReject(
                            request.id,
                            request.name,
                          )
                        }
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* EMPLOYEE DIRECTORY */}
      <SectionCard
        className="mt-6"
        title="Employee directory"
        description={`${rows.length} of ${orgEmployees.length} employees`}
      >
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <label
              htmlFor="employee-search"
              className="sr-only"
            >
              Search employees
            </label>

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="employee-search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search by name, email or employee ID…"
              className="pl-9"
            />
          </div>

          <div className="flex gap-3">
            <Select
              value={dept}
              onValueChange={setDept}
            >
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Filter by department"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All departments
                </SelectItem>

                {departments.map(
                  (department) => (
                    <SelectItem
                      key={department}
                      value={department}
                    >
                      {department}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger
                className="w-full sm:w-36"
                aria-label="Filter by status"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All status
                </SelectItem>

                <SelectItem value="present">
                  Present
                </SelectItem>

                <SelectItem value="leave">
                  On leave
                </SelectItem>

                <SelectItem value="absent">
                  Absent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="h-5 w-5" />
            </span>

            <p className="text-sm font-medium">
              No employees match your filters
            </p>

            <p className="max-w-xs text-xs text-muted-foreground">
              Try a different search term or reset
              the filters.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setQuery("");
                setDept("all");
                setStatus("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="mt-5 w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Joining date</TableHead>
                  <TableHead>Account status</TableHead>
                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                          {employee.initials}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {employee.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground num">
                      {employee.id}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {employee.department}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {employee.jobTitle}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {employee.joinedOn ?? "—"}
                    </TableCell>

                    <TableCell>
                      <StatusBadge tone="success">
                        Active
                      </StatusBadge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setEmployeeDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* ADD EMPLOYEE DIALOG */}
      <Dialog
        open={addEmployeeOpen}
        onOpenChange={setAddEmployeeOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Add employee
            </DialogTitle>

            <DialogDescription>
              Create an employee profile using the Dayflow
              employee fields.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                First name *
              </label>

              <Input
                className="mt-1.5"
                value={newEmployee.firstName}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    firstName:
                      event.target.value,
                  })
                }
                placeholder="First name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Last name *
              </label>

              <Input
                className="mt-1.5"
                value={newEmployee.lastName}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    lastName:
                      event.target.value,
                  })
                }
                placeholder="Last name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Email *
              </label>

              <Input
                className="mt-1.5"
                type="email"
                value={newEmployee.email}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    email: event.target.value,
                  })
                }
                placeholder="employee@dayflow.io"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Phone
              </label>

              <Input
                className="mt-1.5"
                value={newEmployee.phone}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    phone: event.target.value,
                  })
                }
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Department *
              </label>

              <Input
                className="mt-1.5"
                value={newEmployee.department}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    department:
                      event.target.value,
                  })
                }
                placeholder="Department"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Designation *
              </label>

              <Input
                className="mt-1.5"
                value={newEmployee.designation}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    designation:
                      event.target.value,
                  })
                }
                placeholder="Designation"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Joining date
              </label>

              <Input
                className="mt-1.5"
                type="date"
                value={newEmployee.joiningDate}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    joiningDate:
                      event.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Address
              </label>

              <Input
                className="mt-1.5"
                value={newEmployee.address}
                onChange={(event) =>
                  setNewEmployee({
                    ...newEmployee,
                    address:
                      event.target.value,
                  })
                }
                placeholder="Address"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              HR-created accounts will always have the
              <strong> EMPLOYEE </strong>
              role.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setAddEmployeeOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateEmployee}
            >
              Create employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EMPLOYEE DETAILS DIALOG */}
      <Dialog
        open={employeeDetailsOpen}
        onOpenChange={setEmployeeDetailsOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee?.name ??
                "Employee details"}
            </DialogTitle>

            <DialogDescription>
              Employee information and current HR record.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {selectedEmployee.initials}
                </span>

                <div>
                  <p className="font-semibold">
                    {selectedEmployee.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.jobTitle}
                  </p>

                  <div className="mt-2">
                    <StatusBadge tone="success">
                      Active
                    </StatusBadge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Employee ID
                  </p>

                  <p className="mt-1 text-sm font-semibold num">
                    {selectedEmployee.id}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold">
                    {selectedEmployee.email}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Department
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedEmployee.department}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Designation
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedEmployee.jobTitle}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Joining date
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedEmployee.joinedOn ??
                      "Not provided"}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    EMPLOYEE
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold">
                  Backend integration
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  This frontend currently displays demo
                  employee data. The backend can later load
                  this information from the users and
                  employees tables.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setEmployeeDetailsOpen(false)
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}