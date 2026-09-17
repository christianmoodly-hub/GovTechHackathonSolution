import type { QuestionnaireDefinition } from "./domains";

/** Interest / values tool — mirrors NCAP Career Choice intent. */
export const careerChoice: QuestionnaireDefinition = {
  id: "careerChoice",
  title: "Career Choice",
  subtitle:
    "Explore what kind of work energises you. Results lean toward occupations that match those interests.",
  questions: [
    {
      id: "interest",
      prompt: "What kind of work sounds most interesting?",
      options: [
        {
          id: "build_tech",
          label: "Building systems, products, or technology",
          weights: { stem: 2, digital: 3, trades: 1 },
        },
        {
          id: "help_people",
          label: "Helping people stay healthy, learn, or cope",
          weights: { health: 3, education: 2, services: 1 },
        },
        {
          id: "run_orgs",
          label: "Running teams, money, or organisations",
          weights: { business: 3, services: 1, law_security: 1 },
        },
        {
          id: "create",
          label: "Creating stories, designs, or performances",
          weights: { creative: 3, digital: 1, services: 1 },
        },
        {
          id: "land_food",
          label: "Working with land, food, or natural resources",
          weights: { agriculture: 3, stem: 1, trades: 1 },
        },
      ],
    },
    {
      id: "impact",
      prompt: "What impact do you care about most?",
      options: [
        {
          id: "community",
          label: "Stronger communities and public service",
          weights: { education: 2, law_security: 2, health: 1, services: 1 },
        },
        {
          id: "innovation",
          label: "Innovation and solving hard problems",
          weights: { stem: 2, digital: 2, business: 1 },
        },
        {
          id: "enterprise",
          label: "Growing businesses and opportunities",
          weights: { business: 3, services: 1, digital: 1 },
        },
        {
          id: "craft",
          label: "High-quality craftsmanship and practical skill",
          weights: { trades: 3, creative: 1, agriculture: 1 },
        },
      ],
    },
    {
      id: "environment",
      prompt: "Where would you rather spend most workdays?",
      options: [
        {
          id: "office",
          label: "Office / hybrid professional setting",
          weights: { business: 2, law_security: 1, digital: 1, education: 1 },
        },
        {
          id: "clinic_school",
          label: "Clinic, school, or community site",
          weights: { health: 2, education: 2, services: 1 },
        },
        {
          id: "workshop_field",
          label: "Workshop, site, or outdoors",
          weights: { trades: 2, agriculture: 2, stem: 1 },
        },
        {
          id: "studio",
          label: "Studio, stage, or creative production",
          weights: { creative: 3, digital: 1, services: 1 },
        },
      ],
    },
    {
      id: "growth",
      prompt: "Which growth path appeals to you?",
      options: [
        {
          id: "specialist",
          label: "Become a deep specialist",
          weights: { stem: 2, health: 2, digital: 2, law_security: 1 },
        },
        {
          id: "leader",
          label: "Lead people and projects",
          weights: { business: 3, education: 1, services: 1 },
        },
        {
          id: "own_business",
          label: "Build toward my own business / trade",
          weights: { trades: 2, business: 2, creative: 1, agriculture: 1 },
        },
        {
          id: "flexible",
          label: "Keep options open across fields",
          weights: {
            services: 1,
            digital: 1,
            business: 1,
            creative: 1,
            stem: 1,
          },
        },
      ],
    },
  ],
};
