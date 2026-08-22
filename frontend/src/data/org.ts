export interface OrgEmployee {
  id: string;
  name: string;
  initials: string;
  email: string;
  department: string;
  jobTitle: string;
  location: string;
  status: "present" | "leave" | "absent";
  checkIn: string | null;
}

export const departments = ["Engineering", "Design", "Sales", "People Ops", "Finance", "Support"];

export const orgEmployees: OrgEmployee[] = [
  { id: "DF-2041", name: "Nirjala Chauhan", initials: "NC", email: "nirjala.chauhan@dayflow.io", department: "Design", jobTitle: "Product Designer", location: "Bengaluru", status: "present", checkIn: "09:12 AM" },
  { id: "DF-1902", name: "Aarav Mehta", initials: "AM", email: "aarav.mehta@dayflow.io", department: "Design", jobTitle: "Design Manager", location: "Bengaluru", status: "present", checkIn: "08:47 AM" },
  { id: "DF-1750", name: "Ishita Rao", initials: "IR", email: "ishita.rao@dayflow.io", department: "Engineering", jobTitle: "Staff Engineer", location: "Pune", status: "present", checkIn: "09:31 AM" },
  { id: "DF-1811", name: "Kabir Sethi", initials: "KS", email: "kabir.sethi@dayflow.io", department: "Engineering", jobTitle: "Backend Engineer", location: "Remote", status: "leave", checkIn: null },
  { id: "DF-1633", name: "Meera Iyer", initials: "MI", email: "meera.iyer@dayflow.io", department: "People Ops", jobTitle: "HR Business Partner", location: "Bengaluru", status: "present", checkIn: "09:02 AM" },
  { id: "DF-2210", name: "Rohan Gupta", initials: "RG", email: "rohan.gupta@dayflow.io", department: "Sales", jobTitle: "Account Executive", location: "Mumbai", status: "absent", checkIn: null },
  { id: "DF-1988", name: "Sana Fernandes", initials: "SF", email: "sana.fernandes@dayflow.io", department: "Finance", jobTitle: "Financial Analyst", location: "Mumbai", status: "present", checkIn: "09:24 AM" },
  { id: "DF-2109", name: "Dev Malhotra", initials: "DM", email: "dev.malhotra@dayflow.io", department: "Support", jobTitle: "Support Specialist", location: "Remote", status: "present", checkIn: "08:55 AM" },
  { id: "DF-2255", name: "Tara Nair", initials: "TN", email: "tara.nair@dayflow.io", department: "Engineering", jobTitle: "Frontend Engineer", location: "Bengaluru", status: "leave", checkIn: null },
  { id: "DF-1442", name: "Vikram Joshi", initials: "VJ", email: "vikram.joshi@dayflow.io", department: "Sales", jobTitle: "Sales Director", location: "Delhi", status: "present", checkIn: "09:08 AM" },
  { id: "DF-2301", name: "Ananya Bose", initials: "AB", email: "ananya.bose@dayflow.io", department: "People Ops", jobTitle: "Recruiter", location: "Remote", status: "present", checkIn: "09:41 AM" },
  { id: "DF-2077", name: "Farhan Qureshi", initials: "FQ", email: "farhan.qureshi@dayflow.io", department: "Finance", jobTitle: "Payroll Lead", location: "Pune", status: "absent", checkIn: null },
];

export const adminStats = {
  totalEmployees: 248,
  presentToday: 201,
  onLeave: 27,
  absent: 20,
  pendingLeaves: 9,
  payrollTotal: "₹ 3.42 Cr",
  payrollRunDate: "27 Aug 2026",
  headcountChange: "+12 this quarter",
};

export const attendanceTrend = [
  { day: "Mon", present: 214, leave: 21, absent: 13 },
  { day: "Tue", present: 208, leave: 24, absent: 16 },
  { day: "Wed", present: 197, leave: 30, absent: 21 },
  { day: "Thu", present: 220, leave: 18, absent: 10 },
  { day: "Fri", present: 201, leave: 27, absent: 20 },
];

export const departmentSplit = [
  { department: "Engineering", headcount: 96 },
  { department: "Sales", headcount: 48 },
  { department: "Support", headcount: 34 },
  { department: "Design", headcount: 28 },
  { department: "Finance", headcount: 22 },
  { department: "People Ops", headcount: 20 },
];

export const pendingApprovals = [
  { id: "LV-3319", name: "Nirjala Chauhan", initials: "NC", type: "Casual Leave", range: "02 – 03 Sep", days: 2 },
  { id: "LV-3320", name: "Tara Nair", initials: "TN", type: "Sick Leave", range: "24 Aug", days: 1 },
  { id: "LV-3321", name: "Dev Malhotra", initials: "DM", type: "Earned Leave", range: "01 – 05 Sep", days: 5 },
  { id: "LV-3322", name: "Rohan Gupta", initials: "RG", type: "Casual Leave", range: "26 Aug", days: 1 },
];
