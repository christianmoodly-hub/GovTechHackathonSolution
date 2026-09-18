import { careerChoice } from "./careerChoice";
import type { QuestionnaireDefinition } from "./domains";
import { getCareerChoiceStrings } from "../i18n/questionnaires/careerChoice";

type QuestionId = keyof ReturnType<
  typeof getCareerChoiceStrings
>["questions"];

type LikertId = keyof ReturnType<typeof getCareerChoiceStrings>["likert"];

/**
 * Returns a Career Choice questionnaire with locale-specific copy.
 * Single label per option (no altLabel).
 */
export function resolveCareerChoice(
  locale: string | null | undefined,
): QuestionnaireDefinition {
  const strings = getCareerChoiceStrings(locale);

  return {
    ...careerChoice,
    title: strings.title,
    subtitle: strings.subtitle,
    profilerTitle: strings.profilerTitle,
    profilerSubtitle: strings.profilerSubtitle,
    questions: careerChoice.questions.map((question) => {
      const localized = strings.questions[question.id as QuestionId];
      return {
        ...question,
        prompt: localized?.prompt ?? question.prompt,
        helpText: localized?.helpText ?? question.helpText,
        categoryLabel: localized?.categoryLabel ?? question.categoryLabel,
        heroTag: localized?.heroTag ?? question.heroTag,
        heroMeta: localized?.heroMeta ?? question.heroMeta,
        options: question.options.map((option) => {
          const likertLabel = strings.likert[option.id as LikertId];
          return {
            ...option,
            label: likertLabel ?? option.label,
            altLabel: undefined,
          };
        }),
      };
    }),
  };
}
