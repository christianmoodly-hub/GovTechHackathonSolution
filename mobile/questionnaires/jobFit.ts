import type { QuestionnaireDefinition } from "./domains";
import { STITCH_JOBFIT_IMAGES } from "../utils/occupationPresentation";

/** Work-style / fit tool — mirrors NCAP Job Fit / Stitch diagnostic. */
export const jobFit: QuestionnaireDefinition = {
  id: "jobFit",
  title: "Job Fit Diagnostic",
  subtitle:
    "Module focused on work environment and task aptitude. Answers save to your profile and match real NCAP occupations.",
  questions: [
    {
      id: "environment",
      prompt:
        "Which type of work environment would you be most comfortable working in every day?",
      helpText:
        "Select the setting that best reflects where your energy and natural attention thrive.",
      options: [
        {
          id: "outdoors",
          label: "Active Outdoors / On-Site",
          description:
            "Construction, land surveys, solar installs — movement, fresh air, seasonal work.",
          icon: "nature",
          image: STITCH_JOBFIT_IMAGES.outdoors,
          weights: { agriculture: 3, trades: 2, stem: 1 },
        },
        {
          id: "workshop",
          label: "Workshop / Industrial Plant",
          description:
            "Machinery, fabrication, electrical diagnostics, TVET testing bays, automotive work.",
          icon: "precision_manufacturing",
          image: STITCH_JOBFIT_IMAGES.workshop,
          weights: { trades: 3, stem: 2, digital: 1 },
        },
        {
          id: "office",
          label: "Structured Office / Tech Desk",
          description:
            "Data processing, admin, software, accounting — predictable schedules and digital tools.",
          icon: "computer",
          image: STITCH_JOBFIT_IMAGES.office,
          weights: { digital: 3, business: 2, stem: 1 },
        },
        {
          id: "community",
          label: "Community & Healthcare",
          description:
            "Clinics, learning centres, advisory desks — human engagement and empathy.",
          icon: "medical_services",
          image: STITCH_JOBFIT_IMAGES.community,
          weights: { health: 3, education: 2, services: 2 },
        },
      ],
    },
    {
      id: "physical",
      prompt: "How much daily physical exertion feels comfortable for you?",
      helpText:
        "Accommodations for varying mobility are factored into TVET & university matching.",
      options: [
        {
          id: "low",
          label: "Low — Predominantly Seated",
          description: "Desk-focused roles with light movement.",
          icon: "fitness_center",
          weights: { digital: 2, business: 2, education: 1 },
        },
        {
          id: "moderate",
          label: "Moderate — Light Walking / Standing",
          description: "On-your-feet work without heavy lifting.",
          icon: "fitness_center",
          weights: { services: 2, health: 1, trades: 1, education: 1 },
        },
        {
          id: "high",
          label: "High / Heavy — Lifting & Strenuous",
          description: "Field, artisan, and physically demanding roles.",
          icon: "fitness_center",
          weights: { trades: 3, agriculture: 2, law_security: 1 },
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
          icon: "support_agent",
          weights: { health: 2, education: 3, services: 2, business: 1 },
        },
        {
          id: "mixed",
          label: "A mix of solo work and collaboration",
          icon: "groups",
          weights: { business: 1, digital: 1, stem: 1, creative: 1 },
        },
        {
          id: "low_people",
          label: "Mostly independent / technical work",
          icon: "engineering",
          weights: { stem: 2, digital: 2, trades: 2, agriculture: 1 },
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
  ],
};
