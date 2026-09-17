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
