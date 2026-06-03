export type DateRange = "7d" | "30d" | "90d" | "12m" | "ytd";
export type MetricCategory =
  | "revenue"
  | "users"
  | "performance"
  | "acquisition";
export type ChartType = "line" | "bar" | "area" | "donut";

export interface DataPoint {
  label: string;
  value: number;
  prev?: number;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  delta: number;
  deltaLabel: string;
  icon: string;
  color: string;
  bg: string;
  sparkline: number[];
  category: MetricCategory;
  format: "currency" | "number" | "percent" | "duration";
}

export interface ChartSeries {
  id: string;
  label: string;
  color: string;
  data: number[];
}

export interface FunnelStep {
  label: string;
  value: number;
  pct: number;
  color: string;
}

export interface TopItem {
  rank: number;
  label: string;
  sub?: string;
  value: number;
  pct: number;
  delta?: number;
  color?: string;
  flag?: string;
}

export interface HeatmapCell {
  hour: number;
  day: number;
  value: number;
}

export interface GoalProgress {
  id: string;
  label: string;
  current: number;
  target: number;
  color: string;
  unit: string;
  deadline: string;
}
