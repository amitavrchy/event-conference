import axios from "axios";
import type {
  AgendaResponse,
  AuthResponse,
  Session,
  Speaker,
  Sponsor,
  Ticket,
  TicketType,
  Track,
  User,
  VenueInfo,
} from "./types";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined" ? "/backend" : "http://localhost:4000/api");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const authApi = {
  me: () => api.get<User>("/auth/me").then((r) => r.data),
  register: (data: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
};

export const speakersApi = {
  list: () => api.get<Speaker[]>("/speakers").then((r) => r.data),
  bySlug: (slug: string) =>
    api.get<Speaker>(`/speakers/${slug}`).then((r) => r.data),
};

export const sessionsApi = {
  list: () => api.get<Session[]>("/sessions").then((r) => r.data),
  bySlug: (slug: string) =>
    api.get<Session>(`/sessions/${slug}`).then((r) => r.data),
  schedule: (day?: string) =>
    api
      .get<Session[]>("/schedule", { params: day ? { day } : undefined })
      .then((r) => r.data),
  tracks: () => api.get<Track[]>("/tracks").then((r) => r.data),
};

export type CheckoutResponse = {
  mode: "stripe" | "mock";
  checkoutUrl: string | null;
  ticket: Ticket;
};

export const ticketsApi = {
  types: () => api.get<TicketType[]>("/ticket-types").then((r) => r.data),
  checkout: (data: { ticketTypeId: string; email: string; name: string }) =>
    api.post<CheckoutResponse>("/tickets/checkout", data).then((r) => r.data),
  confirm: (sessionId: string) =>
    api
      .get<Ticket>("/tickets/confirm", { params: { session_id: sessionId } })
      .then((r) => r.data),
  me: () => api.get<Ticket[]>("/tickets/me").then((r) => r.data),
  byCode: (code: string) =>
    api.get<Ticket>(`/tickets/${code}`).then((r) => r.data),
  qrPayload: (code: string) =>
    api
      .get<{ payload: string }>(`/tickets/${code}/qr-payload`)
      .then((r) => r.data),
};

export const agendaApi = {
  get: () => api.get<AgendaResponse>("/agenda").then((r) => r.data),
  add: (sessionId: string) =>
    api.post<{ warning?: string }>(`/agenda/${sessionId}`).then((r) => r.data),
  remove: (sessionId: string) =>
    api.delete(`/agenda/${sessionId}`).then((r) => r.data),
};

export const sponsorsApi = {
  list: () => api.get<Sponsor[]>("/sponsors").then((r) => r.data),
};

export const venueApi = {
  get: () => api.get<VenueInfo>("/venue").then((r) => r.data),
};

export const checkInApi = {
  checkIn: (code: string, payload?: string) =>
    api
      .post<Ticket>(`/check-in/${code}`, payload ? { payload } : {})
      .then((r) => r.data),
};
