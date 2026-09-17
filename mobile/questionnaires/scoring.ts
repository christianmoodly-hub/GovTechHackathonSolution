import type { OccupationSummary, QuestionnaireMatch } from "../services/types";
import {
  DOMAIN_KEYWORDS,
  type CareerDomain,
  type Question,
  type QuestionnaireDefinition,
} from "./domains";

export function emptyDomainScores(): Record<CareerDomain, number> {
  return {
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
}

export function scoreAnswers(
  definition: QuestionnaireDefinition,
  answers: Record<string, string>,
): Record<CareerDomain, number> {
  const scores = emptyDomainScores();

  for (const question of definition.questions) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((item) => item.id === optionId);
    if (!option) continue;
    for (const [domain, weight] of Object.entries(option.weights)) {
      const key = domain as CareerDomain;
      scores[key] += weight ?? 0;
    }
  }

  return scores;
}

function occupationDomainHits(summary: OccupationSummary): Record<CareerDomain, number> {
  const hits = emptyDomainScores();
  const text = summary.searchText;

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS) as [
    CareerDomain,
    string[],
  ][]) {
    let count = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) count += 1;
    }
    hits[domain] = count;
  }

  return hits;
}

export function matchOccupations(
  domainScores: Record<CareerDomain, number>,
  summaries: OccupationSummary[],
  limit = 12,
): QuestionnaireMatch[] {
  const activeDomains = (
    Object.entries(domainScores) as [CareerDomain, number][]
  ).filter(([, score]) => score > 0);

  if (!activeDomains.length) return [];

  const ranked: QuestionnaireMatch[] = [];

  for (const summary of summaries) {
    const hits = occupationDomainHits(summary);
    let score = 0;
    for (const [domain, weight] of activeDomains) {
      score += weight * hits[domain];
    }
    if (score <= 0) continue;
    ranked.push({
      occupationCode: summary.occupationCode,
      title: summary.title,
      score,
    });
  }

  ranked.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return ranked.slice(0, limit);
}

export function answerLabel(
  question: Question,
  optionId: string | undefined,
): string {
  if (!optionId) return "";
  return question.options.find((option) => option.id === optionId)?.label ?? optionId;
}
