from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class QualificationRef(BaseModel):
  title: str = Field(..., description="Pathway / qualification title from the page")
  url: Optional[str] = Field(
      None,
      description="Absolute URL to the matching qualification page, if present",
  )


class OccupationDetail(BaseModel):
  occupation_code: str = Field(
      ..., description="Unique OFO / occupation code (e.g., '134915')"
  )
  title: str = Field(..., description="Cleaned title without the code suffix")
  url: str = Field(..., description="Absolute URL to the detail page")
  tasks: List[str] = Field(
      default_factory=list,
      description="List of core duties and daily responsibilities",
  )
  qualifications: List[QualificationRef] = Field(
      default_factory=list,
      description="Ordered pathway titles from h2.career-title (progression order)",
  )
  entry_requirements: List[str] = Field(
      default_factory=list,
      description="Prerequisite / admission notes from pathway dd entries",
  )
  alternative_titles: List[str] = Field(
      default_factory=list,
      description="Synonyms or alternative titles found on the page",
  )
  schema_version: int = Field(
      ...,
      description="Scraper schema version used when this record was written",
  )
  scraped_at: str = Field(
      default_factory=lambda: datetime.utcnow().isoformat(),
      description="Timestamp of when the record was enriched",
  )


class ProviderRef(BaseModel):
  name: str = Field(..., description="Learning provider / institution name")
  provider_id: Optional[str] = Field(
      None, description="NCAP LearningProviderId when available"
  )
  place_name: Optional[str] = Field(
      None, description="Campus / town / place label from NCAP"
  )
  latitude: Optional[float] = Field(None, description="Provider latitude if present")
  longitude: Optional[float] = Field(None, description="Provider longitude if present")
  url: Optional[str] = Field(
      None,
      description="Absolute provider detail URL if NCAP exposes one",
  )


class Qualification(BaseModel):
  title: str = Field(..., description="Qualification name from NCAP providers API/HTML")
  url: str = Field(
      ...,
      description=(
          "Join key: LearningProviderByQualification Index URL "
          "(same URL stored on OccupationDetail.qualifications[].url)"
      ),
  )
  general_qualification_id: str = Field(
      ..., description="GUID from GeneralQualificationId query param"
  )
  qualification_id: Optional[str] = Field(
      None, description="NCAP QualificationID from GetProviders when present"
  )
  nqf_level: Optional[str] = Field(
      None, description="NQF level string when returned by GetProviders"
  )
  duration: Optional[str] = Field(
      None, description="Duration if NCAP ever exposes it (often absent)"
  )
  saqa_url: Optional[str] = Field(
      None, description="External SAQA qualification link when present on the page"
  )
  providers: List[ProviderRef] = Field(
      default_factory=list,
      description="Institutions offering this qualification (embedded on the page/API)",
  )
  schema_version: int = Field(
      ...,
      description="Scraper schema version used when this record was written",
  )
  scraped_at: str = Field(
      default_factory=lambda: datetime.utcnow().isoformat(),
      description="Timestamp of when the record was scraped",
  )


class OfferedQualification(BaseModel):
  title: str = Field(..., description="Qualification title as shown on the provider page")
  saqa_url: Optional[str] = Field(
      None, description="External SAQA showQualification URL when present"
  )
  saqa_id: Optional[str] = Field(None, description="SAQA qualification ID if parseable")
  nqf_level: Optional[str] = Field(
      None, description="NQF level embedded in the listing title when present"
  )


class Provider(BaseModel):
  name: str = Field(..., description="Institution / learning provider name")
  url: str = Field(
      ...,
      description=(
          "Join key: canonical LearningProvider Index URL "
          "(same URL stored on Qualification.providers[].url)"
      ),
  )
  provider_id: str = Field(..., description="GUID from /LearningProvider/Index/{id}/...")
  website: Optional[str] = Field(None, description="Provider web address if not NULL")
  email: Optional[str] = Field(None, description="Contact email if not NULL")
  telephone: Optional[str] = Field(None, description="Telephone if not NULL")
  fax: Optional[str] = Field(None, description="Fax if not NULL")
  street_address: Optional[str] = Field(
      None, description="Street address block cleaned of Null/Undefined placeholders"
  )
  postal_address: Optional[str] = Field(
      None, description="Postal address block cleaned of Null/Undefined placeholders"
  )
  offered_qualifications: List[OfferedQualification] = Field(
      default_factory=list,
      description="Qualifications listed on the provider page (all paginated pages)",
  )
  schema_version: int = Field(
      ...,
      description="Scraper schema version used when this record was written",
  )
  scraped_at: str = Field(
      default_factory=lambda: datetime.utcnow().isoformat(),
      description="Timestamp of when the record was scraped",
  )


class BursaryRef(BaseModel):
  title: str = Field(..., description="Bursary title from a closing-date calendar entry")
  url: Optional[str] = Field(
      None, description="Absolute URL to the bursary detail page when known"
  )
  closing_date_iso: Optional[str] = Field(
      None, description="YYYY-MM-DD when parseable from the calendar listing"
  )
  field_slug: Optional[str] = Field(
      None, description="Field-category slug when derivable from the URL"
  )


class BursaryDetail(BaseModel):
  title: str = Field(
      ..., description="Name of the bursary (e.g., 'Allan Gray Orbis Fellowship')"
  )
  url: str = Field(..., description="Source URL of the bursary page (join key)")
  page_id: int = Field(..., description="WordPress page ID for batched re-fetch")
  field_slug: str = Field(
      ...,
      description="First URL path segment, e.g. 'engineering-bursaries-south-africa'",
  )
  field_label: str = Field(
      ..., description="Human field label, e.g. 'Engineering'"
  )
  provider_name: Optional[str] = Field(
      None, description="Sponsor / organisation name when extractable"
  )
  description: Optional[str] = Field(
      None, description="High-level summary of who the bursary is for"
  )
  eligibility: List[str] = Field(
      default_factory=list,
      description="Eligibility criteria list items from the detail page",
  )
  closing_date: Optional[str] = Field(
      None, description="Raw string of the deadline (e.g., '31 October 2026')"
  )
  closing_date_iso: Optional[str] = Field(
      None, description="YYYY-MM-DD when the raw closing date is parseable"
  )
  open_all_year: bool = Field(
      False,
      description="True when ongoing / no confirmed closing date",
  )
  required_documents: List[str] = Field(
      default_factory=list,
      description="List of requested docs (e.g., 'Certified ID', 'Matric Results')",
  )
  application_steps: List[str] = Field(
      default_factory=list,
      description="How-to-apply list items from the detail page",
  )
  application_link: Optional[str] = Field(
      None, description="External URL to the actual application portal or PDF"
  )
  contact_info: Optional[str] = Field(
      None, description="Email or phone block for queries"
  )
  contact_email: Optional[str] = Field(
      None, description="Email extracted from contact_info / mailto"
  )
  contact_phone: Optional[str] = Field(
      None, description="Phone extracted from contact_info"
  )
  wp_modified: Optional[str] = Field(
      None, description="WordPress modified timestamp for incremental re-scrape"
  )
  schema_version: int = Field(
      ...,
      description="Scraper schema version used when this record was written",
  )
  scraped_at: str = Field(
      default_factory=lambda: datetime.utcnow().isoformat(),
      description="Timestamp of when the record was enriched",
  )
