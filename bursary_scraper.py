#!/usr/bin/env python3
"""Two-stage ZABursaries scraper: list (WP REST) → calendar → enrich."""

from __future__ import annotations

import argparse
import html as html_lib
import json
import os
import re
import time
from collections import Counter, defaultdict
from datetime import datetime, date
from typing import Any, Dict, List, Optional, Set, Tuple
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, NavigableString, Tag
import requests

from models import BursaryDetail, BursaryRef

BASE_URL = "https://www.zabursaries.co.za"
API = BASE_URL + "/wp-json/wp/v2"
BURSARY_SCHEMA_VERSION = 2
CLOSING_SOON_CATEGORY_ID = 170
BATCH_SIZE = 25

FIELD_SLUGS: Dict[str, str] = {
    "general-bursaries-south-africa": "General",
    "general": "General",
    "engineering-bursaries-south-africa": "Engineering",
    "engineering": "Engineering",
    "government-bursaries-south-africa": "Government",
    "government": "Government",
    "science-bursaries-south-africa": "Science",
    "science": "Science",
    "universities-bursaries-south-africa": "Universities",
    "universities": "Universities",
    "mba-postgraduate-bursaries-south-africa": "MBA / Postgraduate",
    "mba-postgraduate": "MBA / Postgraduate",
    "computer-science-it-bursaries-south-africa": "Computer Science & IT",
    "computer-science-it": "Computer Science & IT",
    "commerce-bursaries-south-africa": "Commerce",
    "commerce": "Commerce",
    "construction-and-built-environment-bursaries-south-africa": (
        "Construction & Built Environment"
    ),
    "construction-and-built-environment": "Construction & Built Environment",
    "accounting-bursaries-south-africa": "Accounting",
    "accounting": "Accounting",
    "international-scholarships": "International",
    "international-scholarships-bursaries-south-africa": "International",
    "medical-bursaries-south-africa": "Medical",
    "medical": "Medical",
    "music-and-performing-arts-bursaries-south-africa": "Music & Performing Arts",
    "music-and-performing-arts": "Music & Performing Arts",
    "law-bursaries-south-africa": "Law",
    "law": "Law",
    "education-bursaries-south-africa": "Education",
    "education": "Education",
    "learnerships": "Learnerships",
    "learnerships-bursaries-south-africa": "Learnerships",
}


def canonicalize_field_slug(slug: str) -> Optional[str]:
  """Return the raw slug if it is an allowed field category."""
  if slug in FIELD_SLUGS:
    return slug
  return None

SECTION_MATCHERS: List[Tuple[str, re.Pattern]] = [
    ("closing_date", re.compile(r"closing\s+date|when\s+is\s+the\s+closing", re.I)),
    (
        "required_documents",
        re.compile(
            r"documents?\s+(must|do)\s+i\s+submit|required\s+documents?|"
            r"what\s+documents|supporting\s+documents",
            re.I,
        ),
    ),
    ("application", re.compile(r"how\s+can\s+i\s+apply|how\s+to\s+apply", re.I)),
    ("contact", re.compile(r"how\s+can\s+i\s+contact|contact\s+(details|info)", re.I)),
    (
        "eligibility",
        re.compile(
            r"eligibility\s+criteria|who\s+can\s+apply|"
            r"what\s+is\s+the\s+eligibility",
            re.I,
        ),
    ),
    (
        "fields_of_study",
        re.compile(r"fields?\s+of\s+study|what\s+does\s+.+\s+cover", re.I),
    ),
    ("about", re.compile(r"more\s+about|what\s+does\s+.+\s+do", re.I)),
]

OPEN_ALL_YEAR_RE = re.compile(
    r"open\s+all\s+year|ongoing|no\s+confirmed\s+closing|closes?\s*:\s*ongoing",
    re.I,
)
DATE_DMY_RE = re.compile(
    r"(\d{1,2})\s+"
    r"(january|february|march|april|may|june|july|august|september|october|"
    r"november|december)\s+(\d{4})",
    re.I,
)
DATE_SLASH_RE = re.compile(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})")
EMAIL_RE = re.compile(r"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}", re.I)
PHONE_RE = re.compile(
    r"(?:\+27|0)\s*\d{1,3}[\s\-.]?\d{3}[\s\-.]?\d{4}"
)
NULLISH = re.compile(r"^(null|undefined|n/?a|-|none|tbc|tba)?$", re.I)
CONTACT_BOILERPLATE_RE = re.compile(
    r"do\s+NOT\s+contact|view\s+our\s+other\s+bursaries|please\s+note",
    re.I,
)
MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}

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


def make_session() -> requests.Session:
  session = requests.Session()
  session.headers.update(HEADERS)
  try:
    session.get(BASE_URL + "/", timeout=15)
  except Exception as e:
    print(f"[-] Warm-up request failed: {e}")
  return session


def get_json(session: requests.Session, url: str, retries: int = 3) -> Any:
  for attempt in range(1, retries + 1):
    try:
      response = session.get(url, timeout=25)
      if response.status_code == 200 and response.text.strip():
        return response.json()
      print(
          f"[-] Failed JSON {url}: Status {response.status_code}"
          f" (attempt {attempt}/{retries})"
      )
      if response.status_code >= 500:
        try:
          session.get(BASE_URL + "/", timeout=15)
        except Exception:
          pass
    except Exception as e:
      print(f"[-] Error JSON {url}: {e} (attempt {attempt}/{retries})")
    time.sleep(1.5 * attempt)
  return None


def get_soup(
    session: requests.Session, url: str, retries: int = 3
) -> Optional[BeautifulSoup]:
  for attempt in range(1, retries + 1):
    try:
      response = session.get(
          url,
          headers={"Referer": BASE_URL + "/"},
          timeout=25,
      )
      if response.status_code == 200 and response.text.strip():
        return BeautifulSoup(response.text, "html.parser")
      print(
          f"[-] Failed HTML {url}: Status {response.status_code}"
          f" (attempt {attempt}/{retries})"
      )
      if response.status_code >= 500:
        try:
          session.get(BASE_URL + "/", timeout=15)
        except Exception:
          pass
    except Exception as e:
      print(f"[-] Error HTML {url}: {e} (attempt {attempt}/{retries})")
    time.sleep(1.5 * attempt)
  return None


def save_to_json(data: Any, filename: str) -> None:
  os.makedirs("output", exist_ok=True)
  filepath = os.path.join("output", filename)
  with open(filepath, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
  print(f"[+] Saved structured data to {filepath}")


def load_json(filename: str, default: Any = None) -> Any:
  filepath = os.path.join("output", filename)
  if not os.path.exists(filepath):
    return default if default is not None else []
  with open(filepath, encoding="utf-8") as f:
    return json.load(f)


def clean_text(value: Optional[str]) -> Optional[str]:
  if value is None:
    return None
  text = html_lib.unescape(str(value))
  text = re.sub(r"\s+", " ", text).strip()
  if not text or NULLISH.match(text):
    return None
  return text


def path_segments(url: str) -> List[str]:
  path = urlparse(url).path.strip("/")
  if not path:
    return []
  return [p for p in path.split("/") if p]


def listing_from_page(page: Dict[str, Any]) -> Optional[Dict[str, Any]]:
  link = clean_text(page.get("link")) or ""
  if not link:
    return None
  segs = path_segments(link)
  if len(segs) != 2:
    return None
  field_slug = canonicalize_field_slug(segs[0])
  if not field_slug:
    return None
  title_raw = page.get("title") or {}
  if isinstance(title_raw, dict):
    title = clean_text(title_raw.get("rendered")) or "Unknown Bursary"
  else:
    title = clean_text(str(title_raw)) or "Unknown Bursary"
  return {
      "page_id": int(page["id"]),
      "title": title,
      "url": link if link.endswith("/") else link + "/",
      "slug": segs[1],
      "field_slug": field_slug,
      "field_label": FIELD_SLUGS[field_slug],
      "wp_modified": page.get("modified"),
  }


def scrape_bursary_urls(session: Optional[requests.Session] = None) -> List[Dict[str, Any]]:
  session = session or make_session()
  listings: List[Dict[str, Any]] = []
  seen: Set[str] = set()
  page_num = 1
  total_pages = None

  while True:
    url = (
        f"{API}/pages?per_page=100&page={page_num}"
        f"&_fields=id,slug,link,title,parent,modified"
    )
    payload = get_json(session, url)
    if payload is None:
      break
    if not isinstance(payload, list):
      print(f"[-] Unexpected pages payload on page {page_num}")
      break

    for page in payload:
      row = listing_from_page(page)
      if not row:
        continue
      if row["url"] in seen:
        continue
      seen.add(row["url"])
      listings.append(row)

    if total_pages is None:
      # WP exposes totals on headers; requests keeps them on last response
      try:
        last = session.get(url, timeout=25)
        total_pages = int(last.headers.get("X-WP-TotalPages") or "0") or None
      except Exception:
        total_pages = None

    print(f"[-] list page {page_num}: kept {len(listings)} so far")
    if not payload:
      break
    if total_pages and page_num >= total_pages:
      break
    if len(payload) < 100:
      break
    page_num += 1
    time.sleep(0.5)

  by_field = Counter(r["field_slug"] for r in listings)
  print("[+] Field breakdown:")
  for slug, count in sorted(by_field.items(), key=lambda x: -x[1]):
    print(f"    {FIELD_SLUGS.get(slug, slug)}: {count}")
  print(f"[+] Listed {len(listings)} bursary URLs")
  return listings


def section_blocks(soup: BeautifulSoup) -> Dict[str, List[Tag]]:
  """Map logical section keys to sibling content tags after matching h2s."""
  result: Dict[str, List[Tag]] = defaultdict(list)
  headings = soup.find_all(["h2", "h3"])
  for heading in headings:
    heading_text = heading.get_text(" ", strip=True)
    key = None
    for section_key, pattern in SECTION_MATCHERS:
      if pattern.search(heading_text):
        key = section_key
        break
    if not key:
      continue
    for sibling in heading.next_siblings:
      if isinstance(sibling, NavigableString):
        continue
      if not isinstance(sibling, Tag):
        continue
      if sibling.name in {"h2", "h3"}:
        break
      result[key].append(sibling)
  return result


def list_items(tags: List[Tag]) -> List[str]:
  items: List[str] = []
  seen: Set[str] = set()

  def add_li(li: Tag) -> None:
    text = clean_text(li.get_text(" ", strip=True))
    if text and text not in seen:
      seen.add(text)
      items.append(text)

  for tag in tags:
    if tag.name == "ul":
      for li in tag.find_all("li", recursive=False):
        add_li(li)
      continue
    if tag.name == "li":
      add_li(tag)
      continue
    for ul in tag.find_all("ul"):
      for li in ul.find_all("li", recursive=False):
        add_li(li)

  if not items:
    for tag in tags:
      text = clean_text(tag.get_text(" ", strip=True))
      if text and text not in seen and len(text) > 3:
        seen.add(text)
        items.append(text)
  return items


def paragraphs(tags: List[Tag]) -> str:
  parts: List[str] = []
  for tag in tags:
    text = clean_text(tag.get_text(" ", strip=True))
    if text:
      parts.append(text)
  return "\n\n".join(parts) if parts else ""


def parse_closing_date(
    text: Optional[str],
) -> Tuple[Optional[str], Optional[str], bool]:
  raw = clean_text(text)
  if not raw:
    return None, None, False

  # Prefer the first dated clause / short first line over long disclaimer text
  first_line = re.split(r"[\n\r]+", text or "")[0].strip() if text else raw
  first_line = clean_text(first_line) or raw
  if re.match(r"(?i)^closing\s+date\s*:?\s*", first_line):
    first_line = re.sub(r"(?i)^closing\s+date\s*:?\s*", "", first_line).strip()

  candidates = [first_line, raw]
  for candidate in candidates:
    if OPEN_ALL_YEAR_RE.search(candidate):
      return candidate, None, True

  for candidate in candidates:
    m = DATE_DMY_RE.search(candidate)
    if m:
      day, month_name, year = int(m.group(1)), m.group(2).lower(), int(m.group(3))
      month = MONTHS[month_name]
      try:
        iso = date(year, month, day).isoformat()
      except ValueError:
        iso = None
      if iso:
        try:
          parsed = date.fromisoformat(iso)
          today = date.today()
          if parsed.year > today.year + 2 or parsed.year < today.year - 5:
            iso = None
        except ValueError:
          iso = None
      display = f"{m.group(1)} {m.group(2).capitalize()} {m.group(3)}"
      return display, iso, False

    m2 = DATE_SLASH_RE.search(candidate)
    if m2:
      d, mo, y = int(m2.group(1)), int(m2.group(2)), int(m2.group(3))
      iso = None
      try:
        iso = date(y, mo, d).isoformat()
      except ValueError:
        try:
          iso = date(y, d, mo).isoformat()
        except ValueError:
          iso = None
      return candidate, iso, False

  return first_line, None, False


def closing_section_text(tags: List[Tag]) -> Optional[str]:
  """Prefer the first short dated paragraph in the closing-date section."""
  for tag in tags:
    text = clean_text(tag.get_text(" ", strip=True))
    if not text:
      continue
    if DATE_DMY_RE.search(text) or DATE_SLASH_RE.search(text):
      return text
    if OPEN_ALL_YEAR_RE.search(text):
      return text
    if len(text) < 80:
      return text
  return paragraphs(tags) or None


def extract_application_link(tags: List[Tag]) -> Optional[str]:
  for tag in tags:
    for a in tag.find_all("a", href=True):
      href = a["href"].strip()
      if not href or href.startswith("#") or href.startswith("mailto:"):
        continue
      absolute = urljoin(BASE_URL + "/", href)
      host = urlparse(absolute).netloc.lower()
      if "zabursaries.co.za" in host:
        continue
      return absolute
  # Fallback: any apply-ish link text in content
  for tag in tags:
    for a in tag.find_all("a", href=True):
      label = (a.get_text() or "").lower()
      if "apply" in label or "application" in label:
        href = a["href"].strip()
        absolute = urljoin(BASE_URL + "/", href)
        if "zabursaries.co.za" not in urlparse(absolute).netloc.lower():
          return absolute
  return None


def extract_contact(
    tags: List[Tag],
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
  parts: List[str] = []
  for tag in tags:
    text = clean_text(tag.get_text(" ", strip=True))
    if not text:
      continue
    if CONTACT_BOILERPLATE_RE.search(text) and len(text) < 280:
      continue
    if CONTACT_BOILERPLATE_RE.search(text):
      # Keep non-boilerplate portion when mixed
      continue
    parts.append(text)
  info = "\n".join(parts) if parts else None
  email = None
  phone = None
  blob = info or ""
  for tag in tags:
    for a in tag.find_all("a", href=True):
      href = a["href"]
      if href.startswith("mailto:"):
        email = clean_text(href.split(":", 1)[1].split("?")[0])
  if not email:
    m = EMAIL_RE.search(blob)
    if m:
      email = m.group(0)
  m_phone = PHONE_RE.search(blob)
  if m_phone:
    phone = clean_text(m_phone.group(0))
  return info, email, phone


def guess_provider_name(title: str, about_text: str) -> Optional[str]:
  m = re.search(r"(?i)what\s+does\s+(.+?)\s+do\??", about_text)
  if m:
    return clean_text(m.group(1))
  # Leading token(s) before "Bursary"
  m2 = re.match(r"^(.+?)\s+Bursary", title, re.I)
  if m2:
    return clean_text(m2.group(1))
  return None


def parse_bursary_html(
    html: str,
    listing: Dict[str, Any],
    open_all_year_titles: Optional[Set[str]] = None,
) -> BursaryDetail:
  soup = BeautifulSoup(html, "html.parser")
  sections = section_blocks(soup)

  closing_tags = sections.get("closing_date") or []
  closing_raw_text = closing_section_text(closing_tags)
  closing_date, closing_iso, open_all_year = parse_closing_date(closing_raw_text)

  title = listing["title"]
  if open_all_year_titles and title.lower() in open_all_year_titles:
    open_all_year = True

  docs = list_items(sections.get("required_documents") or [])
  eligibility = list_items(sections.get("eligibility") or [])
  app_steps = list_items(sections.get("application") or [])
  app_link = extract_application_link(sections.get("application") or [])

  contact_info, contact_email, contact_phone = extract_contact(
      sections.get("contact") or []
  )

  desc_parts: List[str] = []
  for key in ("fields_of_study", "about"):
    block = paragraphs(sections.get(key) or [])
    if block:
      desc_parts.append(block)
  description = "\n\n".join(desc_parts) if desc_parts else None

  about_blob = paragraphs(sections.get("about") or [])
  provider_name = guess_provider_name(title, about_blob)

  return BursaryDetail(
      title=title,
      url=listing["url"],
      page_id=int(listing["page_id"]),
      field_slug=listing["field_slug"],
      field_label=listing["field_label"],
      provider_name=provider_name,
      description=description,
      eligibility=eligibility,
      closing_date=closing_date,
      closing_date_iso=closing_iso,
      open_all_year=open_all_year,
      required_documents=docs,
      application_steps=app_steps,
      application_link=app_link,
      contact_info=contact_info,
      contact_email=contact_email,
      contact_phone=contact_phone,
      wp_modified=listing.get("wp_modified"),
      schema_version=BURSARY_SCHEMA_VERSION,
  )


def load_open_all_year_titles() -> Set[str]:
  calendar = load_json("bursary_closing_calendar.json", {})
  titles = calendar.get("no_confirmed_closing_date") or []
  return {str(t).strip().lower() for t in titles if t}


def scrape_closing_calendar(
    session: Optional[requests.Session] = None,
) -> Dict[str, Any]:
  session = session or make_session()
  url = (
      f"{API}/posts?categories={CLOSING_SOON_CATEGORY_ID}"
      f"&per_page=20&_fields=id,slug,link,title,content,modified"
  )
  posts = get_json(session, url) or []
  months: Dict[str, List[Dict[str, Any]]] = {}
  no_confirmed: Set[str] = set()

  for post in posts:
    if not isinstance(post, dict):
      continue
    title_raw = post.get("title") or {}
    month_label = (
        clean_text(title_raw.get("rendered"))
        if isinstance(title_raw, dict)
        else clean_text(str(title_raw))
    ) or post.get("slug") or "Unknown"
    content = (post.get("content") or {}).get("rendered") or ""
    soup = BeautifulSoup(content, "html.parser")

    # Detect no-confirmed section
    in_no_date = False
    refs: List[Dict[str, Any]] = []
    for el in soup.find_all(["h2", "h3", "h4", "p", "li", "a"]):
      text = el.get_text(" ", strip=True)
      lower = text.lower()
      if el.name in {"h2", "h3", "h4"}:
        if "no confirmed" in lower or "open all year" in lower or "ongoing" in lower:
          in_no_date = True
        elif "closing" in lower or "bursaries" in lower:
          in_no_date = False
        continue

      href = None
      if el.name == "a" and el.get("href"):
        href = urljoin(BASE_URL + "/", el["href"])
      else:
        a = el.find("a", href=True) if hasattr(el, "find") else None
        if a:
          href = urljoin(BASE_URL + "/", a["href"])
          text = clean_text(a.get_text(" ", strip=True)) or text

      text = clean_text(text)
      if not text or len(text) < 4:
        continue

      field_slug = None
      if href:
        segs = path_segments(href)
        if segs:
          field_slug = canonicalize_field_slug(segs[0])

      if in_no_date:
        no_confirmed.add(text)
      else:
        ref = BursaryRef(
            title=text,
            url=href,
            closing_date_iso=None,
            field_slug=field_slug,
        )
        refs.append(ref.model_dump())

    months[month_label] = refs
    print(f"[-] calendar '{month_label}': {len(refs)} refs")

  payload = {
      "months": months,
      "no_confirmed_closing_date": sorted(no_confirmed),
      "scraped_at": datetime.utcnow().isoformat(),
  }
  print(
      f"[+] Calendar months={len(months)} "
      f"no_confirmed={len(no_confirmed)}"
  )
  return payload


def write_bursary_qa_summary(
    records: List[Dict[str, Any]],
    failures: List[str],
    expected_from_listing: int,
    html_fallback_used: int,
) -> None:
  today = date.today().isoformat()
  by_field = Counter(r.get("field_slug") for r in records)
  empty_description = sum(1 for r in records if not r.get("description"))
  empty_closing = sum(1 for r in records if not r.get("closing_date"))
  unparsed_closing = sum(
      1
      for r in records
      if r.get("closing_date") and not r.get("closing_date_iso") and not r.get("open_all_year")
  )
  open_all_year_count = sum(1 for r in records if r.get("open_all_year"))
  expired_count = sum(
      1
      for r in records
      if r.get("closing_date_iso") and r["closing_date_iso"] < today
  )
  empty_docs = sum(1 for r in records if not r.get("required_documents"))
  empty_app = sum(1 for r in records if not r.get("application_link"))
  empty_contact = sum(1 for r in records if not r.get("contact_info"))
  contacts_with_email = sum(1 for r in records if r.get("contact_email"))

  summary = {
      "schema_version": BURSARY_SCHEMA_VERSION,
      "total_records": len(records),
      "expected_from_listing": expected_from_listing,
      "by_field": dict(by_field),
      "empty_description": empty_description,
      "empty_closing_date": empty_closing,
      "unparsed_closing_date": unparsed_closing,
      "open_all_year_count": open_all_year_count,
      "expired_count": expired_count,
      "empty_required_documents": empty_docs,
      "empty_application_link": empty_app,
      "empty_contact_info": empty_contact,
      "contacts_with_email": contacts_with_email,
      "fetch_failures": len(failures),
      "html_fallback_used": html_fallback_used,
  }
  save_to_json(summary, "bursaries_qa_summary.json")
  print(
      f"[+] QA: records={summary['total_records']} "
      f"failures={summary['fetch_failures']} "
      f"unparsed_closing={unparsed_closing} "
      f"empty_app_link={empty_app}"
  )


def enrich_bursaries(
    limit: Optional[int] = None,
    delay: float = 0.75,
) -> List[BursaryDetail]:
  listings = load_json("bursary_urls.json", [])
  if not listings:
    print("[-] No listings in output/bursary_urls.json. Run list first.")
    return []

  if limit is not None:
    listings = listings[:limit]

  existing = load_json("bursaries.json", [])
  by_url = {row["url"]: row for row in existing if "url" in row}
  open_titles = load_open_all_year_titles()

  session = make_session()
  enriched: List[BursaryDetail] = []
  failures: List[str] = []
  html_fallback_used = 0
  by_url_out: Dict[str, Dict[str, Any]] = {}

  # Preserve order of listings; reuse cache hits
  to_fetch: List[Dict[str, Any]] = []
  for item in listings:
    url = item.get("url", "")
    cached = by_url.get(url)
    if (
        cached
        and cached.get("schema_version") == BURSARY_SCHEMA_VERSION
        and cached.get("wp_modified") == item.get("wp_modified")
    ):
      try:
        detail = BursaryDetail.model_validate(cached)
        enriched.append(detail)
        by_url_out[url] = detail.model_dump()
        continue
      except Exception:
        pass
    to_fetch.append(item)

  print(
      f"[-] Enriching {len(listings)} listings "
      f"(cache hits={len(enriched)}, to_fetch={len(to_fetch)})..."
  )

  for batch_start in range(0, len(to_fetch), BATCH_SIZE):
    batch = to_fetch[batch_start : batch_start + BATCH_SIZE]
    ids = ",".join(str(item["page_id"]) for item in batch)
    api_url = (
        f"{API}/pages?include={ids}&per_page={BATCH_SIZE}"
        f"&_fields=id,link,slug,title,modified,content"
    )
    payload = get_json(session, api_url)
    by_id: Dict[int, Dict[str, Any]] = {}
    if isinstance(payload, list):
      for page in payload:
        by_id[int(page["id"])] = page

    for item in batch:
      page_id = int(item["page_id"])
      page = by_id.get(page_id)
      html = None
      used_fallback = False

      if page:
        content = page.get("content") or {}
        html = content.get("rendered") if isinstance(content, dict) else None
        if page.get("modified"):
          item = {**item, "wp_modified": page.get("modified")}
        title_raw = page.get("title") or {}
        if isinstance(title_raw, dict) and title_raw.get("rendered"):
          item = {
              **item,
              "title": clean_text(title_raw["rendered"]) or item["title"],
          }

      if not html:
        soup = get_soup(session, item["url"])
        if soup is None:
          failures.append(item["url"])
          continue
        content_div = soup.find("div", class_=re.compile(r"entry-content|post-content"))
        if content_div is None:
          content_div = soup.find("main") or soup
        html = str(content_div)
        used_fallback = True
        html_fallback_used += 1

      try:
        detail = parse_bursary_html(html, item, open_titles)
      except Exception as e:
        print(f"[-] Parse failed {item['url']}: {e}")
        failures.append(item["url"])
        continue

      enriched.append(detail)
      by_url_out[detail.url] = detail.model_dump()
      if used_fallback:
        print(f"    [fallback] {detail.title[:60]}")

    # Checkpoint after each batch
    ordered = [
        by_url_out[item["url"]]
        for item in listings
        if item.get("url") in by_url_out
    ]
    # Also include any already-enriched not in current listings slice
    for url, row in by_url_out.items():
      if url not in {r.get("url") for r in ordered}:
        ordered.append(row)
    save_to_json(ordered, "bursaries.json")
    print(
        f"    [+] checkpoint batch "
        f"{batch_start // BATCH_SIZE + 1} "
        f"({len(by_url_out)} records)"
    )
    time.sleep(delay)

  # Final ordered payload matching listings order
  final_rows: List[Dict[str, Any]] = []
  for item in listings:
    row = by_url_out.get(item["url"])
    if row:
      final_rows.append(row)

  save_to_json(final_rows, "bursaries.json")
  if failures:
    save_to_json(failures, "bursary_failures.json")
  write_bursary_qa_summary(
      final_rows,
      failures,
      expected_from_listing=len(load_json("bursary_urls.json", [])),
      html_fallback_used=html_fallback_used,
  )
  print(f"[+] Enriched {len(final_rows)} bursaries ({len(failures)} failures)")
  return [BursaryDetail.model_validate(r) for r in final_rows]


def main() -> None:
  parser = argparse.ArgumentParser(description="ZABursaries scraper")
  parser.add_argument(
      "mode",
      nargs="?",
      default="enrich",
      choices=["list", "enrich", "calendar", "all"],
      help="list | enrich | calendar | all",
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
      help="Polite delay between enrich batches",
  )
  args = parser.parse_args()

  if args.mode in {"list", "all"}:
    data = scrape_bursary_urls()
    if data:
      save_to_json(data, "bursary_urls.json")
    else:
      print("[-] Listing scrape yielded 0 results.")

  if args.mode in {"calendar", "all"}:
    calendar = scrape_closing_calendar()
    save_to_json(calendar, "bursary_closing_calendar.json")

  if args.mode in {"enrich", "all"}:
    enrich_bursaries(limit=args.limit, delay=args.delay)


if __name__ == "__main__":
  main()
