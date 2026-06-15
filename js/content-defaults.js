// ============================================================
// content-defaults.js — FoolProofDoctor
// Every piece of site content lives here as the fallback default.
// When admin saves changes they go to Firestore.
// If Firestore is unavailable, these defaults render.
// ============================================================

export const DEFAULT_CONTENT = {

  // ── Branding ──────────────────────────────────────────────
  branding: {
    logoType:        "text",          // "text" | "image"
    logoText:        "FoolProofDoctor",
    logoTextAccent:  "Doctor",        // which part gets gold color
    logoImageUrl:    "",              // URL if logoType = "image"
    logoImageWidth:  "160px",         // CSS width for image logo
    faviconUrl:      "/favicon.svg",
    accentColor:     "#c8a96e",       // primary gold
    accentColorHover:"#e8c98e",       // gold hover
  },

  // ── SEO / Meta ─────────────────────────────────────────────
  seo: {
    siteTitle:       "FoolProofDoctor — Become Financially Foolproof",
    metaDescription: "Licensed financial professionals offering mortgage protection, income protection, business protection, family protection, retirement planning, and final expense coverage.",
    ogTitle:         "FoolProofDoctor — Become Financially Foolproof",
    ogDescription:   "Protecting what matters most — your home, your income, your family, and your future.",
    ogImageUrl:      "/og-image.svg",
    twitterHandle:   "",
    canonicalUrl:    "https://foolproofdoctor.com",
  },

  // ── Navigation ────────────────────────────────────────────
  nav: {
    ctaText:         "Get Protected",
    links: [
      { label: "Services", href: "#services" },
      { label: "About",    href: "#about"    },
      { label: "Contact",  href: "#contact"  },
    ]
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    eyebrow:         "Licensed Financial Professionals",
    titleLine1:      "Become",
    titleLine2:      "Financially",
    titleLine3:      "Foolproof",
    titleItalicLine: 2,              // which line (1-3) is italic gold
    subtitle:        "Protecting what matters most — your home, your income, your family, and your future. Comprehensive financial protection tailored to your life.",
    ctaPrimary:      "Explore Protection Plans",
    ctaSecondary:    "Our Approach",
  },

  // ── About Strip ───────────────────────────────────────────
  about: {
    label:           "Who We Are",
    titleLine1:      "Your finances,",
    titleLine2:      "fortified.",
    titleItalicLine: 2,
    body1:           "We believe financial security is not a luxury — it is a necessity. FoolProofDoctor was built on one principle: every family deserves protection that actually works when life doesn't go to plan.",
    body2:           "From your mortgage to your final wishes, we cover every chapter of your financial life with clarity, integrity, and unmatched personal service.",
    stats: [
      { num: "12+", label: "Years of Expertise"   },
      { num: "3K+", label: "Families Protected"   },
      { num: "98%", label: "Client Satisfaction"  },
      { num: "6",   label: "Protection Plans"     },
    ]
  },

  // ── Services Section ──────────────────────────────────────
  servicesSection: {
    label:    "What We Offer",
    titleLine1: "Protection for",
    titleLine2: "every chapter",
    titleItalicLine: 2,
    subtitle: "Six comprehensive plans, one goal — total financial security for you and everyone you love.",
  },

  // ── Individual Services ───────────────────────────────────
  services: {
    mortgage: {
      slug:         "mortgage-protection",
      eyebrow:      "01 / Mortgage Protection",
      cardTitle:    "Mortgage Protection",
      cardDesc:     "Ensure your home remains your family's sanctuary — even when the unexpected strikes. Your mortgage, covered.",
      pageTitle:    "Mortgage Protection",
      pageTitleItalic: true,
      videoUrl:     "",
      videoLabel:   "Understanding Mortgage Protection",
      formTitle:    "Keep the roof over your head",
      formTitleItalic: "over your head",
      formText:     "Your home is more than an address — it is your family's foundation. Our mortgage protection plans ensure your payments are covered if illness, injury, or death prevents you from working.",
      metaTitle:    "Mortgage Protection | FoolProofDoctor",
      metaDesc:     "Protect your home and mortgage payments with our comprehensive mortgage protection plans.",
    },
    income: {
      slug:         "income-protection",
      eyebrow:      "02 / Income Protection",
      cardTitle:    "Income Protection",
      cardDesc:     "Your income is your greatest asset. Protect your earning power against illness, injury, or sudden job loss.",
      pageTitle:    "Income Protection",
      pageTitleItalic: true,
      videoUrl:     "",
      videoLabel:   "How Income Protection Works",
      formTitle:    "Protect your earning power",
      formTitleItalic: "earning power",
      formText:     "What happens to your finances if you suddenly cannot work? Income protection replaces a portion of your salary so your lifestyle and commitments stay intact during recovery.",
      metaTitle:    "Income Protection | FoolProofDoctor",
      metaDesc:     "Protect your income and earning power with our comprehensive income protection plans.",
    },
    business: {
      slug:         "business-protection",
      eyebrow:      "03 / Business Protection",
      cardTitle:    "Business Protection",
      cardDesc:     "Safeguard the enterprise you have built. Key person insurance, partnership cover, and business continuity planning.",
      pageTitle:    "Business Protection",
      pageTitleItalic: true,
      videoUrl:     "",
      videoLabel:   "Protecting Your Business Assets",
      formTitle:    "Safeguard what you have built",
      formTitleItalic: "you have built",
      formText:     "Your business did not build itself. Key person insurance, shareholder protection, and loan cover ensure your enterprise survives any storm — and keeps thriving.",
      metaTitle:    "Business Protection | FoolProofDoctor",
      metaDesc:     "Protect your business with key person insurance, shareholder protection, and more.",
    },
    family: {
      slug:         "family-protection",
      eyebrow:      "04 / Family Protection",
      cardTitle:    "Family Protection",
      cardDesc:     "Life insurance and critical illness cover so your loved ones are always provided for, no matter what comes next.",
      pageTitle:    "Family Protection",
      pageTitleItalic: true,
      videoUrl:     "",
      videoLabel:   "Securing Your Family's Future",
      formTitle:    "Love them enough to plan",
      formTitleItalic: "enough to plan",
      formText:     "Life insurance and critical illness cover that puts your family first. Because the greatest act of love is ensuring they are provided for — no matter what.",
      metaTitle:    "Family Protection | FoolProofDoctor",
      metaDesc:     "Life insurance and critical illness cover to protect your family's financial future.",
    },
    retirement: {
      slug:         "retirement-planning",
      eyebrow:      "05 / Retirement Planning",
      cardTitle:    "Retirement Planning",
      cardDesc:     "Build a retirement that sustains the lifestyle you deserve. Strategic planning for the years ahead, starting now.",
      pageTitle:    "Retirement Planning",
      pageTitleItalic: true,
      videoUrl:     "",
      videoLabel:   "Planning Your Ideal Retirement",
      formTitle:    "Design your golden years",
      formTitleItalic: "golden years",
      formText:     "Retirement should be everything you imagined. We map a strategic, tax-efficient path from where you are today to the financially free future you deserve.",
      metaTitle:    "Retirement Planning | FoolProofDoctor",
      metaDesc:     "Strategic retirement planning to help you achieve the financially free future you deserve.",
    },
    final: {
      slug:         "final-expense",
      eyebrow:      "06 / Final Expense",
      cardTitle:    "Final Expense",
      cardDesc:     "Give your family the gift of peace of mind. Dignified, affordable coverage so nothing is left unplanned.",
      pageTitle:    "Final Expense",
      pageTitleItalic: true,
      videoUrl:     "",
      videoLabel:   "Planning for Final Expenses",
      formTitle:    "Leave nothing unresolved",
      formTitleItalic: "unresolved",
      formText:     "Final expense insurance is the last, most important gift you can give your family. Affordable, simple, and dignified coverage so no one is left with an unexpected burden.",
      metaTitle:    "Final Expense Coverage | FoolProofDoctor",
      metaDesc:     "Affordable final expense insurance so your family is never left with an unexpected burden.",
    }
  },

  // ── Testimonial ───────────────────────────────────────────
  testimonial: {
    quote:  "FoolProofDoctor turned what felt like a complicated financial maze into a clear, confident plan. For the first time, I truly feel protected.",
    author: "Sarah M.",
    role:   "Client since 2021",
  },

  // ── CTA / Contact ─────────────────────────────────────────
  cta: {
    titleLine1:     "Ready to become",
    titleLine2:     "financially",
    titleLine3:     "foolproof?",
    titleItalicLine: 2,
    subtitle:       "One conversation can change everything. Choose a protection plan and speak with a specialist today.",
    ctaPrimary:     "Start With Mortgage Protection",
    ctaSecondary:   "Browse All Services",
  },

  // ── Form ──────────────────────────────────────────────────
  form: {
    title:         "Get Your Free Quote",
    subtitle:      "Fill in your details and a specialist will be in touch shortly.",
    submitText:    "Request My Free Quote",
    successTitle:  "You are in good hands.",
    successText:   "Thank you for reaching out. A specialist will contact you within 24 hours to discuss your personalised protection plan.",
    promise1Title: "Free consultation",
    promise1Text:  "No obligation, no pressure.",
    promise2Title: "100% confidential",
    promise2Text:  "Your information is always protected.",
    promise3Title: "Response within 24 hours",
    promise3Text:  "We move as fast as life does.",
  },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    tagline:       "Become Financially Foolproof",
    copyrightName: "FoolProofDoctor Financial Protection",
    socialLinks: {
      facebook:  "",
      instagram: "",
      twitter:   "",
      linkedin:  "",
    }
  },

  // ── Contact Info ──────────────────────────────────────────
  contact: {
    supportTitle: "We're here to help",
    supportText:  "Our licensed financial professionals are available Monday to Friday, 9am to 6pm. We typically respond within 24 hours.",
    supportHours: "Mon – Fri, 9am – 6pm",
    phone:        "",
    email:        "",
    address:      "",
    metaTitle:    "Contact Us | FoolProofDoctor",
    metaDesc:     "Get in touch with FoolProofDoctor. Our licensed financial professionals are ready to help you become financially foolproof.",
  }
};

// Service order for rendering
export const SERVICE_KEYS = [
  "mortgage", "income", "business", "family", "retirement", "final"
];

// Submission status definitions
export const SUBMISSION_STATUSES = {
  new:                  { label: "New",                  color: "#c8a96e", bg: "rgba(200,169,110,0.12)" },
  pending:              { label: "Pending Review",        color: "#6ea8c8", bg: "rgba(110,168,200,0.12)" },
  in_progress:          { label: "In Progress",           color: "#c8b06e", bg: "rgba(200,176,110,0.12)" },
  consultation_booked:  { label: "Consultation Booked",   color: "#a8c86e", bg: "rgba(168,200,110,0.12)" },
  confirmed:            { label: "Confirmed",             color: "#6ec88a", bg: "rgba(110,200,138,0.12)" },
  cancelled:            { label: "Cancelled",             color: "#c86e6e", bg: "rgba(200,110,110,0.12)" },
};
