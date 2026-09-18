import type { Qualification } from "./types";
import {
  escapePdfHtml,
  sanitizePdfFileName,
  writeAndSharePdf,
} from "./pdfDownload";
import {
  qualificationCurriculum,
  qualificationDescription,
  qualificationNqfLabel,
  qualificationSaqaId,
} from "../utils/qualificationPresentation";

function buildCurriculumHtml(qualification: Qualification): string {
  const nqf = qualificationNqfLabel(qualification.nqfLevel);
  const saqa =
    qualificationSaqaId(
      qualification.id,
      qualification.qualificationId ?? qualification.generalQualificationId,
    ) || "—";
  const description = qualificationDescription(qualification.title);
  const terms = qualificationCurriculum(qualification.title);
  const providers = (qualification.providers ?? [])
    .slice(0, 12)
    .map((p) => `<li>${escapePdfHtml(p.name)}</li>`)
    .join("");

  const termBlocks = terms
    .map((term) => {
      const modules = term.modules
        .map(
          (mod) =>
            `<li><strong>${escapePdfHtml(mod.title)}</strong>${
              mod.meta ? ` — ${escapePdfHtml(mod.meta)}` : ""
            }</li>`,
        )
        .join("");
      return `<div class="card">
        <h2>${escapePdfHtml(term.level)} · ${escapePdfHtml(term.title)}</h2>
        <p class="muted">${escapePdfHtml(term.subtitle)}</p>
        <ul>${modules}</ul>
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapePdfHtml(qualification.title)} — Curriculum</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #0F172A; padding: 32px; }
    h1 { color: #006A4E; margin-bottom: 4px; font-size: 22px; }
    .sub { color: #475569; margin-bottom: 20px; }
    .muted { color: #64748B; font-size: 13px; }
    .card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .footer { margin-top: 24px; font-size: 11px; color: #64748B; }
  </style>
</head>
<body>
  <h1>${escapePdfHtml(qualification.title)}</h1>
  <p class="sub">DHET · Khetha NCAP · Curriculum outline (PDF)</p>
  <div class="card">
    <p><strong>NQF:</strong> ${escapePdfHtml(nqf)}</p>
    <p><strong>SAQA / ID:</strong> ${escapePdfHtml(saqa)}</p>
    ${
      qualification.duration
        ? `<p><strong>Duration:</strong> ${escapePdfHtml(qualification.duration)}</p>`
        : ""
    }
    <p>${escapePdfHtml(description)}</p>
  </div>
  ${termBlocks || `<div class="card"><p>Curriculum modules are summarised in the app for this pathway.</p></div>`}
  ${
    providers
      ? `<div class="card"><h2>Sample campuses / providers</h2><ul>${providers}</ul></div>`
      : ""
  }
  <p class="footer">
    Generated on Khetha NCAP Mobile. Confirm official curriculum and admission rules with the institution and SAQA before applying.
  </p>
</body>
</html>`;
}

/** Download a curriculum outline PDF for a qualification and open the share sheet. */
export async function downloadQualificationCurriculumPdf(
  qualification: Qualification,
): Promise<{ uri: string; fileName: string }> {
  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = sanitizePdfFileName(
    `khetha-curriculum-${qualification.id}-${stamp}.pdf`,
  );
  const html = buildCurriculumHtml(qualification);
  return writeAndSharePdf({
    html,
    fileName,
    dialogTitle: "Save curriculum outline PDF",
  });
}
