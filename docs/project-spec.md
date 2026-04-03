# Project Spec

## Working Title

Paper to Power: A Cross-Country Audit of Southeast Asia's Renewable Build-Out

## Objective

Build an open-source geospatial system that compares announced renewable projects with observed on-the-ground build-out across Indonesia, the Philippines, Vietnam, Malaysia, and Singapore, then evaluates whether built assets appear spatially positioned to contribute to regional electricity delivery.

## Why This Exists

Renewable project pipelines in Southeast Asia are large, but public announcements do not automatically translate into visible infrastructure or regionally usable power. Existing work usually separates:

- project and pipeline databases
- satellite-based asset detection
- grid or interconnection analysis

This project combines them into one asset-level workflow.

## Primary Questions

1. Which announced utility-scale solar and wind projects are actually visible on the ground?
2. Which projects appear delayed, resized, unmatched, or absent?
3. Which observed assets are more likely to matter for regional electricity delivery?
4. How do those patterns differ across the five-country comparison frame?

## Geographic Scope

- Indonesia
- Philippines
- Vietnam
- Malaysia
- Singapore

Role split:

- Indonesia, Philippines, Vietnam, Malaysia: source-side build-out
- Singapore: demand and import anchor

## Core Deliverables

1. Regional comparison map
2. Project and site evidence explorer
3. Paper-to-Power Gap status labels
4. Deliverability readiness score and score breakdown
5. Country comparison summaries
6. Deep case studies with before-and-after evidence

## MVP Boundary

Include:

- utility-scale solar and onshore wind only
- five-country comparison frame
- full first-pass matching focus on Indonesia and the Philippines
- second-pass matching coverage for Vietnam and Malaysia
- Singapore as corridor and demand context
- transparent weighted deliverability scoring

Exclude for v1:

- actual generation output claims
- power-flow simulation
- offshore wind-heavy modeling
- rooftop solar inventories
- commercial-grade completeness claims

## Success Criteria

- all five countries are visible in one coherent interface
- project matching is explainable and inspectable
- country comparison is more than map cosmetics
- at least 8 manually validated case studies are supported in the data model
- the repo reads like a serious applied geospatial system, not a generic dashboard
