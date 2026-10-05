// ============================================================
// WILLOW GARTH — Centralized content & configuration
// Update business information here.
// ============================================================

export const site = {
  name: "Willow Garth Country Park",
  shortName: "Willow Garth",
  tagline: "Time to relax & unwind",
  strapline: "get Powered-up by Nature",
  complex: "3 Lake, 6 Acre Complex",
  url: "https://willowgarthcountrypark.co.uk",
};

export const contact = {
  address: {
    line1: "Marsh Lane",
    line2: "Arksey",
    city: "Doncaster",
    postcode: "DN5 0SH",
    country: "United Kingdom",
    full: "Marsh Lane, Arksey, Doncaster, DN5 0SH, United Kingdom",
  },
  phone: "+44 7951 138579",
  phoneHref: "tel:+447951138579",
  whatsappHref: "https://wa.me/447951138579",
  general: {
    name: "Glen Monks",
    email: "greenheartdoncaster@gmail.com",
    emailHref: "mailto:greenheartdoncaster@gmail.com",
  },
  events: {
    name: "Events Admin",
    email: "gmsoulfood@gmail.com",
    emailHref: "mailto:gmsoulfood@gmail.com",
  },
  mapsUrl: "https://maps.app.goo.gl/VbiN2McQsLq2Cx6o6",
  what3words: "action.take.part",
  what3wordsUrl: "https://what3words.com/action.take.part",
  defibrillator: {
    distance: "251 metres",
    name: "Cooke Almshouses",
    address: "1–6 High Street, Doncaster, DN5 0SE",
  },
};

export const booking = {
  fishing: "https://swimbooker.com/fishery/13681",
  saunaDip: "/sentinal",
  waterDipOnly: "/book/swim",
  sentinelNote:
    "ALL USERS of our sauna and dip lake will be required to complete an online health & safety form through our partner SENTINAL.",
};

export type Lake = {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  image: string;
  species?: string[];
  features: string[];
  status?: "open" | "renovation";
  statusNote?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

export const lakes: Lake[] = [
  {
    slug: "willow",
    number: "01",
    name: "Willow Lake",
    tagline: "Pleasure Fishing / Matches / Education",
    category: "Coarse Fishing",
    description:
      "Willow is our match lake, home to Carp, Tench, Bream, Ide, Roach, Rudd and Perch. A welcoming water for pleasure anglers, matches and education sessions — with night fishing, motorhome pitches and wild camping available to make it a night to remember.",
    image: "/images/willow-lake-full.jpg",
    species: ["Carp", "Tench", "Bream", "Ide", "Roach", "Rudd", "Perch"],
    features: [
      "Match & pleasure fishing",
      "Night fishing permitted",
      "Motorhome pitches",
      "Wild camping",
      "Education & coaching sessions",
    ],
    status: "open",
    bookingUrl: booking.fishing,
    bookingLabel: "Make a Fishing Booking",
  },
  {
    slug: "oak",
    number: "02",
    name: "Oak Lake",
    tagline: "Carp & Predator Lake",
    category: "Specimen Carp & Pike",
    description:
      "Oak Lake is our specimen water, stocked with Common, Leather and Mirror carp up to 30lb and Pike up to 28lb. A dedicated destination for carp and predator anglers seeking quality specimens.",
    image: "/images/boat-bg.jpg",
    species: ["Common carp", "Leather carp", "Mirror carp", "Pike"],
    features: [
      "Specimen carp up to 30lb",
      "Pike up to 28lb",
      "Predator fishing",
    ],
    status: "renovation",
    statusNote: "Currently under renovation — until November 2026.",
    bookingUrl: booking.fishing,
    bookingLabel: "Make a Booking on Swimbooker",
  },
  {
    slug: "pine",
    number: "03",
    name: "Pine Lake",
    tagline: "Sauna & Plunge Lake",
    category: "Wellness & Cold Water",
    description:
      "Chill out in a wood-fired sauna, then plunge into a natural dip lake. In recent years the benefits of cold-water plunging have become well known and evidenced. We provide a safe and welcoming experience with membership options available. You can also hire our Geo-dome and add a wood-fired sauna & plunge to your group booking.",
    image: "/images/sauna-whatsapp.jpeg",
    features: [
      "Wood-fired sauna",
      "Natural dip lake & cold-water plunge",
      "Geo-dome hire",
      "Single tickets & group bookings",
      "Contrast therapy coaches on request",
    ],
    status: "open",
    bookingUrl: booking.saunaDip,
    bookingLabel: "Make a Safe Booking",
  },
];

export type ExperienceHighlight = {
  title: string;
  detail: string;
};

export type Experience = {
  slug: string;
  name: string;
  accent: string;
  category: string;
  description: string;
  image: string;
  gallery: string[];
  intro: string[];
  highlights: ExperienceHighlight[];
  note?: string;
  cta: string;
  href: string;
  bookingUrl?: string;
  bookingLabel?: string;
  bookingExternal?: boolean;
  inHouseHref?: string;
  inHouseLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

export const experiences: Experience[] = [
  {
    slug: "fishing",
    name: "Fishing",
    accent: "the catch.",
    category: "Coarse · Carp · Predator",
    description:
      "Three distinct lakes for pleasure, match and specimen angling — from coarse fishing at Willow to 30lb carp at Oak.",
    image: "/images/fishing-home.jpg",
    gallery: ["/images/fishing-home.jpg", "/images/carp-night.jpg", "/images/carp-800.jpg"],
    intro: [
      "Angling is at the heart of Willow Garth. Our six acres hold three distinct waters, so whether you are chasing a quiet day of silvers, a net of match-winning bream or a 30lb specimen carp, there is a swim with your name on it.",
      "All fishing is booked through Swimbooker, where you can choose your lake and swim. Night fishing is permitted on Willow Lake, with motorhome pitches and wild camping available to make a night of it.",
    ],
    highlights: [
      {
        title: "Willow Lake",
        detail:
          "Carp, Tench, Bream, Ide, Roach, Rudd and Perch — a welcoming water for pleasure angling, matches and education sessions.",
      },
      {
        title: "Oak Lake",
        detail:
          "Our specimen water: Common, Leather and Mirror carp up to 30lb, plus Pike up to 28lb for predator anglers.",
      },
      {
        title: "Fish care first",
        detail:
          "Barbless hooks, unhooking mats and nets, and antiseptic application — our codes protect fish and habitat.",
      },
      {
        title: "Stay the night",
        detail:
          "Night fishing on Willow, wild camping and motorhome pitches steps from the water.",
      },
    ],
    note: "Oak Lake is currently under renovation until November 2026 — Willow and Pine remain open.",
    cta: "Explore Fishing",
    href: "/experiences/fishing",
    bookingUrl: booking.fishing,
    bookingLabel: "Book Fishing on Swimbooker",
    bookingExternal: true,
  },
  {
    slug: "sauna-dip",
    name: "Sauna & Dip",
    accent: "the plunge.",
    category: "Wellness · Cold Water",
    description:
      "Wood-fired sauna and a natural plunge lake. A safe, evidence-backed contrast therapy experience.",
    image: "/images/sauna-home.jpg",
    gallery: [
      "/images/sauna-whatsapp.jpeg",
      "/images/cold-swim.jpg",
      "/images/wom-swim.jpg",
    ],
    intro: [
      "Chill out in a wood-fired sauna, then plunge into a natural dip lake. In recent years the benefits of cold-water plunging have become well known and evidenced — we provide a safe and welcoming environment to experience them.",
      "Sessions are limited to six people, with buoyancy floats, safety whistles, high-viz ropes and life rings provided. Membership options are available, and you can also hire our Geo-dome and add a wood-fired sauna and plunge to your group booking.",
    ],
    highlights: [
      {
        title: "Wood-fired sauna",
        detail:
          "A traditional wooden sauna warmed by a wood burner, metres from the lake.",
      },
      {
        title: "Natural dip lake",
        detail:
          "Cold-water contrast therapy with trained coaches available on request.",
      },
      {
        title: "Six at a time",
        detail:
          "Limited numbers keep every session calm, personal and properly supervised.",
      },
      {
        title: "Safety equipment",
        detail:
          "Buoyancy floats and whistles must be worn; emergency blankets, alarm and blood pressure monitor on site.",
      },
    ],
    note: "ALL USERS must complete the online health & safety form through our partner SENTINAL before visiting. Strictly no children under 16 at the sauna & dip lake.",
    cta: "Book Sauna & Dip",
    href: "/experiences/sauna-dip",
    bookingUrl: booking.saunaDip,
    bookingLabel: "SENTINAL Form",
    bookingExternal: false,
    inHouseHref: "/book/sauna",
    inHouseLabel: "Book Now (In-house)",
  },
  {
    slug: "camping",
    name: "Camping",
    accent: "the stillness.",
    category: "Wild · Motorhome",
    description:
      "Make it a night to remember with wild camping and motorhome pitches beside the lakes.",
    image: "/images/willow-peg.jpg",
    gallery: [
      "/images/willow-peg.jpg",
      "/images/camp-fire.jpg",
      "/images/fire-pit.jpg",
    ],
    intro: [
      "Make it a night to remember. Willow Lake welcomes night fishing, wild camping and motorhome pitches just a short cast from the water — wake to mist over the lake and the first swim of the day.",
      "Groups can take over the Geo-dome and add a wood-fired sauna and cold-water plunge to the booking. It is off-grid, back-to-nature hospitality for anglers, dippers and gatherings.",
    ],
    highlights: [
      {
        title: "Wild camping",
        detail:
          "Pitch among the reeds beside Willow Lake — simple, quiet and unpowered.",
      },
      {
        title: "Motorhome pitches",
        detail:
          "Hard-standing pitches for motorhomes, paired with night fishing on Willow.",
      },
      {
        title: "Night fishing",
        detail:
          "Evening and dawn sessions permitted for anglers staying on site.",
      },
      {
        title: "Group add-ons",
        detail:
          "Hire the Geo-dome and add wood-fired sauna and plunge sessions to group stays.",
      },
    ],
    cta: "Discover Camping",
    href: "/experiences/camping",
    bookingUrl: "/contact",
    bookingLabel: "Plan Your Stay",
  },
  {
    slug: "events",
    name: "Events",
    accent: "the gathering.",
    category: "Retreats · Workshops",
    description:
      "Host your own retreat, workshop or function in our off-grid ecological learning centre and Geo-dome.",
    image: "/images/events-card.jpg",
    gallery: [
      "/images/events-hero.jpg",
      "/images/dome-space.jpg",
      "/images/kids-session.jpg",
    ],
    intro: [
      "Our ecological learning centre, Geo-dome and off-grid classroom host retreats, workshops, coaching and community gatherings — managed by Greenheart Community Group, who provide life skills that help others to learn, share and grow.",
    ],
    highlights: [
      {
        title: "Volunteer days",
        detail:
          "Meet new people, gain experience and a sense of purpose while improving the site.",
      },
      {
        title: "Learning circles",
        detail:
          "Environment and well-being gatherings in the off-grid classroom.",
      },
      {
        title: "Life skills",
        detail:
          "Tailored services building confidence, well-being and job-related skills.",
      },
      {
        title: "Private functions",
        detail:
          "Geo-dome hire with optional wood-fired sauna, plunge lake and catering add-ons.",
      },
    ],
    cta: "View Events",
    href: "/events",
  },
];

export const nav = [
  { label: "Experiences", href: "/experiences" },
  { label: "Lakes", href: "/lakes" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Safety", href: "/health-safety" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = [
  {
    heading: "Experiences",
    links: [
      { label: "Fishing", href: "/experiences/fishing" },
      { label: "Sauna & Dip", href: "/experiences/sauna-dip" },
      { label: "Camping", href: "/experiences/camping" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "The Lakes", href: "/lakes" },
      { label: "About Us", href: "/about" },
      { label: "Health & Safety", href: "/health-safety" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Book",
    links: [
      { label: "Fishing Booking", href: booking.fishing },
      { label: "Sauna & Dip Booking", href: booking.saunaDip },
      { label: "Water Dip Only", href: booking.waterDipOnly },
      { label: "Book Your Experience", href: "/book" },
    ],
  },
];
