export type EventCategory =
  | "meeting"
  | "deadline"
  | "leave"
  | "holiday"
  | "review"
  | "deploy"
  | "training"
  | "personal";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";
export type ViewMode = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  startDate: string; // ISO date "YYYY-MM-DD"
  endDate: string;
  startTime?: string; // "HH:MM" — null = all-day
  endTime?: string;
  allDay: boolean;
  location?: string;
  attendees: Attendee[];
  color: string;
  bg: string;
  recurrence: RecurrenceType;
  createdBy: string;
  reminder?: number; // minutes before
  url?: string;
  tags?: string[];
  completed?: boolean;
}

export interface Attendee {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  status: "accepted" | "declined" | "pending";
}

export interface CalendarFilter {
  categories: EventCategory[];
  showWeekends: boolean;
  showHolidays: boolean;
}

export interface NewEventForm {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location: string;
  attendeeIds: string[];
  recurrence: RecurrenceType;
  reminder: number;
  tags: string;
}
