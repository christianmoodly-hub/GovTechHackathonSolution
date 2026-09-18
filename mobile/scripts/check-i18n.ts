/**
 * Assert every i18n bundle exposes all 11 AppLocales and no empty string leaves.
 * Run: npx tsx scripts/check-i18n.ts  OR  node --import tsx scripts/check-i18n.ts
 * Fallback: npx tsc --noEmit also catches missing Record keys via expandSaLocales/createBundle.
 */
import { APP_LOCALES, type AppLocale } from "../i18n/types";
import { getCommonStrings } from "../i18n/common";
import { getTabStrings } from "../i18n/tabs";
import { getHomeStrings } from "../i18n/home";
import { getAuthStrings } from "../i18n/auth";
import { getOnboardingStrings } from "../i18n/onboarding";
import { getSavedStrings } from "../i18n/saved";
import { getHelplineStrings } from "../i18n/helpline";
import { getDirectoryStrings } from "../i18n/directory";
import { getQuestionnaireChromeStrings } from "../i18n/questionnaires/chrome";
import { getDecisionsStrings } from "../i18n/questionnaires/decisions";
import { getCareerChoiceStrings } from "../i18n/questionnaires/careerChoice";
import { getJobFitStrings } from "../i18n/questionnaires/jobFit";
import { getSubjectChooserStrings } from "../i18n/questionnaires/subjectChooser";
import { getApsStrings } from "../i18n/questionnaires/aps";
import { getAssistantStrings } from "../i18n/assistant";

type Getter = (locale: string) => unknown;

const BUNDLES: { name: string; get: Getter }[] = [
  { name: "common", get: getCommonStrings },
  { name: "tabs", get: getTabStrings },
  { name: "home", get: getHomeStrings },
  { name: "auth", get: getAuthStrings },
  { name: "onboarding", get: getOnboardingStrings },
  { name: "saved", get: getSavedStrings },
  { name: "helpline", get: getHelplineStrings },
  { name: "directory", get: getDirectoryStrings },
  { name: "questionnaires.chrome", get: getQuestionnaireChromeStrings },
  { name: "questionnaires.decisions", get: getDecisionsStrings },
  { name: "questionnaires.careerChoice", get: getCareerChoiceStrings },
  { name: "questionnaires.jobFit", get: getJobFitStrings },
  { name: "questionnaires.subjectChooser", get: getSubjectChooserStrings },
  { name: "questionnaires.aps", get: getApsStrings },
  { name: "assistant", get: getAssistantStrings },
];

function collectEmptyStrings(
  value: unknown,
  path: string,
  out: string[],
): void {
  if (typeof value === "string") {
    if (value.trim() === "") out.push(path);
    return;
  }
  if (typeof value === "function") {
    try {
      const sample = (value as (...args: never[]) => unknown)(
        ..."123".split("") as never[],
      );
      if (typeof sample === "string" && sample.trim() === "") {
        out.push(`${path}()`);
      }
    } catch {
      // interpolators with required args — skip
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectEmptyStrings(child, `${path}.${key}`, out);
    }
  }
}

function assertCareerChoiceIds(locale: AppLocale): string[] {
  const errors: string[] = [];
  const s = getCareerChoiceStrings(locale);
  const expectedQuestions = [
    "riasec_trades_solar",
    "riasec_stem_lab",
    "riasec_digital",
    "riasec_health",
    "riasec_education",
    "riasec_business",
    "riasec_creative",
    "riasec_agriculture",
    "riasec_law_security",
    "riasec_services",
  ];
  for (const id of expectedQuestions) {
    if (!(id in s.questions)) {
      errors.push(`${locale}: missing careerChoice question ${id}`);
    }
  }
  const likert = [
    "strongly_dislike",
    "dislike",
    "neutral",
    "like",
    "strongly_like",
  ];
  for (const id of likert) {
    if (!(id in s.likert)) {
      errors.push(`${locale}: missing likert ${id}`);
    }
  }
  return errors;
}

let failed = 0;

console.log(`Checking ${BUNDLES.length} bundles × ${APP_LOCALES.length} locales…`);

for (const bundle of BUNDLES) {
  for (const locale of APP_LOCALES) {
    let data: unknown;
    try {
      data = bundle.get(locale);
    } catch (err) {
      console.error(`FAIL ${bundle.name}[${locale}]:`, err);
      failed += 1;
      continue;
    }
    if (data == null) {
      console.error(`FAIL ${bundle.name}[${locale}]: null/undefined`);
      failed += 1;
      continue;
    }
    const empties: string[] = [];
    collectEmptyStrings(data, bundle.name, empties);
    if (empties.length) {
      console.error(
        `FAIL ${bundle.name}[${locale}]: empty strings:\n  ${empties.slice(0, 20).join("\n  ")}`,
      );
      failed += 1;
    }
  }
}

for (const locale of APP_LOCALES) {
  for (const err of assertCareerChoiceIds(locale)) {
    console.error(`FAIL ${err}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\ni18n check failed with ${failed} issue(s).`);
  process.exit(1);
}

console.log("i18n check passed.");
