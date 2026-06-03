import React from "react";
import type { KanbanCard } from "../types/kanban";
import { avatarColors, priorityConfig, tagConfig } from "../data/kanbanData";

interface KanbanCardProps {
  card: KanbanCard;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onClick: (card: KanbanCard) => void;
}

const KanbanCardComponent: React.FC<KanbanCardProps> = ({
  card,
  isDragging,
  onDragStart,
  onClick,
}) => {
  const pCfg = priorityConfig[card.priority];
  const checkedCount = card.checklist?.filter((c) => c.done).length ?? 0;
  const totalCount = card.checklist?.length ?? 0;
  const checkPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const getDueClass = (due?: string) => {
    if (!due) return "";
    // simplified: just show normal for demo
    return "normal";
  };

  return (
    <div
      className={`kb-card ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, card.id, card.columnId)}
      onClick={() => onClick(card)}
    >
      {/* Cover bar */}
      {card.coverColor && (
        <div className="kb-card__cover" style={{ background: card.coverColor }} />
      )}

      <div className="kb-card__body">
        {/* Priority */}
        <div className="kb-card__priority">
          <div className={`priority-pip ${card.priority}`}>
            <span />
            <span />
            <span />
          </div>
          <span className="priority-label" style={{ color: pCfg.color }}>
            {pCfg.label}
          </span>
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="kb-card__tags">
            {card.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="kb-tag"
                style={{
                  background: tagConfig[tag]?.bg,
                  color: tagConfig[tag]?.color,
                }}
              >
                {tagConfig[tag]?.label ?? tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <div className="kb-card__title">{card.title}</div>

        {/* Checklist bar */}
        {totalCount > 0 && (
          <div className="kb-card__checklist">
            <div className="kb-checklist-bar">
              <div
                className="kb-checklist-fill"
                style={{ width: `${checkPct}%` }}
              />
            </div>
            <span className="kb-checklist-text">
              {checkedCount}/{totalCount}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="kb-card__footer">
          {/* Assignees */}
          <div className="kb-card__assignees">
            {card.assignees.slice(0, 3).map((a) => (
              <div
                key={a}
                className="kb-card__avatar"
                style={{ background: avatarColors[a] ?? "#6B7280" }}
                title={a}
              >
                {a}
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="kb-card__meta">
            {card.attachments != null && card.attachments > 0 && (
              <span className="kb-card__meta-item">
                📎 {card.attachments}
              </span>
            )}
            {card.comments != null && card.comments > 0 && (
              <span className="kb-card__meta-item">
                💬 {card.comments}
              </span>
            )}
            {card.dueDate && (
              <span className={`kb-card__due ${getDueClass(card.dueDate)}`}>
                {card.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCardComponent;
