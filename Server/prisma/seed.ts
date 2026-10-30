import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const EVENT_START = new Date('2026-09-18T09:00:00.000Z');

function dayOffset(day: number, hour: number, minute = 0) {
  const d = new Date(EVENT_START);
  d.setUTCDate(d.getUTCDate() + day);
  d.setUTCHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  await prisma.agendaItem.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.sessionSpeaker.deleteMany();
  await prisma.session.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.track.deleteMany();
  await prisma.room.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.venueInfo.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('nexus2026', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexusconf.dev',
      passwordHash,
      name: 'NEXUS Admin',
      role: Role.ADMIN,
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@nexusconf.dev',
      passwordHash,
      name: 'Door Staff',
      role: Role.STAFF,
    },
  });

  const attendee = await prisma.user.create({
    data: {
      email: 'amitav@nexusconf.dev',
      passwordHash,
      name: 'Amitav Attendee',
      role: Role.ATTENDEE,
      company: 'Cursor Labs',
    },
  });

  const tracks = await Promise.all([
    prisma.track.create({ data: { name: 'Design Systems', color: '#B6FF3B' } }),
    prisma.track.create({ data: { name: 'Product Craft', color: '#FF4AD2' } }),
    prisma.track.create({ data: { name: 'AI & Interfaces', color: '#7C5CFF' } }),
    prisma.track.create({ data: { name: 'Mainstage', color: '#FFB020' } }),
  ]);

  const rooms = await Promise.all([
    prisma.room.create({ data: { name: 'Nova Hall', capacity: 800 } }),
    prisma.room.create({ data: { name: 'Orbit Room', capacity: 220 } }),
    prisma.room.create({ data: { name: 'Pulse Studio', capacity: 120 } }),
    prisma.room.create({ data: { name: 'Signal Lab', capacity: 90 } }),
  ]);

  const speakersData = [
    {
      slug: 'maya-chen',
      name: 'Maya Chen',
      title: 'VP of Design',
      company: 'Figma',
      bio: 'Maya leads product systems that scale from startup chaos to enterprise clarity. She thinks in type ramps and motion curves.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop',
      socials: { x: 'mayachen', linkedin: 'mayachen' },
    },
    {
      slug: 'jordan-ellis',
      name: 'Jordan Ellis',
      title: 'Creative Technologist',
      company: 'Adobe',
      bio: 'Jordan builds interactive installations and web experiences that feel like venues, not pages.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
      socials: { x: 'jordanellis' },
    },
    {
      slug: 'priya-nair',
      name: 'Priya Nair',
      title: 'Head of Product',
      company: 'Linear',
      bio: 'Priya ships tools people love using every day. Obsessed with velocity without sacrificing craft.',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1000&fit=crop',
      socials: { linkedin: 'priyanair' },
    },
    {
      slug: 'leo-okafor',
      name: 'Leo Okafor',
      title: 'Principal Engineer',
      company: 'Vercel',
      bio: 'Leo designs frameworks for the edge. Performance is a feature, not a checklist.',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop',
      socials: { x: 'leookafor', github: 'leookafor' },
    },
    {
      slug: 'sofia-brandt',
      name: 'Sofia Brandt',
      title: 'Founder',
      company: 'Signal Studio',
      bio: 'Sofia runs a boutique studio crafting brand systems for festivals and cultural institutions.',
      photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop',
      socials: { x: 'sofiabrandt' },
    },
    {
      slug: 'kai-morales',
      name: 'Kai Morales',
      title: 'AI Research Lead',
      company: 'Anthropic',
      bio: 'Kai explores how generative systems collaborate with designers without flattening taste.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop',
      socials: { x: 'kaimorales' },
    },
    {
      slug: 'hana-park',
      name: 'Hana Park',
      title: 'Motion Director',
      company: 'Buck',
      bio: 'Hana turns brand language into kinetic identity — scroll, hover, and stage.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop',
      socials: { x: 'hanapark' },
    },
    {
      slug: 'diego-santos',
      name: 'Diego Santos',
      title: 'Staff Designer',
      company: 'Stripe',
      bio: 'Diego crafts interfaces where money, trust, and clarity meet. Systems thinker, type nerd.',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop',
      socials: { linkedin: 'diegosantos' },
    },
  ];

  const speakers = [];
  for (let i = 0; i < speakersData.length; i++) {
    const s = speakersData[i];
    speakers.push(
      await prisma.speaker.create({
        data: { ...s, sortOrder: i },
      }),
    );
  }

  const sessionsSpec = [
    {
      slug: 'opening-keynote',
      title: 'Opening Keynote: Reshape the Stack',
      abstract: 'Three days that reshape how you build — a manifesto for craft, systems, and velocity.',
      day: 0,
      start: 9,
      end: 10,
      track: 3,
      room: 0,
      level: 'All',
      speakers: [0, 2],
    },
    {
      slug: 'type-as-infrastructure',
      title: 'Type as Infrastructure',
      abstract: 'How display systems become product language — from festival posters to design tokens.',
      day: 0,
      start: 10,
      end: 11,
      track: 0,
      room: 1,
      level: 'Intermediate',
      speakers: [0],
    },
    {
      slug: 'edge-first-interfaces',
      title: 'Edge-First Interfaces',
      abstract: 'Shipping UI at the edge without sacrificing interaction richness.',
      day: 0,
      start: 11,
      end: 12,
      track: 2,
      room: 2,
      level: 'Advanced',
      speakers: [3],
    },
    {
      slug: 'product-taste-workshop',
      title: 'Workshop: Product Taste Under Pressure',
      abstract: 'A hands-on critique lab for shipping decisions that still feel intentional.',
      day: 0,
      start: 13,
      end: 15,
      track: 1,
      room: 3,
      level: 'Intermediate',
      speakers: [2],
    },
    {
      slug: 'motion-systems',
      title: 'Motion Systems That Scale',
      abstract: 'Building kinetic identity kits your whole team can reuse without killing the vibe.',
      day: 1,
      start: 9,
      end: 10,
      track: 0,
      room: 1,
      level: 'Intermediate',
      speakers: [6],
    },
    {
      slug: 'generative-collaboration',
      title: 'Generative Collaboration Without Flat Taste',
      abstract: 'Patterns for AI-assisted design that preserve authorship and judgment.',
      day: 1,
      start: 10,
      end: 11,
      track: 2,
      room: 0,
      level: 'All',
      speakers: [5, 1],
    },
    {
      slug: 'money-ui-trust',
      title: 'Money, UI, Trust',
      abstract: 'Designing financial interfaces where clarity is the product.',
      day: 1,
      start: 11,
      end: 12,
      track: 1,
      room: 2,
      level: 'Intermediate',
      speakers: [7],
    },
    {
      slug: 'installation-web',
      title: 'When the Web Becomes a Venue',
      abstract: 'Interactive installations, WebGL accents, and gestures that feel physical.',
      day: 1,
      start: 14,
      end: 15,
      track: 3,
      room: 0,
      level: 'Advanced',
      speakers: [1, 4],
    },
    {
      slug: 'brand-systems-culture',
      title: 'Brand Systems for Culture',
      abstract: 'How cultural institutions and festivals stay bold without becoming noise.',
      day: 2,
      start: 9,
      end: 10,
      track: 0,
      room: 1,
      level: 'All',
      speakers: [4],
    },
    {
      slug: 'closing-circle',
      title: 'Closing Circle: What We Ship Next',
      abstract: 'A collective look at the next decade of building — open Q&A with the lineup.',
      day: 2,
      start: 15,
      end: 16,
      track: 3,
      room: 0,
      level: 'All',
      speakers: [0, 2, 5, 3],
    },
  ];

  for (const spec of sessionsSpec) {
    const session = await prisma.session.create({
      data: {
        slug: spec.slug,
        title: spec.title,
        abstract: spec.abstract,
        startsAt: dayOffset(spec.day, spec.start),
        endsAt: dayOffset(spec.day, spec.end),
        trackId: tracks[spec.track].id,
        roomId: rooms[spec.room].id,
        level: spec.level,
      },
    });
    for (const si of spec.speakers) {
      await prisma.sessionSpeaker.create({
        data: { sessionId: session.id, speakerId: speakers[si].id },
      });
    }
  }

  const early = await prisma.ticketType.create({
    data: {
      name: 'Early Bird',
      description: 'Full 3-day access at the founding rate. Limited run.',
      price: 299,
      capacity: 200,
      salesStart: new Date('2026-01-01'),
      salesEnd: new Date('2026-05-01'),
      perks: ['All sessions', 'Community lounge', 'Digital swag'],
      sortOrder: 0,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: 'Regular',
      description: 'Standard conference pass for all three days.',
      price: 449,
      capacity: 500,
      salesStart: new Date('2026-05-01'),
      perks: ['All sessions', 'Sponsor expo', 'Networking night'],
      sortOrder: 1,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: 'VIP',
      description: 'Front-row seating, speaker dinner, and green-room access.',
      price: 899,
      capacity: 80,
      perks: [
        'Everything in Regular',
        'Speaker dinner',
        'VIP lounge',
        'Priority seating',
      ],
      sortOrder: 2,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: 'Remote',
      description: 'Livestream + session archive for distributed teams.',
      price: 149,
      capacity: 2000,
      perks: ['Livestream all stages', '30-day replay', 'Slack community'],
      sortOrder: 3,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketTypeId: early.id,
      userId: attendee.id,
      email: attendee.email,
      name: attendee.name,
      status: 'PAID',
    },
  });

  const sponsors = [
    { name: 'Vercel', tier: 'Platinum', logoUrl: '/sponsors/vercel.svg', url: 'https://vercel.com', sortOrder: 0 },
    { name: 'Figma', tier: 'Platinum', logoUrl: '/sponsors/figma.svg', url: 'https://figma.com', sortOrder: 1 },
    { name: 'Linear', tier: 'Gold', logoUrl: '/sponsors/linear.svg', url: 'https://linear.app', sortOrder: 2 },
    { name: 'Stripe', tier: 'Gold', logoUrl: '/sponsors/stripe.svg', url: 'https://stripe.com', sortOrder: 3 },
    { name: 'Adobe', tier: 'Silver', logoUrl: '/sponsors/adobe.svg', url: 'https://adobe.com', sortOrder: 4 },
    { name: 'Cursor', tier: 'Silver', logoUrl: '/sponsors/cursor.svg', url: 'https://cursor.com', sortOrder: 5 },
  ];

  for (const s of sponsors) {
    await prisma.sponsor.create({ data: s });
  }

  await prisma.venueInfo.create({
    data: {
      name: 'NEXUS Arena · Dhaka',
      address: 'Plot 12, Gulshan Avenue, Dhaka 1212, Bangladesh',
      lat: 23.7808,
      lng: 90.4167,
      description:
        'A purpose-built festival venue with three stages, open courtyards, and night markets wrapping the hall.',
      hotelTips:
        'Stay at The Westin Gulshan or Amari Dhaka — both within 10 minutes. Use code NEXUS26 for 15% off.',
    },
  });

  console.log('Seeded NEXUS Conf 2026');
  console.log({ admin: admin.email, staff: staff.email, attendee: attendee.email, password: 'nexus2026' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
