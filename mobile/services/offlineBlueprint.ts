import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  escapePdfHtml,
  sanitizePdfFileName,
  shareExistingPdf,
  writeAndSharePdf,
} from "./pdfDownload";
import type { QuestionnaireId, QuestionnaireResult } from "./types";

const INDEX_KEY = "ncap.offlineBlueprints.v1";

export type OfflineBlueprint = {
  id: string;
  questionnaireId: QuestionnaireId;
  title: string;
  fileName: string;
  uri: string;
  savedAt: string;
  matchCount: number;
};

const QUESTIONNAIRE_TITLES: Record<QuestionnaireId, string> = {
  subjectChooser: "Subject Choice Blueprint",
  careerChoice: "Career Choice Blueprint",
  jobFit: "Job Fit Blueprint",
};

function buildBlueprintHtml(
  questionnaireId: QuestionnaireId,
  result: QuestionnaireResult,
  displayName?: string,
): string {
  const title = QUESTIONNAIRE_TITLES[questionnaireId];
  const completed = result.completedAt
    ? new Date(result.completedAt).toLocaleString("en-ZA")
    : "—";
  const domains = Object.entries(result.domainScores ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(
      ([key, score]) =>
        `<li><strong>${escapePdfHtml(key)}</strong>: ${Math.round(score)}%</li>`,
    )
    .join("");
  const matches = (result.matches ?? [])
    .slice(0, 15)
    .map(
      (match, index) =>
        `<tr>
          <td>${index + 1}</td>
          <td>${escapePdfHtml(match.title)}</td>
          <td>${escapePdfHtml(match.occupationCode)}</td>
          <td>${Math.round(match.score)}%</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapePdfHtml(title)}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #0F172A; padding: 32px; }
    h1 { color: #006A4E; margin-bottom: 4px; }
    .sub { color: #475569; margin-bottom: 24px; }
    .card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
    th { background: #E6F4EA; color: #00503A; }
    .footer { margin-top: 28px; font-size: 11px; color: #64748B; }
  </style>
</head>
<body>
  <h1>${escapePdfHtml(title)}</h1>
  <p class="sub">DHET · Khetha NCAP · Offline Career Blueprint</p>
  <div class="card">
    <p><strong>Learner:</strong> ${escapePdfHtml(displayName || "Guest explorer")}</p>
    <p><strong>Assessment:</strong> ${escapePdfHtml(questionnaireId)}</p>
    <p><strong>Completed:</strong> ${escapePdfHtml(completed)}</p>
  </div>
  ${
    domains
      ? `<div class="card"><h2>Domain profile</h2><ul>${domains}</ul></div>`
      : ""
  }
  <div class="card">
    <h2>Top occupation matches</h2>
    <table>
      <thead>
        <tr><th>#</th><th>Occupation</th><th>Code</th><th>Fit</th></tr>
      </thead>
      <tbody>${matches || "<tr><td colspan='4'>No matches</td></tr>"}</tbody>
    </table>
  </div>
  <p class="footer">
    Generated for offline use on Khetha NCAP Mobile. Career information is aligned to DHET / SAQA directories.
    This summary is guidance only and does not replace official counselling.
  </p>
</body>
</html>`;
}

async function readIndex(): Promise<OfflineBlueprint[]> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineBlueprint[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(items: OfflineBlueprint[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(items));
}

export async function listOfflineBlueprints(): Promise<OfflineBlueprint[]> {
  return readIndex();
}

export async function openOfflineBlueprint(
  item: OfflineBlueprint,
): Promise<void> {
  await shareExistingPdf(item.uri, { dialogTitle: item.title });
}

/**
 * Writes a PDF blueprint to app storage and opens the native share sheet
 * so the learner can save it to Files / Drive / WhatsApp.
 */
export async function downloadOfflineBlueprint(options: {
  questionnaireId: QuestionnaireId;
  result: QuestionnaireResult;
  displayName?: string;
}): Promise<OfflineBlueprint> {
  const { questionnaireId, result, displayName } = options;
  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = sanitizePdfFileName(
    `khetha-${questionnaireId}-blueprint-${stamp}.pdf`,
  );
  const html = buildBlueprintHtml(questionnaireId, result, displayName);

  const saved = await writeAndSharePdf({
    html,
    fileName,
    dialogTitle: "Save your Khetha career blueprint",
  });

  const entry: OfflineBlueprint = {
    id: `${questionnaireId}-${Date.now()}`,
    questionnaireId,
    title: QUESTIONNAIRE_TITLES[questionnaireId],
    fileName: saved.fileName,
    uri: saved.uri,
    savedAt: new Date().toISOString(),
    matchCount: result.matches?.length ?? 0,
  };

  const existing = await readIndex();
  const next = [
    entry,
    ...existing.filter(
      (item) =>
        !(
          item.questionnaireId === questionnaireId &&
          item.fileName === fileName
        ),
    ),
  ].slice(0, 20);
  await writeIndex(next);

  return entry;
}
