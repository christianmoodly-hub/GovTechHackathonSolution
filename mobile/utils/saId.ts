/** Parse YYMMDD (+ optional gender) from a South African 13-digit ID number. */

export type SaIdDerived = {
  dateOfBirth: string; // YYYY-MM-DD
  gender: "Female" | "Male";
};

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const dt = new Date(year, month - 1, day);
  return (
    dt.getFullYear() === year &&
    dt.getMonth() === month - 1 &&
    dt.getDate() === day
  );
}

/**
 * First 6 digits = YYMMDD. Century: prefer 1900s when 20YY would be in the future.
 * Digits 7–10 (SSSS): >= 5000 → male, else female.
 */
export function deriveFromSaId(raw: string): SaIdDerived | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 6) return null;

  const yy = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const dd = Number(digits.slice(4, 6));
  if (!Number.isFinite(yy) || !Number.isFinite(mm) || !Number.isFinite(dd)) {
    return null;
  }

  const now = new Date();
  let year = 2000 + yy;
  if (!isValidCalendarDate(year, mm, dd) || new Date(year, mm - 1, dd) > now) {
    year = 1900 + yy;
  }
  if (!isValidCalendarDate(year, mm, dd)) return null;

  const dateOfBirth = `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;

  if (digits.length < 10) {
    return { dateOfBirth, gender: "Female" }; // gender ignored until SSSS present
  }

  const sequence = Number(digits.slice(6, 10));
  const gender: "Female" | "Male" = sequence >= 5000 ? "Male" : "Female";
  return { dateOfBirth, gender };
}
