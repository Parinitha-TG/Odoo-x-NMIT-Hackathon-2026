export type LeaveStatus = "pending" | "approved" | "rejected";
export type DayStatus = "present" | "absent" | "leave" | "weekoff" | "holiday";

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  name: string;
  initials: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  joinedOn: string;
  manager: string;
  location: string;
  employmentType: string;
  status: "active" | "on-leave" | "absent";
}

export const currentUser: EmployeeProfile = {
  id: "u-001",
  employeeId: "DF-2041",
  name: "Nirjala Chauhan",
  initials: "NC",
  jobTitle: "Product Designer",
  department: "Design",
  email: "nirjala.chauhan@dayflow.io",
  phone: "+91 98204 41123",
  joinedOn: "12 Mar 2023",
  manager: "Aarav Mehta",
  location: "Bengaluru — Prestige Tech Park (Hybrid)",
  employmentType: "Full-time",
  status: "active",
};

export const todaySummary = {
  status: "Present" as const,
  checkIn: "09:12 AM",
  checkOut: null as string | null,
  workedMinutes: 462, // 7h 42m
  targetMinutes: 480,
  breakMinutes: 40,
  overtimeMinutes: 0,
};

export const timeline = [
  { id: 1, label: "Check-in", time: "09:12 AM", type: "in" as const },
  { id: 2, label: "Break started", time: "01:05 PM", type: "break" as const },
  { id: 3, label: "Break ended", time: "01:45 PM", type: "break" as const },
  { id: 4, label: "Current status — Working", time: "Now", type: "active" as const },
];

export const weeklyAttendance: {
  day: string;
  date: string;
  status: DayStatus;
  checkIn: string | null;
  checkOut: string | null;
  hours: number;
}[] = [
  { day: "Mon", date: "17 Aug", status: "present", checkIn: "09:04 AM", checkOut: "06:22 PM", hours: 8.5 },
  { day: "Tue", date: "18 Aug", status: "present", checkIn: "09:21 AM", checkOut: "06:10 PM", hours: 8.1 },
  { day: "Wed", date: "19 Aug", status: "leave", checkIn: null, checkOut: null, hours: 0 },
  { day: "Thu", date: "20 Aug", status: "present", checkIn: "08:58 AM", checkOut: "06:31 PM", hours: 8.8 },
  { day: "Fri", date: "21 Aug", status: "present", checkIn: "09:12 AM", checkOut: "05:40 PM", hours: 7.7 },
  { day: "Sat", date: "22 Aug", status: "weekoff", checkIn: null, checkOut: null, hours: 0 },
  { day: "Sun", date: "23 Aug", status: "weekoff", checkIn: null, checkOut: null, hours: 0 },
];

export const monthlySummary = {
  month: "August 2026",
  workingDays: 22,
  present: 18,
  leaves: 2,
  absent: 1,
  remaining: 1,
  avgCheckIn: "09:08 AM",
  avgHours: "8h 12m",
  onTimeRate: 94,
};

// Calendar grid for August 2026 (starts Saturday). null = padding cell.
export const monthCalendar: ({ day: number; status: DayStatus } | null)[] = [
  ...Array.from({ length: 5 }, () => null),
  ...Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const dow = (day + 5) % 7; // 0 = Mon
    let status: DayStatus = "present";
    if (dow === 5 || dow === 6) status = "weekoff";
    if (day === 15) status = "holiday";
    if ([6, 19].includes(day)) status = "leave";
    if (day === 11) status = "absent";
    if (day > 22) status = "weekoff";
    return { day, status };
  }),
];

export const leaveBalances = [
  { type: "Casual Leave", used: 4, total: 12, tone: "primary" as const },
  { type: "Sick Leave", used: 2, total: 8, tone: "warning" as const },
  { type: "Earned Leave", used: 3, total: 15, tone: "success" as const },
];

export interface LeaveRequest {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approver: string;
}

export const leaveRequests: LeaveRequest[] = [
  {
    id: "LV-3319",
    type: "Casual Leave",
    from: "02 Sep 2026",
    to: "03 Sep 2026",
    days: 2,
    reason: "Family function out of town.",
    status: "pending",
    appliedOn: "19 Aug 2026",
    approver: "Aarav Mehta",
  },
  {
    id: "LV-3284",
    type: "Sick Leave",
    from: "19 Aug 2026",
    to: "19 Aug 2026",
    days: 1,
    reason: "Viral fever, advised rest by doctor.",
    status: "approved",
    appliedOn: "18 Aug 2026",
    approver: "Aarav Mehta",
  },
  {
    id: "LV-3122",
    type: "Earned Leave",
    from: "28 Jul 2026",
    to: "01 Aug 2026",
    days: 5,
    reason: "Annual vacation with family.",
    status: "approved",
    appliedOn: "10 Jul 2026",
    approver: "Aarav Mehta",
  },
  {
    id: "LV-2987",
    type: "Casual Leave",
    from: "04 Jun 2026",
    to: "05 Jun 2026",
    days: 2,
    reason: "Personal errands.",
    status: "rejected",
    appliedOn: "03 Jun 2026",
    approver: "Aarav Mehta",
  },
];

export const holidays = [
  { name: "Independence Day", date: "15 Aug 2026", day: "Saturday" },
  { name: "Ganesh Chaturthi", date: "14 Sep 2026", day: "Monday" },
  { name: "Gandhi Jayanti", date: "02 Oct 2026", day: "Friday" },
];

export const payrollSummary = {
  nextPayrollDate: "27 Aug 2026",
  daysAway: 5,
  ctc: "₹ 18,60,000",
  netMonthly: 128450,
  grossMonthly: 155000,
  currency: "₹",
  account: "HDFC •••• 4412",
};

export const latestPayslip = {
  period: "July 2026",
  paidOn: "27 Jul 2026",
  earnings: [
    { label: "Basic salary", amount: 77500 },
    { label: "House rent allowance", amount: 31000 },
    { label: "Special allowance", amount: 34000 },
    { label: "Performance bonus", amount: 12500 },
  ],
  deductions: [
    { label: "Provident fund", amount: 9300 },
    { label: "Professional tax", amount: 200 },
    { label: "Income tax (TDS)", amount: 16850 },
    { label: "Health insurance", amount: 1200 },
  ],
};

export const payrollHistory = [
  { id: "PS-0726", period: "July 2026", paidOn: "27 Jul 2026", gross: 155000, deductions: 27550, net: 127450, status: "Paid" },
  { id: "PS-0626", period: "June 2026", paidOn: "27 Jun 2026", gross: 152000, deductions: 27100, net: 124900, status: "Paid" },
  { id: "PS-0526", period: "May 2026", paidOn: "28 May 2026", gross: 152000, deductions: 27100, net: 124900, status: "Paid" },
  { id: "PS-0426", period: "April 2026", paidOn: "27 Apr 2026", gross: 152000, deductions: 26400, net: 125600, status: "Paid" },
  { id: "PS-0326", period: "March 2026", paidOn: "27 Mar 2026", gross: 148000, deductions: 25900, net: 122100, status: "Paid" },
];

export const notifications = [
  { id: 1, title: "Leave request submitted", body: "LV-3319 is awaiting approval from Aarav Mehta.", time: "2h ago", unread: true },
  { id: 2, title: "Payslip available", body: "Your July 2026 payslip is ready to download.", time: "1d ago", unread: true },
  { id: 3, title: "Policy update", body: "Hybrid work policy revised — 3 days in office.", time: "3d ago", unread: false },
];
