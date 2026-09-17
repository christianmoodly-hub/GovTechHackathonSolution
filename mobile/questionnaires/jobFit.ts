import type { QuestionnaireDefinition } from "./domains";

/** Work-style / fit tool — mirrors NCAP Job Fit intent. */
export const jobFit: QuestionnaireDefinition = {
  id: "jobFit",
  title: "Job Fit",
  subtitle:
    "Answer based on how you like to work day to day. We will surface occupations with a similar rhythm.",
  questions: [
    {
      id: "pace",
      prompt: "What work pace suits you best?",
      options: [
        {
          id: "steady",
          label: "Steady routines and clear processes",
          weights: { business: 2, services: 2, education: 1, law_security: 1 },
        },
        {
          id: "urgent",
          label: "Fast decisions and urgent situations",
          weights: { health: 2, law_security: 3, services: 1 },
        },
        {
          id: "deep_focus",
          label: "Long stretches of focused problem-solving",
          weights: { stem: 2, digital: 3, creative: 1 },
        },
        {
          id: "varied",
          label: "Varied tasks across places and people",
          weights: { services: 2, agriculture: 1, trades: 1, education: 1 },
        },
      ],
    },
    {
      id: "interaction",
      prompt: "How much people-time do you want?",
      options: [
        {
          id: "high_people",
          label: "Mostly with clients, patients, learners, or teams",
          weights: { health: 2, education: 3, services: 2, business: 1 },
        },
        {
          id: "mixed",
          label: "A mix of solo work and collaboration",
          weights: { business: 1, digital: 1, stem: 1, creative: 1 },
        },
        {
          id: "low_people",
          label: "Mostly independent / technical work",
          weights: { stem: 2, digital: 2, trades: 2, agriculture: 1 },
        },
      ],
    },
    {
      id: "risk",
      prompt: "How do you feel about physical or high-responsibility risk?",
      options: [
        {
          id: "comfort_risk",
          label: "I am fine with physical / field risk",
          weights: { trades: 2, law_security: 2, agriculture: 2, health: 1 },
        },
        {
          id: "professional_risk",
          label: "I prefer professional responsibility over physical risk",
          weights: { law_security: 1, business: 2, health: 1, education: 1 },
        },
        {
          id: "low_risk",
          label: "I want lower physical risk environments",
          weights: { digital: 2, business: 2, creative: 1, education: 1 },
        },
      ],
    },
    {
      id: "structure",
      prompt: "Which work structure fits you?",
      options: [
        {
          id: "rules",
          label: "Clear rules, standards, and accountability",
          weights: { law_security: 3, business: 1, health: 1, education: 1 },
        },
        {
          id: "creative_freedom",
          label: "Room to invent and interpret",
          weights: { creative: 3, digital: 1, education: 1 },
        },
        {
          id: "targets",
          label: "Targets, metrics, and delivery deadlines",
          weights: { business: 2, digital: 1, services: 2, stem: 1 },
        },
        {
          id: "craft_quality",
          label: "Craft quality and practical excellence",
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
          weights: { business: 2, education: 2, digital: 1, stem: 1 },
        },
        {
          id: "shifts",
          label: "Shifts / after-hours is acceptable",
          weights: { health: 3, law_security: 2, services: 2 },
        },
        {
          id: "project_bursts",
          label: "Project bursts with quieter gaps",
          weights: { creative: 2, digital: 2, stem: 1, business: 1 },
        },
        {
          id: "seasonal",
          label: "Seasonal or location-based work",
          weights: { agriculture: 3, trades: 1, services: 1 },
        },
      ],
    },
  ],
};
