"""Evidence rules: a missing match is not evidence of non-delivery."""
from __future__ import annotations
import calendar
import re
from datetime import date
from typing import Any

METHOD_VERSION = '2.0.0'
OBSERVATION_CUTOFF = '2024-06-30'
# These are the countries actually ingested in the saved GRW snapshot, not GRW's global scope.
COVERED_COUNTRIES = {'IDN', 'MYS', 'PHL', 'SGP', 'VNM'}


def date_interval(value: str | None) -> tuple[date, date] | None:
    """Retain date precision; a year or range is never silently a January date."""
    if not isinstance(value, str):
        return None
    text = value.strip()
    try:
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}', text):
            d = date.fromisoformat(text)
            return d, d
        if re.fullmatch(r'\d{4}-\d{2}', text):
            y, m = map(int, text.split('-'))
            return date(y, m, 1), date(y, m, calendar.monthrange(y, m)[1])
        if re.fullmatch(r'\d{4}', text):
            y = int(text)
            return date(y, 1, 1), date(y, 12, 31)
        q = re.fullmatch(r'(\d{4})\s*[Qq]([1-4])', text)
        if q:
            y, quarter = map(int, q.groups()); m = quarter * 3
            return date(y, m - 2, 1), date(y, m, calendar.monthrange(y, m)[1])
        span = re.fullmatch(r'(\d{4})\s*[-–]\s*(\d{4})', text)
        if span:
            y1, y2 = map(int, span.groups())
            if y2 >= y1:
                return date(y1, 1, 1), date(y2, 12, 31)
    except ValueError:
        return None
    return None


def eligibility_reasons(project: dict[str, Any], cutoff: str = OBSERVATION_CUTOFF) -> list[str]:
    reasons: list[str] = []
    if project.get('countryCode') not in COVERED_COUNTRIES:
        reasons.append('Observation coverage unavailable in this snapshot')
    if project.get('installationType') in {'offshore', 'hybrid'} or project.get('technology') not in {'solar', 'wind'}:
        reasons.append('Technology is not assessed by this observation method')
    if project.get('coordinateAccuracy') != 'site':
        reasons.append('Location is representative or has not been verified at site level')
    expected = date_interval(project.get('expectedOperatingDate'))
    if expected is None:
        reasons.append('Expected operating date is missing or unresolved')
    elif expected[1] > date.fromisoformat(cutoff):
        reasons.append('Expected operating date falls after the observation cutoff')
    if project.get('claimReviewStatus') != 'reviewed':
        reasons.append('Documentary claim review is incomplete')
    if not project.get('observationReviewComplete'):
        reasons.append('Site observation review is incomplete')
    return reasons


def assess_project(project: dict[str, Any], approved_matches: list[dict[str, Any]], candidate_count: int = 0) -> dict[str, Any]:
    reasons = eligibility_reasons(project)
    has_coverage = project.get('countryCode') in COVERED_COUNTRIES
    if approved_matches:
        status = 'observed_footprint'
        reason = 'Partial asset attribution reviewed; these geometries do not establish complete construction, capacity, commissioning or output' if project.get('observationExtent')=='partial' else 'Asset attribution reviewed; a physical footprint does not establish commissioning or output'
    elif not has_coverage:
        status = 'coverage_unavailable'
        reason = reasons[0]
    elif project.get('installationType') in {'offshore', 'hybrid'} or project.get('technology') not in {'solar', 'wind'}:
        status = 'method_not_applicable'
        reason = 'GRW assesses solar footprints and onshore wind; this technology is outside its scope'
    elif any('after the observation cutoff' in r for r in reasons):
        status = 'not_yet_due_at_cutoff'
        reason = 'A later project cannot be judged against the older observation snapshot'
    elif not reasons:
        status = 'not_detected_by_cutoff'
        reason = 'No asset detected in a completed, eligible site review; this does not establish failure or abandonment'
    else:
        status = 'review_pending'
        reason = '; '.join(reasons)
    return {
        'paperToPowerLabel': status,
        'observationStatus': status,
        'observationReason': reason,
        'observationSource': 'Global Renewables Watch saved regional extract',
        'observationCutoff': OBSERVATION_CUTOFF,
        'methodVersion': METHOD_VERSION,
        'nonDetectionEligible': not reasons,
        'eligibilityReasons': reasons,
        'scheduleAssessment': 'not_assessable',
        'scheduleReason': 'Satellite first-seen dates are not commissioning dates; an independently sourced baseline and completion date are required',
        'matchReviewStatus': 'approved' if approved_matches else ('pending' if candidate_count else 'no_candidate'),
        'candidateCount': candidate_count,
    }


def summarize(projects: list[dict[str, Any]]) -> dict[str, Any]:
    eligible = [p for p in projects if p['nonDetectionEligible']]
    not_detected = sum(p['observationStatus'] == 'not_detected_by_cutoff' for p in eligible)
    counts: dict[str, int] = {}
    for p in projects:
        k = p['observationStatus']; counts[k] = counts.get(k, 0) + 1
    return {
        'projectCount': len(projects),
        'countryCount': len({p['countryCode'] for p in projects}),
        'coverageCountryCount': len({p['countryCode'] for p in projects if p['countryCode'] in COVERED_COUNTRIES}),
        'documentaryReviewedCount': sum(p.get('claimReviewStatus') == 'reviewed' for p in projects),
        'approvedFootprintCount': counts.get('observed_footprint', 0),
        'eligibleProjectCount': len(eligible),
        'notDetectedCount': not_detected,
        'notDetectedShare': not_detected / len(eligible) if eligible else None,
        'observationCounts': counts,
        'observationCutoff': OBSERVATION_CUTOFF,
        'methodVersion': METHOD_VERSION,
    }
