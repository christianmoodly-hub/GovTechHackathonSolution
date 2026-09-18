import type { FavouriteRef, QuestionnaireResultsMap, UserProfile } from "./types";
import {
  escapePdfHtml,
  sanitizePdfFileName,
  writeAndSharePdf,
} from "./pdfDownload";

const QUESTIONNAIRE_LABELS: Record<string, string> = {
  subjectChooser: "Subject Choice",
  careerChoice: "Career Choice",
  jobFit: "Job Fit",
};

function buildPortfolioHtml(options: {
  displayName: string;
  refId: string;
  favourites: FavouriteRef[];
  results: QuestionnaireResultsMap;
}): string {
  const { displayName, refId, favourites, results } = options;
  const generated = new Date().toLocaleString("en-ZA");

  const favouriteRows = favourites
    .slice(0, 40)
    .map(
      (item, index) =>
        `<tr>
          <td>${index + 1}</td>
          <td>${escapePdfHtml(item.type)}</td>
          <td>${escapePdfHtml(item.title)}</td>
        </tr>`,
    )
    .join("");

  const diagnosticBlocks = Object.entries(results)
    .map(([id, result]) => {
      const label = QUESTIONNAIRE_LABELS[id] ?? id;
      const completed = result.completedAt
        ? new Date(result.completedAt).toLocaleString("en-ZA")
        : "—";
      const matches = (result.matches ?? [])
        .slice(0, 8)
        .map(
          (match) =>
            `<li>${escapePdfHtml(match.title)} (${Math.round(match.score)}%)</li>`,
        )
        .join("");
      return `<div class="card">
        <h2>${escapePdfHtml(label)}</h2>
        <p><strong>Completed:</strong> ${escapePdfHtml(completed)}</p>
        ${matches ? `<ul>${matches}</ul>` : "<p>No occupation matches stored.</p>"}
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>DHET Career Portfolio</title>
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
  <h1>My Career Portfolio</h1>
  <p class="sub">DHET · Khetha NCAP · Official learner record (guidance copy)</p>
  <div class="card">
    <p><strong>Learner:</strong> ${escapePdfHtml(displayName)}</p>
    <p><strong>Reference:</strong> DHET-ZA-${escapePdfHtml(refId)}</p>
    <p><strong>Generated:</strong> ${escapePdfHtml(generated)}</p>
  </div>
  <div class="card">
    <h2>Saved items</h2>
    <table>
      <thead><tr><th>#</th><th>Type</th><th>Title</th></tr></thead>
      <tbody>
        ${favouriteRows || "<tr><td colspan='3'>No saved items yet</td></tr>"}
      </tbody>
    </table>
  </div>
  ${diagnosticBlocks || `<div class="card"><p>No completed questionnaires yet.</p></div>`}
  <p class="footer">
    Generated on Khetha NCAP Mobile for Life Orientation / counselling use.
    Verify details against the live DHET / SAQA directories before formal submission.
  </p>
</body>
</html>`;
}

/** Build and share a DHET-style career portfolio PDF from the learner vault. */
export async function downloadCareerPortfolio(options: {
  profile: UserProfile | null;
  displayName: string;
  refId: string;
}): Promise<{ uri: string; fileName: string }> {
  const favourites = options.profile?.favourites ?? [];
  const results = options.profile?.questionnaireResults ?? {};
  const fileName = sanitizePdfFileName(
    `DHET-Portfolio-ZA${options.refId}.pdf`,
  );
  const html = buildPortfolioHtml({
    displayName: options.displayName,
    refId: options.refId,
    favourites,
    results,
  });

  return writeAndSharePdf({
    html,
    fileName,
    dialogTitle: "Save your DHET career portfolio",
  });
}
