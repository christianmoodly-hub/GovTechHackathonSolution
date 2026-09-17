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
