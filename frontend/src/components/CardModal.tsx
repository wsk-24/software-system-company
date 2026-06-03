import React from "react";
import type { KanbanCard } from "../types/kanban";
import { avatarColors, priorityConfig, tagConfig } from "../data/kanbanData";

interface CardModalProps {
  card: KanbanCard;
  onClose: () => void;
  onChecklistToggle: (cardId: string, checkId: string) => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose, onChecklistToggle }) => {
  const pCfg = priorityConfig[card.priority];
  const checkedCount = card.checklist?.filter((c) => c.done).length ?? 0;
  const totalCount = card.checklist?.length ?? 0;
  const checkPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="kb-modal-backdrop" onClick={handleBackdrop}>
      <div className="kb-modal">
        {card.coverColor && (
          <div className="kb-modal__cover" style={{ background: card.coverColor }} />
        )}

        <div className="kb-modal__body">
          <div className="kb-modal__header">
            <h2 className="kb-modal__title">{card.title}</h2>
            <button className="kb-modal__close" onClick={onClose}>✕</button>
          </div>

          {card.description && (
            <p className="kb-modal__desc">{card.description}</p>
          )}

          {/* Priority & Tags */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div className="kb-modal__label">Priority</div>
              <span
                className="kb-tag"
                style={{
                  background: pCfg.bg,
                  color: pCfg.color,
                  fontSize: 12,
                  padding: "4px 10px",
                }}
              >
                {pCfg.label}
              </span>
            </div>
            {card.dueDate && (
              <div>
                <div className="kb-modal__label">Due Date</div>
                <span className="kb-card__due normal" style={{ fontSize: 12, padding: "4px 10px" }}>
                  📅 {card.dueDate}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="kb-modal__section">
              <div className="kb-modal__label">Labels</div>
              <div className="kb-modal__tags">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="kb-tag"
                    style={{
                      background: tagConfig[tag]?.bg,
                      color: tagConfig[tag]?.color,
                      fontSize: 12,
                      padding: "4px 10px",
                    }}
                  >
                    {tagConfig[tag]?.label ?? tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assignees */}
          {card.assignees.length > 0 && (
            <div className="kb-modal__section">
              <div className="kb-modal__label">Assignees</div>
              <div className="kb-modal__assignees">
                {card.assignees.map((a) => (
                  <div key={a} className="kb-modal__assignee">
                    <div
                      className="kb-modal__av"
                      style={{ background: avatarColors[a] ?? "#6B7280" }}
                    >
                      {a}
                    </div>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checklist */}
          {card.checklist && card.checklist.length > 0 && (
            <div className="kb-modal__section">
              <div
                className="kb-modal__label"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Checklist</span>
                <span style={{ color: "#059669" }}>{checkPct}%</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div className="kb-checklist-bar" style={{ height: 5 }}>
                  <div
                    className="kb-checklist-fill"
                    style={{ width: `${checkPct}%` }}
                  />
                </div>
              </div>
              <div className="kb-modal__checklist">
                {card.checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`kb-modal__check-item ${item.done ? "done" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => onChecklistToggle(card.id, item.id)}
                    />
                    {item.text}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "14px 0 0",
              borderTop: "1px solid #F3F4F6",
              fontSize: 13,
              color: "#9CA3AF",
            }}
          >
            {card.attachments != null && (
              <span>📎 {card.attachments} attachment{card.attachments !== 1 ? "s" : ""}</span>
            )}
            {card.comments != null && (
              <span>💬 {card.comments} comment{card.comments !== 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
