# Event / Conference Website — Project Build Spec (Agent-Ready)

> Stack: Next.js + Redux + RQ + RHF/zod + framer-motion + **gsap, date-fns, qrcode.react, embla**. NestJS + Prisma + JWT. Optional: `@radix-ui/react-tabs`, `leaflet`, `ics` file gen lib.

---

## 1. Vision & Audience

**Vision:** Flagship site for **“NEXUS Conf 2026”** — a design×tech conference. Bold festival energy (FlowFest / SHAPESHIFT / Design Bomb) with practical attendee tools: schedule builder, ticket checkout stub, speaker pages, venue map, live QR check-in for staff.

**Audience:** Attendees, speakers, sponsors, press.

**Promise:** “Three days that reshape how you build.”

---

## 2. References

| Site | Steal | Link |
|------|-------|------|
| FlowFest 2025 | Warm retro palette, bold type, microinteractions — SOTD | https://www.awwwards.com/sites/flowfest-2025 |
| Wild Week Athens | Gestures, filters, WebGL accents — SOTD | https://www.awwwards.com/sites/wild-week-athens |
| Design Bomb Festival | Dark editorial, tickets, speakers, transitions | https://www.awwwards.com/sites/design-bomb-festival |
| SHAPESHIFT Festival 2026 | Preloader, lineup gallery, scroll modals | https://www.awwwards.com/sites/shapeshift-festival-2026 |
| Awwwards Events | Category | https://www.awwwards.com/websites/events/ |

---

## 3. Design System

### Color
| Token | Hex |
|-------|-----|
| `--bg` | `#0E0B16` |
| `--surface` | `#1A1527` |
| `--neon` | `#B6FF3B` |
| `--magenta` | `#FF4AD2` |
| `--violet` | `#7C5CFF` |
| `--text` | `#F7F5FF` |
| `--muted` | `#A39BB8` |
| `--warn` | `#FFB020` |

### Typography
- Display: `Archivo Black` or `Clash Display` style → use `Archivo` + heavy weights / `Oswald` for festival punch
- Body: `Inter`
- Schedule times: `JetBrains Mono`

### Motion
- Preloader 1.2s logo morph
- Speaker card hover magnetic 200ms
- Schedule now-line pulse
- Page transitions opacity 250ms
- Embla speakers / sponsors infinite

---

## 4. Sitemap

### `/`
Countdown; hero; speakers teaser; themes; ticket CTA; sponsors; venue teaser; FAQ.

### `/speakers` · `/speakers/[slug]`
### `/schedule`
Day tabs; tracks filter; session drawers; “Add to my schedule” (auth); export .ics stretch.

### `/tickets`
Tiers Early Bird / Regular / VIP / Remote; FAQ; checkout form.

### `/venue` map + hotels
### `/sponsors` packages
### `/register` attendee profile
### `/ticket/pass` QR code (`qrcode.react`) for purchased ticket
### `/live` stretch: current sessions
### Admin: sessions CRUD, check-in scan (QR payload validate), attendees export

**Signature:** Live schedule “happening now”; personal agenda; ticket QR; bold festival motion without sacrificing readability.

---

## 5. Features

### MVP
- Speakers, sessions, tracks, venues rooms
- Ticket types + order + QR token
- My schedule
- Sponsor list
- Admin check-in endpoint
- Countdown + SEO

### Stretch
- Seat maps
- Live streaming embeds
- Networking matcher
- Multi-language
- Push notifications

---

## 6. Frontend Architecture

```
components/schedule/ (DayTabs, SessionCard, TrackFilter, NowLine)
components/tickets/ (TierCards, CheckoutForm, TicketPass)
features/agenda/agendaSlice.ts // local session ids optimistic
features/auth/authSlice.ts
```

---

## 7. Backend Prisma

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

enum Role { ATTENDEE SPEAKER ADMIN STAFF }
enum TicketStatus { PENDING PAID CHECKED_IN REFUNDED }

model User {
  id String @id @default(cuid())
  email String @unique
  passwordHash String
  name String
  role Role @default(ATTENDEE)
  company String?
  bio String?
  avatarUrl String?
  speaker Speaker?
  tickets Ticket[]
  agenda AgendaItem[]
}

model Speaker {
  id String @id @default(cuid())
  userId String? @unique
  user User? @relation(fields: [userId], references: [id])
  slug String @unique
  name String
  title String
  company String?
  bio String
  photoUrl String?
  socials Json?
  sessions SessionSpeaker[]
}

model Track {
  id String @id @default(cuid())
  name String
  color String
  sessions Session[]
}

model Room {
  id String @id @default(cuid())
  name String
  capacity Int?
  sessions Session[]
}

model Session {
  id String @id @default(cuid())
  slug String @unique
  title String
  abstract String
  startsAt DateTime
  endsAt DateTime
  trackId String?
  track Track? @relation(fields: [trackId], references: [id])
  roomId String?
  room Room? @relation(fields: [roomId], references: [id])
  level String?
  speakers SessionSpeaker[]
  agendaItems AgendaItem[]
}

model SessionSpeaker {
  sessionId String
  speakerId String
  session Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  speaker Speaker @relation(fields: [speakerId], references: [id], onDelete: Cascade)
  @@id([sessionId, speakerId])
}

model TicketType {
  id String @id @default(cuid())
  name String
  description String
  price Decimal @db.Decimal(10,2)
  capacity Int
  salesStart DateTime?
  salesEnd DateTime?
  perks String[]
  tickets Ticket[]
}

model Ticket {
  id String @id @default(cuid())
  code String @unique @default(cuid())
  ticketTypeId String
  ticketType TicketType @relation(fields: [ticketTypeId], references: [id])
  userId String?
  user User? @relation(fields: [userId], references: [id])
  email String
  name String
  status TicketStatus @default(PENDING)
  checkedInAt DateTime?
  createdAt DateTime @default(now())
}

model AgendaItem {
  id String @id @default(cuid())
  userId String
  sessionId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  session Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  @@unique([userId, sessionId])
}

model Sponsor {
  id String @id @default(cuid())
  name String
  tier String
  logoUrl String
  url String?
  sortOrder Int @default(0)
}

model VenueInfo {
  id String @id @default(cuid())
  name String
  address String
  lat Float
  lng Float
  description String?
  hotelTips String?
}
```

### Endpoints
| Method | Path | Auth |
|--------|------|------|
| GET | `/speakers` `/sessions` `/schedule?day=` | public |
| POST | `/tickets/checkout` | public/JWT | creates PENDING→PAID mock |
| GET | `/tickets/me` | JWT |
| GET | `/tickets/:code/qr-payload` | owner/staff |
| POST | `/check-in/:code` | STAFF/ADMIN |
| POST/DELETE | `/agenda/:sessionId` | JWT |
| CRUD | admin resources | ADMIN |

QR payload: signed JWT or HMAC of ticket code (document secret).

---

## 8. Perf / A11y / SEO

- Schedule virtualize if >100 sessions
- Contrast neon on dark AA check
- Event JSON-LD with startDate/location
- Countdown aria-live polite once/minute max

---

## 9. Build Order

1. Seed conference data (speakers/sessions)
2. Schedule UI + filters
3. Speakers pages
4. Tickets + QR pass
5. Agenda auth
6. Staff check-in UI
7. Home festival motion
8. Sponsors/venue/SEO

## 10. Acceptance

- [ ] Schedule filters by day/track
- [ ] Paid mock ticket shows QR; staff check-in flips status
- [ ] Agenda persists per user
- [ ] Mobile schedule usable
- [ ] No overlapping session double-add warning (stretch OK as toast)
