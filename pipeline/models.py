from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal, cast


CountryCode = Literal["IDN", "PHL", "SGP", "VNM", "MYS"]
CountryRole = Literal["source", "anchor"]
Technology = Literal["solar", "wind", "mixed"]
PaperToPowerLabel = Literal[
    "claimed_not_observed",
    "observed_on_schedule",
    "observed_delayed",
    "observed_smaller_than_claimed",
    "observed_unmatched",
    "built_but_low_deliverability",
    "built_and_corridor_ready",
]
RegionalLinkKind = Literal["corridor", "comparison"]
SourceCategory = Literal[
    "observed-assets",
    "project-registry",
    "country-validator",
    "anchor-context",
]

COUNTRY_CODES: set[str] = {"IDN", "PHL", "SGP", "VNM", "MYS"}
COUNTRY_ROLES: set[str] = {"source", "anchor"}
TECHNOLOGIES: set[str] = {"solar", "wind", "mixed"}
PAPER_TO_POWER_LABELS: set[str] = {
    "claimed_not_observed",
    "observed_on_schedule",
    "observed_delayed",
    "observed_smaller_than_claimed",
    "observed_unmatched",
    "built_but_low_deliverability",
    "built_and_corridor_ready",
}
REGIONAL_LINK_KINDS: set[str] = {"corridor", "comparison"}
SOURCE_CATEGORIES: set[str] = {
    "observed-assets",
    "project-registry",
    "country-validator",
    "anchor-context",
}


def require_string(value: Any, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string")
    return value.strip()


def require_number(value: Any, field_name: str) -> float:
    if not isinstance(value, int | float):
        raise ValueError(f"{field_name} must be a number")
    return float(value)


def require_literal(value: Any, allowed: set[str], field_name: str) -> str:
    value_str = require_string(value, field_name)
    if value_str not in allowed:
        raise ValueError(f"{field_name} must be one of {sorted(allowed)}")
    return value_str


def require_string_list(value: Any, field_name: str) -> list[str]:
    if not isinstance(value, list):
        raise ValueError(f"{field_name} must be a list")
    result = [require_string(item, field_name) for item in value]
    if not result:
        raise ValueError(f"{field_name} must not be empty")
    return result


@dataclass(frozen=True)
class FeatureCard:
    eyebrow: str
    title: str
    description: str

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "FeatureCard":
        return cls(
            eyebrow=require_string(value.get("eyebrow"), "eyebrow"),
            title=require_string(value.get("title"), "title"),
            description=require_string(value.get("description"), "description"),
        )


@dataclass(frozen=True)
class CountrySummary:
    code: CountryCode
    name: str
    role: CountryRole
    shortLabel: str
    description: str
    claimedCapacityGw: float
    observedCapacityGw: float
    gapShare: float
    medianLagMonths: int
    readinessScore: int
    keySignal: str

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "CountrySummary":
        gap_share = require_number(value.get("gapShare"), "gapShare")
        readiness = int(require_number(value.get("readinessScore"), "readinessScore"))
        lag_months = int(require_number(value.get("medianLagMonths"), "medianLagMonths"))
        if not 0 <= gap_share <= 1:
            raise ValueError("gapShare must be between 0 and 1")
        if not 0 <= readiness <= 100:
            raise ValueError("readinessScore must be between 0 and 100")
        return cls(
            code=cast(CountryCode, require_literal(value.get("code"), COUNTRY_CODES, "code")),
            name=require_string(value.get("name"), "name"),
            role=cast(CountryRole, require_literal(value.get("role"), COUNTRY_ROLES, "role")),
            shortLabel=require_string(value.get("shortLabel"), "shortLabel"),
            description=require_string(value.get("description"), "description"),
            claimedCapacityGw=require_number(value.get("claimedCapacityGw"), "claimedCapacityGw"),
            observedCapacityGw=require_number(value.get("observedCapacityGw"), "observedCapacityGw"),
            gapShare=gap_share,
            medianLagMonths=lag_months,
            readinessScore=readiness,
            keySignal=require_string(value.get("keySignal"), "keySignal"),
        )


@dataclass(frozen=True)
class RegionalLink:
    from_country: CountryCode
    to_country: CountryCode
    kind: RegionalLinkKind

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "RegionalLink":
        return cls(
            from_country=cast(
                CountryCode,
                require_literal(value.get("from"), COUNTRY_CODES, "from"),
            ),
            to_country=cast(
                CountryCode,
                require_literal(value.get("to"), COUNTRY_CODES, "to"),
            ),
            kind=cast(
                RegionalLinkKind,
                require_literal(value.get("kind"), REGIONAL_LINK_KINDS, "kind"),
            ),
        )


@dataclass(frozen=True)
class EvidenceRow:
    id: str
    projectName: str
    countryCode: CountryCode
    technology: Technology
    claimedCapacityMw: float
    observedCapacityMw: float
    label: PaperToPowerLabel
    firstSeenQuarter: str
    readinessScore: int

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "EvidenceRow":
        readiness = int(require_number(value.get("readinessScore"), "readinessScore"))
        if not 0 <= readiness <= 100:
            raise ValueError("readinessScore must be between 0 and 100")
        return cls(
            id=require_string(value.get("id"), "id"),
            projectName=require_string(value.get("projectName"), "projectName"),
            countryCode=cast(
                CountryCode,
                require_literal(value.get("countryCode"), COUNTRY_CODES, "countryCode"),
            ),
            technology=cast(
                Technology,
                require_literal(value.get("technology"), TECHNOLOGIES, "technology"),
            ),
            claimedCapacityMw=require_number(value.get("claimedCapacityMw"), "claimedCapacityMw"),
            observedCapacityMw=require_number(value.get("observedCapacityMw"), "observedCapacityMw"),
            label=cast(
                PaperToPowerLabel,
                require_literal(value.get("label"), PAPER_TO_POWER_LABELS, "label"),
            ),
            firstSeenQuarter=require_string(value.get("firstSeenQuarter"), "firstSeenQuarter"),
            readinessScore=readiness,
        )


@dataclass(frozen=True)
class CaseStudy:
    id: str
    countryCode: CountryCode
    title: str
    label: PaperToPowerLabel
    summary: str
    whyItMatters: str

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "CaseStudy":
        return cls(
            id=require_string(value.get("id"), "id"),
            countryCode=cast(
                CountryCode,
                require_literal(value.get("countryCode"), COUNTRY_CODES, "countryCode"),
            ),
            title=require_string(value.get("title"), "title"),
            label=cast(
                PaperToPowerLabel,
                require_literal(value.get("label"), PAPER_TO_POWER_LABELS, "label"),
            ),
            summary=require_string(value.get("summary"), "summary"),
            whyItMatters=require_string(value.get("whyItMatters"), "whyItMatters"),
        )


@dataclass(frozen=True)
class PublicSource:
    id: str
    name: str
    scope: list[CountryCode]
    category: SourceCategory
    url: str
    notes: str

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "PublicSource":
        scope = [
            cast(CountryCode, require_literal(item, COUNTRY_CODES, "scope item"))
            for item in require_string_list(value.get("scope"), "scope")
        ]
        return cls(
            id=require_string(value.get("id"), "id"),
            name=require_string(value.get("name"), "name"),
            scope=scope,
            category=cast(
                SourceCategory,
                require_literal(value.get("category"), SOURCE_CATEGORIES, "category"),
            ),
            url=require_string(value.get("url"), "url"),
            notes=require_string(value.get("notes"), "notes"),
        )


@dataclass(frozen=True)
class FrontendDataset:
    featureCards: list[FeatureCard]
    countrySummaries: list[CountrySummary]
    regionalLinks: list[RegionalLink]
    evidenceRows: list[EvidenceRow]
    caseStudies: list[CaseStudy]
    publicSources: list[PublicSource]
