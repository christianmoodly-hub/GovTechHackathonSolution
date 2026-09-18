#!/usr/bin/env python3
"""
Seed Firestore with NCAP + bursary scraper output.

Doc IDs:
  occupations     -> occupation_code
  qualifications  -> stable hash of qualification URL
  providers       -> stable hash of provider URL
  bursaries       -> stable hash of bursary URL

Auth (first match wins):
  1) --credentials path/to/serviceAccount.json
  2) GOOGLE_APPLICATION_CREDENTIALS
  3) firebase/serviceAccountKey.json
  4) Logged-in Firebase CLI tokens (~/.config/configstore/firebase-tools.json)

Usage:
  python scripts/seed_firestore.py
  python scripts/seed_firestore.py --dry-run
  python scripts/seed_firestore.py --credentials firebase/serviceAccountKey.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from firestore_schema import (  # noqa: E402
    EXPECTED_BURSARIES,
    EXPECTED_OCCUPATIONS,
    EXPECTED_PROVIDERS,
    EXPECTED_QUALIFICATIONS,
)

DEFAULT_CREDENTIALS = ROOT / "firebase" / "serviceAccountKey.json"
CONFIG_PATH = ROOT / "firebase" / "config.json"
OUTPUT_DIR = ROOT / "output"
FIREBASE_TOOLS_CONFIG = (
    Path.home() / ".config" / "configstore" / "firebase-tools.json"
)

# Public OAuth client used by the Firebase CLI (same as firebase-tools)
FIREBASE_CLI_CLIENT_ID = (
    "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com"
)
FIREBASE_CLI_CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi"

BATCH_LIMIT = 500  # Firestore max writes per batch
CLOSING_SORT_OPEN = "9999-12-31"


def load_json(path: Path) -> Any:
  with path.open(encoding="utf-8") as f:
    return json.load(f)


def stable_url_id(url: str, length: int = 32) -> str:
  """Deterministic Firestore-safe doc ID derived from a URL join key."""
  digest = hashlib.sha256(url.strip().encode("utf-8")).hexdigest()
  return digest[:length]


def occupation_doc(record: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
  code = str(record["occupation_code"]).strip()
  qualification_urls = [
      q["url"]
      for q in record.get("qualifications") or []
      if q.get("url")
  ]
  doc = {
      "occupationCode": code,
      "title": record.get("title"),
      "url": record.get("url"),
      "tasks": record.get("tasks") or [],
      "qualifications": record.get("qualifications") or [],
      "qualificationUrls": qualification_urls,
      "entryRequirements": record.get("entry_requirements") or [],
      "alternativeTitles": record.get("alternative_titles") or [],
      "schemaVersion": record.get("schema_version"),
      "scrapedAt": record.get("scraped_at"),
  }
  return code, doc


def qualification_doc(record: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
  url = record["url"]
  provider_urls = [
      p["url"]
      for p in record.get("providers") or []
      if p.get("url")
  ]
  doc = {
      "title": record.get("title"),
      "url": url,
      "generalQualificationId": record.get("general_qualification_id"),
      "qualificationId": record.get("qualification_id"),
      "nqfLevel": record.get("nqf_level"),
      "duration": record.get("duration"),
      "saqaUrl": record.get("saqa_url"),
      "providers": record.get("providers") or [],
      "providerUrls": provider_urls,
      "schemaVersion": record.get("schema_version"),
      "scrapedAt": record.get("scraped_at"),
  }
  return stable_url_id(url), doc


def provider_doc(record: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
  url = record["url"]
  offered = record.get("offered_qualifications") or []
  offered_saqa_urls = [q.get("saqa_url") for q in offered if q.get("saqa_url")]
  doc = {
      "name": record.get("name"),
      "url": url,
      "providerId": record.get("provider_id"),
      "website": record.get("website"),
      "email": record.get("email"),
      "telephone": record.get("telephone"),
      "fax": record.get("fax"),
      "streetAddress": record.get("street_address"),
      "postalAddress": record.get("postal_address"),
      "offeredQualifications": offered,
      "offeredSaqaUrls": offered_saqa_urls,
      "schemaVersion": record.get("schema_version"),
      "scrapedAt": record.get("scraped_at"),
  }
  return stable_url_id(url), doc


def bursary_doc(record: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
  url = record["url"]
  closing_iso = record.get("closing_date_iso")
  closing_sort = closing_iso if closing_iso else CLOSING_SORT_OPEN
  doc = {
      "title": record.get("title"),
      "url": url,
      "pageId": record.get("page_id"),
      "fieldSlug": record.get("field_slug"),
      "fieldLabel": record.get("field_label"),
      "providerName": record.get("provider_name"),
      "description": record.get("description"),
      "eligibility": record.get("eligibility") or [],
      "closingDate": record.get("closing_date"),
      "closingDateIso": closing_iso,
      "openAllYear": bool(record.get("open_all_year")),
      "requiredDocuments": record.get("required_documents") or [],
      "applicationSteps": record.get("application_steps") or [],
      "applicationLink": record.get("application_link"),
      "contactInfo": record.get("contact_info"),
      "contactEmail": record.get("contact_email"),
      "contactPhone": record.get("contact_phone"),
      "wpModified": record.get("wp_modified"),
      "schemaVersion": record.get("schema_version"),
      "scrapedAt": record.get("scraped_at"),
      "closingSortKey": closing_sort,
  }
  return stable_url_id(url), doc


def chunked(items: List[Any], size: int) -> Iterable[List[Any]]:
  for i in range(0, len(items), size):
    yield items[i : i + size]


def project_id() -> str:
  if CONFIG_PATH.exists():
    return load_json(CONFIG_PATH).get("projectId") or "nationalcreeradviceapp"
  return "nationalcreeradviceapp"


def init_firestore_admin(credentials_path: Path):
  import firebase_admin
  from firebase_admin import credentials, firestore

  if not firebase_admin._apps:
    cred = credentials.Certificate(str(credentials_path))
    firebase_admin.initialize_app(cred, {"projectId": project_id()})
    print(f"[+] Admin SDK via service account: {credentials_path}")
  return firestore.client()


def init_firestore_cli_user():
  """Use Firebase CLI login tokens with google-cloud-firestore."""
  from google.auth.transport.requests import Request
  from google.cloud import firestore
  from google.oauth2.credentials import Credentials

  if not FIREBASE_TOOLS_CONFIG.exists():
    raise FileNotFoundError(
        f"Firebase CLI config not found at {FIREBASE_TOOLS_CONFIG}. "
        "Run `firebase login` or provide a service account."
    )

  cfg = load_json(FIREBASE_TOOLS_CONFIG)
  tokens = cfg.get("tokens") or {}
  refresh_token = tokens.get("refresh_token")
  access_token = tokens.get("access_token")
  if not refresh_token:
    raise RuntimeError(
        "No Firebase CLI refresh token found. Run `firebase login`."
    )

  expires_at_ms = tokens.get("expires_at") or 0
  creds = Credentials(
      token=access_token,
      refresh_token=refresh_token,
      token_uri="https://oauth2.googleapis.com/token",
      client_id=FIREBASE_CLI_CLIENT_ID,
      client_secret=FIREBASE_CLI_CLIENT_SECRET,
      scopes=[
          "https://www.googleapis.com/auth/cloud-platform",
      ],
  )
  import time as _time
  if (not access_token) or (_time.time() * 1000 > float(expires_at_ms) - 60000):
    creds.refresh(Request())
  print("[+] Firestore client via Firebase CLI user credentials")
  return firestore.Client(project=project_id(), credentials=creds)


def resolve_credentials_path(explicit: Optional[Path]) -> Optional[Path]:
  if explicit and explicit.exists():
    return explicit
  env_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
  if env_path and Path(env_path).exists():
    return Path(env_path)
  if DEFAULT_CREDENTIALS.exists():
    return DEFAULT_CREDENTIALS
  return None


def init_firestore(credentials_path: Optional[Path]):
  resolved = resolve_credentials_path(credentials_path)
  if resolved:
    return init_firestore_admin(resolved)
  return init_firestore_cli_user()


def batch_write(
    db,
    collection: str,
    docs: List[Tuple[str, Dict[str, Any]]],
    dry_run: bool = False,
) -> Tuple[int, List[str]]:
  """Write docs in batches of BATCH_LIMIT. Returns (written, failures)."""
  written = 0
  failures: List[str] = []

  total_batches = (len(docs) + BATCH_LIMIT - 1) // BATCH_LIMIT
  for batch_idx, batch_docs in enumerate(chunked(docs, BATCH_LIMIT), start=1):
    if dry_run:
      written += len(batch_docs)
      print(
          f"    [dry-run] {collection} batch {batch_idx}/{total_batches}: "
          f"{len(batch_docs)} docs"
      )
      continue

    batch = db.batch()
    for doc_id, data in batch_docs:
      ref = db.collection(collection).document(doc_id)
      batch.set(ref, data, merge=True)

    try:
      batch.commit()
      written += len(batch_docs)
      print(
          f"    [+] {collection} batch {batch_idx}/{total_batches}: "
          f"wrote {len(batch_docs)} (total {written}/{len(docs)})"
      )
    except Exception as exc:
      print(
          f"    [-] {collection} batch {batch_idx} failed ({exc}); "
          "retrying per-doc"
      )
      for doc_id, data in batch_docs:
        try:
          db.collection(collection).document(doc_id).set(data, merge=True)
          written += 1
        except Exception as doc_exc:
          failures.append(f"{collection}/{doc_id}: {doc_exc}")
      time.sleep(0.5)

  return written, failures


def seed(credentials: Optional[Path], dry_run: bool = False) -> int:
  sources = {
      "occupations": OUTPUT_DIR / "occupation_details.json",
      "qualifications": OUTPUT_DIR / "qualifications.json",
      "providers": OUTPUT_DIR / "providers.json",
      "bursaries": OUTPUT_DIR / "bursaries.json",
  }

  loaded: Dict[str, List[Any]] = {}
  for name, path in sources.items():
    if not path.exists():
      print(f"[-] Missing {path} (skipping {name})")
      continue
    loaded[name] = load_json(path)

  if not loaded:
    print("[-] No scraper JSON found under output/")
    return 1

  print(
      "[-] Loaded JSON: "
      + ", ".join(f"{k}={len(v)}" for k, v in loaded.items())
  )

  builders = {
      "occupations": occupation_doc,
      "qualifications": qualification_doc,
      "providers": provider_doc,
      "bursaries": bursary_doc,
  }

  collection_docs: Dict[str, List[Tuple[str, Dict[str, Any]]]] = {}
  for name, records in loaded.items():
    collection_docs[name] = [builders[name](r) for r in records]

  for label, docs in collection_docs.items():
    ids = [doc_id for doc_id, _ in docs]
    if len(ids) != len(set(ids)):
      print(f"[-] Duplicate doc IDs detected in {label}")
      return 1

  db = None if dry_run else init_firestore(credentials)

  all_failures: List[str] = []
  summary = {}

  for collection, docs in collection_docs.items():
    print(f"[-] Seeding {collection} ({len(docs)} docs)...")
    written, failures = batch_write(db, collection, docs, dry_run=dry_run)
    summary[collection] = {
        "written": written,
        "failed": len(failures),
        "expected": len(docs),
    }
    all_failures.extend(failures)

  print("\n=== Seed summary ===")
  for collection, stats in summary.items():
    status = (
        "OK"
        if stats["written"] == stats["expected"] and stats["failed"] == 0
        else "CHECK"
    )
    print(
        f"  {collection}: written={stats['written']} "
        f"expected={stats['expected']} failed={stats['failed']} [{status}]"
    )

  expected = {
      "occupations": EXPECTED_OCCUPATIONS,
      "qualifications": EXPECTED_QUALIFICATIONS,
      "providers": EXPECTED_PROVIDERS,
      "bursaries": EXPECTED_BURSARIES,
  }
  print("\n=== Count check vs targets ===")
  matches = True
  for collection, target in expected.items():
    if collection not in summary:
      print(f"  {collection}: skipped (no JSON) [SKIP]")
      continue
    actual = summary[collection]["written"]
    ok = actual == target
    matches = matches and ok
    mark = "OK" if ok else "MISMATCH"
    print(f"  {collection}: {actual} (target {target}) [{mark}]")

  if all_failures:
    fail_path = OUTPUT_DIR / "firestore_seed_failures.json"
    with fail_path.open("w", encoding="utf-8") as f:
      json.dump(all_failures, f, indent=2)
    print(f"\n[-] {len(all_failures)} write failures logged to {fail_path}")
    for line in all_failures[:20]:
      print(f"    {line}")

  if dry_run:
    print("\n[dry-run] No writes were sent to Firestore.")
    return 0

  return 0 if matches and not all_failures else 2


def main() -> int:
  parser = argparse.ArgumentParser(description="Seed NCAP data into Firestore")
  parser.add_argument(
      "--credentials",
      type=Path,
      default=None,
      help="Path to Firebase service account JSON",
  )
  parser.add_argument(
      "--dry-run",
      action="store_true",
      help="Build docs and validate IDs without writing",
  )
  args = parser.parse_args()
  return seed(args.credentials, dry_run=args.dry_run)


if __name__ == "__main__":
  sys.exit(main())
