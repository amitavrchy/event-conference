import { Hero } from "@/components/home/Hero";
import { Countdown } from "@/components/home/Countdown";
import { SpeakersTeaser } from "@/components/home/SpeakersTeaser";
import { Themes } from "@/components/home/Themes";
import { TicketCTA } from "@/components/home/TicketCTA";
import { SponsorsMarquee } from "@/components/home/SponsorsMarquee";
import { VenueTeaser } from "@/components/home/VenueTeaser";
import { FAQ } from "@/components/home/FAQ";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "NEXUS Conf 2026",
  description: "Three days that reshape how you build. Design×tech conference.",
  startDate: "2026-09-18T09:00:00.000Z",
  endDate: "2026-09-20T18:00:00.000Z",
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "NEXUS Arena · Dhaka",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 12, Gulshan Avenue",
      addressLocality: "Dhaka",
      postalCode: "1212",
      addressCountry: "BD",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "NEXUS Conf",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Countdown />
      <SpeakersTeaser />
      <Themes />
      <TicketCTA />
      <SponsorsMarquee />
      <VenueTeaser />
      <FAQ />
    </>
  );
}
