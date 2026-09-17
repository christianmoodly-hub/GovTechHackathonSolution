import type { CareerDomain } from "./domains";

export type JobFitEnvOption = {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  image: number;
  imageOverlay: string;
  weights: Partial<Record<CareerDomain, number>>;
};

export type JobFitDemandOption = {
  id: string;
  label: string;
  detail: string;
  weights: Partial<Record<CareerDomain, number>>;
};

export type JobFitFollowUp = {
  id: string;
  prompt: string;
  helpText?: string;
  options: {
    id: string;
    label: string;
    description?: string;
    icon: string;
    weights: Partial<Record<CareerDomain, number>>;
  }[];
};

const IMAGES = {
  outdoors: require("../assets/stitch/job-fit/img1.jpg"),
  workshop: require("../assets/stitch/job-fit/img2.jpg"),
  office: require("../assets/stitch/job-fit/img3.jpg"),
  community: require("../assets/stitch/job-fit/img4.jpg"),
} as const;

export const JOB_FIT_ENVIRONMENTS: JobFitEnvOption[] = [
  {
    id: "outdoors",
    label: "Active Outdoors / On-Site",
    subtitle: "Field & Outdoor Ready",
    description:
      "Construction projects, agricultural research, land surveys, solar and renewable energy installations. Involves movement, fresh air, and seasonal changes.",
    icon: "nature_people",
    accent: "#15803D",
    image: IMAGES.outdoors,
    imageOverlay: "Practical • High Mobility",
    weights: { agriculture: 3, trades: 2, stem: 1 },
  },
  {
    id: "workshop",
    label: "Workshop / Industrial Plant",
    subtitle: "Artisan & Technical Trades",
    description:
      "Machinery operation, metal fabrication, electrical diagnostics, TVET testing bays, and automotive maintenance. Hands-on tools and calibrated gear.",
    icon: "precision_manufacturing",
    accent: "#C2611A",
    image: IMAGES.workshop,
    imageOverlay: "Structured Workshop • Equipment Driven",
    weights: { trades: 3, stem: 2, digital: 1 },
  },
  {
    id: "office",
    label: "Structured Office / Tech Desk",
    subtitle: "Corporate & Digital Tech",
    description:
      "Computer data processing, administrative records, software coding, and public accounting. Predictable schedules, ergonomic seating, and digital collaboration.",
    icon: "computer",
    accent: "#2B6CB0",
    image: IMAGES.office,
    imageOverlay: "Digital Systems • Desk Focus",
    weights: { digital: 3, business: 2, stem: 1 },
  },
  {
    id: "community",
    label: "Community & Healthcare",
    subtitle: "Care & Public Service",
    description:
      "Public health clinics, learning centres, community advisory desks, and municipal public service. Centred on direct human engagement and empathy.",
    icon: "medical_services",
    accent: "#6D28D9",
    image: IMAGES.community,
    imageOverlay: "Human Centred • High Empathy",
    weights: { health: 3, education: 2, services: 2 },
  },
];

export const JOB_FIT_DEMAND: JobFitDemandOption[] = [
  {
    id: "low",
    label: "Low",
    detail: "Predominantly Seated",
    weights: { digital: 2, business: 2, education: 1 },
  },
  {
    id: "moderate",
    label: "Moderate",
    detail: "Light Walking • Standing",
    weights: { services: 2, health: 1, trades: 1, education: 1 },
  },
  {
    id: "high",
    label: "High / Heavy",
    detail: "Lifting • Strenuous",
    weights: { trades: 3, agriculture: 2, law_security: 1 },
  },
];

export const JOB_FIT_FOLLOW_UPS: JobFitFollowUp[] = [
  {
    id: "interaction",
    prompt: "How much people-time do you want in a typical work week?",
    helpText:
      "Choose the balance of client, team, and independent work that feels sustainable.",
    options: [
      {
        id: "high_people",
        label: "Mostly with clients, patients, learners, or teams",
        description: "High engagement, coaching, and service contact.",
        icon: "support_agent",
        weights: { health: 2, education: 3, services: 2, business: 1 },
      },
      {
        id: "mixed",
        label: "A mix of solo work and collaboration",
        description: "Alternate between deep focus and team delivery.",
        icon: "groups",
        weights: { business: 1, digital: 1, stem: 1, creative: 1 },
      },
      {
        id: "low_people",
        label: "Mostly independent / technical work",
        description: "Systems, tools, and craft over constant meetings.",
        icon: "engineering",
        weights: { stem: 2, digital: 2, trades: 2, agriculture: 1 },
      },
    ],
  },
  {
    id: "structure",
    prompt: "Which work structure fits you best?",
    options: [
      {
        id: "rules",
        label: "Clear rules, standards, and accountability",
        icon: "verified",
        weights: { law_security: 3, business: 1, health: 1, education: 1 },
      },
      {
        id: "creative_freedom",
        label: "Room to invent and interpret",
        icon: "palette",
        weights: { creative: 3, digital: 1, education: 1 },
      },
      {
        id: "targets",
        label: "Targets, metrics, and delivery deadlines",
        icon: "trending_up",
        weights: { business: 2, digital: 1, services: 2, stem: 1 },
      },
      {
        id: "craft_quality",
        label: "Craft quality and practical excellence",
        icon: "build",
        weights: { trades: 3, agriculture: 1, creative: 1, stem: 1 },
      },
    ],
  },
  {
    id: "schedule",
    prompt: "What schedule preference do you have?",
    options: [
      {
        id: "office_hours",
        label: "Mostly regular daytime hours",
        icon: "timer",
        weights: { business: 2, education: 2, digital: 1, stem: 1 },
      },
      {
        id: "shifts",
        label: "Shifts / after-hours is acceptable",
        icon: "schedule",
        weights: { health: 3, law_security: 2, services: 2 },
      },
      {
        id: "project_bursts",
        label: "Project bursts with quieter gaps",
        icon: "bolt",
        weights: { creative: 2, digital: 2, stem: 1, business: 1 },
      },
      {
        id: "seasonal",
        label: "Seasonal or location-based work",
        icon: "agriculture",
        weights: { agriculture: 3, trades: 1, services: 1 },
      },
    ],
  },
];

/** Total steps = environment/physical combined + follow-ups. */
export const JOB_FIT_TOTAL_STEPS = 1 + JOB_FIT_FOLLOW_UPS.length;

export function scoreJobFitAnswers(answers: {
  environment?: string;
  physical?: string;
  interaction?: string;
  structure?: string;
  schedule?: string;
}): Record<CareerDomain, number> {
  const scores: Record<CareerDomain, number> = {
    stem: 0,
    health: 0,
    business: 0,
    education: 0,
    creative: 0,
    trades: 0,
    agriculture: 0,
    law_security: 0,
    services: 0,
    digital: 0,
  };

  const apply = (weights?: Partial<Record<CareerDomain, number>>) => {
    if (!weights) return;
    for (const [domain, weight] of Object.entries(weights) as [
      CareerDomain,
      number,
    ][]) {
      scores[domain] += weight ?? 0;
    }
  };

  apply(JOB_FIT_ENVIRONMENTS.find((o) => o.id === answers.environment)?.weights);
  apply(JOB_FIT_DEMAND.find((o) => o.id === answers.physical)?.weights);
  for (const followUp of JOB_FIT_FOLLOW_UPS) {
    const selected = answers[followUp.id as keyof typeof answers];
    apply(followUp.options.find((o) => o.id === selected)?.weights);
  }

  return scores;
}
