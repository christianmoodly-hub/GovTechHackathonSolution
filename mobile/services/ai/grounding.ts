/**
 * Heuristics + tool-name allowlists so the assistant cannot answer NCAP catalogue
 * questions from model memory alone.
 */

/** Tools that return DHET/NCAP catalogue facts. */
export const RETRIEVAL_TOOL_NAMES = new Set([
  "search_careers",
  "get_career",
  "search_qualifications",
  "get_qualification",
  "search_institutions",
  "get_institution",
  "search_bursaries",
  "get_bursary",
  "list_bursary_fields",
]);

/**
 * True when the typed question is asking for catalogue facts that must come
 * from search/get tools. App-help / navigation phrasing is excluded.
 */
export function needsCatalogueGrounding(text: string): boolean {
  const q = text.trim().toLowerCase();
  if (q.length < 4) return false;

  // Pure navigation / how-to — covered by app help and action tools.
  if (
    /\b(open|go to|take me|show me the|where is|how do i|how to|navigate|change language|high contrast)\b/.test(
      q,
    ) &&
    !/\b(bursar|occupat|career|qualif|college|university|tvet|nqf|saqa)\b/.test(q)
  ) {
    return false;
  }

  return (
    /\b(bursar|funding|scholarship|nsfas)\b/.test(q) ||
    /\b(career|occupation|job|profession|what does a .+ do)\b/.test(q) ||
    /\b(qualif|diploma|degree|certificate|ncv|nated|nqf|saqa)\b/.test(q) ||
    /\b(university|college|tvet|institution|campus|where can i study)\b/.test(q) ||
    /\b(closing date|entry requirement|aps|admission|how (do i|to) become)\b/.test(
      q,
    ) ||
    /\b(tell me about|what is|details (on|for|about)|requirements for)\b/.test(q)
  );
}
