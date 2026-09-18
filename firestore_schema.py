"""
Firestore schema for the NCAP Firebase app.

Collections
-----------
occupations/{occupationCode}
  Source: output/occupation_details.json
  Doc ID: occupation_code (stable OFO code, e.g. "134915")
  Fields mirror OccupationDetail, plus:
    qualificationUrls: string[]   # join keys into qualifications via source URL
    providerUrls: string[]        # optional denormalized set derived later if needed

qualifications/{urlHash}
  Source: output/qualifications.json
  Doc ID: stable hash of canonical qualification URL
  Fields mirror Qualification, plus:
    providerUrls: string[]        # join keys into providers

providers/{urlHash}
  Source: output/providers.json
  Doc ID: stable hash of canonical provider URL
  Fields mirror Provider

bursaries/{urlHash}
  Source: output/bursaries.json
  Doc ID: stable hash of canonical bursary URL
  Fields mirror BursaryDetail (camelCase), plus:
    closingSortKey: string  # closingDateIso or "9999-12-31" for sort

profiles/{authUid}
  Created by the app on first sign-in (not seeded).
  Fields:
    questionnaireResults: map
    favourites: array of {type, url, title, entityId?}
    demographics: map | null
      preferredLanguage, role, hasDisability, disabilityCategories[], completedAt
    pushToken: string | null
    createdAt: timestamp
    updatedAt: timestamp

Join model
----------
Keep source URLs as the join keys (same as scraper JSON). Doc IDs are
deterministic derivatives of those keys for Firestore addressing only.
"""

from typing import Any, Dict, List, Optional

# Collection names
OCCUPATIONS = "occupations"
QUALIFICATIONS = "qualifications"
PROVIDERS = "providers"
BURSARIES = "bursaries"
PROFILES = "profiles"

# Expected seed counts (QA targets)
EXPECTED_OCCUPATIONS = 1432
EXPECTED_QUALIFICATIONS = 705
EXPECTED_PROVIDERS = 89
EXPECTED_BURSARIES = 1141


def profile_schema_example(uid: str) -> Dict[str, Any]:
  return {
      "questionnaireResults": {},
      "favourites": [],
      "demographics": None,
      "pushToken": None,
      "createdAt": None,  # server timestamp in app write
      "updatedAt": None,
  }
