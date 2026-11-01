export type Role = "ATTENDEE" | "SPEAKER" | "ADMIN" | "STAFF";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  company?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type Track = {
  id: string;
  name: string;
  color: string;
};

export type Room = {
  id: string;
  name: string;
  capacity?: number | null;
};

export type Speaker = {
  id: string;
  slug: string;
  name: string;
  title: string;
  company?: string | null;
  bio: string;
  photoUrl?: string | null;
  socials?: Record<string, string> | null;
  sortOrder?: number;
  sessionCount?: number;
  sessions?: Session[];
};

export type SessionSpeaker = {
  speaker: Speaker;
};

export type Session = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  startsAt: string;
  endsAt: string;
  level?: string | null;
  track?: Track | null;
  room?: Room | null;
  speakers?: SessionSpeaker[] | Speaker[];
};

export type TicketType = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  salesStart?: string | null;
  salesEnd?: string | null;
  perks: string[];
  sortOrder?: number;
};

export type TicketStatus = "PENDING" | "PAID" | "CHECKED_IN" | "REFUNDED";

export type Ticket = {
  id: string;
  code: string;
  email: string;
  name: string;
  status: TicketStatus;
  checkedInAt?: string | null;
  createdAt?: string;
  ticketType?: TicketType;
  ticketTypeId?: string;
};

export type Sponsor = {
  id: string;
  name: string;
  tier: string;
  logoUrl: string;
  url?: string | null;
  sortOrder?: number;
};

export type VenueInfo = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description?: string | null;
  hotelTips?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type AgendaResponse = {
  sessionIds: string[];
  sessions: Session[];
};
