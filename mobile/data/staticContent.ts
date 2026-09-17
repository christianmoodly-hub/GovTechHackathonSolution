export const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "zu", label: "isiZulu" },
  { id: "st", label: "Sesotho" },
  { id: "af", label: "Afrikaans" },
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
    address: "123 Francis Baard Street, Pretoria CBD, 0001",
    hours: "Mon–Fri 07:30 – 16:00",
    accessible: true,
  },
  {
    id: "durban",
    name: "Durban Coastal TVET & CDS Advisory",
    city: "Durban",
    address: "Anton Lembede St, Durban Central",
    hours: "Mon–Fri 08:00 – 16:00",
    accessible: true,
  },
  {
    id: "cape-town",
    name: "Cape Town CDS Regional Hub",
    city: "Cape Town",
    address: "Plein Street, Cape Town CBD",
    hours: "Mon–Fri 08:00 – 16:00",
    accessible: true,
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
  careersCached: 1432,
  qualificationsCached: 705,
  providersCached: 89,
  storageLabel: "14.2 / 50 MB",
  note: "Presentation stats from the design mock. Live offline packaging is not wired yet.",
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
