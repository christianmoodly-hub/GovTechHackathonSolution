import {
  JOB_FIT_DEMAND,
  JOB_FIT_ENVIRONMENTS,
  JOB_FIT_FOLLOW_UPS,
  type JobFitDemandOption,
  type JobFitEnvOption,
  type JobFitFollowUp,
} from "./jobFitData";
import { jobFit } from "./jobFit";
import type { QuestionnaireDefinition } from "./domains";
import { getJobFitStrings } from "../i18n/questionnaires/jobFit";

export type LocalizedJobFitData = {
  title: string;
  subtitle: string;
  envPrompt: string;
  envHelp: string;
  physicalPrompt: string;
  physicalHelp: string;
  environments: JobFitEnvOption[];
  demand: JobFitDemandOption[];
  followUps: JobFitFollowUp[];
};

/** Localized Job Fit screen data (environments, demand, follow-ups). */
export function resolveJobFitData(
  locale: string | null | undefined,
): LocalizedJobFitData {
  const s = getJobFitStrings(locale);

  return {
    title: s.title,
    subtitle: s.subtitle,
    envPrompt: s.envPrompt,
    envHelp: s.envHelp,
    physicalPrompt: s.physicalPrompt,
    physicalHelp: s.physicalHelp,
    environments: JOB_FIT_ENVIRONMENTS.map((env) => {
      const loc = s.environments[env.id as keyof typeof s.environments];
      return {
        ...env,
        label: loc?.label ?? env.label,
        subtitle: loc?.subtitle ?? env.subtitle,
        description: loc?.description ?? env.description,
        imageOverlay: loc?.imageOverlay ?? env.imageOverlay,
      };
    }),
    demand: JOB_FIT_DEMAND.map((item) => {
      const loc = s.demand[item.id as keyof typeof s.demand];
      return {
        ...item,
        label: loc?.label ?? item.label,
        detail: loc?.detail ?? item.detail,
      };
    }),
    followUps: JOB_FIT_FOLLOW_UPS.map((fu) => {
      if (fu.id === "interaction") {
        const loc = s.followUps.interaction;
        return {
          ...fu,
          prompt: loc.prompt,
          helpText: loc.helpText,
          options: fu.options.map((opt) => {
            const o =
              loc.options[opt.id as keyof typeof loc.options];
            return {
              ...opt,
              label: o?.label ?? opt.label,
              description: o?.description ?? opt.description,
            };
          }),
        };
      }
      if (fu.id === "structure") {
        const loc = s.followUps.structure;
        return {
          ...fu,
          prompt: loc.prompt,
          options: fu.options.map((opt) => {
            const o =
              loc.options[opt.id as keyof typeof loc.options];
            return {
              ...opt,
              label: o?.label ?? opt.label,
            };
          }),
        };
      }
      const loc = s.followUps.schedule;
      return {
        ...fu,
        prompt: loc.prompt,
        options: fu.options.map((opt) => {
          const o = loc.options[opt.id as keyof typeof loc.options];
          return {
            ...opt,
            label: o?.label ?? opt.label,
          };
        }),
      };
    }),
  };
}

/**
 * QuestionnaireDefinition form for shared QuestionnaireScreen flows.
 * Prefer resolveJobFitData for the custom Job Fit UI.
 */
export function resolveJobFit(
  locale: string | null | undefined,
): QuestionnaireDefinition {
  const data = resolveJobFitData(locale);
  const base = jobFit;

  return {
    ...base,
    title: data.title,
    subtitle: data.subtitle,
    questions: base.questions.map((question) => {
      if (question.id === "environment") {
        return {
          ...question,
          prompt: data.envPrompt,
          helpText: data.envHelp,
          options: question.options.map((opt) => {
            const env = data.environments.find((e) => e.id === opt.id);
            return {
              ...opt,
              label: env?.label ?? opt.label,
              description: env?.description ?? opt.description,
              altLabel: undefined,
            };
          }),
        };
      }
      if (question.id === "physical") {
        return {
          ...question,
          prompt: data.physicalPrompt,
          helpText: data.physicalHelp,
          options: question.options.map((opt) => {
            const d = data.demand.find((item) => item.id === opt.id);
            return {
              ...opt,
              label: d ? `${d.label} — ${d.detail}` : opt.label,
              altLabel: undefined,
            };
          }),
        };
      }
      const followUp = data.followUps.find((f) => f.id === question.id);
      if (!followUp) return { ...question, options: question.options.map((o) => ({ ...o, altLabel: undefined })) };
      return {
        ...question,
        prompt: followUp.prompt,
        helpText: followUp.helpText,
        options: question.options.map((opt) => {
          const match = followUp.options.find((o) => o.id === opt.id);
          return {
            ...opt,
            label: match?.label ?? opt.label,
            description: match?.description ?? opt.description,
            altLabel: undefined,
          };
        }),
      };
    }),
  };
}
