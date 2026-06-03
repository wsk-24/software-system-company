export type LeaveType = "annual" | "sick" | "personal" | "maternity" | "paternity" | "unpaid" | "wfh";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type LeavePeriod = "full" | "morning" | "afternoon";

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  pending: number;
  color: string;
  icon: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeDept: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  period: LeavePeriod;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectedReason?: string;
  coverBy?: string;
}

export interface PublicHoliday {
  date: string;
  name: string;
  day: string;
}

export interface TeamLeaveDay {
  date: string;
  employees: { name: string; avatar: string; type: LeaveType }[];
}

export interface NewLeaveForm {
  type: LeaveType;
  startDate: string;
  endDate: string;
  period: LeavePeriod;
  reason: string;
  coverBy: string;
}
