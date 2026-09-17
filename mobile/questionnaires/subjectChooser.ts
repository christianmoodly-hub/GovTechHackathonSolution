import type { QuestionnaireDefinition } from "./domains";

/** School-subject oriented tool — mirrors NCAP Subject Chooser intent. */
export const subjectChooser: QuestionnaireDefinition = {
  id: "subjectChooser",
  title: "Subject Chooser",
  subtitle:
    "Pick the school subjects and study styles you enjoy. We will match careers that lean on those strengths.",
  questions: [
    {
      id: "favourite_subject",
      prompt: "Which school subject do you enjoy most?",
      options: [
        {
          id: "maths",
          label: "Mathematics / Mathematical Literacy",
          weights: { stem: 3, digital: 2, business: 1 },
        },
        {
          id: "science",
          label: "Physical / Life Sciences",
          weights: { stem: 3, health: 2, agriculture: 1 },
        },
        {
          id: "languages",
          label: "Languages / Literature",
          weights: { education: 2, creative: 2, services: 1, law_security: 1 },
        },
        {
          id: "commerce",
          label: "Accounting / Business Studies / Economics",
          weights: { business: 3, services: 1, digital: 1 },
        },
        {
          id: "tech",
          label: "CAT / IT / Engineering Graphics & Design",
          weights: { digital: 3, stem: 2, trades: 1 },
        },
        {
          id: "arts",
          label: "Visual Arts / Dramatic Arts / Music",
          weights: { creative: 3, education: 1, services: 1 },
        },
      ],
    },
    {
      id: "second_subject",
      prompt: "Which other subject area do you want to keep in your mix?",
      options: [
        {
          id: "life_orientation_people",
          label: "Working with people / Life Orientation themes",
          weights: { education: 2, health: 2, services: 2 },
        },
        {
          id: "geography_agri",
          label: "Geography / Agricultural Sciences",
          weights: { agriculture: 3, stem: 1, services: 1 },
        },
        {
          id: "history_law",
          label: "History / Law-related topics",
          weights: { law_security: 3, education: 1, business: 1 },
        },
        {
          id: "consumer_hospitality",
          label: "Consumer Studies / Hospitality",
          weights: { services: 3, creative: 1, business: 1 },
        },
        {
          id: "more_stem",
          label: "More STEM / technical subjects",
          weights: { stem: 2, digital: 2, trades: 2 },
        },
      ],
    },
    {
      id: "study_style",
      prompt: "How do you prefer to learn?",
      options: [
        {
          id: "theory",
          label: "Reading, theory, and exams",
          weights: { education: 1, law_security: 1, business: 1, stem: 1 },
        },
        {
          id: "labs",
          label: "Labs, experiments, and problem sets",
          weights: { stem: 2, health: 2, digital: 1 },
        },
        {
          id: "hands_on",
          label: "Hands-on making and fixing",
          weights: { trades: 3, agriculture: 1, creative: 1 },
        },
        {
          id: "projects",
          label: "Projects, presentations, and group work",
          weights: { creative: 2, business: 1, services: 2, education: 1 },
        },
      ],
    },
    {
      id: "further_study",
      prompt: "What kind of further study feels right after school?",
      options: [
        {
          id: "university",
          label: "University degree",
          weights: { stem: 1, health: 1, law_security: 1, education: 1, business: 1 },
        },
        {
          id: "diploma",
          label: "University of Technology / diploma",
          weights: { digital: 2, stem: 1, business: 1, creative: 1 },
        },
        {
          id: "tvet",
          label: "TVET college / occupational certificate",
          weights: { trades: 3, services: 2, agriculture: 1 },
        },
        {
          id: "unsure",
          label: "Not sure yet — show a broad mix",
          weights: {
            stem: 1,
            health: 1,
            business: 1,
            creative: 1,
            trades: 1,
            services: 1,
          },
        },
      ],
    },
  ],
};
