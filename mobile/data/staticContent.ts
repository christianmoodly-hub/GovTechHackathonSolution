export const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "af", label: "Afrikaans" },
  { id: "zu", label: "isiZulu" },
  { id: "xh", label: "isiXhosa" },
  { id: "nr", label: "isiNdebele" },
  { id: "ss", label: "siSwati" },
  { id: "nso", label: "Sepedi" },
  { id: "st", label: "Sesotho" },
  { id: "tn", label: "Setswana" },
  { id: "ve", label: "Tshivenda" },
  { id: "ts", label: "Xitsonga" },
] as const;

export const LEARNER_ROLES = [
  {
    id: "grade10",
    label: "Grade 10 Learner",
    description: "Subject choice & future study stream",
  },
  {
    id: "grade11",
    label: "Grade 11 Learner",
    description: "Early tertiary & TVET benchmark",
  },
  {
    id: "grade12",
    label: "Grade 12 Learner",
    description: "Matric final prep, CAO & NSFAS",
  },
  {
    id: "below_grade10",
    label: "Less than Grade 10",
    description: "Senior phase guidance & TVET access",
  },
  {
    id: "tertiary",
    label: "Student (Tertiary / TVET)",
    description: "Colleges, artisan trades & diplomas",
  },
  {
    id: "work_seeker",
    label: "Work Seeker",
    description: "Upskilling, learnerships & jobs",
  },
  {
    id: "parent",
    label: "Parent / Guardian",
    description: "Guiding youth through career paths",
  },
  {
    id: "teacher",
    label: "Career Guidance Teacher",
    description: "Life Orientation & classroom tools",
  },
  {
    id: "practitioner",
    label: "Career Practitioner",
    description: "Professional advisory diagnostic tools",
  },
] as const;

export const DISABILITY_CATEGORIES = [
  { id: "visual", label: "Visual" },
  { id: "hearing", label: "Hearing" },
  { id: "physical", label: "Physical" },
  { id: "learning", label: "Learning" },
] as const;

export const HELPLINE = {
  tollFree: "0869990123",
  tollFreeDisplay: "086 999 0123",
  whatsapp: "0722045056",
  whatsappDisplay: "072 204 5056",
  hours: "Mon – Fri: 08:00 – 16:30",
} as const;

export const WALK_IN_CENTRES = [
  {
    id: "pretoria",
    name: "DHET Central CDS Walk-in Centre",
    city: "Pretoria",
    badge: "National CDS Flagship",
    address: "123 Francis Baard Street, Pretoria CBD, 0001",
    hours: "Mon–Fri 07:30 – 16:00",
    accessible: true,
    accessLabel: "Wheelchair Accessible",
    mapsQuery: "123 Francis Baard Street, Pretoria CBD",
    phone: "0869990123",
  },
  {
    id: "durban",
    name: "Durban Coastal TVET & CDS Advisory",
    city: "Durban",
    badge: "Regional Hub",
    address: "Anton Lembede St, Durban Central, 4001",
    hours: "Mon–Fri 08:00 – 16:00",
    accessible: true,
    accessLabel: "Braille & Audio Facilities",
    mapsQuery: "Anton Lembede Street, Durban Central",
    phone: "0869990123",
  },
  {
    id: "cape-town",
    name: "Cape Town CDS Regional Hub",
    city: "Cape Town",
    badge: "Regional Hub",
    address: "Plein Street, Cape Town CBD, 8001",
    hours: "Mon–Fri 08:00 – 16:00",
    accessible: true,
    accessLabel: "Wheelchair Accessible",
    mapsQuery: "Plein Street, Cape Town CBD",
    phone: "0869990123",
  },
  {
    id: "bloemfontein",
    name: "Free State CDS Advisory Desk",
    city: "Bloemfontein",
    badge: "Provincial Desk",
    address: "Charlotte Maxeke Street, Bloemfontein CBD",
    hours: "Mon–Fri 08:00 – 16:00",
    accessible: true,
    accessLabel: "Wheelchair Accessible",
    mapsQuery: "Charlotte Maxeke Street, Bloemfontein",
    phone: "0869990123",
  },
] as const;

export const GUIDANCE_TOPICS = [
  "Subject Choice Guidance (Grade 9 & 10)",
  "NSFAS & Bursary Funding Guidance",
  "TVET College vs University Admission",
  "Artisan & Apprenticeship Pathway (INDLELA)",
  "Support for Learners with Disabilities",
  "Second Chance Matric Support",
] as const;

export const DIGITAL_CHANNELS = [
  {
    id: "email",
    icon: "mail",
    label: "careerhelp@dhet.gov.za",
    subtitle: "Official DHET Email Desk",
    url: "mailto:careerhelp@dhet.gov.za",
  },
  {
    id: "facebook",
    icon: "public",
    label: "facebook.com/khethacareerdevelopment",
    subtitle: "Khetha Career Guidance Page",
    url: "https://www.facebook.com/khethacareerdevelopment",
  },
  {
    id: "x",
    icon: "tag",
    label: "@rsacareerhelp",
    subtitle: "Verified X (Twitter) Desk",
    url: "https://x.com/rsacareerhelp",
  },
] as const;

export const FUNDING_CARDS = [
  {
    id: "nsfas",
    title: "NSFAS & Fee-free criteria",
    body: "Check eligibility for fee-free higher education and TVET support through NSFAS.",
  },
  {
    id: "funza",
    title: "Funza Lushaka",
    body: "Bursary support for students who want to teach priority school subjects.",
  },
  {
    id: "provincial",
    title: "Provincial bursaries",
    body: "Explore province-specific bursaries and SETA-funded learnership pathways.",
  },
] as const;

export const OFFLINE_VAULT_STATS = {
  careersCached: 0,
  qualificationsCached: 0,
  providersCached: 0,
  storageLabel: "0 MB cached",
  note: "Deprecated mock — use getOfflineVaultStats / useVaultStats for live counts.",
} as const;

export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export const REGISTER_ROLES = [
  { id: "grade9_10", label: "Grade 9 – 10", description: "Subject choices" },
  { id: "grade11_12", label: "Grade 11 – 12", description: "Matric & APS score" },
  { id: "tvet", label: "TVET / Artisan", description: "NC(V) & NATED N1–N6" },
  { id: "university", label: "University student", description: "Degrees & diplomas" },
  { id: "work_seeker", label: "Unemployed youth / job seeker", description: "Learnerships & YES" },
] as const;
