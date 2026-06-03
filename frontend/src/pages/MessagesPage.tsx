import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback
} from "react";
import type { Conversation, Message } from "../types/messages";
import {
  conversations as initialConvos,
  ME,
  presenceConfig,
  attachmentConfig,
  REACTIONS
} from "../data/messagesData";
import "./MessagesPage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
const fmtDay = (iso: string) => {
  const d = new Date(iso),
    now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
};
const fmtRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};
const getOther = (convo: Conversation) =>
  convo.participants.find((p) => p.id !== ME.id);
const getConvoName = (convo: Conversation) =>
  convo.name ?? getOther(convo)?.name ?? "Unknown";
const getConvoColor = (convo: Conversation) =>
  convo.type === "direct"
    ? getOther(convo)?.avatarColor ?? "#6B7280"
    : convo.avatarColor ?? "#6B7280";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😎",
  "👍",
  "❤️",
  "🔥",
  "✅",
  "🎉",
  "😅",
  "😭",
  "🙌",
  "💯",
  "🚀",
  "⭐",
  "💡",
  "📌",
  "🎯",
  "⚡"
];

let msgCounter = 1000;
const uid = () => `M${++msgCounter}`;

// ── Avatar ────────────────────────────────────────────────────────────────────
const Av: React.FC<{
  text: string;
  color: string;
  size?: number;
  radius?: string;
}> = ({ text, color, size = 32, radius = "50%" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.32,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif"
    }}
  >
    {text}
  </div>
);

// ── Message bubble ────────────────────────────────────────────────────────────
const MsgBubble: React.FC<{
  msg: Message;
  isMine: boolean;
  isConsecutive: boolean;
  senderParticipant?: Conversation["participants"][number];
  onReact: (msgId: string, emoji: string) => void;
  onReply: (msg: Message) => void;
}> = ({ msg, isMine, isConsecutive, senderParticipant, onReact, onReply }) => {
  const [showPicker, setShowPicker] = useState(false);

  if (msg.system) return <div className="msg-system">{msg.text}</div>;

  const attConf = (type: string) =>
    attachmentConfig[type as keyof typeof attachmentConfig] ??
    attachmentConfig.other;

  return (
    <div
      className={`msg-row ${isMine ? "mine" : ""} ${
        isConsecutive ? "consecutive" : ""
      }`}
    >
      {/* Avatar */}
      {senderParticipant ? (
        <Av
          text={senderParticipant.avatar}
          color={senderParticipant.avatarColor}
          size={32}
        />
      ) : (
        <div style={{ width: 32, flexShrink: 0 }} />
      )}

      <div className="msg-row__bubble-wrap">
        {/* Sender name + time (only if not consecutive) */}
        {!isConsecutive && (
          <div className="msg-row__meta">
            {!isMine && senderParticipant && (
              <span className="msg-row__sender">{senderParticipant.name}</span>
            )}
            <span className="msg-row__time">{fmtTime(msg.timestamp)}</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`msg-bubble ${isMine ? "mine" : ""}`}
          style={{ animation: "msgBubbleIn 0.2s ease" }}
        >
          {msg.text && <span>{msg.text}</span>}
          {msg.edited && (
            <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 6 }}>
              (edited)
            </span>
          )}

          {/* Attachments */}
          {msg.attachments.map((att) => {
            const cfg = attConf(att.type);
            return (
              <div key={att.id} className="msg-attachment">
                <div className="msg-attachment__icon">{cfg.icon}</div>
                <div>
                  <div className="msg-attachment__name">{att.name}</div>
                  <div className="msg-attachment__size">{att.size}</div>
                </div>
                <span style={{ fontSize: 12, opacity: 0.6 }}>⬇</span>
              </div>
            );
          })}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="msg-reactions">
            {msg.reactions.map((r) => (
              <button
                key={r.emoji}
                className={`msg-reaction ${r.byMe ? "mine" : ""}`}
                onClick={() => onReact(msg.id, r.emoji)}
              >
                {r.emoji} <span className="msg-reaction__count">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Status (only for mine) */}
        {isMine && (
          <div className={`msg-status ${msg.status}`}>
            {msg.status === "sent"
              ? "✓"
              : msg.status === "delivered"
              ? "✓✓"
              : "✓✓"}
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="msg-row__actions">
        {REACTIONS.slice(0, 4).map((e) => (
          <button
            key={e}
            className="msg-action-btn"
            title={`React ${e}`}
            onClick={() => onReact(msg.id, e)}
          >
            {e}
          </button>
        ))}
        <button
          className="msg-action-btn"
          title="React"
          onClick={() => setShowPicker((p) => !p)}
        >
          🙂
        </button>
        <button
          className="msg-action-btn"
          title="Reply"
          onClick={() => onReply(msg)}
        >
          ↩
        </button>
        <button className="msg-action-btn" title="More">
          ⋯
        </button>
      </div>

      {/* Inline reaction picker */}
      {showPicker && (
        <div
          className="msg-reaction-picker"
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            zIndex: 50
          }}
        >
          {REACTIONS.map((e) => (
            <button
              key={e}
              onClick={() => {
                onReact(msg.id, e);
                setShowPicker(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Sidebar convo item ────────────────────────────────────────────────────────
const ConvoItem: React.FC<{
  convo: Conversation;
  active: boolean;
  onClick: () => void;
}> = ({ convo, active, onClick }) => {
  const other = getOther(convo);
  const name = getConvoName(convo);
  const color = getConvoColor(convo);
  const lastMsg = convo.messages[convo.messages.length - 1];
  const presence = other?.presence ?? "offline";
  const pCfg = presenceConfig[presence];

  const preview = lastMsg
    ? lastMsg.attachments.length > 0
      ? `📎 ${lastMsg.attachments[0].name}`
      : lastMsg.text.slice(0, 45)
    : "No messages yet";

  return (
    <div
      className={`msg-convo-item ${active ? "active" : ""} ${
        convo.muted ? "muted" : ""
      }`}
      onClick={onClick}
    >
      <div className="msg-convo-item__avatar-wrap">
        {convo.type === "direct" ? (
          <>
            <div
              className="msg-convo-item__avatar"
              style={{ background: color }}
            >
              {other?.avatar ?? "?"}
            </div>
            <div
              className="msg-presence-dot"
              style={{ background: pCfg.color }}
              title={pCfg.label}
            />
          </>
        ) : convo.type === "group" ? (
          <div className="msg-convo-item__avatar msg-convo-item__avatar--group">
            👥
          </div>
        ) : (
          <div
            className="msg-convo-item__avatar msg-convo-item__avatar--channel"
            style={{
              background: color,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 900
            }}
          >
            #
          </div>
        )}
      </div>

      <div className="msg-convo-item__body">
        <div className="msg-convo-item__row1">
          <span className="msg-convo-item__name">
            {name}
            {convo.pinned && <span className="msg-pin-icon"> 📌</span>}
            {convo.muted && <span className="msg-muted-icon"> 🔇</span>}
          </span>
          <span className="msg-convo-item__time">
            {fmtRelative(convo.lastActivity)}
          </span>
        </div>
        <div
          className={`msg-convo-item__preview ${
            convo.unread > 0 ? "has-unread" : ""
          }`}
        >
          {preview}
        </div>
      </div>

      {convo.unread > 0 && (
        <div className="msg-unread-badge">{convo.unread}</div>
      )}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MessagesPageComponent: React.FC = () => {
  const [convos, setConvos] = useState<Conversation[]>(initialConvos);
  const [activeId, setActiveId] = useState<string>("C001");
  const [text, setText] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConvo = convos.find((c) => c.id === activeId)!;

  // scroll to bottom on convo change or new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, convos]);

  // Mark as read on open
  useEffect(() => {
    setConvos((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
    );
  }, [activeId]);

  // filtered convos
  const filteredConvos = useMemo(() => {
    if (!searchQ) return convos;
    return convos.filter((c) => {
      const name = getConvoName(c).toLowerCase();
      const lastMsg = c.messages[c.messages.length - 1]?.text ?? "";
      return (
        name.includes(searchQ.toLowerCase()) ||
        lastMsg.toLowerCase().includes(searchQ.toLowerCase())
      );
    });
  }, [convos, searchQ]);

  const pinnedConvos = filteredConvos.filter((c) => c.pinned);
  const dmConvos = filteredConvos.filter(
    (c) => !c.pinned && c.type === "direct"
  );
  const groupConvos = filteredConvos.filter(
    (c) => !c.pinned && c.type === "group"
  );
  const channelConvos = filteredConvos.filter(
    (c) => !c.pinned && c.type === "channel"
  );

  // ── Send message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const newMsg: Message = {
      id: uid(),
      convoId: activeId,
      senderId: ME.id,
      text: trimmed,
      timestamp: now,
      status: "sent",
      reactions: [],
      attachments: [],
      replyTo: replyTo?.id
    };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastActivity: now,
              unread: 0
            }
          : c
      )
    );
    setText("");
    setReplyTo(null);
    setShowEmoji(false);

    // simulate "delivered" after 1s
    setTimeout(() => {
      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === newMsg.id ? { ...m, status: "delivered" } : m
                )
              }
            : c
        )
      );
    }, 1000);

    // simulate typing indicator + reply
    const other = getOther(activeConvo);
    if (activeConvo.type === "direct" && other) {
      setTimeout(() => setIsTyping(true), 1200);
      setTimeout(() => {
        setIsTyping(false);
        const replies = [
          "Got it, thanks! 👍",
          "Sounds good, I'll take a look",
          "On it! Will update you shortly",
          "Perfect, that works for me",
          "Thanks for the heads up 🙌"
        ];
        const reply: Message = {
          id: uid(),
          convoId: activeId,
          senderId: other.id,
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toISOString(),
          status: "sent",
          reactions: [],
          attachments: []
        };
        setConvos((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: [...c.messages, reply],
                  lastActivity: reply.timestamp
                }
              : c
          )
        );
      }, 3000);
    }
  }, [text, activeId, replyTo, activeConvo]);

  // ── React to message ────────────────────────────────────────────────────
  const handleReact = useCallback(
    (msgId: string, emoji: string) => {
      setConvos((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id !== msgId) return m;
              const existing = m.reactions.find((r) => r.emoji === emoji);
              if (existing) {
                return {
                  ...m,
                  reactions: m.reactions
                    .map((r) =>
                      r.emoji === emoji
                        ? {
                            ...r,
                            count: r.byMe ? r.count - 1 : r.count + 1,
                            byMe: !r.byMe
                          }
                        : r
                    )
                    .filter((r) => r.count > 0)
                };
              }
              return {
                ...m,
                reactions: [
                  ...m.reactions,
                  { emoji: emoji as any, count: 1, byMe: true }
                ]
              };
            })
          };
        })
      );
    },
    [activeId]
  );

  // ── Key handler ────────────────────────────────────────────────────────
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // typing indicator
    if (typingTimer.current) clearTimeout(typingTimer.current);
  };

  // ── Emoji insert ───────────────────────────────────────────────────────
  const insertEmoji = (e: string) => {
    setText((t) => t + e);
    textareaRef.current?.focus();
    setShowEmoji(false);
  };

  // ── Select convo ───────────────────────────────────────────────────────
  const selectConvo = (id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
    setReplyTo(null);
    setText("");
  };

  // ── Group messages by day ──────────────────────────────────────────────
  const groupedMessages = useMemo(() => {
    const groups: { day: string; messages: Message[] }[] = [];
    activeConvo.messages.forEach((msg) => {
      const day = fmtDay(msg.timestamp);
      const last = groups[groups.length - 1];
      if (last?.day === day) last.messages.push(msg);
      else groups.push({ day, messages: [msg] });
    });
    return groups;
  }, [activeConvo]);

  // ── Participant lookup ────────────────────────────────────────────────
  const findParticipant = (senderId: string) =>
    activeConvo.participants.find((p) => p.id === senderId);

  // ── Info panel files ──────────────────────────────────────────────────
  const allAttachments = useMemo(
    () => activeConvo.messages.flatMap((m) => m.attachments),
    [activeConvo]
  );

  const other = getOther(activeConvo);
  const convoColor = getConvoColor(activeConvo);
  const convoName = getConvoName(activeConvo);

  return (
    <div className="msg-page">
      {/* ── Sidebar ── */}
      <div className={`msg-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="msg-sidebar__header">
          <div className="msg-sidebar__title">
            Messages
            <div className="msg-sidebar__title-right">
              <button className="msg-icon-btn" title="New message">
                ✏
              </button>
              <button className="msg-icon-btn" title="New group">
                👥
              </button>
            </div>
          </div>
          <div className="msg-sidebar__search">
            <span className="msg-sidebar__search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>
        </div>

        <div className="msg-convo-list">
          {/* Pinned */}
          {pinnedConvos.length > 0 && (
            <>
              <div className="msg-sidebar__section">Pinned</div>
              {pinnedConvos.map((c) => (
                <ConvoItem
                  key={c.id}
                  convo={c}
                  active={c.id === activeId}
                  onClick={() => selectConvo(c.id)}
                />
              ))}
            </>
          )}
          {/* DMs */}
          {dmConvos.length > 0 && (
            <>
              <div className="msg-sidebar__section">
                Direct Messages
                <span className="msg-sidebar__section-add">+</span>
              </div>
              {dmConvos.map((c) => (
                <ConvoItem
                  key={c.id}
                  convo={c}
                  active={c.id === activeId}
                  onClick={() => selectConvo(c.id)}
                />
              ))}
            </>
          )}
          {/* Groups */}
          {groupConvos.length > 0 && (
            <>
              <div className="msg-sidebar__section">
                Groups
                <span className="msg-sidebar__section-add">+</span>
              </div>
              {groupConvos.map((c) => (
                <ConvoItem
                  key={c.id}
                  convo={c}
                  active={c.id === activeId}
                  onClick={() => selectConvo(c.id)}
                />
              ))}
            </>
          )}
          {/* Channels */}
          {channelConvos.length > 0 && (
            <>
              <div className="msg-sidebar__section">
                Channels
                <span className="msg-sidebar__section-add">+</span>
              </div>
              {channelConvos.map((c) => (
                <ConvoItem
                  key={c.id}
                  convo={c}
                  active={c.id === activeId}
                  onClick={() => selectConvo(c.id)}
                />
              ))}
            </>
          )}
          {filteredConvos.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 24,
                color: "#9CA3AF",
                fontSize: 13
              }}
            >
              No conversations found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="msg-sidebar__footer">
          <div className="msg-me-avatar" style={{ position: "relative" }}>
            <Av text={ME.avatar} color={ME.avatarColor} size={32} />
            <div
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#059669",
                border: "2px solid #FAFAFA"
              }}
            />
          </div>
          <div>
            <div className="msg-me-name">{ME.name}</div>
            <div className="msg-me-status">● Online</div>
          </div>
          <button className="msg-icon-btn" style={{ marginLeft: "auto" }}>
            ⚙
          </button>
        </div>
      </div>

      {/* ── Chat Panel ── */}
      <div className="msg-chat">
        {/* Chat header */}
        <div className="msg-chat__header">
          <div className="msg-chat__header-left">
            {/* Mobile menu toggle */}
            <button
              className="msg-icon-btn"
              style={{ display: "none" }}
              onClick={() => setSidebarOpen((s) => !s)}
            >
              ☰
            </button>

            {activeConvo.type === "direct" && other ? (
              <>
                <div
                  className="msg-chat__avatar"
                  style={{ background: convoColor, position: "relative" }}
                >
                  {other.avatar}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -1,
                      right: -1,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: presenceConfig[other.presence].color,
                      border: "2px solid #fff"
                    }}
                  />
                </div>
                <div>
                  <div className="msg-chat__name">{other.name}</div>
                  <div className="msg-chat__sub">
                    <span
                      style={{ color: presenceConfig[other.presence].color }}
                    >
                      ●
                    </span>
                    {presenceConfig[other.presence].label} · {other.role}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`msg-chat__avatar msg-chat__avatar--group`}
                  style={{ background: convoColor + "22", fontSize: 20 }}
                >
                  {activeConvo.type === "channel" ? "#" : "👥"}
                </div>
                <div>
                  <div className="msg-chat__name">{convoName}</div>
                  <div className="msg-chat__sub">
                    {activeConvo.participants.length} members
                    {activeConvo.description && ` · ${activeConvo.description}`}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="msg-chat__header-right">
            <button className="msg-chat__action-btn" title="Search">
              ⌕
            </button>
            <button className="msg-chat__action-btn" title="Pinned">
              📌
            </button>
            <button
              className={`msg-chat__action-btn ${showInfo ? "active" : ""}`}
              title="Details"
              onClick={() => setShowInfo((s) => !s)}
            >
              ⓘ
            </button>
          </div>
        </div>

        {/* Topic banner */}
        {activeConvo.topic && (
          <div className="msg-topic-banner">
            📌 <strong>Topic:</strong> {activeConvo.topic}
          </div>
        )}

        {/* Messages */}
        <div className="msg-messages">
          {/* Welcome header */}
          <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
            {activeConvo.type === "direct" && other ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <Av text={other.avatar} color={other.avatarColor} size={56} />
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#111827"
                  }}
                >
                  {other.name}
                </div>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>
                  {other.role}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#6B7280",
                    background: "#F9FAFB",
                    borderRadius: 8,
                    padding: "6px 14px"
                  }}
                >
                  This is the beginning of your conversation with {other.name}
                </div>
              </div>
            ) : (
              <div
                style={{
                  fontSize: 12.5,
                  color: "#9CA3AF",
                  background: "#F9FAFB",
                  borderRadius: 8,
                  padding: "6px 14px",
                  display: "inline-block"
                }}
              >
                This is the beginning of <strong>{convoName}</strong>
              </div>
            )}
          </div>

          {/* Message groups by day */}
          {groupedMessages.map((group) => (
            <React.Fragment key={group.day}>
              <div className="msg-date-divider">{group.day}</div>
              {group.messages.map((msg, i) => {
                const prevMsg = i > 0 ? group.messages[i - 1] : null;
                const isConsecutive = !!(
                  prevMsg &&
                  prevMsg.senderId === msg.senderId &&
                  new Date(msg.timestamp).getTime() -
                    new Date(prevMsg.timestamp).getTime() <
                    5 * 60_000
                );
                const isMine = msg.senderId === ME.id;
                const sender = isConsecutive
                  ? undefined
                  : findParticipant(msg.senderId);
                return (
                  <MsgBubble
                    key={msg.id}
                    msg={msg}
                    isMine={isMine}
                    isConsecutive={isConsecutive}
                    senderParticipant={sender}
                    onReact={handleReact}
                    onReply={setReplyTo}
                  />
                );
              })}
            </React.Fragment>
          ))}

          {/* Typing indicator */}
          {isTyping && other && (
            <div className="msg-row">
              <Av text={other.avatar} color={other.avatarColor} size={32} />
              <div className="msg-typing">
                <div className="msg-typing__dots">
                  <div className="msg-typing__dot" />
                  <div className="msg-typing__dot" />
                  <div className="msg-typing__dot" />
                </div>
                <span>{other.name} is typing…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Compose */}
        <div className="msg-compose">
          {replyTo && (
            <div className="msg-reply-preview">
              ↩ Replying to:{" "}
              <span className="msg-reply-preview__text">
                {replyTo.text || "attachment"}
              </span>
              <span
                className="msg-reply-preview__close"
                onClick={() => setReplyTo(null)}
              >
                ✕
              </span>
            </div>
          )}
          <div className="msg-compose__bar">
            <div className="msg-compose__tools">
              <button className="msg-compose__tool" title="Attach file">
                📎
              </button>
              <button
                className="msg-compose__tool"
                title="Emoji"
                onClick={() => setShowEmoji((s) => !s)}
              >
                😊
              </button>
              <button className="msg-compose__tool" title="Mention">
                @
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="msg-compose__input"
              placeholder={`Message ${
                activeConvo.type === "channel"
                  ? convoName
                  : other?.name ?? "group"
              }…`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className="msg-compose__send"
              onClick={sendMessage}
              disabled={!text.trim()}
            >
              ➤
            </button>
          </div>
          {/* Emoji picker */}
          {showEmoji && (
            <div className="msg-emoji-picker">
              <div className="msg-emoji-picker__grid">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    className="msg-emoji-picker__btn"
                    onClick={() => insertEmoji(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Info Panel ── */}
      {showInfo && (
        <div className="msg-info-panel">
          <div className="msg-info-panel__header">
            Details
            <button className="msg-icon-btn" onClick={() => setShowInfo(false)}>
              ✕
            </button>
          </div>

          {/* Participants */}
          <div className="msg-info-panel__section">
            <div className="msg-info-section-title">
              Members ({activeConvo.participants.length})
            </div>
            {activeConvo.participants.map((p) => {
              const pCfg = presenceConfig[p.presence];
              return (
                <div key={p.id} className="msg-info-member">
                  <div
                    className="msg-info-member__av"
                    style={{ background: p.avatarColor }}
                  >
                    {p.avatar}
                    <div
                      className="msg-info-member__presence"
                      style={{ background: pCfg.color }}
                    />
                  </div>
                  <div>
                    <div className="msg-info-member__name">
                      {p.name}{" "}
                      {p.id === ME.id && (
                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                          (you)
                        </span>
                      )}
                    </div>
                    <div className="msg-info-member__role">{p.role}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Files */}
          {allAttachments.length > 0 && (
            <div className="msg-info-panel__section">
              <div className="msg-info-section-title">
                Shared Files ({allAttachments.length})
              </div>
              {allAttachments.map((att) => {
                const cfg =
                  attachmentConfig[att.type as keyof typeof attachmentConfig] ??
                  attachmentConfig.other;
                return (
                  <div key={att.id} className="msg-info-file">
                    <div className="msg-info-file__icon">{cfg.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="msg-info-file__name">{att.name}</div>
                      <div className="msg-info-file__size">{att.size}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>⬇</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stats */}
          <div className="msg-info-panel__section">
            <div className="msg-info-section-title">Conversation Stats</div>
            {[
              { label: "Total Messages", val: activeConvo.messages.length },
              { label: "Attachments", val: allAttachments.length },
              {
                label: "Type",
                val:
                  activeConvo.type === "direct"
                    ? "Direct"
                    : activeConvo.type === "group"
                    ? "Group"
                    : "Channel"
              },
              { label: "Pinned", val: activeConvo.pinned ? "Yes" : "No" }
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid #F9FAFB",
                  fontSize: 12.5
                }}
              >
                <span style={{ color: "#9CA3AF" }}>{s.label}</span>
                <span style={{ fontWeight: 600, color: "#374151" }}>
                  {s.val}
                </span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="msg-info-panel__section">
            <div className="msg-info-section-title">Actions</div>
            {[
              "📌 Pin conversation",
              "🔇 Mute notifications",
              "🗑 Clear history",
              "⛔ Block"
            ].map((a) => (
              <div
                key={a}
                style={{
                  padding: "8px 6px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#374151",
                  transition: "background 0.15s"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F3F4F6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPageComponent;
