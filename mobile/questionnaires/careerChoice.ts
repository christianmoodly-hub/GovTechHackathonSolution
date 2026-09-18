import type { CareerDomain, QuestionOption, QuestionnaireDefinition } from "./domains";
import { STITCH_JOBFIT_IMAGES } from "../utils/occupationPresentation";

const HERO_SOLAR = require("../assets/stitch/career-choice/img0.jpg");
const HERO_WORKSHOP = STITCH_JOBFIT_IMAGES.workshop;
const HERO_OFFICE = STITCH_JOBFIT_IMAGES.office;
const HERO_COMMUNITY = STITCH_JOBFIT_IMAGES.community;
const HERO_OUTDOORS = STITCH_JOBFIT_IMAGES.outdoors;
const HERO_RESULTS = require("../assets/stitch/results/img1.jpg");

function scaleWeights(
  base: Partial<Record<CareerDomain, number>>,
  multiplier: number,
): Partial<Record<CareerDomain, number>> {
  if (multiplier <= 0) return {};
  const next: Partial<Record<CareerDomain, number>> = {};
  for (const [domain, weight] of Object.entries(base) as [CareerDomain, number][]) {
    next[domain] = Number((weight * multiplier).toFixed(2));
  }
  return next;
}

/**
 * Shared Holland RIASEC Likert scale.
 * Labels are placeholders — resolveCareerChoice overwrites from i18n.
 */
function likertOptions(
  base: Partial<Record<CareerDomain, number>>,
): QuestionOption[] {
  return [
    {
      id: "strongly_dislike",
      label: "",
      emoji: "😡",
      weights: {},
    },
    {
      id: "dislike",
      label: "",
      emoji: "🙁",
      weights: {},
    },
    {
      id: "neutral",
      label: "",
      emoji: "😐",
      weights: scaleWeights(base, 0.25),
    },
    {
      id: "like",
      label: "",
      emoji: "🙂",
      weights: scaleWeights(base, 1),
    },
    {
      id: "strongly_like",
      label: "",
      emoji: "🤩",
      weights: scaleWeights(base, 2),
    },
  ];
}

/** Interest / RIASEC tool — Stitch Career Choice Questionnaire. */
export const careerChoice: QuestionnaireDefinition = {
  id: "careerChoice",
  title: "Career Choice",
  profilerTitle: "Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  subtitle:
    "Rate how much you would enjoy each activity. Honest answers improve occupation matching against the national NCAP database.",
  questions: [
    {
      id: "riasec_trades_solar",
      prompt:
        "How much would you enjoy assembling electrical components, fixing machinery, or installing solar panels?",
      helpText:
        "Ungakujabulela kangakanani ukuhlanganisa izingxenye zikagesi noma ukulungisa imishini?",
      categoryLabel: "Realistic & Investigative • Hands-on & Analytical",
      categoryIcon: "build",
      heroImage: HERO_SOLAR,
      heroTag: "Practical Skills • Green Tech",
      heroMeta: "TVET Pathway",
      options: likertOptions({ trades: 2, stem: 1.5, agriculture: 0.5 }),
    },
    {
      id: "riasec_stem_lab",
      prompt:
        "How much would you enjoy solving technical problems, running experiments, or analysing data in a lab or workshop?",
      helpText:
        "Ungakujabulela kangakanani ukuxazulula izinkinga zobuchwepheshe noma ukuhlaziya idatha?",
      categoryLabel: "Investigative • STEM & Analysis",
      categoryIcon: "biotech",
      heroImage: HERO_WORKSHOP,
      heroTag: "STEM • Problem Solving",
      heroMeta: "University / UoT",
      options: likertOptions({ stem: 2.5, digital: 1, trades: 0.5 }),
    },
    {
      id: "riasec_digital",
      prompt:
        "How much would you enjoy building software, websites, apps, or digital systems?",
      helpText:
        "Ungakujabulela kangakanani ukwakha isofthiwe, amawebhusayithi noma izinhlelo zedijithali?",
      categoryLabel: "Investigative & Conventional • Digital",
      categoryIcon: "computer",
      heroImage: HERO_OFFICE,
      heroTag: "ICT & Coding",
      heroMeta: "Digital Economy",
      options: likertOptions({ digital: 2.5, stem: 1, business: 0.5 }),
    },
    {
      id: "riasec_health",
      prompt:
        "How much would you enjoy caring for people’s health, wellbeing, or recovery?",
      helpText:
        "Ungakujabulela kangakanani ukunakekela impilo noma inhlalakahle yabantu?",
      categoryLabel: "Social • Care & Support",
      categoryIcon: "medical_services",
      heroImage: HERO_COMMUNITY,
      heroTag: "Health & Care",
      heroMeta: "Public Service",
      options: likertOptions({ health: 2.5, services: 1, education: 0.5 }),
    },
    {
      id: "riasec_education",
      prompt:
        "How much would you enjoy teaching, coaching, or helping others learn new skills?",
      helpText:
        "Ungakujabulela kangakanani ukufundisa noma ukusiza abanye ukufunda amakhono amasha?",
      categoryLabel: "Social • Learning & Guidance",
      categoryIcon: "school",
      heroImage: HERO_RESULTS,
      heroTag: "Education Pathway",
      heroMeta: "Life Orientation",
      options: likertOptions({ education: 2.5, services: 1, health: 0.5 }),
    },
    {
      id: "riasec_business",
      prompt:
        "How much would you enjoy leading teams, managing money, or growing a business?",
      helpText:
        "Ungakujabulela kangakanani ukuhola amaqembu, ukuphatha imali noma ukukhulisa ibhizinisi?",
      categoryLabel: "Enterprising • Business & Leadership",
      categoryIcon: "trending_up",
      heroImage: HERO_OFFICE,
      heroTag: "Enterprise & Finance",
      heroMeta: "Commerce Route",
      options: likertOptions({ business: 2.5, services: 1, law_security: 0.5 }),
    },
    {
      id: "riasec_creative",
      prompt:
        "How much would you enjoy designing, creating media, performing, or making visual art?",
      helpText:
        "Ungakujabulela kangakanani ukudizayina, ukudala imidiya noma ubuciko?",
      categoryLabel: "Artistic • Creative Expression",
      categoryIcon: "palette",
      heroImage: HERO_RESULTS,
      heroTag: "Creative Industries",
      heroMeta: "Design & Media",
      options: likertOptions({ creative: 2.5, digital: 1, services: 0.5 }),
    },
    {
      id: "riasec_agriculture",
      prompt:
        "How much would you enjoy working with plants, animals, land, or food production outdoors?",
      helpText:
        "Ungakujabulela kangakanani ukusebenza ngezitshalo, izilwane noma ukukhiqiza ukudla?",
      categoryLabel: "Realistic • Land & Food Systems",
      categoryIcon: "agriculture",
      heroImage: HERO_OUTDOORS,
      heroTag: "Agriculture & Environment",
      heroMeta: "Green Economy",
      options: likertOptions({ agriculture: 2.5, trades: 1, stem: 0.5 }),
    },
    {
      id: "riasec_law_security",
      prompt:
        "How much would you enjoy enforcing rules, protecting people, or working in justice and security?",
      helpText:
        "Ungakujabulela kangakanani ukuvikela abantu noma ukusebenza kwezomthetho nokuphepha?",
      categoryLabel: "Conventional & Enterprising • Law & Security",
      categoryIcon: "verified",
      heroImage: HERO_COMMUNITY,
      heroTag: "Justice & Safety",
      heroMeta: "Public Service",
      options: likertOptions({ law_security: 2.5, services: 1, business: 0.5 }),
    },
    {
      id: "riasec_services",
      prompt:
        "How much would you enjoy helping customers, hospitality work, or hands-on community service?",
      helpText:
        "Ungakujabulela kangakanani ukusiza amakhasimende noma umsebenzi wokuphatha izivakashi?",
      categoryLabel: "Social & Enterprising • Services",
      categoryIcon: "support_agent",
      heroImage: HERO_COMMUNITY,
      heroTag: "Service Economy",
      heroMeta: "People First",
      options: likertOptions({ services: 2.5, business: 1, education: 0.5 }),
    },
  ],
};
