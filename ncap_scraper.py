import argparse
import json
import os
import re
import time
from urllib.parse import parse_qs, quote, urljoin, urlparse

from bs4 import BeautifulSoup, NavigableString, Tag
import requests

from models import (
    OccupationDetail,
    OfferedQualification,
    Provider,
    ProviderRef,
    Qualification,
    QualificationRef,
)

BASE_URL = "https://ncap.careerhelp.org.za"
# Bump whenever OccupationDetail fields/parsing change so resume re-fetches stale rows
SCHEMA_VERSION = 2
# Separate version gate for qualification scrapes
QUALIFICATION_SCHEMA_VERSION = 1
PROVIDER_SCHEMA_VERSION = 1
ZERO_GUID = "00000000-0000-0000-0000-000000000000"
PROVIDER_INDEX_RE = re.compile(
    r"/LearningProvider/Index/([0-9a-fA-F-]{36})", re.I
)
PROVIDER_PAGE_RE = re.compile(
    r"/LearningProvider/Index/([0-9a-fA-F-]{36})/page/(\d+)", re.I
)
SAQA_ID_RE = re.compile(r"showQualification\.php\?id=(\d+)", re.I)
OFFERED_NQF_RE = re.compile(r"NQF Level\s*:\s*(NQF Level\s*\d+)", re.I)
OFFERED_SAQA_RE = re.compile(r"SAQA Qualification ID\s*:\s*(\d+)", re.I)
NULLISH = re.compile(
    r"^(null|undefined|n/?a|-|none)?$",
    re.I,
)
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


def collect_qualification_urls(occupation_details):
  """Return (unique_urls_in_order, raw_count, title_hints_by_url)."""
  raw = []
  title_hints = {}
  for record in occupation_details:
    for qual in record.get("qualifications") or []:
      url = qual.get("url")
      if not url:
        continue
      if ZERO_GUID in url:
        continue
      raw.append(url)
      title = (qual.get("title") or "").strip()
      if title:
        title_hints.setdefault(url, title)
  # Preserve first-seen order while deduping
  unique = list(dict.fromkeys(raw))
  return unique, len(raw), title_hints


def extract_general_qualification_id(url):
  parsed = urlparse(url)
  values = parse_qs(parsed.query).get("GeneralQualificationId") or []
  if values:
    return values[0]
  # Fallback: last path segment if somehow path-based
  parts = [p for p in parsed.path.split("/") if p]
  return parts[-1] if parts else ""


def _parse_optional_float(value):
  if value is None:
    return None
  if isinstance(value, (int, float)):
    return float(value)
  text = str(value).strip()
  if not text or text.upper() == "NULL":
    return None
  try:
    return float(text)
  except ValueError:
    return None


def _provider_from_api_item(item):
  """Normalize flat or nested LearningProvider payloads into ProviderRef."""
  nested = item.get("LearningProvider")
  place_name = item.get("PlaceName")
  lat = _parse_optional_float(item.get("Latitude"))
  lon = _parse_optional_float(item.get("Longitude"))
  provider_id = None
  name = None
  provider_url = None

  if isinstance(nested, dict):
    name = (
        nested.get("LearningProvider")
        or nested.get("Name")
        or nested.get("name")
    )
    provider_id = nested.get("LearningProviderId") or nested.get("Id")
    lat = lat or _parse_optional_float(nested.get("Latitude"))
    lon = lon or _parse_optional_float(nested.get("Longitude"))
  elif isinstance(nested, str):
    name = nested.strip() or None

  if not name:
    return None

  if provider_id:
    provider_url = (
        f"{BASE_URL}/LearningProvider/Index/{provider_id}/page/1"
    )

  return ProviderRef(
      name=name,
      provider_id=str(provider_id) if provider_id else None,
      place_name=place_name,
      latitude=lat,
      longitude=lon,
      url=provider_url,
  )


def parse_qualification_index_html(soup):
  """Parse server-rendered .body.search-results list items."""
  title = None
  saqa_url = None
  providers = []
  results = soup.select_one(".body.search-results")
  if not results:
    return title, saqa_url, providers

  for li in results.select("li"):
    for a in li.find_all("a", href=True):
      href = a["href"]
      text = a.get_text(" ", strip=True)
      abs_url = normalize_url(href)
      if "saqa.org.za" in href.lower() or SAQA_ID_RE.search(href):
        if text and not title:
          title = text
        saqa_url = abs_url
        continue
      match = PROVIDER_INDEX_RE.search(href)
      if match and text:
        providers.append(
            ProviderRef(
                name=text,
                provider_id=match.group(1),
                url=normalize_url(href),
            )
        )
        continue
      # Qualification title link without SAQA host (rare)
      if text and not title and "LearningProvider" not in href:
        title = text
  return title, saqa_url, providers


def fetch_providers_api(session, general_qualification_id, referer):
  api_url = (
      f"{BASE_URL}/LearningProviderByQualification/GetProviders/"
      f"{general_qualification_id}"
  )
  for attempt in range(1, 4):
    try:
      response = session.get(
          api_url,
          headers={
              "X-Requested-With": "XMLHttpRequest",
              "Accept": "application/json, text/javascript, */*; q=0.01",
              "Referer": referer,
              "Content-Type": "application/json; charset=utf-8",
          },
          timeout=30,
      )
      if response.status_code == 200 and response.text.strip():
        data = response.json()
        if isinstance(data, list):
          return data
        if isinstance(data, dict):
          return [data]
      print(
          f"    [-] GetProviders status {response.status_code}"
          f" (attempt {attempt}/3)"
      )
    except Exception as e:
      print(f"    [-] GetProviders error: {e} (attempt {attempt}/3)")
    time.sleep(1.2 * attempt)
  return None


def merge_providers(*groups):
  """Dedupe providers by provider_id and name, prefer richer records."""
  by_id = {}
  by_name = {}
  ordered = []

  def upsert(provider):
    existing = None
    if provider.provider_id and provider.provider_id in by_id:
      existing = by_id[provider.provider_id]
    elif provider.name.lower() in by_name:
      existing = by_name[provider.name.lower()]

    if existing is None:
      ordered.append(provider)
      if provider.provider_id:
        by_id[provider.provider_id] = provider
      by_name[provider.name.lower()] = provider
      return

    merged = ProviderRef(
        name=existing.name or provider.name,
        provider_id=existing.provider_id or provider.provider_id,
        place_name=existing.place_name or provider.place_name,
        latitude=(
            existing.latitude
            if existing.latitude is not None
            else provider.latitude
        ),
        longitude=(
            existing.longitude
            if existing.longitude is not None
            else provider.longitude
        ),
        url=existing.url or provider.url,
    )
    idx = ordered.index(existing)
    ordered[idx] = merged
    if merged.provider_id:
      by_id[merged.provider_id] = merged
    by_name[merged.name.lower()] = merged

  for group in groups:
    for provider in group:
      upsert(provider)
  return ordered


def scrape_one_qualification(session, url, title_hint=""):
  general_id = extract_general_qualification_id(url)
  if not general_id or general_id == ZERO_GUID:
    return None

  soup = get_soup(session, url, retries=4)
  if not soup:
    return None

  html_title, saqa_url, html_providers = parse_qualification_index_html(soup)
  api_rows = fetch_providers_api(session, general_id, referer=url)

  api_providers = []
  title = html_title or title_hint or "Unknown"
  nqf_level = None
  qualification_id = None
  duration = None

  if api_rows:
    for row in api_rows:
      if row.get("QualificationName") and title in {"Unknown", title_hint, ""}:
        title = row["QualificationName"]
      elif row.get("QualificationName") and not html_title:
        title = row["QualificationName"]
      if row.get("NQFLevel") and not nqf_level:
        nqf_level = str(row["NQFLevel"]).strip() or None
      if row.get("QualificationID") and not qualification_id:
        qualification_id = str(row["QualificationID"])
      if row.get("Duration") and not duration:
        duration = str(row["Duration"]).strip() or None
      provider = _provider_from_api_item(row)
      if provider:
        api_providers.append(provider)
    # Prefer API qualification name when present
    first_name = next(
        (r.get("QualificationName") for r in api_rows if r.get("QualificationName")),
        None,
    )
    if first_name:
      title = first_name

  providers = merge_providers(html_providers, api_providers)

  return Qualification(
      title=title,
      url=url,
      general_qualification_id=general_id,
      qualification_id=qualification_id,
      nqf_level=nqf_level,
      duration=duration,
      saqa_url=saqa_url,
      providers=providers,
      schema_version=QUALIFICATION_SCHEMA_VERSION,
  )


def write_qualification_qa_summary(records, failures=None, raw_url_refs=0):
  failures = failures or []
  summary = {
      "schema_version": QUALIFICATION_SCHEMA_VERSION,
      "raw_qualification_url_refs": raw_url_refs,
      "unique_qualification_urls": len(records) + len(failures),
      "total_records": len(records),
      "empty_title": sum(
          1 for r in records if not r.get("title") or r.get("title") == "Unknown"
      ),
      "empty_nqf_level": sum(1 for r in records if not r.get("nqf_level")),
      "empty_duration": sum(1 for r in records if not r.get("duration")),
      "empty_providers": sum(1 for r in records if not r.get("providers")),
      "empty_saqa_url": sum(1 for r in records if not r.get("saqa_url")),
      "total_provider_refs": sum(len(r.get("providers") or []) for r in records),
      "providers_with_url": sum(
          1
          for r in records
          for p in r.get("providers") or []
          if p.get("url")
      ),
      "fetch_failures": len(failures),
  }
  save_to_json(summary, "qualifications_qa_summary.json")
  print("[+] Qualifications QA summary:")
  for key, value in summary.items():
    print(f"    {key}: {value}")
  return summary


def scrape_qualifications(limit=None, delay=0.75):
  """Scrape unique qualification provider pages reachable from occupations."""
  occupation_details = load_json("occupation_details.json", [])
  if not occupation_details:
    print("[-] No occupation_details.json found. Run enrich first.")
    return []

  unique_urls, raw_count, title_hints = collect_qualification_urls(occupation_details)
  print(
      f"[-] Qualification URL inventory: {raw_count} raw refs -> "
      f"{len(unique_urls)} unique (excl. zero-GUID)"
  )

  if limit is not None:
    unique_urls = unique_urls[:limit]

  existing = load_json("qualifications.json", [])
  by_url = {row["url"]: row for row in existing if "url" in row}
  cached_hits = sum(
      1
      for row in by_url.values()
      if row.get("schema_version") == QUALIFICATION_SCHEMA_VERSION
  )
  print(
      f"[-] Scraping {len(unique_urls)} qualifications "
      f"(cache={len(by_url)}, schema_v{QUALIFICATION_SCHEMA_VERSION} hits={cached_hits})..."
  )

  session = make_session()
  scraped = []
  failures = []

  for idx, url in enumerate(unique_urls, start=1):
    cached = by_url.get(url)
    if cached and cached.get("schema_version") == QUALIFICATION_SCHEMA_VERSION:
      try:
        scraped.append(Qualification.model_validate(cached))
        continue
      except Exception:
        pass

    hint = title_hints.get(url, "")
    print(f"[-] ({idx}/{len(unique_urls)}) {hint or url[-60:]}")
    detail = scrape_one_qualification(session, url, title_hint=hint)
    if detail is None:
      failures.append(url)
      # Re-warm session after hard failures
      try:
        session.get(BASE_URL + "/", timeout=15)
      except Exception:
        pass
      time.sleep(delay)
      continue

    scraped.append(detail)
    by_url[url] = detail.model_dump()

    if idx % 25 == 0:
      save_to_json([q.model_dump() for q in scraped], "qualifications.json")
      print(f"    [+] checkpoint saved ({len(scraped)} records)")

    time.sleep(delay)

  payload = [q.model_dump() for q in scraped]
  save_to_json(payload, "qualifications.json")
  print(f"[+] Scraped {len(payload)} qualifications ({len(failures)} failures)")
  if failures:
    save_to_json(failures, "qualification_failures.json")
  write_qualification_qa_summary(payload, failures, raw_url_refs=raw_count)
  return scraped


def collect_provider_urls(qualifications):
  """Return (unique_urls, raw_count, name_hints_by_url)."""
  raw = []
  name_hints = {}
  for qual in qualifications:
    for provider in qual.get("providers") or []:
      url = provider.get("url")
      if not url:
        continue
      raw.append(url)
      name = (provider.get("name") or "").strip()
      if name:
        name_hints.setdefault(url, name)
  unique = list(dict.fromkeys(raw))
  return unique, len(raw), name_hints


def canonicalize_provider_url(url):
  """Normalize to https://.../LearningProvider/Index/{id}/page/1."""
  abs_url = normalize_url(url)
  match = PROVIDER_PAGE_RE.search(abs_url) or PROVIDER_INDEX_RE.search(abs_url)
  if not match:
    return abs_url
  provider_id = match.group(1)
  return f"{BASE_URL}/LearningProvider/Index/{provider_id}/page/1"


def extract_provider_id(url):
  match = PROVIDER_PAGE_RE.search(url) or PROVIDER_INDEX_RE.search(url)
  return match.group(1) if match else ""


def clean_ncap_value(value):
  """Return None for NCAP nullish placeholders."""
  if value is None:
    return None
  text = " ".join(str(value).split()).strip()
  if not text or NULLISH.match(text):
    return None
  # Address blocks often look like: "Null Null Undefined NULL"
  tokens = re.split(r"[\s|,;]+", text)
  cleaned = []
  for token in tokens:
    token = token.strip()
    if token and not NULLISH.match(token):
      cleaned.append(token)
  if not cleaned:
    return None
  return " ".join(cleaned)


def parse_strong_labeled_value(soup, label):
  """Extract value following <strong>Label :</strong> patterns."""
  for strong in soup.find_all("strong"):
    label_text = strong.get_text(" ", strip=True).rstrip(":").strip()
    if label.lower() not in label_text.lower():
      continue
    parent = strong.parent
    # Prefer anchor href/text in the same paragraph
    if parent:
      link = parent.find("a", href=True)
      if link:
        href = link.get("href", "").strip()
        text = link.get_text(" ", strip=True)
        if href.lower().startswith("mailto:"):
          return clean_ncap_value(href.split(":", 1)[1])
        if href and not NULLISH.match(href):
          return clean_ncap_value(href)
        return clean_ncap_value(text)
      full = parent.get_text(" ", strip=True)
      # Strip the label prefix
      remainder = re.sub(
          re.escape(strong.get_text(" ", strip=True)),
          "",
          full,
          count=1,
      ).strip(" :")
      return clean_ncap_value(remainder)
  return None


def parse_address_block(soup, heading_label):
  for h2 in soup.find_all("h2"):
    if heading_label.lower() not in h2.get_text(" ", strip=True).lower():
      continue
    for el in h2.next_siblings:
      if getattr(el, "name", None) == "h2":
        break
      if getattr(el, "name", None) == "div" and "address" in (el.get("class") or []):
        return clean_ncap_value(el.get_text(" ", strip=True))
  return None


def parse_offered_qualifications(soup):
  offered = []
  seen = set()
  for item in soup.select(".linkItem a[href]"):
    title = item.get_text(" ", strip=True)
    href = item.get("href", "").strip()
    if not title:
      continue
    saqa_url = normalize_url(href) if "saqa.org.za" in href.lower() else None
    saqa_id = None
    nqf_level = None
    saqa_match = SAQA_ID_RE.search(href) or OFFERED_SAQA_RE.search(title)
    if saqa_match:
      saqa_id = saqa_match.group(1)
    nqf_match = OFFERED_NQF_RE.search(title)
    if nqf_match:
      nqf_level = nqf_match.group(1)
    key = saqa_url or title
    if key in seen:
      continue
    seen.add(key)
    offered.append(
        OfferedQualification(
            title=title,
            saqa_url=saqa_url,
            saqa_id=saqa_id,
            nqf_level=nqf_level,
        )
    )
  return offered


def find_provider_max_page(soup, provider_id):
  max_page = 1
  for a in soup.find_all("a", href=True):
    match = PROVIDER_PAGE_RE.search(a["href"])
    if match and match.group(1).lower() == provider_id.lower():
      max_page = max(max_page, int(match.group(2)))
    # Numeric pagination links without full path sometimes appear
    text = a.get_text(strip=True)
    if text.isdigit() and ("page" in a["href"].lower() or provider_id in a["href"]):
      max_page = max(max_page, int(text))
  return max_page


def parse_provider_name(soup, name_hint=""):
  skip = {
      "street address",
      "postal address",
      "error message",
      "where to study",
      "contact us",
      "resources",
      "ncap partners",
  }
  for h2 in soup.find_all("h2"):
    text = h2.get_text(" ", strip=True)
    if text and text.lower() not in skip:
      return text
  return name_hint or "Unknown"


def scrape_one_provider(session, url, name_hint=""):
  canonical = canonicalize_provider_url(url)
  provider_id = extract_provider_id(canonical)
  if not provider_id:
    return None

  first_soup = get_soup(session, canonical, retries=4)
  if not first_soup:
    return None

  name = parse_provider_name(first_soup, name_hint=name_hint)
  website = parse_strong_labeled_value(first_soup, "Web Address")
  email = parse_strong_labeled_value(first_soup, "Email")
  telephone = parse_strong_labeled_value(first_soup, "Telephone")
  fax = parse_strong_labeled_value(first_soup, "Fax")
  street_address = parse_address_block(first_soup, "Street Address")
  postal_address = parse_address_block(first_soup, "Postal Address")

  offered = parse_offered_qualifications(first_soup)
  max_page = find_provider_max_page(first_soup, provider_id)
  print(f"    [+] page 1: {len(offered)} quals (max page seen: {max_page})")

  for page in range(2, max_page + 1):
    page_url = f"{BASE_URL}/LearningProvider/Index/{provider_id}/page/{page}"
    page_soup = get_soup(session, page_url, retries=3)
    if not page_soup:
      continue
    page_quals = parse_offered_qualifications(page_soup)
    print(f"    [+] page {page}: {len(page_quals)} quals")
    # Dedupe while preserving order
    seen = {(q.saqa_url or q.title) for q in offered}
    for qual in page_quals:
      key = qual.saqa_url or qual.title
      if key not in seen:
        seen.add(key)
        offered.append(qual)
    max_page = max(max_page, find_provider_max_page(page_soup, provider_id))
    time.sleep(0.4)

  return Provider(
      name=name,
      url=canonical,
      provider_id=provider_id,
      website=website,
      email=email,
      telephone=telephone,
      fax=fax,
      street_address=street_address,
      postal_address=postal_address,
      offered_qualifications=offered,
      schema_version=PROVIDER_SCHEMA_VERSION,
  )


def write_provider_qa_summary(records, failures=None, raw_url_refs=0):
  failures = failures or []
  summary = {
      "schema_version": PROVIDER_SCHEMA_VERSION,
      "raw_provider_url_refs": raw_url_refs,
      "unique_provider_urls": len(records) + len(failures),
      "total_records": len(records),
      "empty_name": sum(
          1 for r in records if not r.get("name") or r.get("name") == "Unknown"
      ),
      "empty_website": sum(1 for r in records if not r.get("website")),
      "empty_email": sum(1 for r in records if not r.get("email")),
      "empty_telephone": sum(1 for r in records if not r.get("telephone")),
      "empty_street_address": sum(1 for r in records if not r.get("street_address")),
      "empty_postal_address": sum(1 for r in records if not r.get("postal_address")),
      "empty_offered_qualifications": sum(
          1 for r in records if not r.get("offered_qualifications")
      ),
      "total_offered_qualification_refs": sum(
          len(r.get("offered_qualifications") or []) for r in records
      ),
      "fetch_failures": len(failures),
  }
  save_to_json(summary, "providers_qa_summary.json")
  print("[+] Providers QA summary:")
  for key, value in summary.items():
    print(f"    {key}: {value}")
  return summary


def scrape_providers(limit=None, delay=0.75):
  """Scrape unique learning-provider detail pages reachable from qualifications."""
  qualifications = load_json("qualifications.json", [])
  if not qualifications:
    print("[-] No qualifications.json found. Run qualifications scrape first.")
    return []

  unique_urls, raw_count, name_hints = collect_provider_urls(qualifications)
  # Canonicalize before dedupe so page/2 variants collapse
  canonical_urls = []
  canonical_hints = {}
  for url in unique_urls:
    canon = canonicalize_provider_url(url)
    if canon not in canonical_hints:
      canonical_urls.append(canon)
    if url in name_hints:
      canonical_hints.setdefault(canon, name_hints[url])

  print(
      f"[-] Provider URL inventory: {raw_count} raw refs -> "
      f"{len(canonical_urls)} unique institutions"
  )

  if limit is not None:
    canonical_urls = canonical_urls[:limit]

  existing = load_json("providers.json", [])
  by_url = {row["url"]: row for row in existing if "url" in row}
  cached_hits = sum(
      1
      for row in by_url.values()
      if row.get("schema_version") == PROVIDER_SCHEMA_VERSION
  )
  print(
      f"[-] Scraping {len(canonical_urls)} providers "
      f"(cache={len(by_url)}, schema_v{PROVIDER_SCHEMA_VERSION} hits={cached_hits})..."
  )

  session = make_session()
  scraped = []
  failures = []

  for idx, url in enumerate(canonical_urls, start=1):
    cached = by_url.get(url)
    if cached and cached.get("schema_version") == PROVIDER_SCHEMA_VERSION:
      try:
        scraped.append(Provider.model_validate(cached))
        continue
      except Exception:
        pass

    hint = canonical_hints.get(url, "")
    print(f"[-] ({idx}/{len(canonical_urls)}) {hint or url[-60:]}")
    detail = scrape_one_provider(session, url, name_hint=hint)
    if detail is None:
      failures.append(url)
      try:
        session.get(BASE_URL + "/", timeout=15)
      except Exception:
        pass
      time.sleep(delay)
      continue

    scraped.append(detail)
    by_url[url] = detail.model_dump()

    if idx % 10 == 0:
      save_to_json([p.model_dump() for p in scraped], "providers.json")
      print(f"    [+] checkpoint saved ({len(scraped)} records)")

    time.sleep(delay)

  payload = [p.model_dump() for p in scraped]
  save_to_json(payload, "providers.json")
  print(f"[+] Scraped {len(payload)} providers ({len(failures)} failures)")
  if failures:
    save_to_json(failures, "provider_failures.json")
  write_provider_qa_summary(payload, failures, raw_url_refs=raw_count)
  return scraped


def main():
  parser = argparse.ArgumentParser(description="NCAP occupation scraper")
  parser.add_argument(
      "mode",
      nargs="?",
      default="enrich",
      choices=["list", "enrich", "qualifications", "providers", "all"],
      help="list | enrich | qualifications | providers | all",
  )
  parser.add_argument(
      "--limit",
      type=int,
      default=None,
      help="Limit number of detail pages to scrape (for testing)",
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

  if args.mode in {"qualifications", "all"}:
    scrape_qualifications(limit=args.limit, delay=args.delay)

  if args.mode in {"providers", "all"}:
    scrape_providers(limit=args.limit, delay=args.delay)


if __name__ == "__main__":
  main()
