import argparse
import json
import os
import re
import time
from urllib.parse import quote, urljoin

from bs4 import BeautifulSoup, NavigableString, Tag
import requests

from models import OccupationDetail, QualificationRef

BASE_URL = "https://ncap.careerhelp.org.za"
# Bump whenever OccupationDetail fields/parsing change so resume re-fetches stale rows
SCHEMA_VERSION = 2
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,"
        " like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

CATEGORY_STARTS = [
    "/occupations",
    "/occupations/search/Green career/page/1/",
    "/occupations/search/High demand/page/1/",
    "/occupations/search/Trades/page/1/",
]

ALPHABET = "abcdefghijklmnopqrstuvwxyz"
OCCUPATION_HREF_RE = re.compile(r"/occupation/[0-9a-fA-F-]{36}", re.I)
PAGE_HREF_RE = re.compile(r"/page/(\d+)/?$", re.I)
CODE_RE = re.compile(
    r"^(?P<title>.*?)\s*\(Occupation Code\s*:\s*(?P<code>\d+)\)\s*$",
    re.I,
)


def make_session():
  session = requests.Session()
  session.headers.update(HEADERS)
  try:
    session.get(BASE_URL + "/", timeout=15)
  except Exception as e:
    print(f"[-] Warm-up request failed: {e}")
  return session


def encode_path(path):
  if path.startswith("http"):
    return path
  return quote(path, safe="/:")


def get_soup(session, url, retries=3):
  url = encode_path(url)
  for attempt in range(1, retries + 1):
    try:
      response = session.get(
          url,
          headers={"Referer": BASE_URL + "/occupations"},
          timeout=25,
      )
      if response.status_code == 200 and response.text.strip():
        return BeautifulSoup(response.text, "html.parser")
      print(
          f"[-] Failed to fetch {url}: Status {response.status_code}"
          f" (attempt {attempt}/{retries})"
      )
      if response.status_code >= 500:
        try:
          session.get(BASE_URL + "/", timeout=15)
        except Exception:
          pass
    except Exception as e:
      print(f"[-] Error requesting {url}: {e} (attempt {attempt}/{retries})")
    time.sleep(1.5 * attempt)
  return None


def normalize_url(href):
  if not href:
    return ""
  if href.startswith("http://ncap.careerhelp.org.za"):
    href = "https://" + href[len("http://"):]
  return urljoin(BASE_URL + "/", href)


def extract_occupations_from_soup(soup, category):
  found = []
  for a in soup.find_all("a", href=True):
    href = a["href"]
    if not OCCUPATION_HREF_RE.search(href):
      continue
    title = a.get_text(" ", strip=True)
    if not title:
      continue
    found.append({
        "title": title,
        "url": normalize_url(href),
        "category": category,
    })
  return found


def find_max_page(soup):
  max_page = 1
  for a in soup.find_all("a", href=True):
    match = PAGE_HREF_RE.search(a["href"])
    if match:
      max_page = max(max_page, int(match.group(1)))
  return max_page


def iter_paginated(session, start_path, category_label):
  results = []
  start_url = BASE_URL + start_path if start_path.startswith("/") else start_path
  soup = get_soup(session, start_url)
  if not soup:
    return results

  results.extend(extract_occupations_from_soup(soup, category_label))
  max_page = find_max_page(soup)
  print(f"    [+] page 1: {len(results)} items (max page seen: {max_page})")

  if "/page/" not in start_path:
    return results

  base_prefix = re.sub(r"/page/\d+/?$", "", start_path.rstrip("/"))
  for page in range(2, max_page + 1):
    page_path = f"{base_prefix}/page/{page}/"
    page_url = BASE_URL + page_path
    print(f"    [-] Fetching page {page}: {page_url}")
    page_soup = get_soup(session, page_url)
    if not page_soup:
      continue
    page_items = extract_occupations_from_soup(page_soup, category_label)
    print(f"    [+] page {page}: {len(page_items)} items")
    results.extend(page_items)
    max_page = max(max_page, find_max_page(page_soup))
    time.sleep(0.75)
  return results


def scrape_alphabetical(session, occupations, seen_urls):
  print("[-] Scraping alphabetical A–Z listings...")
  for letter in ALPHABET:
    start = (
        "/occupations"
        if letter == "a"
        else f"/occupations/alphabetical/{letter}/page/1/"
    )
    print(f"[-] Letter {letter.upper()}: {BASE_URL}{start}")
    items = iter_paginated(session, start, f"alphabetical/{letter}")

    if letter == "a":
      soup = get_soup(session, BASE_URL + "/occupations")
      max_page = find_max_page(soup) if soup else 1
      for page in range(2, max_page + 1):
        page_path = f"/occupations/alphabetical/a/page/{page}/"
        print(f"    [-] Fetching page {page}: {BASE_URL}{page_path}")
        page_soup = get_soup(session, BASE_URL + page_path)
        if not page_soup:
          continue
        page_items = extract_occupations_from_soup(
            page_soup, f"alphabetical/{letter}"
        )
        print(f"    [+] page {page}: {len(page_items)} items")
        items.extend(page_items)
        time.sleep(0.75)

    for item in items:
      if item["url"] not in seen_urls:
        seen_urls.add(item["url"])
        occupations.append(item)
    time.sleep(0.75)


def scrape_occupations():
  print("[-] Starting live occupation scrape from /occupations...")
  session = make_session()
  occupations = []
  seen_urls = set()

  for cat_path in CATEGORY_STARTS:
    if cat_path == "/occupations":
      continue
    print(f"[-] Scraping category endpoint: {BASE_URL}{cat_path}")
    items = iter_paginated(session, cat_path, cat_path)
    for item in items:
      if item["url"] not in seen_urls:
        seen_urls.add(item["url"])
        occupations.append(item)
    time.sleep(1)

  scrape_alphabetical(session, occupations, seen_urls)
  print(f"[+] Total unique occupations discovered: {len(occupations)}")
  return occupations


def find_heading(soup, label):
  for h in soup.select("h2.heading"):
    if label.lower() in h.get_text(" ", strip=True).lower():
      return h
  return None


def texts_until_next_heading(start_h2):
  """Collect stripped text nodes / paragraph texts until the next h2.heading."""
  values = []
  for el in start_h2.next_siblings:
    if isinstance(el, Tag) and el.name == "h2":
      break
    if isinstance(el, NavigableString):
      text = str(el).strip()
      if text:
        values.append(text)
    elif isinstance(el, Tag):
      if el.name in {"script", "style", "br"}:
        continue
      if el.name == "div" and "clear" in (el.get("class") or []):
        continue
      text = el.get_text(" ", strip=True)
      if text:
        values.append(text)
  return values


def parse_title_and_code(raw_title, soup=None):
  """Prefer detail-page H1; fall back to listing title string."""
  candidates = []
  if soup is not None:
    for h1 in soup.find_all("h1"):
      text = h1.get_text(" ", strip=True)
      if "occupation code" in text.lower():
        candidates.append(text)
  if raw_title:
    candidates.append(raw_title)

  for candidate in candidates:
    match = CODE_RE.match(candidate.strip())
    if match:
      return match.group("title").strip(), match.group("code")

  # Last resort: keep raw title, unknown code
  return (raw_title or "Unknown").strip(), "unknown"


def scrape_occupation_details(session, url, listing_title=""):
  """Parse a detail page into fields for OccupationDetail."""
  soup = get_soup(session, url)
  if not soup:
    return None

  title, code = parse_title_and_code(listing_title, soup)

  tasks_h = find_heading(soup, "Tasks")
  alt_h = find_heading(soup, "Alternate Occupation Names")
  path_h = find_heading(soup, "Learning Pathways")

  tasks = texts_until_next_heading(tasks_h) if tasks_h else []

  alternative_titles = []
  if alt_h:
    for el in alt_h.next_siblings:
      if isinstance(el, Tag) and el.name == "h2":
        break
      if isinstance(el, Tag) and el.name == "p":
        text = el.get_text(" ", strip=True)
        if text:
          alternative_titles.append(text)

  qualifications = []
  entry_requirements = []
  if path_h:
    container = path_h.find_parent("div", class_="col-md-6") or path_h.parent
    seen_qual_titles = set()
    for career_title in container.select("h2.career-title"):
      text = career_title.get_text(" ", strip=True)
      text = re.sub(r"\s*\d+\s*$", "", text).strip()
      if not text or text in seen_qual_titles:
        continue
      seen_qual_titles.add(text)
      qual_url = _extract_qualification_url(career_title)
      qualifications.append(QualificationRef(title=text, url=qual_url))

    # Preserve DOM order; keep first occurrence of each requirement string
    seen_reqs = set()
    for dd in container.select("dd"):
      text = dd.get_text(" ", strip=True)
      if not text or text in seen_reqs:
        continue
      seen_reqs.add(text)
      entry_requirements.append(text)

  # If listing title differs from official title, keep it as an alternate
  if listing_title:
    listing_clean, _ = parse_title_and_code(listing_title)
    if (
        listing_clean
        and listing_clean.lower() != title.lower()
        and listing_clean not in alternative_titles
    ):
      alternative_titles.insert(0, listing_clean)

  return OccupationDetail(
      occupation_code=code,
      title=title,
      url=url,
      tasks=tasks,
      qualifications=qualifications,
      entry_requirements=entry_requirements,
      alternative_titles=alternative_titles,
      schema_version=SCHEMA_VERSION,
  )


def _extract_qualification_url(career_title):
  """Prefer a real page link near the pathway title; ignore collapse #fragments."""
  candidates = []
  parent_a = career_title.find_parent("a")
  if parent_a and parent_a.has_attr("href"):
    candidates.append(parent_a["href"])
  for a in career_title.find_all("a", href=True):
    candidates.append(a["href"])
  # Sibling / nearby anchors inside the same pathway accordion block
  block = career_title.find_parent("div", class_="career") or career_title.parent
  if block:
    for a in block.find_all("a", href=True):
      candidates.append(a["href"])

  for href in candidates:
    if not href or href.startswith("#"):
      continue
    if href.lower().startswith("javascript:"):
      continue
    return normalize_url(href)
  return None


def save_to_json(data, filename):
  os.makedirs("output", exist_ok=True)
  filepath = os.path.join("output", filename)
  with open(filepath, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
  print(f"[+] Saved structured data to {filepath}")


def load_json(filename, default=None):
  filepath = os.path.join("output", filename)
  if not os.path.exists(filepath):
    return default if default is not None else []
  with open(filepath, encoding="utf-8") as f:
    return json.load(f)


def enrich_occupations(limit=None, delay=0.75):
  """Enrich listing records into validated OccupationDetail models."""
  listings = load_json("occupations.json", [])
  if not listings:
    print("[-] No listings found in output/occupations.json. Run listing scrape first.")
    return []

  if limit is not None:
    listings = listings[:limit]

  existing = load_json("occupation_details.json", [])
  by_url = {row["url"]: row for row in existing if "url" in row}
  current_version_cached = sum(
      1 for row in by_url.values() if row.get("schema_version") == SCHEMA_VERSION
  )
  print(
      f"[-] Enriching {len(listings)} listings "
      f"(cache={len(by_url)}, schema_v{SCHEMA_VERSION} hits={current_version_cached})..."
  )

  session = make_session()
  enriched = []
  failures = []

  for idx, item in enumerate(listings, start=1):
    url = item.get("url", "")
    listing_title = item.get("title", "")

    cached = by_url.get(url)
    if cached and cached.get("schema_version") == SCHEMA_VERSION:
      try:
        enriched.append(OccupationDetail.model_validate(cached))
        continue
      except Exception:
        # Stale/invalid cache shape — fall through and re-fetch
        pass

    print(f"[-] ({idx}/{len(listings)}) {listing_title[:70]}")
    detail = scrape_occupation_details(session, url, listing_title)
    if detail is None:
      failures.append(url)
      continue

    enriched.append(detail)
    by_url[url] = detail.model_dump()

    # Checkpoint every 25 records so long runs are resumable
    if idx % 25 == 0:
      save_to_json([d.model_dump() for d in enriched], "occupation_details.json")
      print(f"    [+] checkpoint saved ({len(enriched)} records)")

    time.sleep(delay)

  payload = [d.model_dump() for d in enriched]
  save_to_json(payload, "occupation_details.json")
  print(f"[+] Enriched {len(payload)} occupations ({len(failures)} failures)")
  if failures:
    save_to_json(failures, "occupation_detail_failures.json")
  write_qa_summary(payload, failures)
  return enriched


def write_qa_summary(records, failures=None):
  """Write a quick data-quality rollup for app planning."""
  failures = failures or []
  summary = {
      "schema_version": SCHEMA_VERSION,
      "total_records": len(records),
      "unknown_occupation_codes": sum(
          1 for r in records if r.get("occupation_code") in (None, "", "unknown")
      ),
      "empty_tasks": sum(1 for r in records if not r.get("tasks")),
      "empty_qualifications": sum(1 for r in records if not r.get("qualifications")),
      "empty_entry_requirements": sum(
          1 for r in records if not r.get("entry_requirements")
      ),
      "qualifications_with_url": sum(
          1
          for r in records
          for q in r.get("qualifications", [])
          if q.get("url")
      ),
      "fetch_failures": len(failures),
  }
  save_to_json(summary, "qa_summary.json")
  print("[+] QA summary:")
  for key, value in summary.items():
    print(f"    {key}: {value}")
  return summary


def main():
  parser = argparse.ArgumentParser(description="NCAP occupation scraper")
  parser.add_argument(
      "mode",
      nargs="?",
      default="enrich",
      choices=["list", "enrich", "all"],
      help="list=listings only, enrich=detail pages, all=both",
  )
  parser.add_argument(
      "--limit",
      type=int,
      default=None,
      help="Limit number of detail pages to enrich (for testing)",
  )
  parser.add_argument(
      "--delay",
      type=float,
      default=0.75,
      help="Polite delay between detail requests",
  )
  args = parser.parse_args()

  if args.mode in {"list", "all"}:
    data = scrape_occupations()
    if data:
      save_to_json(data, "occupations.json")
    else:
      print("[-] Listing scrape yielded 0 results.")

  if args.mode in {"enrich", "all"}:
    enrich_occupations(limit=args.limit, delay=args.delay)


if __name__ == "__main__":
  main()
