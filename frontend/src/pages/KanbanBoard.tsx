import React, { useState, useCallback, useRef } from "react";
import type { KanbanColumn, KanbanCard, DragInfo } from "../types/kanban";
import { initialColumns, avatarColors } from "../data/kanbanData";
import KanbanCardComponent from "../components/KanbanCard";
import CardModal from "../components/CardModal";
import "./KanbanBoard.css";

// ── Helpers ──────────────────────────────────────────────────────────────────
let idCounter = 100;
const uid = () => `card-${++idCounter}`;

// ── KanbanBoard ───────────────────────────────────────────────────────────────
const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [dragInfo, setDragInfo] = useState<DragInfo>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newCardText, setNewCardText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Total card count
  const totalCards = columns.reduce((acc, col) => acc + col.cards.length, 0);

  // ── Filtered columns
  const filteredColumns = columns.map((col) => ({
    ...col,
    cards: col.cards.filter((card) => {
      const matchSearch =
        !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.tags.some((t) => t.includes(searchQuery.toLowerCase()));
      const matchPriority = !filterPriority || card.priority === filterPriority;
      return matchSearch && matchPriority;
    }),
  }));

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.DragEvent, cardId: string, columnId: string) => {
      const col = columns.find((c) => c.id === columnId);
      const fromIndex = col?.cards.findIndex((c) => c.id === cardId) ?? 0;
      setDragInfo({ cardId, fromColumnId: columnId, fromIndex });
      e.dataTransfer.effectAllowed = "move";
      // ghost image trick: slight delay so dragging class kicks in
      setTimeout(() => {
        setColumns((prev) =>
          prev.map((c) => ({
            ...c,
            cards: c.cards.map((card) =>
              card.id === cardId ? { ...card, _dragging: true } : card
            ),
          }))
        );
      }, 0);
    },
    [columns]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, colId: string, idx?: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverCol(colId);
      if (idx !== undefined) setDragOverIdx(idx);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColId: string, targetIdx?: number) => {
      e.preventDefault();
      if (!dragInfo) return;

      const { cardId, fromColumnId } = dragInfo;

      setColumns((prev) => {
        // Find the card
        const srcCol = prev.find((c) => c.id === fromColumnId);
        if (!srcCol) return prev;
        const card = srcCol.cards.find((c) => c.id === cardId);
        if (!card) return prev;

        // Remove from source
        const withoutCard = prev.map((col) =>
          col.id === fromColumnId
            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            : col
        );

        // Insert into target
        return withoutCard.map((col) => {
          if (col.id !== targetColId) return col;
          const updatedCard = { ...card, columnId: targetColId };
          const cards = [...col.cards];
          const insertAt = targetIdx !== undefined ? targetIdx : cards.length;
          cards.splice(insertAt, 0, updatedCard);
          return {
            ...col,
            cards: cards.map((c, i) => ({ ...c, order: i })),
          };
        });
      });

      setDragInfo(null);
      setDragOverCol(null);
      setDragOverIdx(null);
    },
    [dragInfo]
  );



  // ── Checklist toggle ──────────────────────────────────────────────────────
  const handleChecklistToggle = useCallback(
    (cardId: string, checkId: string) => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  checklist: card.checklist?.map((item) =>
                    item.id === checkId ? { ...item, done: !item.done } : item
                  ),
                }
              : card
          ),
        }))
      );
      // update active card if open
      setActiveCard((prev) => {
        if (!prev || prev.id !== cardId) return prev;
        return {
          ...prev,
          checklist: prev.checklist?.map((item) =>
            item.id === checkId ? { ...item, done: !item.done } : item
          ),
        };
      });
    },
    []
  );

  // ── Add card ──────────────────────────────────────────────────────────────
  const handleAddCard = useCallback(
    (colId: string) => {
      if (!newCardText.trim()) {
        setAddingTo(null);
        return;
      }
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== colId) return col;
          const newCard: KanbanCard = {
            id: uid(),
            title: newCardText.trim(),
            priority: "medium",
            tags: [],
            assignees: [],
            columnId: colId,
            order: col.cards.length,
            comments: 0,
          };
          return { ...col, cards: [...col.cards, newCard] };
        })
      );
      setNewCardText("");
      setAddingTo(null);
    },
    [newCardText]
  );

  const startAdding = (colId: string) => {
    setAddingTo(colId);
    setNewCardText("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="kb-header">
        <div className="kb-header__left">
          <h1 className="kb-title">Nexus Board</h1>
          <div className="kb-meta">
            <span>{filteredColumns.length} columns</span>
            <span className="kb-meta__dot" />
            <span>{totalCards} cards</span>
            <span className="kb-meta__dot" />
            <span style={{ color: "#059669" }}>
              {columns.find((c) => c.id === "done")?.cards.length ?? 0} done
            </span>
          </div>
        </div>

        <div className="kb-header__actions">
          {/* Member stack */}
          <div className="kb-members">
            {Object.entries(avatarColors)
              .slice(0, 4)
              .map(([initials, color]) => (
                <div
                  key={initials}
                  className="kb-member-avatar"
                  style={{ background: color }}
                  title={initials}
                >
                  {initials}
                </div>
              ))}
            <div className="kb-member-more">+2</div>
          </div>

          <button className="kb-btn">
            <span className="kb-btn__icon">⚙</span> Board settings
          </button>
          <button className="kb-btn kb-btn--primary">
            <span className="kb-btn__icon">+</span> Add card
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="kb-toolbar">
        <div className="kb-toolbar__left">
          {/* Search */}
          <div className="kb-search">
            <span className="kb-search__icon">⌕</span>
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Priority filters */}
          {(["urgent", "high", "medium", "low"] as const).map((p) => (
            <button
              key={p}
              className={`kb-filter-btn ${filterPriority === p ? "active" : ""}`}
              onClick={() => setFilterPriority(filterPriority === p ? null : p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}

          {(searchQuery || filterPriority) && (
            <button
              className="kb-filter-btn"
              onClick={() => {
                setSearchQuery("");
                setFilterPriority(null);
              }}
              style={{ color: "#DC2626" }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="kb-view-toggle">
          <button className="kb-view-btn active">⊞ Board</button>
          <button className="kb-view-btn">☰ List</button>
          <button className="kb-view-btn">▦ Calendar</button>
        </div>
      </div>

      {/* Board */}
      <div className="kb-board">
        {filteredColumns.map((col) => {
          const isOver = dragOverCol === col.id;
          const atLimit =
            col.wipLimit != null && col.cards.length >= col.wipLimit;

          return (
            <div key={col.id} className="kb-col">
              {/* Column header */}
              <div className="kb-col__header">
                <div className="kb-col__header-left">
                  <div
                    className="kb-col__dot"
                    style={{ background: col.color }}
                  />
                  <span className="kb-col__title">{col.title}</span>
                  <span
                    className={`kb-col__count ${atLimit ? "at-limit" : ""}`}
                  >
                    {col.cards.length}
                    {col.wipLimit ? `/${col.wipLimit}` : ""}
                  </span>
                </div>
                <button
                  className="kb-col__add-btn"
                  onClick={() => startAdding(col.id)}
                  title="Add card"
                >
                  +
                </button>
              </div>

              {/* Drop zone */}
              <div
                className={`kb-drop-zone ${isOver ? "drag-over" : ""}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragLeave={() => {
                  if (dragOverCol === col.id) setDragOverCol(null);
                }}
              >
                {col.cards.map((card, idx) => (
                  <React.Fragment key={card.id}>
                    {/* Drop target slot between cards */}
                    {isOver && dragOverIdx === idx && dragInfo?.fromColumnId !== col.id && (
                      <div className="kb-card drop-placeholder" />
                    )}
                    <div
                      onDragOver={(e) => handleDragOver(e, col.id, idx)}
                      onDrop={(e) => handleDrop(e, col.id, idx)}
                    >
                      <KanbanCardComponent
                        card={card}
                        isDragging={dragInfo?.cardId === card.id}
                        onDragStart={handleDragStart}
                        onClick={setActiveCard}
                      />
                    </div>
                  </React.Fragment>
                ))}

                {/* Inline add form */}
                {addingTo === col.id ? (
                  <div className="kb-card-form">
                    <textarea
                      ref={textareaRef}
                      placeholder="Card title..."
                      value={newCardText}
                      onChange={(e) => setNewCardText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddCard(col.id);
                        }
                        if (e.key === "Escape") {
                          setAddingTo(null);
                          setNewCardText("");
                        }
                      }}
                    />
                    <div className="kb-card-form__actions">
                      <button
                        className="kb-form-btn kb-form-btn--save"
                        onClick={() => handleAddCard(col.id)}
                      >
                        Add card
                      </button>
                      <button
                        className="kb-form-btn kb-form-btn--cancel"
                        onClick={() => {
                          setAddingTo(null);
                          setNewCardText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="kb-add-card"
                    onClick={() => startAdding(col.id)}
                  >
                    + Add a card
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add column */}
        <div className="kb-col-add">
          <div className="kb-col-add__icon">+</div>
          <div className="kb-col-add__label">Add column</div>
        </div>
      </div>

      {/* Card detail modal */}
      {activeCard && (
        <CardModal
          card={activeCard}
          onClose={() => setActiveCard(null)}
          onChecklistToggle={handleChecklistToggle}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
