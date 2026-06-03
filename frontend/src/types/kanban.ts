export type Priority = "urgent" | "high" | "medium" | "low";
export type CardTag = "design" | "dev" | "research" | "marketing" | "qa" | "backend" | "infra";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  tags: CardTag[];
  assignees: string[];
  dueDate?: string;
  checklist?: { id: string; text: string; done: boolean }[];
  columnId: string;
  order: number;
  attachments?: number;
  comments?: number;
  coverColor?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  wipLimit?: number;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
}

export type DragInfo = {
  cardId: string;
  fromColumnId: string;
  fromIndex: number;
} | null;
