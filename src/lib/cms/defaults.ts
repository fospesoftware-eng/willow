// ============================================================
// CMS DEFAULT CONTENT — single source of truth
// Mirrors the current hardcoded page copy. The public site renders
// CMS rows when present and falls back to these values otherwise,
// so the site can never break on missing/partial CMS data.
// ============================================================

export type CmsHero = {
  variant: "cinematic" | "split" | "solid";
  align?: "left" | "center";
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  chips: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  statValue: string;
  statLabel: string;
};

export type SeoFields = {
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
};

export type PageRecord = {
  slug: string;
  label: string;
  path: string;
  seo: SeoFields;
  content: Record<string, unknown>;
};

const blankHero = (p: Partial<CmsHero>): CmsHero => ({
  variant: "cinematic",
  align: "left",
  eyebrow: "",
  title: "",
  accent: "",
  subtitle: "",
  image: "",
  imageAlt: "",
  imagePosition: "",
  chips: [],
  ctaLabel: "",
  ctaHref: "",
  secondaryLabel: "",
  secondaryHref: "",
  statValue: "",
  statLabel: "",
  ...p,
});

// ---------------------------- HOME -----------------------------------------

const homeHero = {
  image: "/images/hero-aerial.jpg",
  imageAlt:
    "Aerial view of Willow Garth Country Park — three lakes, the Geo-dome and swims surrounded by woodland and fields near Doncaster",
  badge: "3 Lake, 6 Acre Complex",
  line1: "Time to relax",
  line2: "& unwind",
  subtitle:
    "Fishing · Sauna & Dip · Camping · Events — a countryside escape near Doncaster.",
  metaLeft: "Marsh Lane · Arksey · Doncaster",
  metaRight: "Six acres · Three lakes",
  tags: ["Coarse Fishing", "Specimen Carp", "Sauna & Dip", "Wild Camping"],
  ctaPrimaryLabel: "Book Your Experience",
  ctaPrimaryHref: "/book",
  ctaSecondaryLabel: "Explore the Lakes",
  ctaSecondaryHref: "/lakes",
  wordmark: "Willow Garth\nCountry Park",
};

const homeStatement = {
  eyebrow: "Willow Garth",
  ctaLabel: "Our Story",
  ctaHref: "/about",
  avatars: [
    "/images/fishing-home.jpg",
    "/images/sauna-home.jpg",
    "/images/willow-peg.jpg",
  ],
  avatarBadge: "3 Lakes",
  titleBefore: "We created a place where nature and comfort ",
  accent: "truly meet",
  titleAfter: ".",
  paragraph:
    "A 6-acre countryside destination with three distinct lakes — coarse fishing, specimen carp & predator, and a wood-fired sauna with a natural dip lake. Managed by Greenheart Community Group, it is also home to an ecological learning centre, a Geo-dome and off-grid spaces to learn, share and grow.",
};

const homeFeature = {
  image: "/images/willow-lake-full.jpg",
  imageAlt: "Willow Lake — green still water, grassy swims and woodland at Willow Garth",
  tag: "The Three Lakes",
  title: "Untouched nature,",
  accent: "perfect stillness.",
  caption:
    "Willow, Oak and Pine — three lakes set across six acres of South Yorkshire countryside, each with its own rhythm.",
  ctaLabel: "Explore the Lakes",
  ctaHref: "/lakes",
};

const homeCta = {
  image: "/images/fire-pit.jpg",
  eyebrow: "Book your experience",
  title: "Powered-up",
  accent: "by nature.",
  text:
    "Book fishing through Swimbooker, secure your sauna & dip session through our safety platform, or plan your own event.",
  primaryLabel: "Book Your Experience",
  primaryHref: "/book",
  secondaryLabel: "Chat with Willow Garth",
  secondaryHref: "https://wa.me/447951138579",
};

const homeFaq = {
  eyebrow: "Good to know",
  title1: "Frequently",
  title2: "asked",
  accent: "questions.",
  subtext:
    "Everything you need to know before you visit. More detail is on our Health & Safety page.",
  ctaLabel: "Read the Full Safety Guide",
  ctaHref: "/health-safety",
  items: [
    {
      q: "How do I book fishing at Willow Garth?",
      a: "Fishing at Willow and Oak lakes is booked through our Swimbooker platform — follow the Book Fishing links to choose your lake and swim.",
    },
    {
      q: "Do I need to complete a health & safety form for the sauna & dip?",
      a: "Yes. ALL USERS of our sauna and dip lake will be required to complete an online health & safety form through our partner SENTINAL. A Green Light health check is also required before usage.",
    },
    {
      q: "Is there an age limit for the sauna & dip lake?",
      a: "Strictly no children under 16 years old at Pine Lake. Buoyancy floats and safety whistles are provided and must be worn at all times.",
    },
    {
      q: "Can I stay overnight?",
      a: "Willow Lake offers night fishing, motorhome pitches and wild camping so you can make it a night to remember. Book your pitch through Swimbooker.",
    },
    {
      q: "Is Oak Lake currently available?",
      a: "Oak Lake is currently under renovation until November 2026. Willow Lake remains open for coarse and match fishing throughout.",
    },
    {
      q: "Is the site lifeguarded?",
      a: "Willow Garth is not lifeguarded. A first aider is always on site and full safety equipment is provided. If in doubt — leave it out.",
    },
  ],
};

// ---------------------------- ABOUT ----------------------------------------

const aboutHero = blankHero({
  eyebrow: "About Willow Garth",
  title: "Bringing you closer to",
  accent: "nature.",
  subtitle:
    "A 6-acre countryside destination managed by Greenheart Community Group — supporting local anglers and the community for generations.",
  image: "/images/about-hero.jpg",
  imageAlt: "A young angler fishing a tree-lined Willow Garth lake under a summer sky",
  chips: ["Established for the community", "Greenheart Community Group", "Arksey, Doncaster"],
  ctaLabel: "Discover the Lakes",
  ctaHref: "/lakes",
  secondaryLabel: "Read Safety Guide",
  secondaryHref: "/health-safety",
});

const aboutSections = {
  intro: {
    eyebrow: "Driven by nature",
    title: "Supporting local anglers",
    accent: "for generations.",
    paragraphs: [
      "Our home-reared carp have been specifically cultivated in a controlled pond environment since being C's (2 year old). With careful handling, we aim to bring them on to become high-weight, quality specimens as they grow year upon year.",
      "Managed by Greenheart Community Group, Willow Garth is also a place of learning — an ecological learning centre, Geo-dome and off-grid classroom host workshops, coaching and community events throughout the year.",
    ],
    image: "/images/classroom.jpg",
    imageAlt: "The off-grid classroom at Willow Garth's ecological learning centre",
  },
  rules: {
    eyebrow: "Our codes of conduct",
    title: "Fish & environmental",
    accent: "protection first.",
    text: "Our codes of conduct ensure fish and environmental protection, for a respectful angling experience.",
    items: [
      "Barbless hooks",
      "Unhooking mats & nets",
      "Antiseptic application",
      "Careful fish handling",
      "Zero litter tolerance",
      "Respect other anglers & wildlife",
    ],
  },
  facilities: {
    eyebrow: "On site",
    title: "Tackle, bait &",
    accent: "off-grid provision.",
    items: [
      {
        title: "New & Used Tackle",
        body: "We stock all the basics and a selection of used rods, reels, boxes and carry bags. If you forget something, chances are we will have it.",
      },
      {
        title: "Bait Store",
        body: "Our supplier, Copdock, has over 100 years of experience sourcing quality ingredients and has supplied excellent bait products for over 30 years.",
      },
      {
        title: "Snap Shack",
        body: "Currently stocking pop, crisps and general chocolate bars. We also stock local honey and our own chicken eggs when available.",
      },
      {
        title: "Toilets & Off-grid",
        body: "Willow Garth is totally off-grid. We have a septic waste-tank and a separate 'ladies only' flushing toilet.",
      },
    ],
  },
  local: {
    eyebrow: "Surrounding area",
    title: "Never far from",
    accent: "what you need.",
    text: "Connecting to 'on-grid' civilisation is just around the corner. Arksey Village hosts All Saints Church and a couple of traditional pubs: The Plough and The Old School Bistro. Adjoining villages provide supermarkets and shops for almost everything. Arksey village itself is just 3.4 miles from Doncaster.",
    highlights: [
      {
        name: "Trans Pennine Trail",
        desc: "The TPT passes through Bentley and can be accessed beside Willow Garth — flat, traffic-free paths for walkers, cyclists and families.",
      },
      {
        name: "Arksey Village",
        desc: "All Saints Church, The Plough and The Old School Bistro.",
      },
      {
        name: "Doncaster City Centre",
        desc: "Around 3.4 miles away, with shops, restaurants and transport links.",
      },
    ],
  },
  cta: {
    title: "Come and see",
    accent: "for yourself.",
    text: "Find us at Marsh Lane, Arksey, DN5 0SH.",
    primaryLabel: "Get In Touch",
    primaryHref: "/contact",
    secondaryLabel: "Google Maps →",
    secondaryHref: "https://maps.app.goo.gl/VbiN2McQsLq2Cx6o6",
  },
};

// ---------------------------- EVENTS ---------------------------------------

const eventsHero = blankHero({
  variant: "cinematic",
  align: "center",
  eyebrow: "Events & functions",
  title: "Host your own",
  accent: "event.",
  subtitle:
    "Retreats, workshops, coaching and community gatherings in our off-grid ecological learning centre and Geo-dome.",
  image: "/images/events-hero.jpg",
  imageAlt: "A community gathering around the fire circle in Willow Garth woodland",
  chips: ["Retreats", "Workshops", "Functions", "Geo-dome hire"],
  ctaLabel: "Enquire by Email",
  ctaHref: "mailto:gmsoulfood@gmail.com",
  secondaryLabel: "Call Events Admin",
  secondaryHref: "tel:+447951138579",
});

const eventsSections = {
  lead: {
    image: "/images/dome-space.jpg",
    imageAlt: "Relaxation workshop inside the Geo-dome at Willow Garth",
    eyebrow: "Established 2018",
    title: "Ecological Learning",
    accent: "Centre.",
    text: "Greenheart Community Group manage the Willow Garth site. They provide life skills that help others to learn, share and grow.",
    quote:
      "Our mission is to positively impact the physical and mental well-being of our community.",
  },
  community: {
    title: "Events & News",
    items: [
      {
        title: "Volunteer Days",
        body: "Volunteering is a powerful way to make a positive difference in your community while boosting your wellbeing, confidence and skill set. It provides opportunities to meet new people, gain experience and a sense of purpose.",
      },
      {
        title: "Learning Circles",
        body: "To help a person re-orient their experience is to help them find compassion. When we establish the need for self-care we care more for the environment — a winning combination for healthy, happy societies.",
      },
      {
        title: "Life Skills",
        body: "We provide tailored services that boost confidence and help individuals overcome barriers to employment. We focus on improving job-related skills, fostering wellbeing and providing personalised guidance.",
      },
    ],
  },
  workshops: {
    eyebrow: "Workshops & Events",
    title: "Because there's always",
    accent: "room to grow.",
    items: [
      {
        title: "Regular Coaching Sessions",
        body: "Fishing coaching for learners is a structured, hands-on educational experience designed to introduce newcomers to the fundamentals of angling in a safe, fun and encouraging environment.",
      },
      {
        title: "Cold Water Therapy",
        body: "We prioritise safety, efficacy and individualised progress with a comprehensive understanding of the physiological, biochemical and psychological benefits of cold water exposure.",
      },
      {
        title: "Host Your Community Event",
        body: "We provide off-grid infrastructure for community projects to leverage their ecological outputs around sustainability.",
      },
      {
        title: "Woodfire Comfort",
        body: "Our community Geo-dome is available for hire — suitable for workshops, events and gatherings. Equipped with woodburning stove, projector screen and lake views.",
      },
      {
        title: "Off-grid Learning",
        body: "Off-grid classroom available for hire — suitable for community events, homeschooling and crafting sessions. Includes gas hob, gas fire, toilet and crafting stock.",
      },
      {
        title: "Fire Circle & Outdoor Kitchen",
        body: "Outdoor woodland cooking is an immersive, sensory experience that blends primitive survival skills with culinary creativity, transforming the forest floor into a rustic kitchen.",
      },
    ],
  },
  support: {
    eyebrow: "Delivery support",
    title: "Your business is",
    accent: "our business.",
    text: "If you are a tutor or a specialist in the field of outdoor education we want to hear from you. Whether it's to host your own sessions or become part of our delivery team, there may be an opportunity worth exploring.",
    facilities: [
      "3 premises holding up to 40 attendees",
      "A lounge to relax and work",
      "Catering with self-service provision",
      "Motorhome pitches for overnight accommodation",
    ],
    managerTitle: "Site Manager",
    managerName: "Glen Monks",
    managerEmail: "greenheartdoncaster@gmail.com",
  },
  cta: {
    eyebrow: "Create your own event",
    title: "Whatever your idea,",
    accent: "we'll work with you.",
    primaryLabel: "Plan Your Event",
    primaryHref: "mailto:gmsoulfood@gmail.com",
    secondaryLabel: "Call +44 7951 138579",
    secondaryHref: "tel:+447951138579",
  },
};

// ---------------------------- SAFETY ---------------------------------------

const safetyHero = blankHero({
  variant: "solid",
  eyebrow: "Your safety",
  title: "Health &",
  accent: "Safety",
  subtitle:
    "Please read the guidance below before your visit. If in doubt — leave it out.",
  image: "",
  chips: [
    "SENTINAL waiver required",
    "No under-16s at the sauna & dip lake",
    "Non-lifeguarded site",
    "Call 999 in an emergency",
  ],
});

const safetySections = {
  notice:
    "ALL USERS of our sauna and dip lake will be required to complete an online health & safety form through our partner SENTINAL.",
  groups: [
    {
      id: "before-you-visit",
      title: "Before You Visit",
      items: [
        "Willow Garth is not lifeguarded. We have carried out risk assessments and extensive contrast therapy training, but we encourage you to make informed decisions based on your own self-care or the agreement of a health care practitioner.",
        "Please come prepared and do some research before dipping.",
        "STRICTLY NO CHILDREN UNDER 16 YEARS OLD at the sauna & dip lake.",
        "A SENTINEL online waiver is MANDATORY for all sauna & dip users.",
        "A Green Light health check is required before usage.",
      ],
    },
    {
      id: "sauna-dip-safety",
      title: "Sauna & Dip Safety",
      items: [
        "Limited numbers — six people at any one time.",
        "Buoyancy floats are provided and must be worn.",
        "Safety whistles are provided and must be worn.",
        "Emergency blankets are provided on site.",
        "Floating safety doc available.",
        "Thermometer monitor to check water temperature.",
        "High-viz safety ropes and life rings in place.",
        "First aid equipment and designated first aiders on site.",
        "Trained contrast therapy coaches available upon request.",
        "Emergency alarm and blood pressure monitor available on request",
      ],
    },
    {
      id: "water-safety",
      title: "Water Safety",
      items: [
        "We do not provide swimming attendants. This is a non-supervised service, but a first aider will always be on site.",
        "IF IN DOUBT — LEAVE IT OUT!",
        "Emergency location — What3words: action.take.part",
      ],
    },
    {
      id: "booking-requirements",
      title: "Booking Requirements",
      items: [
        "Sauna & dip bookings must be made through our partner SENTINAL — an online health & safety form is mandatory before your visit.",
        "Fishing bookings are made through Swimbooker.",
        "Water dip only sessions have a separate booking pathway.",
      ],
    },
    {
      id: "emergency",
      title: "Emergency Information",
      items: [
        "Nearest defibrillator — 251 metres: Cooke Almshouses, 1–6 High Street, Doncaster, DN5 0SE.",
        "Emergency location — What3words: action.take.part",
        "Call 999 in an emergency.",
      ],
    },
    {
      id: "onsite",
      title: "Onsite Information",
      items: [
        "Safety posters and information are shown on site.",
        "Fire extinguisher on site.",
        "Willow Garth is totally off-grid — facilities include a septic waste-tank and a separate 'ladies only' flushing toilet.",
      ],
    },
  ],
  pregnancy: {
    title: "Swimming & Saunas Whilst Pregnant",
    text: "The safety of sauna use and wild swimming during pregnancy is unclear. Contrast therapy (hot sauna / cold water) poses risks such as increased core temperature, changes in blood pressure, dehydration and fainting. The impact on unborn babies is not well understood. Review the UK-based articles below, consult your midwife, and research before using a sauna while pregnant.",
    links: [
      {
        label: "NHS Pregnancy Advice",
        href: "https://www.nhs.uk/pregnancy/finding-out/health-things-you-should-know-in-pregnancy/",
      },
      {
        label: "NCT Safety Advice",
        href: "https://www.nct.org.uk/information/pregnancy/wellbeing-and-lifestyle-pregnancy/which-beauty-and-wellbeing-treatments-are-safe-during-pregnancy-and-breastfeeding",
      },
      {
        label: "BBC — Saunas whilst pregnant",
        href: "https://www.bbc.co.uk/tiny-happy-people/articles/zdhw47h",
      },
    ],
  },
};

// ---------------------------- CONTACT --------------------------------------

const contactHero = blankHero({
  eyebrow: "Contact",
  title: "Get in touch.",
  accent: "",
  subtitle:
    "Marsh Lane, Arksey, DN5 0SH. Call, email or WhatsApp — we're here to help.",
  image: "/images/site-walks.jpg",
  imageAlt: "Woodland site walk beside the lakes at Willow Garth",
  imagePosition: "center 35%",
  chips: ["Marsh Lane, Arksey", "Doncaster, DN5 0SH", "WhatsApp welcome"],
  ctaLabel: "Call Us",
  ctaHref: "tel:+447951138579",
  secondaryLabel: "WhatsApp",
  secondaryHref: "https://wa.me/447951138579",
});

const contactPanel = {
  eyebrow: "Get in touch",
  title: "We'd love to",
  accent: "hear from you.",
  mapNote:
    "Willow Garth is on Marsh Lane — turn left after the Church and past Marsh Lane Community Centre.",
  successTitle: "Message sent",
  successText:
    "Thank you for getting in touch. We'll get back to you as soon as we can.",
};

// ---------------------------- BOOK -----------------------------------------

const bookHero = blankHero({
  variant: "cinematic",
  align: "center",
  eyebrow: "Book now",
  title: "Book your",
  accent: "experience.",
  subtitle:
    "Fishing, sauna & dip, cold-water plunging and events — choose your escape at Willow Garth.",
  image: "/images/sauna-whatsapp.jpeg",
  imageAlt: "Geo-dome and wood-fired barrel sauna beside Pine Lake at Willow Garth",
  chips: ["Fishing via Swimbooker", "Sauna via SENTINAL", "Group bookings"],
});

const bookHub = {
  eyebrow: "Booking hub",
  title: "Book your",
  accent: "experience.",
  subtitle:
    "Choose how you'd like to spend your time at Willow Garth. Each booking takes you through to the relevant platform.",
  options: [
    {
      title: "Fishing",
      description:
        "Book a swim at Willow or Oak lake through Swimbooker. Coarse, match, carp and predator fishing available.",
      image: "/images/fishing-home.jpg",
      cta: "Book Fishing",
      href: "https://swimbooker.com/fishery/13681",
      note: "",
      altHref: "",
      altLabel: "",
    },
    {
      title: "Sauna & Dip",
      description:
        "Book a wood-fired sauna and natural plunge session at Pine Lake through our in-house calendar — choose your slot and pay securely. The short health & safety declaration is completed onsite before your session.",
      image: "/images/sauna-home.jpg",
      cta: "Book In-house",
      href: "/book/sauna",
      note: "Get a head start — open the SENTINAL health & safety declaration before you arrive.",
      altHref: "/sentinal",
      altLabel: "Open SENTINAL form",
    },
    {
      title: "Water Dip Only",
      description:
        "Book a cold-water dip session without the sauna. Limited numbers and buoyancy equipment provided on site.",
      image: "/images/cold-swim.jpg",
      cta: "Book Swim Only",
      href: "/book/swim",
      note: "",
      altHref: "",
      altLabel: "",
    },
    {
      title: "Events & Retreats",
      description:
        "Host your own retreat, workshop or function in our ecological learning centre, Geo-dome and off-grid facilities.",
      image: "/images/events-card.jpg",
      cta: "Plan Your Event",
      href: "/events",
      note: "",
      altHref: "",
      altLabel: "",
    },
  ],
};

// ---------------------------- LEGAL ----------------------------------------

const legalPages: Record<string, { title: string; updated: string; sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[] }> = {
  privacy: {
    title: "Privacy Policy",
    updated: "October 2026",
    sections: [
      {
        heading: "",
        paragraphs: [
          "[Editable placeholder — replace with your full, legally-reviewed privacy policy before going live.]",
          "Willow Garth Country Park respects your privacy. This policy explains what personal information we collect, how we use it, and the choices you have. It should be reviewed by a qualified legal professional before publication.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "We may collect contact details you provide through our forms or booking platforms (such as name, email, phone number and enquiry details), and technical data such as your IP address and browser type via analytics.",
        ],
      },
      {
        heading: "How we use your information",
        paragraphs: [
          "We use your information to respond to enquiries, manage bookings and improve our services. We do not sell your personal data.",
        ],
      },
      {
        heading: "Third-party services",
        paragraphs: [
          "Bookings are processed by our partners (Swimbooker and SENTINAL) under their own privacy policies. Analytics and mapping services may also process data.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You may request access to, correction of, or deletion of your personal data by contacting us.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "October 2026",
    sections: [
      {
        heading: "",
        paragraphs: [
          "[Editable placeholder — replace with your full, legally-reviewed terms and conditions before going live.]",
          "These terms govern your use of the Willow Garth Country Park website and your visits to the site. By using the website or visiting Willow Garth, you agree to these terms.",
        ],
      },
      {
        heading: "Bookings",
        paragraphs: [
          "Fishing bookings are made through Swimbooker and sauna & dip bookings through our SENTINAL safety platform, each subject to their own terms. All sauna & dip users must complete the mandatory online health & safety form before visiting.",
        ],
      },
      {
        heading: "Health & safety",
        paragraphs: [
          "Visitors are responsible for their own safety. Willow Garth is not lifeguarded. Please read our Health & Safety page before your visit and follow all onsite guidance. Strictly no children under 16 at the sauna & dip lake.",
        ],
      },
      {
        heading: "Codes of conduct",
        paragraphs: [
          "Anglers must follow our codes of conduct, including the use of barbless hooks, unhooking mats and nets, antiseptic application, careful fish handling and a zero-litter policy.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, Willow Garth Country Park accepts no liability for loss, damage or injury arising from your visit or use of the website, except where caused by our negligence.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    updated: "October 2026",
    sections: [
      {
        heading: "",
        paragraphs: [
          "[Editable placeholder — replace with your full, legally-reviewed cookie policy before going live.]",
          "This website may use cookies and similar technologies to enhance your experience, understand how the site is used, and deliver relevant content.",
        ],
      },
      {
        heading: "What are cookies?",
        paragraphs: [
          "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and actions.",
        ],
      },
      {
        heading: "Types of cookies we use",
        bullets: [
          "Essential cookies — required for the site to function and cannot be disabled.",
          "Analytics cookies — help us understand how visitors use the site (e.g. page views, navigation).",
          "Third-party cookies — set by partners such as booking platforms, maps and analytics providers.",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can control cookies through your browser settings. Disabling cookies may affect the functionality of the website.",
        ],
      },
    ],
  },
};

// ---------------------------- REGISTRY -------------------------------------

export const defaultPages: PageRecord[] = [
  {
    slug: "home",
    label: "Homepage",
    path: "/",
    seo: {
      seoTitle: "Willow Garth Country Park — Fishing, Sauna & Dip, Camping & Events near Doncaster",
      seoDescription:
        "Time to relax & unwind at Willow Garth — a 3-lake, 6-acre country park near Doncaster offering coarse & specimen fishing, wood-fired sauna & cold-water dip, wild camping and events.",
      ogImage: "/images/home-aerial.jpg",
    },
    content: {
      hero: homeHero,
      statement: homeStatement,
      feature: homeFeature,
      cta: homeCta,
      faq: homeFaq,
    },
  },
  {
    slug: "about",
    label: "About Us",
    path: "/about",
    seo: {
      seoTitle: "About Us — Bringing You Closer to Nature | Willow Garth",
      seoDescription:
        "Willow Garth Country Park is managed by Greenheart Community Group. Discover our home-reared carp, codes of conduct, tackle & bait store, off-grid facilities and surrounding area.",
      ogImage: "/images/about-hero.jpg",
    },
    content: { hero: aboutHero, ...aboutSections },
  },
  {
    slug: "events",
    label: "Events",
    path: "/events",
    seo: {
      seoTitle: "Events & Functions — Retreats, Workshops & Geo-dome Hire",
      seoDescription:
        "Host your own retreat, event or function at Willow Garth. Ecological learning centre, Geo-dome, off-grid classroom, fishing coaching, cold water therapy and volunteer days.",
      ogImage: "/images/events-hero.jpg",
    },
    content: { hero: eventsHero, ...eventsSections },
  },
  {
    slug: "health-safety",
    label: "Health & Safety",
    path: "/health-safety",
    seo: {
      seoTitle: "Health & Safety — Fishing, Sauna & Dip Guidance | Willow Garth",
      seoDescription:
        "Health and safety information for Willow Garth Country Park — fishing safety, sauna & dip safety, water safety, booking requirements and emergency details.",
      ogImage: "/images/cold-water.jpg",
    },
    content: { hero: safetyHero, ...safetySections },
  },
  {
    slug: "contact",
    label: "Contact",
    path: "/contact",
    seo: {
      seoTitle: "Contact Us — Willow Garth Country Park, Arksey, Doncaster",
      seoDescription:
        "Contact Willow Garth Country Park — address, phone, email and WhatsApp for general and event enquiries. Find us at Marsh Lane, Arksey, DN5 0SH.",
      ogImage: "/images/site-walks.jpg",
    },
    content: { hero: contactHero, panel: contactPanel },
  },
  {
    slug: "book",
    label: "Booking Hub",
    path: "/book",
    seo: {
      seoTitle: "Book Your Experience — Fishing, Sauna & Dip, Events",
      seoDescription:
        "Book fishing, sauna & dip, water dip or events at Willow Garth Country Park. Fishing via Swimbooker, sauna & dip via our in-house calendar and SENTINAL safety platform.",
      ogImage: "/images/sauna-whatsapp.jpeg",
    },
    content: { hero: bookHero, hub: bookHub },
  },
  ...(["privacy", "terms", "cookies"] as const).map((slug) => ({
    slug,
    label: legalPages[slug].title,
    path: `/${slug}`,
    seo: {
      seoTitle: `${legalPages[slug].title} | Willow Garth Country Park`,
      seoDescription: `${legalPages[slug].title} for Willow Garth Country Park.`,
      ogImage: "",
    },
    content: legalPages[slug] as unknown as Record<string, unknown>,
  })),
];

export function getDefaultPage(slug: string): PageRecord | undefined {
  return defaultPages.find((p) => p.slug === slug);
}
