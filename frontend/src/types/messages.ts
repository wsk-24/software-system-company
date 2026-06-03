export type MessageStatus = "sent" | "delivered" | "read";
export type ConvoType = "direct" | "group" | "channel";
export type PresenceStatus = "online" | "away" | "busy" | "offline";
export type ReactionEmoji = "👍" | "❤️" | "😂" | "🔥" | "👏" | "😮";

export interface Reaction {
  emoji: ReactionEmoji;
  count: number;
  byMe: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: "image" | "pdf" | "doc" | "zip" | "code" | "other";
  url?: string;
}

export interface Message {
  id: string;
  convoId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  reactions: Reaction[];
  attachments: Attachment[];
  replyTo?: string; // message id
  edited?: boolean;
  system?: boolean; // system message e.g. "James joined"
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  role?: string;
  presence: PresenceStatus;
}

export interface Conversation {
  id: string;
  type: ConvoType;
  name?: string; // for group/channel
  description?: string;
  participants: Participant[];
  messages: Message[];
  unread: number;
  pinned: boolean;
  muted: boolean;
  lastActivity: string;
  avatar?: string;
  avatarColor?: string;
  topic?: string;
}
