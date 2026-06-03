export type OTStatus = "pending" | "approved" | "rejected" | "paid";
export type OTType = "weekday" | "weekend" | "holiday" | "night";
export type OTCompensation = "cash" | "comp_off" | "pending";

export interface OTRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  position: string;
  date: string;
  dayOfWeek: string;
  otType: OTType;
  startTime: string;
  endTime: string;
  hours: number;
  project: string;
  task: string;
  reason: string;
  status: OTStatus;
  compensation: OTCompensation;
  rate: number;            // multiplier e.g. 1.5, 2.0
  baseSalaryPerHour: number;
  totalPay: number;
  approvedBy?: string;
  approvedOn?: string;
  rejectedReason?: string;
  submittedOn: string;
  attachmentCount?: number;
  notes?: string;
}

export interface OTSummary {
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  totalHours: number;
  totalPay: number;
  approvedHours: number;
  pendingHours: number;
  paidAmount: number;
  unpaidAmount: number;
  recordCount: number;
  trend: "up" | "down" | "flat";
  trendPct: number;
}

export interface OTFormData {
  employeeId: string;
  date: string;
  otType: OTType;
  startTime: string;
  endTime: string;
  project: string;
  task: string;
  reason: string;
  compensation: OTCompensation;
}

export interface DeptOTStat {
  dept: string;
  hours: number;
  amount: number;
  color: string;
}
