import type {
  CaseStudy,
  CountrySummary,
  EvidenceRow,
  FeatureCard,
  PublicSource,
  RegistryMapProject,
  RegionalLink,
} from '../types/domain'

const dataset =
{
  "featureCards": [
    {
      "eyebrow": "Observed Build-Out",
      "title": "Check whether projects are visible on the ground.",
      "description": "Use satellite-observed renewable assets as the reality layer, not just a background map."
    },
    {
      "eyebrow": "Paper-to-Power Gap",
      "title": "Measure where public project claims diverge from observed infrastructure.",
      "description": "Treat delays, downsizing, and absent build-out as first-class analytic outputs."
    },
    {
      "eyebrow": "Deliverability",
      "title": "Screen whether built assets look positioned to matter regionally.",
      "description": "Score infrastructure context and corridor relevance without pretending to run grid dispatch."
    }
  ],
  "countrySummaries": [
    {
      "code": "PHL",
      "name": "Philippines",
      "role": "source",
      "shortLabel": "PH",
      "description": "Project metadata is comparatively rich, but many sites still stall between announcement and visible delivery.",
      "claimedCapacityGw": 14.944,
      "observedCapacityGw": 0.292,
      "gapShare": 0.9805,
      "medianLagMonths": 84,
      "readinessScore": 16,
      "keySignal": "Projects often clear land but stall before panel installation.",
      "observedAssetInventoryCount": 325,
      "matchedProjectCount": 7,
      "hasObservedCoverage": true
    },
    {
      "code": "VNM",
      "name": "Vietnam",
      "role": "source",
      "shortLabel": "VN",
      "description": "Large utility-scale ambition is visible, but transmission readiness remains a recurring constraint.",
      "claimedCapacityGw": 1.743,
      "observedCapacityGw": 0.228,
      "gapShare": 0.8694,
      "medianLagMonths": 57,
      "readinessScore": 29,
      "keySignal": "Massive wind capacity announced, waiting on transmission upgrades.",
      "observedAssetInventoryCount": 1739,
      "matchedProjectCount": 4,
      "hasObservedCoverage": true
    },
    {
      "code": "LAO",
      "name": "Laos",
      "role": "source",
      "shortLabel": "LA",
      "description": "Export-oriented wind development is becoming a core part of the country\u2019s utility-scale strategy.",
      "claimedCapacityGw": 1.695,
      "observedCapacityGw": 0.0,
      "gapShare": 1.0,
      "medianLagMonths": 0,
      "readinessScore": 8,
      "keySignal": "Cross-border export ambitions are becoming central to utility-scale wind development.",
      "observedAssetInventoryCount": 0,
      "matchedProjectCount": 0,
      "hasObservedCoverage": false
    },
    {
      "code": "MYS",
      "name": "Malaysia",
      "role": "source",
      "shortLabel": "MY",
      "description": "Solar expansion is active, but land availability and corridor relevance vary sharply by location.",
      "claimedCapacityGw": 1.285,
      "observedCapacityGw": 0.135,
      "gapShare": 0.8947,
      "medianLagMonths": 3,
      "readinessScore": 34,
      "keySignal": "Strong solar buildout but facing land constraint challenges.",
      "observedAssetInventoryCount": 123,
      "matchedProjectCount": 7,
      "hasObservedCoverage": true
    },
    {
      "code": "IDN",
      "name": "Indonesia",
      "role": "source",
      "shortLabel": "ID",
      "description": "Large geography with uneven build-out and persistent grid-side bottlenecks across utility-scale projects.",
      "claimedCapacityGw": 0.702,
      "observedCapacityGw": 0.17,
      "gapShare": 0.7579,
      "medianLagMonths": 6,
      "readinessScore": 34,
      "keySignal": "Significant delays in grid connectivity for constructed projects.",
      "observedAssetInventoryCount": 113,
      "matchedProjectCount": 5,
      "hasObservedCoverage": true
    },
    {
      "code": "THA",
      "name": "Thailand",
      "role": "source",
      "shortLabel": "TH",
      "description": "Floating solar expansion and grid modernization increasingly shape the utility-scale pipeline.",
      "claimedCapacityGw": 0.655,
      "observedCapacityGw": 0.0,
      "gapShare": 1.0,
      "medianLagMonths": 0,
      "readinessScore": 8,
      "keySignal": "Floating solar and grid modernization shape the current expansion path.",
      "observedAssetInventoryCount": 0,
      "matchedProjectCount": 0,
      "hasObservedCoverage": false
    },
    {
      "code": "SGP",
      "name": "Singapore",
      "role": "anchor",
      "shortLabel": "SG",
      "description": "Best understood as a demand and import anchor rather than a major domestic utility-scale geography.",
      "claimedCapacityGw": 0.416,
      "observedCapacityGw": 0.011,
      "gapShare": 0.974,
      "medianLagMonths": 6,
      "readinessScore": 32,
      "keySignal": "High demand driving regional export ambitions, zero domestic utility scale.",
      "observedAssetInventoryCount": 11,
      "matchedProjectCount": 5,
      "hasObservedCoverage": true
    },
    {
      "code": "MMR",
      "name": "Myanmar",
      "role": "source",
      "shortLabel": "MM",
      "description": "Project execution is constrained by instability, financing risk, and weak grid reliability.",
      "claimedCapacityGw": 0.17,
      "observedCapacityGw": 0.0,
      "gapShare": 1.0,
      "medianLagMonths": 0,
      "readinessScore": 8,
      "keySignal": "Operational context is constrained by instability and weak grid reliability.",
      "observedAssetInventoryCount": 0,
      "matchedProjectCount": 0,
      "hasObservedCoverage": false
    },
    {
      "code": "KHM",
      "name": "Cambodia",
      "role": "source",
      "shortLabel": "KH",
      "description": "Pipeline depth remains thin, but structured procurement has already produced bankable solar evidence.",
      "claimedCapacityGw": 0.1,
      "observedCapacityGw": 0.0,
      "gapShare": 1.0,
      "medianLagMonths": 0,
      "readinessScore": 8,
      "keySignal": "Pipeline depth is thinner, but structured procurement has already proven viable.",
      "observedAssetInventoryCount": 0,
      "matchedProjectCount": 0,
      "hasObservedCoverage": false
    },
    {
      "code": "BRN",
      "name": "Brunei",
      "role": "source",
      "shortLabel": "BN",
      "description": "Utility-scale deployment is still nascent and shaped by first-project execution.",
      "claimedCapacityGw": 0.03,
      "observedCapacityGw": 0.0,
      "gapShare": 1.0,
      "medianLagMonths": 0,
      "readinessScore": 8,
      "keySignal": "The utility-scale market is nascent and still defined by first-project execution.",
      "observedAssetInventoryCount": 0,
      "matchedProjectCount": 0,
      "hasObservedCoverage": false
    }
  ],
  "regionalLinks": [
    {
      "from": "IDN",
      "to": "SGP",
      "kind": "corridor"
    },
    {
      "from": "MYS",
      "to": "SGP",
      "kind": "corridor"
    },
    {
      "from": "VNM",
      "to": "SGP",
      "kind": "comparison"
    },
    {
      "from": "PHL",
      "to": "SGP",
      "kind": "comparison"
    }
  ],
  "evidenceRows": [
    {
      "id": "BRN-S-ASEAN-001",
      "projectName": "Kampong Belimbing Solar",
      "countryCode": "BRN",
      "technology": "solar",
      "claimedCapacityMw": 30.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "IDN-S-ASEAN-001",
      "projectName": "Cirata Floating PV",
      "countryCode": "IDN",
      "technology": "solar",
      "claimedCapacityMw": 145.0,
      "observedCapacityMw": 160.52,
      "label": "observed_on_schedule",
      "firstSeenQuarter": "2024 Q1",
      "readinessScore": 34
    },
    {
      "id": "IDN-S-ASEAN-002",
      "projectName": "Karangkates Floating Solar",
      "countryCode": "IDN",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "IDN-S-ASEAN-003",
      "projectName": "Likupang Solar Power",
      "countryCode": "IDN",
      "technology": "solar",
      "claimedCapacityMw": 15.0,
      "observedCapacityMw": 9.41,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2019 Q1",
      "readinessScore": 34
    },
    {
      "id": "IDN-S-ASEAN-004",
      "projectName": "Trembesi Floating Solar",
      "countryCode": "IDN",
      "technology": "solar",
      "claimedCapacityMw": 35.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "IDN-W-001",
      "projectName": "Sidrap I Wind Power Plant",
      "countryCode": "IDN",
      "technology": "wind",
      "claimedCapacityMw": 75.0,
      "observedCapacityMw": 0.0,
      "label": "observed_on_schedule",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 34
    },
    {
      "id": "IDN-W-ASEAN-001",
      "projectName": "East Lombok PLTB",
      "countryCode": "IDN",
      "technology": "wind",
      "claimedCapacityMw": 115.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "IDN-W-ASEAN-002",
      "projectName": "PLTB Tanah Laut Adaro",
      "countryCode": "IDN",
      "technology": "wind",
      "claimedCapacityMw": 70.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "IDN-W-ASEAN-003",
      "projectName": "Sidrap 1 Wind",
      "countryCode": "IDN",
      "technology": "wind",
      "claimedCapacityMw": 75.0,
      "observedCapacityMw": 0.0,
      "label": "observed_on_schedule",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 34
    },
    {
      "id": "IDN-W-ASEAN-004",
      "projectName": "Tolo 1 Wind",
      "countryCode": "IDN",
      "technology": "wind",
      "claimedCapacityMw": 72.0,
      "observedCapacityMw": 0.0,
      "label": "observed_on_schedule",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 34
    },
    {
      "id": "KHM-S-ASEAN-001",
      "projectName": "National Solar Park",
      "countryCode": "KHM",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "LAO-W-ASEAN-001",
      "projectName": "Monsoon Wind Power Project",
      "countryCode": "LAO",
      "technology": "wind",
      "claimedCapacityMw": 600.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "LAO-W-ASEAN-002",
      "projectName": "Savan 1 Project",
      "countryCode": "LAO",
      "technology": "wind",
      "claimedCapacityMw": 495.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "LAO-W-ASEAN-003",
      "projectName": "Truong Son Wind Farm",
      "countryCode": "LAO",
      "technology": "wind",
      "claimedCapacityMw": 600.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "MMR-S-ASEAN-001",
      "projectName": "Minbu Solar Park",
      "countryCode": "MMR",
      "technology": "solar",
      "claimedCapacityMw": 170.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "MYS-S-001",
      "projectName": "TNB Sepang Solar",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 50.0,
      "observedCapacityMw": 44.16,
      "label": "observed_on_schedule",
      "firstSeenQuarter": "2018 Q2",
      "readinessScore": 34
    },
    {
      "id": "MYS-S-002",
      "projectName": "Gurun Quantum Solar PV Park",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 65.0,
      "observedCapacityMw": 40.43,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2018 Q3",
      "readinessScore": 34
    },
    {
      "id": "MYS-S-ASEAN-001",
      "projectName": "LSS5+ Kelantan Solar",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "MYS-S-ASEAN-002",
      "projectName": "LSS5+ Port Dickson Solar",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 99.99,
      "observedCapacityMw": 2.39,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 34
    },
    {
      "id": "MYS-S-ASEAN-003",
      "projectName": "LSS5+ Segamat Solar",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 99.99,
      "observedCapacityMw": 0.61,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2019 Q2",
      "readinessScore": 34
    },
    {
      "id": "MYS-S-ASEAN-004",
      "projectName": "LSS5+ Windsor Estate Solar",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 470.0,
      "observedCapacityMw": 20.46,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2018 Q3",
      "readinessScore": 34
    },
    {
      "id": "MYS-S-ASEAN-005",
      "projectName": "LSS5+ reNIKOLA Kemaman 1",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 250.0,
      "observedCapacityMw": 15.66,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2018 Q1",
      "readinessScore": 34
    },
    {
      "id": "MYS-S-ASEAN-006",
      "projectName": "LSS5+ reNIKOLA Kemaman 2",
      "countryCode": "MYS",
      "technology": "solar",
      "claimedCapacityMw": 150.0,
      "observedCapacityMw": 11.6,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2019 Q2",
      "readinessScore": 34
    },
    {
      "id": "PHL-M-ASEAN-001",
      "projectName": "Terra Solar (with BESS)",
      "countryCode": "PHL",
      "technology": "mixed",
      "claimedCapacityMw": 1785.7,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "PHL-S-001",
      "projectName": "Olongapo Solar Power Project",
      "countryCode": "PHL",
      "technology": "solar",
      "claimedCapacityMw": 221.082,
      "observedCapacityMw": 131.07,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 16
    },
    {
      "id": "PHL-S-002",
      "projectName": "Cayanga-Bugallon Solar Power Plant",
      "countryCode": "PHL",
      "technology": "solar",
      "claimedCapacityMw": 94.717,
      "observedCapacityMw": 18.22,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2022 Q4",
      "readinessScore": 16
    },
    {
      "id": "PHL-S-003",
      "projectName": "Opus Solar Power Project",
      "countryCode": "PHL",
      "technology": "solar",
      "claimedCapacityMw": 300.0,
      "observedCapacityMw": 50.05,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 16
    },
    {
      "id": "PHL-S-004",
      "projectName": "Laoag Solar Power Project",
      "countryCode": "PHL",
      "technology": "solar",
      "claimedCapacityMw": 159.0,
      "observedCapacityMw": 0.74,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2022 Q3",
      "readinessScore": 16
    },
    {
      "id": "PHL-S-005",
      "projectName": "Calatrava Solar Power Project",
      "countryCode": "PHL",
      "technology": "solar",
      "claimedCapacityMw": 168.953,
      "observedCapacityMw": 84.53,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 16
    },
    {
      "id": "PHL-S-006",
      "projectName": "Armenia Solar Power Project",
      "countryCode": "PHL",
      "technology": "solar",
      "claimedCapacityMw": 46.658,
      "observedCapacityMw": 7.27,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2017 Q4",
      "readinessScore": 16
    },
    {
      "id": "PHL-W-ASEAN-001",
      "projectName": "Bulalacao Bay Offshore",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 1200.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "PHL-W-ASEAN-002",
      "projectName": "Calatagan Offshore Wind",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 1830.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "PHL-W-ASEAN-003",
      "projectName": "Claveria Offshore Wind",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 1600.0,
      "observedCapacityMw": 0.0,
      "label": "observed_on_schedule",
      "firstSeenQuarter": "2019 Q1",
      "readinessScore": 16
    },
    {
      "id": "PHL-W-ASEAN-004",
      "projectName": "Mariveles Offshore Wind",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 1500.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "PHL-W-ASEAN-005",
      "projectName": "NOM FL1 Offshore Wind",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 3038.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "PHL-W-ASEAN-006",
      "projectName": "Northern Mindoro Offshore",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 2000.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "PHL-W-ASEAN-007",
      "projectName": "San Miguel Bay Offshore",
      "countryCode": "PHL",
      "technology": "wind",
      "claimedCapacityMw": 1000.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "SGP-S-001",
      "projectName": "Sembcorp Tengeh Floating Solar Farm",
      "countryCode": "SGP",
      "technology": "solar",
      "claimedCapacityMw": 60.0,
      "observedCapacityMw": 2.85,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2021 Q1",
      "readinessScore": 32
    },
    {
      "id": "SGP-S-ASEAN-001",
      "projectName": "Kranji Reservoir Floating Solar",
      "countryCode": "SGP",
      "technology": "solar",
      "claimedCapacityMw": 141.0,
      "observedCapacityMw": 1.2,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2021 Q3",
      "readinessScore": 32
    },
    {
      "id": "SGP-S-ASEAN-002",
      "projectName": "Lower Seletar Floating Solar",
      "countryCode": "SGP",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "observedCapacityMw": 2.71,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2024 Q2",
      "readinessScore": 32
    },
    {
      "id": "SGP-S-ASEAN-003",
      "projectName": "Pandan Reservoir Floating Solar",
      "countryCode": "SGP",
      "technology": "solar",
      "claimedCapacityMw": 55.0,
      "observedCapacityMw": 2.29,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2019 Q2",
      "readinessScore": 32
    },
    {
      "id": "SGP-S-ASEAN-004",
      "projectName": "Sembcorp Tengeh Floating Solar Farm",
      "countryCode": "SGP",
      "technology": "solar",
      "claimedCapacityMw": 60.0,
      "observedCapacityMw": 1.75,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2018 Q3",
      "readinessScore": 32
    },
    {
      "id": "THA-S-ASEAN-001",
      "projectName": "Bhumibol Dam FPV 1",
      "countryCode": "THA",
      "technology": "solar",
      "claimedCapacityMw": 158.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "THA-S-ASEAN-002",
      "projectName": "Saeng Pat Phalangngan",
      "countryCode": "THA",
      "technology": "solar",
      "claimedCapacityMw": 77.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "THA-S-ASEAN-003",
      "projectName": "Sri Nakarin Dam FPV 1",
      "countryCode": "THA",
      "technology": "solar",
      "claimedCapacityMw": 140.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "THA-S-ASEAN-004",
      "projectName": "Srinagarind Dam FPV 3",
      "countryCode": "THA",
      "technology": "solar",
      "claimedCapacityMw": 280.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "VNM-S-001",
      "projectName": "Trungnam Solar Farm (Thuan Bac)",
      "countryCode": "VNM",
      "technology": "solar",
      "claimedCapacityMw": 204.0,
      "observedCapacityMw": 0.72,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2019 Q3",
      "readinessScore": 29
    },
    {
      "id": "VNM-S-002",
      "projectName": "Dau Tieng Solar Power Complex",
      "countryCode": "VNM",
      "technology": "solar",
      "claimedCapacityMw": 350.0,
      "observedCapacityMw": 224.29,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2018 Q4",
      "readinessScore": 29
    },
    {
      "id": "VNM-S-003",
      "projectName": "Xuan Thien Ea Sup Solar Power Complex",
      "countryCode": "VNM",
      "technology": "solar",
      "claimedCapacityMw": 600.0,
      "observedCapacityMw": 1.94,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2021 Q2",
      "readinessScore": 29
    },
    {
      "id": "VNM-S-004",
      "projectName": "Hoa Hoi Solar Power Plant",
      "countryCode": "VNM",
      "technology": "solar",
      "claimedCapacityMw": 214.0,
      "observedCapacityMw": 0.68,
      "label": "observed_smaller_than_claimed",
      "firstSeenQuarter": "2021 Q1",
      "readinessScore": 29
    },
    {
      "id": "VNM-W-001",
      "projectName": "Dien Bien 1 Wind Power Plant",
      "countryCode": "VNM",
      "technology": "wind",
      "claimedCapacityMw": 175.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    },
    {
      "id": "VNM-W-002",
      "projectName": "Nam Bung Wind Power Plant",
      "countryCode": "VNM",
      "technology": "wind",
      "claimedCapacityMw": 200.0,
      "observedCapacityMw": 0.0,
      "label": "claimed_not_observed",
      "firstSeenQuarter": "not seen",
      "readinessScore": 0
    }
  ],
  "caseStudies": [
    {
      "id": "case-idn-riau",
      "countryCode": "IDN",
      "title": "Indonesia as the main source-side anchor",
      "label": "observed_smaller_than_claimed",
      "summary": "A cluster that appears real on the ground, but the observed footprint suggests slower realized build-out than the public headline implies.",
      "whyItMatters": "Useful for showing that the project is not anti-renewables; it is pro-verification."
    },
    {
      "id": "case-ph-luzon",
      "countryCode": "PHL",
      "title": "The Philippines as the metadata proving ground",
      "label": "observed_on_schedule",
      "summary": "A cleaner case where public metadata and observed timing align well enough to serve as a validation benchmark.",
      "whyItMatters": "Supports the credibility of the broader matching workflow."
    },
    {
      "id": "case-my-sarawak",
      "countryCode": "MYS",
      "title": "Sarawak as corridor logic, not just country coverage",
      "label": "built_and_corridor_ready",
      "summary": "A case where build-out and regional corridor framing can be shown in the same evidence thread.",
      "whyItMatters": "Helps distinguish this from a flat country-by-country map exercise."
    }
  ],
  "publicSources": [
    {
      "id": "grw-preprint",
      "name": "Global Renewables Watch preprint",
      "scope": [
        "IDN",
        "MYS",
        "PHL",
        "SGP",
        "VNM"
      ],
      "category": "observed-assets",
      "url": "https://www.microsoft.com/en-us/research/wp-content/uploads/2025/03/Global-Renewables-Watch_Caleb-Robinson_2025.pdf",
      "notes": "Observed renewable asset layer with quarterly timing, capacity proxy, and preceding land use. Current backend coverage: IDN, MYS, PHL, SGP, VNM."
    },
    {
      "id": "gem-solar",
      "name": "Global Solar Power Tracker",
      "scope": [
        "BRN",
        "IDN",
        "KHM",
        "LAO",
        "MMR",
        "MYS",
        "PHL",
        "SGP",
        "THA",
        "VNM"
      ],
      "category": "project-registry",
      "url": "https://globalenergymonitor.org/projects/global-solar-power-tracker/download-data/",
      "notes": "Primary public backbone for utility-scale solar project metadata. The expanded ASEAN registry also includes manually reviewed project-level evidence where tracker coverage is weak."
    },
    {
      "id": "gem-wind",
      "name": "Global Wind Power Tracker",
      "scope": [
        "BRN",
        "IDN",
        "KHM",
        "LAO",
        "MMR",
        "MYS",
        "PHL",
        "SGP",
        "THA",
        "VNM"
      ],
      "category": "project-registry",
      "url": "https://globalenergymonitor.org/projects/global-wind-power-tracker/",
      "notes": "Primary public backbone for utility-scale wind project metadata. The expanded ASEAN registry also includes manually reviewed project-level evidence where tracker coverage is weak."
    },
    {
      "id": "ph-doe",
      "name": "Philippines DOE project and plant lists",
      "scope": [
        "PHL"
      ],
      "category": "country-validator",
      "url": "https://doe.gov.ph/electric-power",
      "notes": "Strong public metadata source for project validation and commissioning context."
    },
    {
      "id": "idn-ruptl",
      "name": "Indonesia RUPTL planning documents",
      "scope": [
        "IDN"
      ],
      "category": "country-validator",
      "url": "https://web.pln.co.id/cms/media/siaran-pers/2025/05/ruptl-pln-2025-2034-siap-buka-keran-investasi-swasta/",
      "notes": "Planning and project detail source for Indonesian pipeline context."
    },
    {
      "id": "vnm-pdp8",
      "name": "Vietnam PDP8 implementation materials",
      "scope": [
        "VNM"
      ],
      "category": "country-validator",
      "url": "https://www.allenandgledhill.com/vn/perspectives/articles/27819/issues-implementation-plan-for-national-power-development-plan-viii",
      "notes": "Useful for province, timing, and investor-level project context."
    },
    {
      "id": "mys-lss",
      "name": "Malaysia LSS and energy commission sources",
      "scope": [
        "MYS"
      ],
      "category": "country-validator",
      "url": "https://www.seda.gov.my/reportal/large-scale-solar/",
      "notes": "Program-centric source for project awards and utility-scale solar progress."
    },
    {
      "id": "sgp-ema",
      "name": "Singapore EMA regional energy connectivity",
      "scope": [
        "SGP"
      ],
      "category": "anchor-context",
      "url": "https://www.ema.gov.sg/news-events/news/media-releases/2024/the-united-states-singapore-feasibility-study-on-regional-energy-connectivity",
      "notes": "Anchor reference for corridor relevance and import-side framing."
    }
  ],
  "registryMapProjects": [
    {
      "projectId": "BRN-S-ASEAN-001",
      "projectName": "Kampong Belimbing Solar",
      "countryCode": "BRN",
      "countryName": "Brunei",
      "technology": "solar",
      "claimedCapacityMw": 30.0,
      "claimedStatus": "construction",
      "claimedCod": null,
      "locationText": "Kampong Belimbing Mukim Kota Batu",
      "provinceStateRegion": "Brunei-Muara",
      "latitude": 4.9082,
      "longitude": 114.9655,
      "sourcePrimaryUrl": "https://reglobal.org/construction-begins-at-bruneis-flagship-solar-power-plant/",
      "sourcePrimaryType": "Industry News",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point for Kampong Belimbing area",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "IDN-S-ASEAN-001",
      "projectName": "Cirata Floating PV",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "solar",
      "claimedCapacityMw": 145.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Cirata Reservoir",
      "provinceStateRegion": "West Java",
      "latitude": -6.7025,
      "longitude": 107.3691,
      "sourcePrimaryUrl": "https://www.masdar.ae/en/our-portfolio/cirata",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "observed_on_schedule",
      "observedCapacityMw": 160.52,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2024 Q1",
      "matchConfidence": 0.875,
      "distanceKm": 3.98,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::IDN::solar_sea_2024q2_v1.geojson::8",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              107.328886,
              -6.693532
            ],
            [
              107.339448,
              -6.693586
            ],
            [
              107.339341,
              -6.714303
            ],
            [
              107.328779,
              -6.71425
            ],
            [
              107.328886,
              -6.693532
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": -6.7018409,
      "matchedAssetCentroidLongitude": 107.3330681
    },
    {
      "projectId": "IDN-W-ASEAN-001",
      "projectName": "East Lombok PLTB",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "wind",
      "claimedCapacityMw": 115.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "East Lombok Regency",
      "provinceStateRegion": "West Nusa Tenggara",
      "latitude": -8.65,
      "longitude": 116.53,
      "sourcePrimaryUrl": "https://www.esdm.go.id/",
      "sourcePrimaryType": "Government Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "IDN-S-ASEAN-002",
      "projectName": "Karangkates Floating Solar",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Karangkates (Sutami) Dam",
      "provinceStateRegion": "East Java",
      "latitude": -8.156,
      "longitude": 112.447,
      "sourcePrimaryUrl": "https://www.pln.co.id/",
      "sourcePrimaryType": "Utility Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "IDN-S-ASEAN-003",
      "projectName": "Likupang Solar Power",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "solar",
      "claimedCapacityMw": 15.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Likupang North Minahasa",
      "provinceStateRegion": "North Sulawesi",
      "latitude": 1.683,
      "longitude": 125.056,
      "sourcePrimaryUrl": "https://vieshine.com/projects/likupang-solar-power-plant/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 9.41,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2019 Q1",
      "matchConfidence": 0.695,
      "distanceKm": 5.257,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::IDN::solar_sea_2024q2_v1.geojson::483",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              125.09222,
              1.657031
            ],
            [
              125.092177,
              1.656945
            ],
            [
              125.092049,
              1.656859
            ],
            [
              125.092092,
              1.656645
            ],
            [
              125.092177,
              1.656602
            ],
            [
              125.092263,
              1.656516
            ],
            [
              125.092349,
              1.656473
            ],
            [
              125.092392,
              1.656344
            ],
            [
              125.092478,
              1.656302
            ],
            [
              125.092521,
              1.65613
            ],
            [
              125.092607,
              1.656087
            ],
            [
              125.092649,
              1.656001
            ],
            [
              125.092735,
              1.655915
            ],
            [
              125.092778,
              1.655658
            ],
            [
              125.092864,
              1.655272
            ],
            [
              125.092821,
              1.654972
            ],
            [
              125.092735,
              1.654843
            ],
            [
              125.092692,
              1.654671
            ],
            [
              125.092607,
              1.654629
            ],
            [
              125.092564,
              1.654457
            ],
            [
              125.092478,
              1.654371
            ],
            [
              125.092435,
              1.654242
            ],
            [
              125.09222,
              1.6542
            ],
            [
              125.092177,
              1.654114
            ],
            [
              125.09222,
              1.653942
            ],
            [
              125.092306,
              1.653856
            ],
            [
              125.092478,
              1.653814
            ],
            [
              125.092564,
              1.653728
            ],
            [
              125.092692,
              1.653685
            ],
            [
              125.092778,
              1.653599
            ],
            [
              125.092993,
              1.653556
            ],
            [
              125.093336,
              1.653556
            ],
            [
              125.093679,
              1.653513
            ],
            [
              125.093722,
              1.653385
            ],
            [
              125.093808,
              1.653342
            ],
            [
              125.093851,
              1.653213
            ],
            [
              125.093937,
              1.653084
            ],
            [
              125.09398,
              1.652698
            ],
            [
              125.094151,
              1.652655
            ],
            [
              125.09428,
              1.652655
            ],
            [
              125.09428,
              1.653127
            ],
            [
              125.094323,
              1.653427
            ],
            [
              125.094666,
              1.65347
            ],
            [
              125.094881,
              1.653385
            ],
            [
              125.095053,
              1.653342
            ],
            [
              125.095096,
              1.653256
            ],
            [
              125.095181,
              1.653213
            ],
            [
              125.095267,
              1.653127
            ],
            [
              125.095696,
              1.65317
            ],
            [
              125.095911,
              1.653256
            ],
            [
              125.09604,
              1.653299
            ],
            [
              125.096083,
              1.653385
            ],
            [
              125.096169,
              1.653685
            ],
            [
              125.096211,
              1.653856
            ],
            [
              125.096297,
              1.653899
            ],
            [
              125.096383,
              1.653985
            ],
            [
              125.096598,
              1.654028
            ],
            [
              125.096683,
              1.654114
            ],
            [
              125.096812,
              1.6542
            ],
            [
              125.096855,
              1.654629
            ],
            [
              125.096941,
              1.654757
            ],
            [
              125.096984,
              1.655229
            ],
            [
              125.096898,
              1.655401
            ],
            [
              125.096855,
              1.655615
            ],
            [
              125.096769,
              1.656001
            ],
            [
              125.096512,
              1.656044
            ],
            [
              125.09634,
              1.656087
            ],
            [
              125.096297,
              1.656173
            ],
            [
              125.096169,
              1.656216
            ],
            [
              125.096083,
              1.656302
            ],
            [
              125.095739,
              1.656344
            ],
            [
              125.095396,
              1.65643
            ],
            [
              125.095053,
              1.656473
            ],
            [
              125.094967,
              1.656387
            ],
            [
              125.094838,
              1.656344
            ],
            [
              125.094752,
              1.656173
            ],
            [
              125.094109,
              1.65613
            ],
            [
              125.09398,
              1.656044
            ],
            [
              125.093765,
              1.656087
            ],
            [
              125.093722,
              1.656173
            ],
            [
              125.093636,
              1.656259
            ],
            [
              125.093594,
              1.656387
            ],
            [
              125.093508,
              1.65643
            ],
            [
              125.093422,
              1.656516
            ],
            [
              125.093336,
              1.656602
            ],
            [
              125.09325,
              1.656688
            ],
            [
              125.093122,
              1.656731
            ],
            [
              125.093079,
              1.656816
            ],
            [
              125.092864,
              1.656859
            ],
            [
              125.092778,
              1.656945
            ],
            [
              125.092521,
              1.656988
            ],
            [
              125.09222,
              1.657031
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 1.6549984,
      "matchedAssetCentroidLongitude": 125.0941105
    },
    {
      "projectId": "IDN-W-ASEAN-002",
      "projectName": "PLTB Tanah Laut Adaro",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "wind",
      "claimedCapacityMw": 70.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Tanah Laut Regency",
      "provinceStateRegion": "South Kalimantan",
      "latitude": -3.8,
      "longitude": 114.76,
      "sourcePrimaryUrl": "https://www.adaro.com/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "IDN-W-ASEAN-003",
      "projectName": "Sidrap 1 Wind",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "wind",
      "claimedCapacityMw": 75.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Sidenreng Rappang (Sidrap)",
      "provinceStateRegion": "South Sulawesi",
      "latitude": -3.921,
      "longitude": 119.805,
      "sourcePrimaryUrl": "https://upcrenewables.com/indonesia/sidrap-wind-farm/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Exact site point",
      "paperToPowerLabel": "observed_on_schedule",
      "observedCapacityMw": null,
      "observedAssetCount": 24,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.71,
      "distanceKm": 10.123,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::WIND::IDN::wind_sea_2024q2_v1.geojson::793",
      "matchedAssetGeometry": {
        "type": "Point",
        "coordinates": [
          119.720343,
          -3.95498
        ]
      },
      "matchedAssetCentroidLatitude": -3.9549801,
      "matchedAssetCentroidLongitude": 119.720343
    },
    {
      "projectId": "IDN-W-001",
      "projectName": "Sidrap I Wind Power Plant",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "wind",
      "claimedCapacityMw": 75.0,
      "claimedStatus": "operating",
      "claimedCod": "2018-04-05",
      "locationText": "Pabbaresseng Mountains, Lainungan and Mattirotasi Villages, Watang Pulu",
      "provinceStateRegion": "South Sulawesi",
      "latitude": -3.987306,
      "longitude": 119.711472,
      "sourcePrimaryUrl": "https://www.thewindpower.net/windfarm_en_24999_sidrap.php",
      "sourcePrimaryType": "Technical Database",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; ridge-layout wind farm",
      "paperToPowerLabel": "observed_on_schedule",
      "observedCapacityMw": null,
      "observedAssetCount": 27,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.925,
      "distanceKm": 0.24,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "1 direct connected substations within 2.5 km, 16 transmission lines, 17 credible substation-line bridges; max mapped voltage 150 kV.",
      "gridContextScore": 0.665,
      "gridMetadataScore": 0.78,
      "maxNearbyGridVoltageKv": 150.0,
      "nearestSiteSideGridDistanceKm": 2.471,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 2,
      "matchedAssetSiteId": "GRW::WIND::IDN::wind_sea_2024q2_v1.geojson::786",
      "matchedAssetGeometry": {
        "type": "Point",
        "coordinates": [
          119.711041,
          -3.989422
        ]
      },
      "matchedAssetCentroidLatitude": -3.9894223,
      "matchedAssetCentroidLongitude": 119.7110411
    },
    {
      "projectId": "IDN-W-ASEAN-004",
      "projectName": "Tolo 1 Wind",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "wind",
      "claimedCapacityMw": 72.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Jeneponto",
      "provinceStateRegion": "South Sulawesi",
      "latitude": -5.67,
      "longitude": 119.82,
      "sourcePrimaryUrl": "https://vieshine.com/projects/tolo-wind-farm/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Exact site point",
      "paperToPowerLabel": "observed_on_schedule",
      "observedCapacityMw": null,
      "observedAssetCount": 18,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.71,
      "distanceKm": 5.45,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::WIND::IDN::wind_sea_2024q2_v1.geojson::801",
      "matchedAssetGeometry": {
        "type": "Point",
        "coordinates": [
          119.773658,
          -5.653401
        ]
      },
      "matchedAssetCentroidLatitude": -5.6534012,
      "matchedAssetCentroidLongitude": 119.7736581
    },
    {
      "projectId": "IDN-S-ASEAN-004",
      "projectName": "Trembesi Floating Solar",
      "countryCode": "IDN",
      "countryName": "Indonesia",
      "technology": "solar",
      "claimedCapacityMw": 35.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Tembesi Reservoir Batam",
      "provinceStateRegion": "Riau Islands",
      "latitude": 1.05,
      "longitude": 103.978,
      "sourcePrimaryUrl": "https://ptplnnr.com/news-and-articles/detail/getting-to-know-plts-terapung-tembesi-the-largest-solar-power-plant-in-indonesia-by-pln-nusantara-renewables",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "KHM-S-ASEAN-001",
      "projectName": "National Solar Park",
      "countryCode": "KHM",
      "countryName": "Cambodia",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Kampong Chhnang",
      "provinceStateRegion": "Kampong Chhnang",
      "latitude": 12.03,
      "longitude": 104.58,
      "sourcePrimaryUrl": "https://www.adb.org/projects/51139-002/main",
      "sourcePrimaryType": "Multilateral Project Page",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative project-area point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "LAO-W-ASEAN-001",
      "projectName": "Monsoon Wind Power Project",
      "countryCode": "LAO",
      "countryName": "Laos",
      "technology": "wind",
      "claimedCapacityMw": 600.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Dak Cheung and Sanxay Districts",
      "provinceStateRegion": "Sekong and Attapeu",
      "latitude": 15.4,
      "longitude": 107.25,
      "sourcePrimaryUrl": "https://monsoonwindpower.com/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative project-area point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "LAO-W-ASEAN-002",
      "projectName": "Savan 1 Project",
      "countryCode": "LAO",
      "countryName": "Laos",
      "technology": "wind",
      "claimedCapacityMw": 495.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Phin and Nong districts",
      "provinceStateRegion": "Savannakhet",
      "latitude": 16.4,
      "longitude": 106.0,
      "sourcePrimaryUrl": "https://vietnamenergy.vn/savan-1-wpp-a-highlight-of-vietnam-laos-energy-cooperation-in-the-era-of-green-transition-35626.html",
      "sourcePrimaryType": "Industry News",
      "sourceConfidence": "high",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "LAO-W-ASEAN-003",
      "projectName": "Truong Son Wind Farm",
      "countryCode": "LAO",
      "countryName": "Laos",
      "technology": "wind",
      "claimedCapacityMw": 600.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Bolikhamxay",
      "provinceStateRegion": "Bolikhamxay",
      "latitude": 18.3,
      "longitude": 104.5,
      "sourcePrimaryUrl": "https://en.evn.com.vn/d6/news/EVN-and-Phong-Subthavy-Group-Laos-signed-power-purchase-agreements-66-163-3051.aspx",
      "sourcePrimaryType": "Utility Filing",
      "sourceConfidence": "low",
      "dataQualityFlags": "Province representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "MMR-S-ASEAN-001",
      "projectName": "Minbu Solar Park",
      "countryCode": "MMR",
      "countryName": "Myanmar",
      "technology": "solar",
      "claimedCapacityMw": 170.0,
      "claimedStatus": "construction",
      "claimedCod": null,
      "locationText": "Minbu",
      "provinceStateRegion": "Magway Region",
      "latitude": 20.14,
      "longitude": 94.86,
      "sourcePrimaryUrl": "https://gepmyanmar.com/minbu-solar-power-plant/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Exact site point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "MYS-S-002",
      "projectName": "Gurun Quantum Solar PV Park",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 65.0,
      "claimedStatus": "operating",
      "claimedCod": "2018-12",
      "locationText": "Jln Kampung Paya Mat Insun, Pendang",
      "provinceStateRegion": "Kedah",
      "latitude": 5.86295,
      "longitude": 100.53893,
      "sourcePrimaryUrl": "http://eprints.utar.edu.my/4992/1/MEEK25110_EdbertHuamJunPing_2102592_EEC.pdf",
      "sourcePrimaryType": "Academic Thesis",
      "sourceConfidence": "high",
      "dataQualityFlags": "None",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 40.43,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2018 Q3",
      "matchConfidence": 0.91,
      "distanceKm": 0.059,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "1 direct connected substations within 0.5 km, 31 transmission lines, 25 credible substation-line bridges; max mapped voltage 300 kV.",
      "gridContextScore": 0.814,
      "gridMetadataScore": 0.96,
      "maxNearbyGridVoltageKv": 300.0,
      "nearestSiteSideGridDistanceKm": 0.454,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 3,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::952",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              100.539837,
              5.866848
            ],
            [
              100.539794,
              5.866763
            ],
            [
              100.539665,
              5.86672
            ],
            [
              100.539622,
              5.866635
            ],
            [
              100.539536,
              5.866592
            ],
            [
              100.539494,
              5.866507
            ],
            [
              100.539365,
              5.866464
            ],
            [
              100.539279,
              5.866379
            ],
            [
              100.539064,
              5.866336
            ],
            [
              100.538893,
              5.866251
            ],
            [
              100.538292,
              5.866293
            ],
            [
              100.537734,
              5.866379
            ],
            [
              100.537648,
              5.866422
            ],
            [
              100.537605,
              5.866507
            ],
            [
              100.537434,
              5.86655
            ],
            [
              100.536962,
              5.866635
            ],
            [
              100.536275,
              5.866678
            ],
            [
              100.535374,
              5.866592
            ],
            [
              100.534387,
              5.86655
            ],
            [
              100.534301,
              5.866464
            ],
            [
              100.534215,
              5.866422
            ],
            [
              100.534258,
              5.866251
            ],
            [
              100.534344,
              5.866165
            ],
            [
              100.534387,
              5.865909
            ],
            [
              100.534472,
              5.865739
            ],
            [
              100.534515,
              5.865397
            ],
            [
              100.534601,
              5.865141
            ],
            [
              100.534644,
              5.8645
            ],
            [
              100.53473,
              5.86433
            ],
            [
              100.534773,
              5.863946
            ],
            [
              100.534859,
              5.863732
            ],
            [
              100.534902,
              5.862964
            ],
            [
              100.534987,
              5.862707
            ],
            [
              100.53503,
              5.861512
            ],
            [
              100.53503,
              5.861128
            ],
            [
              100.535073,
              5.860658
            ],
            [
              100.535159,
              5.860274
            ],
            [
              100.535202,
              5.860103
            ],
            [
              100.535288,
              5.860061
            ],
            [
              100.535331,
              5.859933
            ],
            [
              100.535417,
              5.85989
            ],
            [
              100.53546,
              5.859804
            ],
            [
              100.535631,
              5.859762
            ],
            [
              100.535889,
              5.859676
            ],
            [
              100.536189,
              5.859634
            ],
            [
              100.536275,
              5.859548
            ],
            [
              100.536618,
              5.859506
            ],
            [
              100.536747,
              5.85942
            ],
            [
              100.53709,
              5.859378
            ],
            [
              100.537305,
              5.859292
            ],
            [
              100.537648,
              5.859249
            ],
            [
              100.537863,
              5.859164
            ],
            [
              100.539021,
              5.859121
            ],
            [
              100.539322,
              5.859121
            ],
            [
              100.53988,
              5.859079
            ],
            [
              100.539966,
              5.858993
            ],
            [
              100.540051,
              5.858951
            ],
            [
              100.540094,
              5.858865
            ],
            [
              100.540652,
              5.858823
            ],
            [
              100.540867,
              5.858737
            ],
            [
              100.541167,
              5.858695
            ],
            [
              100.54121,
              5.858695
            ],
            [
              100.541382,
              5.85878
            ],
            [
              100.541425,
              5.859036
            ],
            [
              100.541425,
              5.859762
            ],
            [
              100.541468,
              5.859975
            ],
            [
              100.541553,
              5.860061
            ],
            [
              100.541596,
              5.860189
            ],
            [
              100.541682,
              5.860231
            ],
            [
              100.541725,
              5.860402
            ],
            [
              100.541811,
              5.860488
            ],
            [
              100.541854,
              5.860658
            ],
            [
              100.54194,
              5.860744
            ],
            [
              100.541983,
              5.860914
            ],
            [
              100.542068,
              5.861
            ],
            [
              100.542111,
              5.861128
            ],
            [
              100.542197,
              5.861213
            ],
            [
              100.54224,
              5.861341
            ],
            [
              100.542326,
              5.861469
            ],
            [
              100.542369,
              5.86164
            ],
            [
              100.542455,
              5.861726
            ],
            [
              100.542498,
              5.86211
            ],
            [
              100.542583,
              5.862707
            ],
            [
              100.542541,
              5.86433
            ],
            [
              100.542541,
              5.864543
            ],
            [
              100.542498,
              5.866379
            ],
            [
              100.542498,
              5.86672
            ],
            [
              100.542455,
              5.866806
            ],
            [
              100.539837,
              5.866848
            ]
          ],
          [
            [
              100.537648,
              5.864757
            ],
            [
              100.537863,
              5.864757
            ],
            [
              100.537863,
              5.864714
            ],
            [
              100.537906,
              5.864714
            ],
            [
              100.537906,
              5.864671
            ],
            [
              100.537605,
              5.864671
            ],
            [
              100.537605,
              5.864714
            ],
            [
              100.537648,
              5.864714
            ],
            [
              100.537648,
              5.864757
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 5.8626366,
      "matchedAssetCentroidLongitude": 100.5385045
    },
    {
      "projectId": "MYS-S-ASEAN-001",
      "projectName": "LSS5+ Kelantan Solar",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Kelantan",
      "provinceStateRegion": "Kelantan",
      "latitude": 5.3,
      "longitude": 102.0,
      "sourcePrimaryUrl": "https://www.st.gov.my/",
      "sourcePrimaryType": "Regulator Website",
      "sourceConfidence": "low",
      "dataQualityFlags": "Province representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "MYS-S-ASEAN-002",
      "projectName": "LSS5+ Port Dickson Solar",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 99.99,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Port Dickson",
      "provinceStateRegion": "Negeri Sembilan",
      "latitude": 2.5,
      "longitude": 101.8,
      "sourcePrimaryUrl": "https://www.st.gov.my/",
      "sourcePrimaryType": "Regulator Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 2.39,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.6575,
      "distanceKm": 9.804,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::39",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              101.830945,
              2.583315
            ],
            [
              101.831074,
              2.583272
            ],
            [
              101.83116,
              2.583229
            ],
            [
              101.831245,
              2.583186
            ],
            [
              101.831288,
              2.583143
            ],
            [
              101.831374,
              2.5831
            ],
            [
              101.831417,
              2.583057
            ],
            [
              101.831503,
              2.582972
            ],
            [
              101.831589,
              2.582929
            ],
            [
              101.831632,
              2.582886
            ],
            [
              101.831675,
              2.582843
            ],
            [
              101.831717,
              2.5828
            ],
            [
              101.831803,
              2.582757
            ],
            [
              101.831846,
              2.582714
            ],
            [
              101.831932,
              2.582672
            ],
            [
              101.831975,
              2.582629
            ],
            [
              101.832061,
              2.582586
            ],
            [
              101.832104,
              2.582543
            ],
            [
              101.83219,
              2.5825
            ],
            [
              101.832275,
              2.582457
            ],
            [
              101.832361,
              2.582414
            ],
            [
              101.83249,
              2.582371
            ],
            [
              101.832619,
              2.582329
            ],
            [
              101.832662,
              2.582329
            ],
            [
              101.832705,
              2.582286
            ],
            [
              101.83279,
              2.582286
            ],
            [
              101.83279,
              2.5822
            ],
            [
              101.832833,
              2.581986
            ],
            [
              101.83279,
              2.581943
            ],
            [
              101.832747,
              2.581943
            ],
            [
              101.832747,
              2.5819
            ],
            [
              101.832705,
              2.581857
            ],
            [
              101.832662,
              2.581814
            ],
            [
              101.832619,
              2.581771
            ],
            [
              101.832576,
              2.581728
            ],
            [
              101.832533,
              2.581686
            ],
            [
              101.83249,
              2.581643
            ],
            [
              101.832447,
              2.5816
            ],
            [
              101.832404,
              2.581557
            ],
            [
              101.832318,
              2.581514
            ],
            [
              101.832232,
              2.581471
            ],
            [
              101.831932,
              2.581514
            ],
            [
              101.831803,
              2.581557
            ],
            [
              101.831717,
              2.5816
            ],
            [
              101.831632,
              2.581643
            ],
            [
              101.831546,
              2.581686
            ],
            [
              101.83146,
              2.581728
            ],
            [
              101.831331,
              2.581771
            ],
            [
              101.831245,
              2.581814
            ],
            [
              101.831202,
              2.581857
            ],
            [
              101.831117,
              2.5819
            ],
            [
              101.831031,
              2.581943
            ],
            [
              101.830988,
              2.581986
            ],
            [
              101.830902,
              2.582029
            ],
            [
              101.830816,
              2.582071
            ],
            [
              101.83073,
              2.582114
            ],
            [
              101.830645,
              2.582157
            ],
            [
              101.830559,
              2.5822
            ],
            [
              101.83043,
              2.582243
            ],
            [
              101.830344,
              2.582286
            ],
            [
              101.830258,
              2.582329
            ],
            [
              101.830215,
              2.582371
            ],
            [
              101.830173,
              2.582414
            ],
            [
              101.830087,
              2.582414
            ],
            [
              101.830044,
              2.582457
            ],
            [
              101.830001,
              2.5825
            ],
            [
              101.830001,
              2.582586
            ],
            [
              101.829958,
              2.582629
            ],
            [
              101.829915,
              2.582672
            ],
            [
              101.829872,
              2.582714
            ],
            [
              101.829872,
              2.582757
            ],
            [
              101.829829,
              2.582843
            ],
            [
              101.829786,
              2.582886
            ],
            [
              101.829743,
              2.583015
            ],
            [
              101.829786,
              2.5831
            ],
            [
              101.829829,
              2.583143
            ],
            [
              101.829872,
              2.583186
            ],
            [
              101.829915,
              2.583229
            ],
            [
              101.829958,
              2.583315
            ],
            [
              101.830044,
              2.583315
            ],
            [
              101.830087,
              2.583358
            ],
            [
              101.830173,
              2.5834
            ],
            [
              101.830301,
              2.583443
            ],
            [
              101.830516,
              2.5834
            ],
            [
              101.830945,
              2.583358
            ],
            [
              101.830945,
              2.583315
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 2.5824378,
      "matchedAssetCentroidLongitude": 101.8312891
    },
    {
      "projectId": "MYS-S-ASEAN-003",
      "projectName": "LSS5+ Segamat Solar",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 99.99,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Segamat",
      "provinceStateRegion": "Johor",
      "latitude": 2.5,
      "longitude": 102.8,
      "sourcePrimaryUrl": "https://www.st.gov.my/",
      "sourcePrimaryType": "Regulator Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 0.61,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2019 Q2",
      "matchConfidence": 0.5675,
      "distanceKm": 22.001,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::988",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              102.630157,
              2.60325
            ],
            [
              102.630157,
              2.603207
            ],
            [
              102.630029,
              2.603207
            ],
            [
              102.630029,
              2.603121
            ],
            [
              102.630587,
              2.603121
            ],
            [
              102.630587,
              2.603078
            ],
            [
              102.63063,
              2.603078
            ],
            [
              102.63063,
              2.603036
            ],
            [
              102.630587,
              2.603036
            ],
            [
              102.630587,
              2.602993
            ],
            [
              102.630544,
              2.602993
            ],
            [
              102.630544,
              2.60295
            ],
            [
              102.630243,
              2.60295
            ],
            [
              102.630243,
              2.602735
            ],
            [
              102.630286,
              2.602735
            ],
            [
              102.630286,
              2.60265
            ],
            [
              102.630329,
              2.60265
            ],
            [
              102.630329,
              2.602607
            ],
            [
              102.630372,
              2.602607
            ],
            [
              102.630372,
              2.602478
            ],
            [
              102.630415,
              2.602478
            ],
            [
              102.630415,
              2.602435
            ],
            [
              102.630501,
              2.602435
            ],
            [
              102.630501,
              2.602392
            ],
            [
              102.630587,
              2.602392
            ],
            [
              102.630587,
              2.60235
            ],
            [
              102.630715,
              2.60235
            ],
            [
              102.630715,
              2.602307
            ],
            [
              102.630801,
              2.602307
            ],
            [
              102.630801,
              2.602264
            ],
            [
              102.63093,
              2.602264
            ],
            [
              102.63093,
              2.602221
            ],
            [
              102.631016,
              2.602221
            ],
            [
              102.631016,
              2.602264
            ],
            [
              102.631102,
              2.602264
            ],
            [
              102.631102,
              2.602307
            ],
            [
              102.631145,
              2.602307
            ],
            [
              102.631145,
              2.60235
            ],
            [
              102.63123,
              2.60235
            ],
            [
              102.63123,
              2.602392
            ],
            [
              102.631273,
              2.602392
            ],
            [
              102.631273,
              2.602564
            ],
            [
              102.631316,
              2.602564
            ],
            [
              102.631316,
              2.602607
            ],
            [
              102.631273,
              2.602607
            ],
            [
              102.631273,
              2.602821
            ],
            [
              102.63123,
              2.602821
            ],
            [
              102.63123,
              2.603036
            ],
            [
              102.631187,
              2.603036
            ],
            [
              102.631187,
              2.603164
            ],
            [
              102.631145,
              2.603164
            ],
            [
              102.631145,
              2.603207
            ],
            [
              102.631059,
              2.603207
            ],
            [
              102.631059,
              2.60325
            ],
            [
              102.63063,
              2.60325
            ],
            [
              102.63063,
              2.603207
            ],
            [
              102.630372,
              2.603207
            ],
            [
              102.630372,
              2.60325
            ],
            [
              102.630157,
              2.60325
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 2.6027412,
      "matchedAssetCentroidLongitude": 102.6307379
    },
    {
      "projectId": "MYS-S-ASEAN-004",
      "projectName": "LSS5+ Windsor Estate Solar",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 470.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Windsor Estate",
      "provinceStateRegion": "Perak",
      "latitude": 4.15,
      "longitude": 101.15,
      "sourcePrimaryUrl": "https://www.st.gov.my/",
      "sourcePrimaryType": "Regulator Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "Representative project-area point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 20.46,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2018 Q3",
      "matchConfidence": 0.6575,
      "distanceKm": 13.051,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::460",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              101.246095,
              4.086749
            ],
            [
              101.245966,
              4.08662
            ],
            [
              101.245837,
              4.086535
            ],
            [
              101.245751,
              4.086406
            ],
            [
              101.245623,
              4.086321
            ],
            [
              101.245537,
              4.086192
            ],
            [
              101.245408,
              4.086107
            ],
            [
              101.245322,
              4.085978
            ],
            [
              101.245108,
              4.085807
            ],
            [
              101.245022,
              4.085679
            ],
            [
              101.244893,
              4.085593
            ],
            [
              101.244807,
              4.085465
            ],
            [
              101.244678,
              4.085379
            ],
            [
              101.244593,
              4.085251
            ],
            [
              101.244464,
              4.085122
            ],
            [
              101.244378,
              4.084908
            ],
            [
              101.244249,
              4.084437
            ],
            [
              101.244163,
              4.083367
            ],
            [
              101.244035,
              4.082768
            ],
            [
              101.243949,
              4.081955
            ],
            [
              101.24382,
              4.081398
            ],
            [
              101.24382,
              4.080799
            ],
            [
              101.243949,
              4.08067
            ],
            [
              101.244035,
              4.080414
            ],
            [
              101.244249,
              4.080328
            ],
            [
              101.244464,
              4.080285
            ],
            [
              101.245151,
              4.080199
            ],
            [
              101.245451,
              4.080071
            ],
            [
              101.245923,
              4.079985
            ],
            [
              101.246309,
              4.079857
            ],
            [
              101.246567,
              4.079771
            ],
            [
              101.246824,
              4.079643
            ],
            [
              101.247168,
              4.079557
            ],
            [
              101.247425,
              4.079429
            ],
            [
              101.247683,
              4.079343
            ],
            [
              101.247811,
              4.079472
            ],
            [
              101.24794,
              4.079643
            ],
            [
              101.248026,
              4.079857
            ],
            [
              101.248155,
              4.079985
            ],
            [
              101.24824,
              4.080242
            ],
            [
              101.248369,
              4.080371
            ],
            [
              101.248455,
              4.080713
            ],
            [
              101.24867,
              4.080799
            ],
            [
              101.248798,
              4.08097
            ],
            [
              101.248927,
              4.081098
            ],
            [
              101.249013,
              4.081312
            ],
            [
              101.249142,
              4.081441
            ],
            [
              101.249228,
              4.081869
            ],
            [
              101.249356,
              4.082126
            ],
            [
              101.249442,
              4.082639
            ],
            [
              101.249571,
              4.082811
            ],
            [
              101.249657,
              4.083025
            ],
            [
              101.2497,
              4.083538
            ],
            [
              101.249528,
              4.083667
            ],
            [
              101.248884,
              4.083752
            ],
            [
              101.248627,
              4.083881
            ],
            [
              101.248455,
              4.083966
            ],
            [
              101.248369,
              4.084266
            ],
            [
              101.248198,
              4.084566
            ],
            [
              101.248026,
              4.084694
            ],
            [
              101.247768,
              4.08478
            ],
            [
              101.247554,
              4.084908
            ],
            [
              101.247382,
              4.085336
            ],
            [
              101.247296,
              4.085679
            ],
            [
              101.247168,
              4.085764
            ],
            [
              101.247082,
              4.085893
            ],
            [
              101.246953,
              4.085978
            ],
            [
              101.246867,
              4.086107
            ],
            [
              101.246738,
              4.086192
            ],
            [
              101.246653,
              4.086364
            ],
            [
              101.246524,
              4.086449
            ],
            [
              101.246438,
              4.08662
            ],
            [
              101.246095,
              4.086749
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 4.0831918,
      "matchedAssetCentroidLongitude": 101.2467471
    },
    {
      "projectId": "MYS-S-ASEAN-005",
      "projectName": "LSS5+ reNIKOLA Kemaman 1",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 250.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Kemaman",
      "provinceStateRegion": "Terengganu",
      "latitude": 4.23,
      "longitude": 103.3,
      "sourcePrimaryUrl": "https://renikola.com/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 15.66,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2018 Q1",
      "matchConfidence": 0.5675,
      "distanceKm": 16.421,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::940",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.438168,
              4.278497
            ],
            [
              103.438168,
              4.278455
            ],
            [
              103.438125,
              4.278455
            ],
            [
              103.438125,
              4.278412
            ],
            [
              103.438082,
              4.278412
            ],
            [
              103.438082,
              4.278326
            ],
            [
              103.438039,
              4.278326
            ],
            [
              103.438039,
              4.277941
            ],
            [
              103.438082,
              4.277941
            ],
            [
              103.438082,
              4.277042
            ],
            [
              103.438039,
              4.277042
            ],
            [
              103.438039,
              4.274945
            ],
            [
              103.438082,
              4.274945
            ],
            [
              103.438082,
              4.274261
            ],
            [
              103.438039,
              4.274261
            ],
            [
              103.438039,
              4.273918
            ],
            [
              103.438082,
              4.273918
            ],
            [
              103.438082,
              4.273875
            ],
            [
              103.438125,
              4.273875
            ],
            [
              103.438125,
              4.273833
            ],
            [
              103.43821,
              4.273833
            ],
            [
              103.43821,
              4.27379
            ],
            [
              103.438382,
              4.27379
            ],
            [
              103.438382,
              4.273833
            ],
            [
              103.438768,
              4.273833
            ],
            [
              103.438768,
              4.273875
            ],
            [
              103.43894,
              4.273875
            ],
            [
              103.43894,
              4.273833
            ],
            [
              103.439713,
              4.273833
            ],
            [
              103.439713,
              4.27379
            ],
            [
              103.439841,
              4.27379
            ],
            [
              103.439841,
              4.273833
            ],
            [
              103.440914,
              4.273833
            ],
            [
              103.440914,
              4.27379
            ],
            [
              103.441257,
              4.27379
            ],
            [
              103.441257,
              4.273833
            ],
            [
              103.441343,
              4.273833
            ],
            [
              103.441343,
              4.27379
            ],
            [
              103.442202,
              4.27379
            ],
            [
              103.442202,
              4.273747
            ],
            [
              103.442588,
              4.273747
            ],
            [
              103.442588,
              4.27379
            ],
            [
              103.442674,
              4.27379
            ],
            [
              103.442674,
              4.273833
            ],
            [
              103.442759,
              4.273833
            ],
            [
              103.442759,
              4.273875
            ],
            [
              103.442802,
              4.273875
            ],
            [
              103.442802,
              4.273961
            ],
            [
              103.442845,
              4.273961
            ],
            [
              103.442845,
              4.274132
            ],
            [
              103.442888,
              4.274132
            ],
            [
              103.442888,
              4.274389
            ],
            [
              103.442931,
              4.274389
            ],
            [
              103.442931,
              4.274517
            ],
            [
              103.442888,
              4.274517
            ],
            [
              103.442888,
              4.274646
            ],
            [
              103.442845,
              4.274646
            ],
            [
              103.442845,
              4.274731
            ],
            [
              103.442802,
              4.274731
            ],
            [
              103.442802,
              4.274817
            ],
            [
              103.442759,
              4.274817
            ],
            [
              103.442759,
              4.274945
            ],
            [
              103.442717,
              4.274945
            ],
            [
              103.442717,
              4.275031
            ],
            [
              103.442674,
              4.275031
            ],
            [
              103.442674,
              4.275117
            ],
            [
              103.442631,
              4.275117
            ],
            [
              103.442631,
              4.275331
            ],
            [
              103.442588,
              4.275331
            ],
            [
              103.442588,
              4.277
            ],
            [
              103.442545,
              4.277
            ],
            [
              103.442545,
              4.277342
            ],
            [
              103.442502,
              4.277342
            ],
            [
              103.442502,
              4.277599
            ],
            [
              103.442545,
              4.277599
            ],
            [
              103.442545,
              4.277813
            ],
            [
              103.442588,
              4.277813
            ],
            [
              103.442588,
              4.278283
            ],
            [
              103.442545,
              4.278283
            ],
            [
              103.442545,
              4.278326
            ],
            [
              103.442502,
              4.278326
            ],
            [
              103.442502,
              4.278369
            ],
            [
              103.44233,
              4.278369
            ],
            [
              103.44233,
              4.278412
            ],
            [
              103.441515,
              4.278412
            ],
            [
              103.441515,
              4.278455
            ],
            [
              103.438511,
              4.278455
            ],
            [
              103.438511,
              4.278497
            ],
            [
              103.438168,
              4.278497
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 4.2755412,
      "matchedAssetCentroidLongitude": 103.440865
    },
    {
      "projectId": "MYS-S-ASEAN-006",
      "projectName": "LSS5+ reNIKOLA Kemaman 2",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 150.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Kemaman",
      "provinceStateRegion": "Terengganu",
      "latitude": 4.23,
      "longitude": 103.3,
      "sourcePrimaryUrl": "https://renikola.com/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "District representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 11.6,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2019 Q2",
      "matchConfidence": 0.5675,
      "distanceKm": 25.906,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::407",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.368044,
              4.008624
            ],
            [
              103.367658,
              4.00841
            ],
            [
              103.366885,
              4.008238
            ],
            [
              103.366241,
              4.008024
            ],
            [
              103.365555,
              4.007853
            ],
            [
              103.364911,
              4.007639
            ],
            [
              103.364139,
              4.007468
            ],
            [
              103.363495,
              4.007254
            ],
            [
              103.362851,
              4.007083
            ],
            [
              103.362336,
              4.006868
            ],
            [
              103.361692,
              4.006697
            ],
            [
              103.361092,
              4.006483
            ],
            [
              103.360791,
              4.006226
            ],
            [
              103.360491,
              4.006184
            ],
            [
              103.359933,
              4.006184
            ],
            [
              103.359675,
              4.005927
            ],
            [
              103.359718,
              4.005456
            ],
            [
              103.35989,
              4.004985
            ],
            [
              103.360233,
              4.004471
            ],
            [
              103.360577,
              4.004685
            ],
            [
              103.360362,
              4.004942
            ],
            [
              103.360577,
              4.005627
            ],
            [
              103.360834,
              4.005884
            ],
            [
              103.361135,
              4.00567
            ],
            [
              103.361349,
              4.00537
            ],
            [
              103.361263,
              4.004985
            ],
            [
              103.361435,
              4.0046
            ],
            [
              103.361435,
              4.00537
            ],
            [
              103.361907,
              4.00567
            ],
            [
              103.362293,
              4.005627
            ],
            [
              103.362679,
              4.00537
            ],
            [
              103.363023,
              4.005242
            ],
            [
              103.362851,
              4.0046
            ],
            [
              103.362379,
              4.004471
            ],
            [
              103.361993,
              4.004171
            ],
            [
              103.361821,
              4.003872
            ],
            [
              103.362679,
              4.003957
            ],
            [
              103.363237,
              4.004171
            ],
            [
              103.363752,
              4.004343
            ],
            [
              103.363752,
              4.004557
            ],
            [
              103.363366,
              4.004728
            ],
            [
              103.363152,
              4.005199
            ],
            [
              103.363366,
              4.005541
            ],
            [
              103.363366,
              4.005798
            ],
            [
              103.363495,
              4.006012
            ],
            [
              103.363667,
              4.006355
            ],
            [
              103.36401,
              4.006569
            ],
            [
              103.364182,
              4.00567
            ],
            [
              103.364439,
              4.005584
            ],
            [
              103.364439,
              4.006398
            ],
            [
              103.364696,
              4.005927
            ],
            [
              103.364782,
              4.005499
            ],
            [
              103.365083,
              4.006055
            ],
            [
              103.365169,
              4.006569
            ],
            [
              103.36534,
              4.006098
            ],
            [
              103.365512,
              4.006526
            ],
            [
              103.365812,
              4.006355
            ],
            [
              103.366027,
              4.005969
            ],
            [
              103.366456,
              4.006055
            ],
            [
              103.366756,
              4.006398
            ],
            [
              103.366971,
              4.006697
            ],
            [
              103.367271,
              4.006569
            ],
            [
              103.367572,
              4.006654
            ],
            [
              103.367701,
              4.006269
            ],
            [
              103.367271,
              4.005884
            ],
            [
              103.366542,
              4.005627
            ],
            [
              103.366027,
              4.00537
            ],
            [
              103.366156,
              4.005156
            ],
            [
              103.366971,
              4.005327
            ],
            [
              103.367829,
              4.005541
            ],
            [
              103.368173,
              4.005713
            ],
            [
              103.368859,
              4.005841
            ],
            [
              103.369074,
              4.006184
            ],
            [
              103.368902,
              4.007339
            ],
            [
              103.368688,
              4.007896
            ],
            [
              103.368516,
              4.008196
            ],
            [
              103.368044,
              4.008624
            ]
          ],
          [
            [
              103.36813,
              4.007425
            ],
            [
              103.368344,
              4.007425
            ],
            [
              103.368344,
              4.007382
            ],
            [
              103.36843,
              4.007382
            ],
            [
              103.36843,
              4.007211
            ],
            [
              103.368473,
              4.007211
            ],
            [
              103.368473,
              4.007125
            ],
            [
              103.368516,
              4.007125
            ],
            [
              103.368516,
              4.007083
            ],
            [
              103.368559,
              4.007083
            ],
            [
              103.368559,
              4.006911
            ],
            [
              103.368516,
              4.006911
            ],
            [
              103.368516,
              4.006868
            ],
            [
              103.368473,
              4.006868
            ],
            [
              103.368473,
              4.006826
            ],
            [
              103.368387,
              4.006826
            ],
            [
              103.368387,
              4.006783
            ],
            [
              103.368344,
              4.006783
            ],
            [
              103.368344,
              4.00674
            ],
            [
              103.368387,
              4.00674
            ],
            [
              103.368387,
              4.006697
            ],
            [
              103.368473,
              4.006697
            ],
            [
              103.368473,
              4.006654
            ],
            [
              103.368516,
              4.006654
            ],
            [
              103.368516,
              4.006612
            ],
            [
              103.368559,
              4.006612
            ],
            [
              103.368559,
              4.006526
            ],
            [
              103.368602,
              4.006526
            ],
            [
              103.368602,
              4.006483
            ],
            [
              103.368559,
              4.006483
            ],
            [
              103.368559,
              4.006355
            ],
            [
              103.368516,
              4.006355
            ],
            [
              103.368516,
              4.006269
            ],
            [
              103.368473,
              4.006269
            ],
            [
              103.368473,
              4.006226
            ],
            [
              103.36843,
              4.006226
            ],
            [
              103.36843,
              4.006184
            ],
            [
              103.368173,
              4.006184
            ],
            [
              103.368173,
              4.006226
            ],
            [
              103.368087,
              4.006226
            ],
            [
              103.368087,
              4.006269
            ],
            [
              103.368044,
              4.006269
            ],
            [
              103.368044,
              4.006312
            ],
            [
              103.368001,
              4.006312
            ],
            [
              103.368001,
              4.006355
            ],
            [
              103.367915,
              4.006355
            ],
            [
              103.367915,
              4.006398
            ],
            [
              103.367872,
              4.006398
            ],
            [
              103.367872,
              4.006483
            ],
            [
              103.367915,
              4.006483
            ],
            [
              103.367915,
              4.006569
            ],
            [
              103.367958,
              4.006569
            ],
            [
              103.367958,
              4.006612
            ],
            [
              103.368001,
              4.006612
            ],
            [
              103.368001,
              4.006654
            ],
            [
              103.368044,
              4.006654
            ],
            [
              103.368044,
              4.006697
            ],
            [
              103.368087,
              4.006697
            ],
            [
              103.368087,
              4.007168
            ],
            [
              103.368044,
              4.007168
            ],
            [
              103.368044,
              4.007254
            ],
            [
              103.368001,
              4.007254
            ],
            [
              103.368001,
              4.007339
            ],
            [
              103.368044,
              4.007339
            ],
            [
              103.368044,
              4.007382
            ],
            [
              103.36813,
              4.007382
            ],
            [
              103.36813,
              4.007425
            ]
          ],
          [
            [
              103.3674,
              4.007382
            ],
            [
              103.367529,
              4.007382
            ],
            [
              103.367529,
              4.007339
            ],
            [
              103.367572,
              4.007339
            ],
            [
              103.367572,
              4.007297
            ],
            [
              103.367615,
              4.007297
            ],
            [
              103.367615,
              4.007254
            ],
            [
              103.367572,
              4.007254
            ],
            [
              103.367572,
              4.007211
            ],
            [
              103.367529,
              4.007211
            ],
            [
              103.367529,
              4.007168
            ],
            [
              103.3674,
              4.007168
            ],
            [
              103.3674,
              4.007211
            ],
            [
              103.367357,
              4.007211
            ],
            [
              103.367357,
              4.007339
            ],
            [
              103.3674,
              4.007339
            ],
            [
              103.3674,
              4.007382
            ]
          ],
          [
            [
              103.362808,
              4.006226
            ],
            [
              103.36298,
              4.006226
            ],
            [
              103.36298,
              4.006141
            ],
            [
              103.363023,
              4.006141
            ],
            [
              103.363023,
              4.006012
            ],
            [
              103.363066,
              4.006012
            ],
            [
              103.363066,
              4.005969
            ],
            [
              103.363109,
              4.005969
            ],
            [
              103.363109,
              4.005798
            ],
            [
              103.363066,
              4.005798
            ],
            [
              103.363066,
              4.005755
            ],
            [
              103.363023,
              4.005755
            ],
            [
              103.363023,
              4.005713
            ],
            [
              103.36298,
              4.005713
            ],
            [
              103.36298,
              4.00567
            ],
            [
              103.362937,
              4.00567
            ],
            [
              103.362937,
              4.005627
            ],
            [
              103.362894,
              4.005627
            ],
            [
              103.362894,
              4.005584
            ],
            [
              103.362765,
              4.005584
            ],
            [
              103.362765,
              4.00567
            ],
            [
              103.362722,
              4.00567
            ],
            [
              103.362722,
              4.005755
            ],
            [
              103.362679,
              4.005755
            ],
            [
              103.362679,
              4.006055
            ],
            [
              103.362722,
              4.006055
            ],
            [
              103.362722,
              4.006141
            ],
            [
              103.362765,
              4.006141
            ],
            [
              103.362765,
              4.006184
            ],
            [
              103.362808,
              4.006184
            ],
            [
              103.362808,
              4.006226
            ]
          ],
          [
            [
              103.362207,
              4.006184
            ],
            [
              103.362336,
              4.006184
            ],
            [
              103.362336,
              4.006098
            ],
            [
              103.362379,
              4.006098
            ],
            [
              103.362379,
              4.006055
            ],
            [
              103.362422,
              4.006055
            ],
            [
              103.362422,
              4.005884
            ],
            [
              103.362379,
              4.005884
            ],
            [
              103.362379,
              4.005841
            ],
            [
              103.362293,
              4.005841
            ],
            [
              103.362293,
              4.005798
            ],
            [
              103.362122,
              4.005798
            ],
            [
              103.362122,
              4.005841
            ],
            [
              103.362079,
              4.005841
            ],
            [
              103.362079,
              4.006012
            ],
            [
              103.362122,
              4.006012
            ],
            [
              103.362122,
              4.006055
            ],
            [
              103.362164,
              4.006055
            ],
            [
              103.362164,
              4.006098
            ],
            [
              103.362207,
              4.006098
            ],
            [
              103.362207,
              4.006184
            ]
          ],
          [
            [
              103.361735,
              4.005884
            ],
            [
              103.361778,
              4.005884
            ],
            [
              103.361778,
              4.005798
            ],
            [
              103.361735,
              4.005798
            ],
            [
              103.361735,
              4.005884
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 4.0060516,
      "matchedAssetCentroidLongitude": 103.3644135
    },
    {
      "projectId": "MYS-S-001",
      "projectName": "TNB Sepang Solar",
      "countryCode": "MYS",
      "countryName": "Malaysia",
      "technology": "solar",
      "claimedCapacityMw": 50.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Mukim Tanjung 12, Kuala Langat",
      "provinceStateRegion": "Selangor",
      "latitude": 2.7483,
      "longitude": 101.5275,
      "sourcePrimaryUrl": "https://www.st.gov.my/",
      "sourcePrimaryType": "Regulator Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point for LSS site",
      "paperToPowerLabel": "observed_on_schedule",
      "observedCapacityMw": 44.16,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2018 Q2",
      "matchConfidence": 0.785,
      "distanceKm": 10.597,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "1 direct connected substations within 0.9 km, 19 transmission lines, 22 credible substation-line bridges; max mapped voltage 500 kV.",
      "gridContextScore": 0.813,
      "gridMetadataScore": 1.0,
      "maxNearbyGridVoltageKv": 500.0,
      "nearestSiteSideGridDistanceKm": 0.939,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 2,
      "matchedAssetSiteId": "GRW::SOLAR::MYS::solar_sea_2024q2_v1.geojson::591",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              101.619287,
              2.790068
            ],
            [
              101.618686,
              2.789939
            ],
            [
              101.617441,
              2.790025
            ],
            [
              101.617055,
              2.789896
            ],
            [
              101.61684,
              2.789811
            ],
            [
              101.616755,
              2.789639
            ],
            [
              101.616626,
              2.789553
            ],
            [
              101.616497,
              2.789382
            ],
            [
              101.616282,
              2.789296
            ],
            [
              101.616025,
              2.789168
            ],
            [
              101.615682,
              2.789082
            ],
            [
              101.615424,
              2.788953
            ],
            [
              101.615124,
              2.788868
            ],
            [
              101.614995,
              2.788739
            ],
            [
              101.614737,
              2.788653
            ],
            [
              101.614566,
              2.788525
            ],
            [
              101.614394,
              2.788439
            ],
            [
              101.613922,
              2.78831
            ],
            [
              101.613793,
              2.788225
            ],
            [
              101.613708,
              2.787153
            ],
            [
              101.613579,
              2.78651
            ],
            [
              101.613321,
              2.786381
            ],
            [
              101.613193,
              2.786167
            ],
            [
              101.613107,
              2.785996
            ],
            [
              101.612978,
              2.78591
            ],
            [
              101.612892,
              2.785738
            ],
            [
              101.612763,
              2.785653
            ],
            [
              101.612678,
              2.785481
            ],
            [
              101.612506,
              2.785353
            ],
            [
              101.612334,
              2.785224
            ],
            [
              101.612163,
              2.785095
            ],
            [
              101.612034,
              2.784967
            ],
            [
              101.611819,
              2.784881
            ],
            [
              101.611648,
              2.784753
            ],
            [
              101.611433,
              2.784667
            ],
            [
              101.611261,
              2.784538
            ],
            [
              101.610961,
              2.784452
            ],
            [
              101.610832,
              2.784238
            ],
            [
              101.610875,
              2.783895
            ],
            [
              101.610961,
              2.783767
            ],
            [
              101.611133,
              2.783681
            ],
            [
              101.611261,
              2.783552
            ],
            [
              101.61139,
              2.783467
            ],
            [
              101.611476,
              2.783038
            ],
            [
              101.611347,
              2.782866
            ],
            [
              101.611261,
              2.782738
            ],
            [
              101.611133,
              2.782652
            ],
            [
              101.611047,
              2.782481
            ],
            [
              101.611004,
              2.782224
            ],
            [
              101.61109,
              2.782095
            ],
            [
              101.611347,
              2.782009
            ],
            [
              101.612034,
              2.781966
            ],
            [
              101.613021,
              2.781881
            ],
            [
              101.614137,
              2.782009
            ],
            [
              101.614566,
              2.782095
            ],
            [
              101.615424,
              2.782224
            ],
            [
              101.616368,
              2.782309
            ],
            [
              101.616926,
              2.782438
            ],
            [
              101.61787,
              2.782524
            ],
            [
              101.618471,
              2.782652
            ],
            [
              101.618857,
              2.782738
            ],
            [
              101.618986,
              2.782866
            ],
            [
              101.620102,
              2.782952
            ],
            [
              101.620831,
              2.783081
            ],
            [
              101.621304,
              2.783167
            ],
            [
              101.621389,
              2.783295
            ],
            [
              101.621432,
              2.78381
            ],
            [
              101.621346,
              2.784624
            ],
            [
              101.621218,
              2.785053
            ],
            [
              101.621132,
              2.785867
            ],
            [
              101.621003,
              2.786381
            ],
            [
              101.620917,
              2.787067
            ],
            [
              101.620789,
              2.787582
            ],
            [
              101.620703,
              2.788182
            ],
            [
              101.620574,
              2.788868
            ],
            [
              101.620488,
              2.789553
            ],
            [
              101.620359,
              2.789939
            ],
            [
              101.620274,
              2.790068
            ],
            [
              101.619287,
              2.790068
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 2.7856231,
      "matchedAssetCentroidLongitude": 101.6152864
    },
    {
      "projectId": "PHL-S-006",
      "projectName": "Armenia Solar Power Project",
      "countryCode": "PHL",
      "countryName": "Philippines",
      "technology": "solar",
      "claimedCapacityMw": 46.658,
      "claimedStatus": "operating",
      "claimedCod": "2024-11",
      "locationText": "Brgy. Armenia, Tarlac City",
      "provinceStateRegion": "Tarlac",
      "latitude": 15.43,
      "longitude": 120.551,
      "sourcePrimaryUrl": "https://aboitizpower.com/",
      "sourcePrimaryType": "Developer Portfolio",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; precise footprint mapping unavailable",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 7.27,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.66,
      "distanceKm": 2.298,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "1 direct connected substations within 9.1 km, 18 transmission lines, 12 credible substation-line bridges; max mapped voltage 230 kV.",
      "gridContextScore": 0.493,
      "gridMetadataScore": 0.78,
      "maxNearbyGridVoltageKv": 230.0,
      "nearestSiteSideGridDistanceKm": 9.141,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 1,
      "matchedAssetSiteId": "GRW::SOLAR::PHL::solar_sea_2024q2_v1.geojson::361",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              120.533109,
              15.41587
            ],
            [
              120.533066,
              15.415994
            ],
            [
              120.533023,
              15.41616
            ],
            [
              120.53298,
              15.416408
            ],
            [
              120.533023,
              15.416698
            ],
            [
              120.533066,
              15.416822
            ],
            [
              120.533109,
              15.417111
            ],
            [
              120.533023,
              15.417194
            ],
            [
              120.53298,
              15.417277
            ],
            [
              120.532894,
              15.41736
            ],
            [
              120.532808,
              15.417401
            ],
            [
              120.532765,
              15.417484
            ],
            [
              120.53268,
              15.417566
            ],
            [
              120.532637,
              15.418104
            ],
            [
              120.532722,
              15.418187
            ],
            [
              120.532765,
              15.41827
            ],
            [
              120.532894,
              15.418311
            ],
            [
              120.532937,
              15.418353
            ],
            [
              120.53298,
              15.418435
            ],
            [
              120.533023,
              15.418559
            ],
            [
              120.533066,
              15.418642
            ],
            [
              120.533023,
              15.418849
            ],
            [
              120.533066,
              15.418932
            ],
            [
              120.533066,
              15.419014
            ],
            [
              120.533109,
              15.419221
            ],
            [
              120.533195,
              15.419263
            ],
            [
              120.53328,
              15.419345
            ],
            [
              120.533667,
              15.419304
            ],
            [
              120.53371,
              15.419221
            ],
            [
              120.533838,
              15.41918
            ],
            [
              120.533881,
              15.419139
            ],
            [
              120.533924,
              15.419097
            ],
            [
              120.533967,
              15.419056
            ],
            [
              120.53401,
              15.419014
            ],
            [
              120.534053,
              15.418973
            ],
            [
              120.534096,
              15.418932
            ],
            [
              120.534139,
              15.41889
            ],
            [
              120.534224,
              15.418849
            ],
            [
              120.53431,
              15.418766
            ],
            [
              120.534739,
              15.418725
            ],
            [
              120.534868,
              15.418808
            ],
            [
              120.535383,
              15.418849
            ],
            [
              120.535684,
              15.418766
            ],
            [
              120.535769,
              15.418642
            ],
            [
              120.535727,
              15.418394
            ],
            [
              120.535641,
              15.418353
            ],
            [
              120.535555,
              15.41827
            ],
            [
              120.53504,
              15.418228
            ],
            [
              120.534997,
              15.418187
            ],
            [
              120.534997,
              15.418104
            ],
            [
              120.53504,
              15.41798
            ],
            [
              120.535126,
              15.417939
            ],
            [
              120.53534,
              15.417856
            ],
            [
              120.535426,
              15.417815
            ],
            [
              120.535512,
              15.417773
            ],
            [
              120.535598,
              15.417732
            ],
            [
              120.535641,
              15.417484
            ],
            [
              120.535598,
              15.416449
            ],
            [
              120.535555,
              15.416118
            ],
            [
              120.535512,
              15.415705
            ],
            [
              120.535555,
              15.41525
            ],
            [
              120.535512,
              15.415001
            ],
            [
              120.535469,
              15.414919
            ],
            [
              120.535426,
              15.414877
            ],
            [
              120.53534,
              15.414836
            ],
            [
              120.535126,
              15.414836
            ],
            [
              120.53504,
              15.414877
            ],
            [
              120.534525,
              15.414919
            ],
            [
              120.534439,
              15.414919
            ],
            [
              120.533924,
              15.41496
            ],
            [
              120.533838,
              15.415001
            ],
            [
              120.533752,
              15.415043
            ],
            [
              120.533624,
              15.415084
            ],
            [
              120.533538,
              15.415084
            ],
            [
              120.533495,
              15.415167
            ],
            [
              120.533366,
              15.415208
            ],
            [
              120.533323,
              15.415291
            ],
            [
              120.533237,
              15.415374
            ],
            [
              120.533195,
              15.415498
            ],
            [
              120.533152,
              15.415663
            ],
            [
              120.533109,
              15.41587
            ],
            [
              120.533109,
              15.41587
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 15.4173324,
      "matchedAssetCentroidLongitude": 120.5340636
    },
    {
      "projectId": "PHL-W-ASEAN-001",
      "projectName": "Bulalacao Bay Offshore",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 1200.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Bulalacao Bay",
      "provinceStateRegion": "Oriental Mindoro",
      "latitude": 12.25,
      "longitude": 121.3,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "PHL-W-ASEAN-002",
      "projectName": "Calatagan Offshore Wind",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 1830.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Calatagan",
      "provinceStateRegion": "Batangas",
      "latitude": 13.8,
      "longitude": 120.6,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "PHL-S-005",
      "projectName": "Calatrava Solar Power Project",
      "countryCode": "PHL",
      "countryName": "Philippines",
      "technology": "solar",
      "claimedCapacityMw": 168.953,
      "claimedStatus": "operating",
      "claimedCod": "2024-12",
      "locationText": "Brgy. San Isidro, Calatrava",
      "provinceStateRegion": "Negros Occidental",
      "latitude": 10.598,
      "longitude": 123.477,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/sites/default/files/pdf/renewable_energy/awarded_solar_2023-10-31.pdf",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; exact site coordinates not public",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 84.53,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.6075,
      "distanceKm": 10.245,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "2 direct connected substations within 0.5 km, 9 transmission lines, 5 credible substation-line bridges; max mapped voltage 230 kV.",
      "gridContextScore": 0.728,
      "gridMetadataScore": 0.695,
      "maxNearbyGridVoltageKv": 230.0,
      "nearestSiteSideGridDistanceKm": 0.462,
      "directConnectedSubstationCount": 2,
      "directConnectedTransmissionCount": 2,
      "matchedAssetSiteId": "GRW::SOLAR::PHL::solar_sea_2024q2_v1.geojson::785",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              123.428264,
              10.525197
            ],
            [
              123.427019,
              10.524818
            ],
            [
              123.426719,
              10.524227
            ],
            [
              123.426247,
              10.523678
            ],
            [
              123.426633,
              10.523299
            ],
            [
              123.425045,
              10.522919
            ],
            [
              123.424315,
              10.522244
            ],
            [
              123.423843,
              10.521611
            ],
            [
              123.423371,
              10.52102
            ],
            [
              123.422899,
              10.52043
            ],
            [
              123.422427,
              10.519797
            ],
            [
              123.421955,
              10.519121
            ],
            [
              123.42144,
              10.518489
            ],
            [
              123.420968,
              10.517898
            ],
            [
              123.420496,
              10.517265
            ],
            [
              123.420024,
              10.516379
            ],
            [
              123.420496,
              10.515662
            ],
            [
              123.421097,
              10.515197
            ],
            [
              123.421741,
              10.514733
            ],
            [
              123.42247,
              10.514269
            ],
            [
              123.423672,
              10.513805
            ],
            [
              123.425388,
              10.513425
            ],
            [
              123.426375,
              10.514311
            ],
            [
              123.427191,
              10.514775
            ],
            [
              123.426633,
              10.513847
            ],
            [
              123.426118,
              10.513299
            ],
            [
              123.426332,
              10.512413
            ],
            [
              123.428564,
              10.51313
            ],
            [
              123.429036,
              10.513763
            ],
            [
              123.429508,
              10.514354
            ],
            [
              123.42998,
              10.514986
            ],
            [
              123.429937,
              10.515957
            ],
            [
              123.429422,
              10.517223
            ],
            [
              123.42895,
              10.518615
            ],
            [
              123.428478,
              10.519248
            ],
            [
              123.427834,
              10.519754
            ],
            [
              123.427191,
              10.520219
            ],
            [
              123.427448,
              10.520387
            ],
            [
              123.428607,
              10.520683
            ],
            [
              123.429294,
              10.521231
            ],
            [
              123.428822,
              10.522413
            ],
            [
              123.429251,
              10.522244
            ],
            [
              123.429723,
              10.521569
            ],
            [
              123.430195,
              10.520683
            ],
            [
              123.430667,
              10.519965
            ],
            [
              123.431139,
              10.519248
            ],
            [
              123.431611,
              10.518531
            ],
            [
              123.432126,
              10.517729
            ],
            [
              123.432384,
              10.517476
            ],
            [
              123.43277,
              10.516463
            ],
            [
              123.433242,
              10.515873
            ],
            [
              123.433714,
              10.515197
            ],
            [
              123.434186,
              10.514396
            ],
            [
              123.435602,
              10.514354
            ],
            [
              123.43646,
              10.51486
            ],
            [
              123.43749,
              10.515408
            ],
            [
              123.437233,
              10.516885
            ],
            [
              123.436761,
              10.517856
            ],
            [
              123.436289,
              10.518826
            ],
            [
              123.435688,
              10.519417
            ],
            [
              123.435044,
              10.518911
            ],
            [
              123.434229,
              10.518446
            ],
            [
              123.434186,
              10.518531
            ],
            [
              123.434701,
              10.518995
            ],
            [
              123.435259,
              10.519459
            ],
            [
              123.435602,
              10.520303
            ],
            [
              123.43513,
              10.521147
            ],
            [
              123.434529,
              10.521738
            ],
            [
              123.433242,
              10.522117
            ],
            [
              123.43277,
              10.523088
            ],
            [
              123.432126,
              10.524016
            ],
            [
              123.431396,
              10.52448
            ],
            [
              123.430409,
              10.525029
            ],
            [
              123.428349,
              10.525155
            ],
            [
              123.428264,
              10.525197
            ]
          ],
          [
            [
              123.427792,
              10.523256
            ],
            [
              123.428092,
              10.523256
            ],
            [
              123.428092,
              10.523214
            ],
            [
              123.428135,
              10.523214
            ],
            [
              123.428135,
              10.523172
            ],
            [
              123.428178,
              10.523172
            ],
            [
              123.428178,
              10.52313
            ],
            [
              123.428221,
              10.52313
            ],
            [
              123.428221,
              10.523088
            ],
            [
              123.428264,
              10.523088
            ],
            [
              123.428264,
              10.523046
            ],
            [
              123.428435,
              10.523046
            ],
            [
              123.428435,
              10.523003
            ],
            [
              123.428478,
              10.523003
            ],
            [
              123.428478,
              10.522961
            ],
            [
              123.428521,
              10.522961
            ],
            [
              123.428521,
              10.522919
            ],
            [
              123.428564,
              10.522919
            ],
            [
              123.428564,
              10.522835
            ],
            [
              123.428607,
              10.522835
            ],
            [
              123.428607,
              10.522708
            ],
            [
              123.428521,
              10.522708
            ],
            [
              123.428521,
              10.52275
            ],
            [
              123.428435,
              10.52275
            ],
            [
              123.428435,
              10.522792
            ],
            [
              123.428349,
              10.522792
            ],
            [
              123.428349,
              10.522835
            ],
            [
              123.428307,
              10.522835
            ],
            [
              123.428307,
              10.522877
            ],
            [
              123.428221,
              10.522877
            ],
            [
              123.428221,
              10.522919
            ],
            [
              123.428135,
              10.522919
            ],
            [
              123.428135,
              10.522961
            ],
            [
              123.428092,
              10.522961
            ],
            [
              123.428092,
              10.523003
            ],
            [
              123.428006,
              10.523003
            ],
            [
              123.428006,
              10.523046
            ],
            [
              123.42792,
              10.523046
            ],
            [
              123.42792,
              10.523088
            ],
            [
              123.427877,
              10.523088
            ],
            [
              123.427877,
              10.52313
            ],
            [
              123.427834,
              10.52313
            ],
            [
              123.427834,
              10.523172
            ],
            [
              123.427792,
              10.523172
            ],
            [
              123.427792,
              10.523256
            ]
          ],
          [
            [
              123.425732,
              10.521738
            ],
            [
              123.425775,
              10.521738
            ],
            [
              123.425775,
              10.521695
            ],
            [
              123.42586,
              10.521695
            ],
            [
              123.42586,
              10.521653
            ],
            [
              123.425903,
              10.521653
            ],
            [
              123.425903,
              10.521611
            ],
            [
              123.425946,
              10.521611
            ],
            [
              123.425946,
              10.521569
            ],
            [
              123.425989,
              10.521569
            ],
            [
              123.425989,
              10.521527
            ],
            [
              123.426032,
              10.521527
            ],
            [
              123.426032,
              10.521484
            ],
            [
              123.426075,
              10.521484
            ],
            [
              123.426075,
              10.5214
            ],
            [
              123.426118,
              10.5214
            ],
            [
              123.426118,
              10.521358
            ],
            [
              123.426161,
              10.521358
            ],
            [
              123.426161,
              10.521316
            ],
            [
              123.426204,
              10.521316
            ],
            [
              123.426204,
              10.521231
            ],
            [
              123.426247,
              10.521231
            ],
            [
              123.426247,
              10.521189
            ],
            [
              123.42629,
              10.521189
            ],
            [
              123.42629,
              10.521147
            ],
            [
              123.426332,
              10.521147
            ],
            [
              123.426332,
              10.521105
            ],
            [
              123.426375,
              10.521105
            ],
            [
              123.426375,
              10.521062
            ],
            [
              123.426418,
              10.521062
            ],
            [
              123.426418,
              10.52102
            ],
            [
              123.426504,
              10.52102
            ],
            [
              123.426504,
              10.520978
            ],
            [
              123.42659,
              10.520978
            ],
            [
              123.42659,
              10.520936
            ],
            [
              123.426676,
              10.520936
            ],
            [
              123.426676,
              10.520894
            ],
            [
              123.426719,
              10.520894
            ],
            [
              123.426719,
              10.520767
            ],
            [
              123.426547,
              10.520767
            ],
            [
              123.426547,
              10.520809
            ],
            [
              123.426461,
              10.520809
            ],
            [
              123.426461,
              10.520851
            ],
            [
              123.426418,
              10.520851
            ],
            [
              123.426418,
              10.520894
            ],
            [
              123.426375,
              10.520894
            ],
            [
              123.426375,
              10.520936
            ],
            [
              123.426332,
              10.520936
            ],
            [
              123.426332,
              10.520978
            ],
            [
              123.42629,
              10.520978
            ],
            [
              123.42629,
              10.52102
            ],
            [
              123.426247,
              10.52102
            ],
            [
              123.426247,
              10.521062
            ],
            [
              123.426204,
              10.521062
            ],
            [
              123.426204,
              10.521105
            ],
            [
              123.426161,
              10.521105
            ],
            [
              123.426161,
              10.521147
            ],
            [
              123.426118,
              10.521147
            ],
            [
              123.426118,
              10.521189
            ],
            [
              123.426075,
              10.521189
            ],
            [
              123.426075,
              10.521231
            ],
            [
              123.426032,
              10.521231
            ],
            [
              123.426032,
              10.521273
            ],
            [
              123.425989,
              10.521273
            ],
            [
              123.425989,
              10.521316
            ],
            [
              123.425946,
              10.521316
            ],
            [
              123.425946,
              10.521358
            ],
            [
              123.425903,
              10.521358
            ],
            [
              123.425903,
              10.5214
            ],
            [
              123.42586,
              10.5214
            ],
            [
              123.42586,
              10.521442
            ],
            [
              123.425817,
              10.521442
            ],
            [
              123.425817,
              10.521527
            ],
            [
              123.425775,
              10.521527
            ],
            [
              123.425775,
              10.521611
            ],
            [
              123.425732,
              10.521611
            ],
            [
              123.425732,
              10.521738
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 10.5188659,
      "matchedAssetCentroidLongitude": 123.4289912
    },
    {
      "projectId": "PHL-S-002",
      "projectName": "Cayanga-Bugallon Solar Power Plant",
      "countryCode": "PHL",
      "countryName": "Philippines",
      "technology": "solar",
      "claimedCapacityMw": 94.717,
      "claimedStatus": "operating",
      "claimedCod": "2024-07",
      "locationText": "Barangays Cayanga, Salomague Sur, and Salomague Norte, Municipality of Bugallon",
      "provinceStateRegion": "Pangasinan",
      "latitude": 15.9122,
      "longitude": 120.1983,
      "sourcePrimaryUrl": "https://aboitizpower.com/static-assets/uploads/pdf/ap-bonds---preliminary-prospectus-2025.04.29.pdf",
      "sourcePrimaryType": "Developer Prospectus",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; competing 650 MW project overlaps same barangays",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 18.22,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2022 Q4",
      "matchConfidence": 0.645,
      "distanceKm": 7.949,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "1 direct connected substations within 0.8 km, 41 transmission lines, 38 credible substation-line bridges; max mapped voltage 500 kV.",
      "gridContextScore": 0.782,
      "gridMetadataScore": 0.84,
      "maxNearbyGridVoltageKv": 500.0,
      "nearestSiteSideGridDistanceKm": 0.825,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 3,
      "matchedAssetSiteId": "GRW::SOLAR::PHL::solar_sea_2024q2_v1.geojson::523",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              120.128245,
              15.936406
            ],
            [
              120.127945,
              15.936282
            ],
            [
              120.127773,
              15.936158
            ],
            [
              120.12773,
              15.935498
            ],
            [
              120.127516,
              15.935333
            ],
            [
              120.127387,
              15.935704
            ],
            [
              120.127258,
              15.935663
            ],
            [
              120.12713,
              15.935539
            ],
            [
              120.127001,
              15.935251
            ],
            [
              120.127387,
              15.935044
            ],
            [
              120.127645,
              15.934962
            ],
            [
              120.127559,
              15.934673
            ],
            [
              120.127087,
              15.934714
            ],
            [
              120.126915,
              15.93459
            ],
            [
              120.1267,
              15.934466
            ],
            [
              120.126529,
              15.934343
            ],
            [
              120.1264,
              15.933847
            ],
            [
              120.126057,
              15.933724
            ],
            [
              120.125928,
              15.9336
            ],
            [
              120.125799,
              15.933476
            ],
            [
              120.125585,
              15.933352
            ],
            [
              120.125284,
              15.933228
            ],
            [
              120.125113,
              15.933105
            ],
            [
              120.12507,
              15.932651
            ],
            [
              120.124855,
              15.932362
            ],
            [
              120.124683,
              15.932238
            ],
            [
              120.124512,
              15.932114
            ],
            [
              120.124383,
              15.931825
            ],
            [
              120.124254,
              15.93166
            ],
            [
              120.12404,
              15.931537
            ],
            [
              120.123911,
              15.930835
            ],
            [
              120.12404,
              15.93034
            ],
            [
              120.123739,
              15.929968
            ],
            [
              120.12361,
              15.929762
            ],
            [
              120.123482,
              15.929556
            ],
            [
              120.123353,
              15.929432
            ],
            [
              120.123525,
              15.929226
            ],
            [
              120.12404,
              15.929102
            ],
            [
              120.124297,
              15.929226
            ],
            [
              120.124683,
              15.929349
            ],
            [
              120.124855,
              15.929473
            ],
            [
              120.125027,
              15.929597
            ],
            [
              120.12537,
              15.929721
            ],
            [
              120.125713,
              15.92968
            ],
            [
              120.125842,
              15.929556
            ],
            [
              120.126014,
              15.929432
            ],
            [
              120.126185,
              15.929308
            ],
            [
              120.126872,
              15.929267
            ],
            [
              120.128245,
              15.929308
            ],
            [
              120.128846,
              15.929267
            ],
            [
              120.129232,
              15.929308
            ],
            [
              120.129361,
              15.929473
            ],
            [
              120.129232,
              15.929803
            ],
            [
              120.129104,
              15.929968
            ],
            [
              120.128975,
              15.930175
            ],
            [
              120.128846,
              15.930422
            ],
            [
              120.128717,
              15.930629
            ],
            [
              120.128589,
              15.930918
            ],
            [
              120.128546,
              15.931495
            ],
            [
              120.128674,
              15.932073
            ],
            [
              120.128803,
              15.932362
            ],
            [
              120.128932,
              15.932527
            ],
            [
              120.129061,
              15.933063
            ],
            [
              120.129189,
              15.933394
            ],
            [
              120.129318,
              15.934054
            ],
            [
              120.129533,
              15.934425
            ],
            [
              120.129662,
              15.934549
            ],
            [
              120.12979,
              15.934797
            ],
            [
              120.129833,
              15.935085
            ],
            [
              120.129662,
              15.935457
            ],
            [
              120.129747,
              15.935663
            ],
            [
              120.129576,
              15.93587
            ],
            [
              120.129361,
              15.936117
            ],
            [
              120.129104,
              15.936241
            ],
            [
              120.128846,
              15.936365
            ],
            [
              120.128245,
              15.936406
            ]
          ],
          [
            [
              120.128202,
              15.935622
            ],
            [
              120.128288,
              15.935622
            ],
            [
              120.128288,
              15.935581
            ],
            [
              120.128331,
              15.935581
            ],
            [
              120.128331,
              15.935539
            ],
            [
              120.128288,
              15.935539
            ],
            [
              120.128288,
              15.935498
            ],
            [
              120.128202,
              15.935498
            ],
            [
              120.128202,
              15.935622
            ]
          ],
          [
            [
              120.128674,
              15.935333
            ],
            [
              120.129061,
              15.935333
            ],
            [
              120.129061,
              15.935292
            ],
            [
              120.129189,
              15.935292
            ],
            [
              120.129189,
              15.935251
            ],
            [
              120.129232,
              15.935251
            ],
            [
              120.129232,
              15.935168
            ],
            [
              120.129147,
              15.935168
            ],
            [
              120.129147,
              15.935127
            ],
            [
              120.129061,
              15.935127
            ],
            [
              120.129061,
              15.935085
            ],
            [
              120.128846,
              15.935085
            ],
            [
              120.128846,
              15.935127
            ],
            [
              120.128803,
              15.935127
            ],
            [
              120.128803,
              15.935085
            ],
            [
              120.128674,
              15.935085
            ],
            [
              120.128674,
              15.935044
            ],
            [
              120.128632,
              15.935044
            ],
            [
              120.128632,
              15.935085
            ],
            [
              120.128589,
              15.935085
            ],
            [
              120.128589,
              15.935251
            ],
            [
              120.128632,
              15.935251
            ],
            [
              120.128632,
              15.935292
            ],
            [
              120.128674,
              15.935292
            ],
            [
              120.128674,
              15.935333
            ]
          ],
          [
            [
              120.128589,
              15.93492
            ],
            [
              120.128674,
              15.93492
            ],
            [
              120.128674,
              15.934838
            ],
            [
              120.128717,
              15.934838
            ],
            [
              120.128717,
              15.934755
            ],
            [
              120.128674,
              15.934755
            ],
            [
              120.128674,
              15.934714
            ],
            [
              120.128589,
              15.934714
            ],
            [
              120.128589,
              15.934755
            ],
            [
              120.128546,
              15.934755
            ],
            [
              120.128546,
              15.934838
            ],
            [
              120.128589,
              15.934838
            ],
            [
              120.128589,
              15.93492
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 15.9327753,
      "matchedAssetCentroidLongitude": 120.1271107
    },
    {
      "projectId": "PHL-W-ASEAN-003",
      "projectName": "Claveria Offshore Wind",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 1600.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Claveria coast",
      "provinceStateRegion": "Cagayan",
      "latitude": 18.65,
      "longitude": 121.05,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "observed_on_schedule",
      "observedCapacityMw": null,
      "observedAssetCount": 47,
      "observedFirstSeenQuarter": "2019 Q1",
      "matchConfidence": 0.62,
      "distanceKm": 20.32,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::WIND::PHL::wind_sea_2024q2_v1.geojson::852",
      "matchedAssetGeometry": {
        "type": "Point",
        "coordinates": [
          120.86019,
          18.617701
        ]
      },
      "matchedAssetCentroidLatitude": 18.6177006,
      "matchedAssetCentroidLongitude": 120.8601896
    },
    {
      "projectId": "PHL-S-004",
      "projectName": "Laoag Solar Power Project",
      "countryCode": "PHL",
      "countryName": "Philippines",
      "technology": "solar",
      "claimedCapacityMw": 159.0,
      "claimedStatus": "construction",
      "claimedCod": null,
      "locationText": "Brgy. Laoag, Aguilar",
      "provinceStateRegion": "Pangasinan",
      "latitude": 15.89,
      "longitude": 120.23,
      "sourcePrimaryUrl": "https://aboitizpower.com/news/aboitizpower-starts-construction-of-159-mwp-pangasinan-solar-plant",
      "sourcePrimaryType": "Developer Press Release",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; project naming ambiguity remains",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 0.74,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2022 Q3",
      "matchConfidence": 0.6575,
      "distanceKm": 11.583,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "1 direct connected substations within 0.1 km, 15 transmission lines, 16 credible substation-line bridges; max mapped voltage 500 kV.",
      "gridContextScore": 0.782,
      "gridMetadataScore": 0.84,
      "maxNearbyGridVoltageKv": 500.0,
      "nearestSiteSideGridDistanceKm": 0.061,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 3,
      "matchedAssetSiteId": "GRW::SOLAR::PHL::solar_sea_2024q2_v1.geojson::17",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              120.135355,
              15.94105
            ],
            [
              120.134539,
              15.940588
            ],
            [
              120.134548,
              15.940476
            ],
            [
              120.135018,
              15.940053
            ],
            [
              120.135043,
              15.939934
            ],
            [
              120.135416,
              15.939917
            ],
            [
              120.135754,
              15.940098
            ],
            [
              120.135942,
              15.940636
            ],
            [
              120.135634,
              15.94099
            ],
            [
              120.135467,
              15.94106
            ],
            [
              120.135355,
              15.94105
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 15.9405319,
      "matchedAssetCentroidLongitude": 120.1352792
    },
    {
      "projectId": "PHL-W-ASEAN-004",
      "projectName": "Mariveles Offshore Wind",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 1500.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Mariveles coast",
      "provinceStateRegion": "Bataan",
      "latitude": 14.4,
      "longitude": 120.45,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "PHL-W-ASEAN-005",
      "projectName": "NOM FL1 Offshore Wind",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 3038.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Northern Occidental Mindoro coast",
      "provinceStateRegion": "Occidental Mindoro",
      "latitude": 13.5,
      "longitude": 120.2,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "PHL-W-ASEAN-006",
      "projectName": "Northern Mindoro Offshore",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 2000.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Northern Mindoro coast",
      "provinceStateRegion": "Mindoro",
      "latitude": 13.5,
      "longitude": 120.5,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "PHL-S-001",
      "projectName": "Olongapo Solar Power Project",
      "countryCode": "PHL",
      "countryName": "Philippines",
      "technology": "solar",
      "claimedCapacityMw": 221.082,
      "claimedStatus": "construction",
      "claimedCod": "2025-09",
      "locationText": "Olongapo City",
      "provinceStateRegion": "Zambales",
      "latitude": 14.8386,
      "longitude": 120.2842,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/sites/default/files/pdf/renewable_energy/awarded_solar_2023-10-31.pdf",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; exact site boundaries not public",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 131.07,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.6075,
      "distanceKm": 9.475,
      "gridEvidenceClass": "power_infrastructure_nearby_but_ambiguous",
      "gridEvidenceReason": "max mapped voltage 500 kV; 1 substations, 20 transmission lines, 1 credible bridges, but no confirmed site-side connected candidate.",
      "gridContextScore": 0.358,
      "gridMetadataScore": 0.495,
      "maxNearbyGridVoltageKv": 500.0,
      "nearestSiteSideGridDistanceKm": 6.505,
      "directConnectedSubstationCount": 1,
      "directConnectedTransmissionCount": 0,
      "matchedAssetSiteId": "GRW::SOLAR::PHL::solar_sea_2024q2_v1.geojson::919",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              120.363207,
              14.813346
            ],
            [
              120.362005,
              14.812558
            ],
            [
              120.360589,
              14.810815
            ],
            [
              120.361705,
              14.809446
            ],
            [
              120.362263,
              14.808658
            ],
            [
              120.361662,
              14.80733
            ],
            [
              120.36222,
              14.805671
            ],
            [
              120.361233,
              14.80538
            ],
            [
              120.360503,
              14.807413
            ],
            [
              120.358829,
              14.808036
            ],
            [
              120.358529,
              14.807081
            ],
            [
              120.359387,
              14.805712
            ],
            [
              120.360718,
              14.804965
            ],
            [
              120.359344,
              14.803223
            ],
            [
              120.359774,
              14.80231
            ],
            [
              120.360847,
              14.802808
            ],
            [
              120.36016,
              14.801024
            ],
            [
              120.359001,
              14.800567
            ],
            [
              120.357242,
              14.801024
            ],
            [
              120.356555,
              14.801895
            ],
            [
              120.358014,
              14.802559
            ],
            [
              120.356984,
              14.80397
            ],
            [
              120.355225,
              14.803057
            ],
            [
              120.355268,
              14.80065
            ],
            [
              120.357842,
              14.79953
            ],
            [
              120.358958,
              14.798244
            ],
            [
              120.358958,
              14.796294
            ],
            [
              120.357928,
              14.796252
            ],
            [
              120.358829,
              14.795173
            ],
            [
              120.359859,
              14.793887
            ],
            [
              120.357928,
              14.794011
            ],
            [
              120.356727,
              14.792725
            ],
            [
              120.356898,
              14.791439
            ],
            [
              120.3581,
              14.790443
            ],
            [
              120.359216,
              14.78924
            ],
            [
              120.359302,
              14.78729
            ],
            [
              120.360632,
              14.788078
            ],
            [
              120.361748,
              14.789738
            ],
            [
              120.362821,
              14.790443
            ],
            [
              120.362864,
              14.789323
            ],
            [
              120.363979,
              14.790734
            ],
            [
              120.366511,
              14.791522
            ],
            [
              120.367842,
              14.791812
            ],
            [
              120.368786,
              14.792767
            ],
            [
              120.36973,
              14.79509
            ],
            [
              120.370073,
              14.796501
            ],
            [
              120.371189,
              14.798078
            ],
            [
              120.371575,
              14.800194
            ],
            [
              120.369987,
              14.800775
            ],
            [
              120.368528,
              14.800111
            ],
            [
              120.367627,
              14.798908
            ],
            [
              120.367885,
              14.797082
            ],
            [
              120.367327,
              14.797206
            ],
            [
              120.367198,
              14.798493
            ],
            [
              120.366082,
              14.799281
            ],
            [
              120.366726,
              14.801356
            ],
            [
              120.367284,
              14.802476
            ],
            [
              120.365438,
              14.80177
            ],
            [
              120.364623,
              14.800775
            ],
            [
              120.363164,
              14.799157
            ],
            [
              120.361361,
              14.79841
            ],
            [
              120.360975,
              14.799115
            ],
            [
              120.362306,
              14.800194
            ],
            [
              120.362906,
              14.801356
            ],
            [
              120.363979,
              14.802891
            ],
            [
              120.365095,
              14.804135
            ],
            [
              120.366383,
              14.805546
            ],
            [
              120.364623,
              14.806625
            ],
            [
              120.365953,
              14.807455
            ],
            [
              120.366554,
              14.809571
            ],
            [
              120.367155,
              14.811811
            ],
            [
              120.366297,
              14.812599
            ],
            [
              120.36531,
              14.812392
            ],
            [
              120.364237,
              14.81289
            ],
            [
              120.363207,
              14.813346
            ]
          ],
          [
            [
              120.363722,
              14.803845
            ],
            [
              120.363765,
              14.803845
            ],
            [
              120.363765,
              14.803804
            ],
            [
              120.363808,
              14.803804
            ],
            [
              120.363808,
              14.803762
            ],
            [
              120.363851,
              14.803762
            ],
            [
              120.363851,
              14.803389
            ],
            [
              120.363893,
              14.803389
            ],
            [
              120.363893,
              14.803181
            ],
            [
              120.363851,
              14.803181
            ],
            [
              120.363851,
              14.80314
            ],
            [
              120.363679,
              14.80314
            ],
            [
              120.363679,
              14.803098
            ],
            [
              120.363593,
              14.803098
            ],
            [
              120.363593,
              14.803057
            ],
            [
              120.363507,
              14.803057
            ],
            [
              120.363507,
              14.803015
            ],
            [
              120.363379,
              14.803015
            ],
            [
              120.363379,
              14.803057
            ],
            [
              120.363293,
              14.803057
            ],
            [
              120.363293,
              14.803098
            ],
            [
              120.36325,
              14.803098
            ],
            [
              120.36325,
              14.80314
            ],
            [
              120.363293,
              14.80314
            ],
            [
              120.363293,
              14.803223
            ],
            [
              120.363336,
              14.803223
            ],
            [
              120.363336,
              14.803264
            ],
            [
              120.363379,
              14.803264
            ],
            [
              120.363379,
              14.803306
            ],
            [
              120.363421,
              14.803306
            ],
            [
              120.363421,
              14.803347
            ],
            [
              120.363507,
              14.803347
            ],
            [
              120.363507,
              14.803389
            ],
            [
              120.36355,
              14.803389
            ],
            [
              120.36355,
              14.80343
            ],
            [
              120.363636,
              14.80343
            ],
            [
              120.363636,
              14.803472
            ],
            [
              120.363679,
              14.803472
            ],
            [
              120.363679,
              14.803762
            ],
            [
              120.363722,
              14.803762
            ],
            [
              120.363722,
              14.803845
            ]
          ],
          [
            [
              120.362692,
              14.794924
            ],
            [
              120.363035,
              14.794924
            ],
            [
              120.363035,
              14.794883
            ],
            [
              120.363636,
              14.794883
            ],
            [
              120.363636,
              14.794841
            ],
            [
              120.363679,
              14.794841
            ],
            [
              120.363679,
              14.7948
            ],
            [
              120.363722,
              14.7948
            ],
            [
              120.363722,
              14.794675
            ],
            [
              120.363765,
              14.794675
            ],
            [
              120.363765,
              14.794551
            ],
            [
              120.363808,
              14.794551
            ],
            [
              120.363808,
              14.794509
            ],
            [
              120.363893,
              14.794509
            ],
            [
              120.363893,
              14.794468
            ],
            [
              120.363936,
              14.794468
            ],
            [
              120.363936,
              14.794426
            ],
            [
              120.363979,
              14.794426
            ],
            [
              120.363979,
              14.794343
            ],
            [
              120.364022,
              14.794343
            ],
            [
              120.364022,
              14.79426
            ],
            [
              120.364065,
              14.79426
            ],
            [
              120.364065,
              14.794094
            ],
            [
              120.364022,
              14.794094
            ],
            [
              120.364022,
              14.793887
            ],
            [
              120.364065,
              14.793887
            ],
            [
              120.364065,
              14.79368
            ],
            [
              120.364022,
              14.79368
            ],
            [
              120.364022,
              14.793597
            ],
            [
              120.363979,
              14.793597
            ],
            [
              120.363979,
              14.793555
            ],
            [
              120.363936,
              14.793555
            ],
            [
              120.363936,
              14.793514
            ],
            [
              120.363893,
              14.793514
            ],
            [
              120.363893,
              14.793472
            ],
            [
              120.363851,
              14.793472
            ],
            [
              120.363851,
              14.793431
            ],
            [
              120.363808,
              14.793431
            ],
            [
              120.363808,
              14.793389
            ],
            [
              120.363765,
              14.793389
            ],
            [
              120.363765,
              14.793348
            ],
            [
              120.363636,
              14.793348
            ],
            [
              120.363636,
              14.793389
            ],
            [
              120.363593,
              14.793389
            ],
            [
              120.363593,
              14.793431
            ],
            [
              120.36355,
              14.793431
            ],
            [
              120.36355,
              14.793472
            ],
            [
              120.363507,
              14.793472
            ],
            [
              120.363507,
              14.793555
            ],
            [
              120.363464,
              14.793555
            ],
            [
              120.363464,
              14.793597
            ],
            [
              120.363379,
              14.793597
            ],
            [
              120.363379,
              14.793638
            ],
            [
              120.363336,
              14.793638
            ],
            [
              120.363336,
              14.79368
            ],
            [
              120.363293,
              14.79368
            ],
            [
              120.363293,
              14.793721
            ],
            [
              120.36325,
              14.793721
            ],
            [
              120.36325,
              14.793763
            ],
            [
              120.363207,
              14.793763
            ],
            [
              120.363207,
              14.793804
            ],
            [
              120.363164,
              14.793804
            ],
            [
              120.363164,
              14.793846
            ],
            [
              120.363121,
              14.793846
            ],
            [
              120.363121,
              14.793887
            ],
            [
              120.363078,
              14.793887
            ],
            [
              120.363078,
              14.793928
            ],
            [
              120.363035,
              14.793928
            ],
            [
              120.363035,
              14.79397
            ],
            [
              120.362992,
              14.79397
            ],
            [
              120.362992,
              14.794011
            ],
            [
              120.362949,
              14.794011
            ],
            [
              120.362949,
              14.794053
            ],
            [
              120.362906,
              14.794053
            ],
            [
              120.362906,
              14.794094
            ],
            [
              120.362864,
              14.794094
            ],
            [
              120.362864,
              14.794136
            ],
            [
              120.362821,
              14.794136
            ],
            [
              120.362821,
              14.794177
            ],
            [
              120.362735,
              14.794177
            ],
            [
              120.362735,
              14.794219
            ],
            [
              120.362692,
              14.794219
            ],
            [
              120.362692,
              14.79426
            ],
            [
              120.362606,
              14.79426
            ],
            [
              120.362606,
              14.794302
            ],
            [
              120.362563,
              14.794302
            ],
            [
              120.362563,
              14.794509
            ],
            [
              120.362606,
              14.794509
            ],
            [
              120.362606,
              14.794551
            ],
            [
              120.362649,
              14.794551
            ],
            [
              120.362649,
              14.794592
            ],
            [
              120.362692,
              14.794592
            ],
            [
              120.362692,
              14.794841
            ],
            [
              120.362649,
              14.794841
            ],
            [
              120.362649,
              14.794883
            ],
            [
              120.362692,
              14.794883
            ],
            [
              120.362692,
              14.794924
            ]
          ],
          [
            [
              120.367584,
              14.793928
            ],
            [
              120.367713,
              14.793928
            ],
            [
              120.367713,
              14.793887
            ],
            [
              120.367799,
              14.793887
            ],
            [
              120.367799,
              14.793846
            ],
            [
              120.367842,
              14.793846
            ],
            [
              120.367842,
              14.793638
            ],
            [
              120.367799,
              14.793638
            ],
            [
              120.367799,
              14.793597
            ],
            [
              120.367756,
              14.793597
            ],
            [
              120.367756,
              14.793348
            ],
            [
              120.367713,
              14.793348
            ],
            [
              120.367713,
              14.793306
            ],
            [
              120.36767,
              14.793306
            ],
            [
              120.36767,
              14.793265
            ],
            [
              120.367627,
              14.793265
            ],
            [
              120.367627,
              14.793223
            ],
            [
              120.367584,
              14.793223
            ],
            [
              120.367584,
              14.793182
            ],
            [
              120.367498,
              14.793182
            ],
            [
              120.367498,
              14.79314
            ],
            [
              120.36737,
              14.79314
            ],
            [
              120.36737,
              14.793182
            ],
            [
              120.367284,
              14.793182
            ],
            [
              120.367284,
              14.793265
            ],
            [
              120.367198,
              14.793265
            ],
            [
              120.367198,
              14.793306
            ],
            [
              120.367155,
              14.793306
            ],
            [
              120.367155,
              14.793348
            ],
            [
              120.367069,
              14.793348
            ],
            [
              120.367069,
              14.793389
            ],
            [
              120.367026,
              14.793389
            ],
            [
              120.367026,
              14.793431
            ],
            [
              120.366983,
              14.793431
            ],
            [
              120.366983,
              14.793472
            ],
            [
              120.366898,
              14.793472
            ],
            [
              120.366898,
              14.793514
            ],
            [
              120.366855,
              14.793514
            ],
            [
              120.366855,
              14.793555
            ],
            [
              120.366898,
              14.793555
            ],
            [
              120.366898,
              14.793597
            ],
            [
              120.367026,
              14.793597
            ],
            [
              120.367026,
              14.793638
            ],
            [
              120.367069,
              14.793638
            ],
            [
              120.367069,
              14.79368
            ],
            [
              120.367112,
              14.79368
            ],
            [
              120.367112,
              14.793721
            ],
            [
              120.367198,
              14.793721
            ],
            [
              120.367198,
              14.793763
            ],
            [
              120.367284,
              14.793763
            ],
            [
              120.367284,
              14.793804
            ],
            [
              120.36737,
              14.793804
            ],
            [
              120.36737,
              14.793846
            ],
            [
              120.367455,
              14.793846
            ],
            [
              120.367455,
              14.793887
            ],
            [
              120.367584,
              14.793887
            ],
            [
              120.367584,
              14.793928
            ]
          ],
          [
            [
              120.365138,
              14.793887
            ],
            [
              120.365396,
              14.793887
            ],
            [
              120.365396,
              14.793846
            ],
            [
              120.365481,
              14.793846
            ],
            [
              120.365481,
              14.793804
            ],
            [
              120.365524,
              14.793804
            ],
            [
              120.365524,
              14.793763
            ],
            [
              120.365567,
              14.793763
            ],
            [
              120.365567,
              14.793721
            ],
            [
              120.365653,
              14.793721
            ],
            [
              120.365653,
              14.79368
            ],
            [
              120.365739,
              14.79368
            ],
            [
              120.365739,
              14.793555
            ],
            [
              120.365438,
              14.793555
            ],
            [
              120.365438,
              14.793514
            ],
            [
              120.36531,
              14.793514
            ],
            [
              120.36531,
              14.793555
            ],
            [
              120.365181,
              14.793555
            ],
            [
              120.365181,
              14.793597
            ],
            [
              120.365138,
              14.793597
            ],
            [
              120.365138,
              14.793638
            ],
            [
              120.365095,
              14.793638
            ],
            [
              120.365095,
              14.79368
            ],
            [
              120.365052,
              14.79368
            ],
            [
              120.365052,
              14.793804
            ],
            [
              120.365095,
              14.793804
            ],
            [
              120.365095,
              14.793846
            ],
            [
              120.365138,
              14.793846
            ],
            [
              120.365138,
              14.793887
            ]
          ],
          [
            [
              120.368271,
              14.793763
            ],
            [
              120.368357,
              14.793763
            ],
            [
              120.368357,
              14.793555
            ],
            [
              120.3684,
              14.793555
            ],
            [
              120.3684,
              14.793431
            ],
            [
              120.368443,
              14.793431
            ],
            [
              120.368443,
              14.793265
            ],
            [
              120.368228,
              14.793265
            ],
            [
              120.368228,
              14.793348
            ],
            [
              120.368185,
              14.793348
            ],
            [
              120.368185,
              14.793472
            ],
            [
              120.368228,
              14.793472
            ],
            [
              120.368228,
              14.793555
            ],
            [
              120.368271,
              14.793555
            ],
            [
              120.368271,
              14.793638
            ],
            [
              120.368228,
              14.793638
            ],
            [
              120.368228,
              14.793721
            ],
            [
              120.368271,
              14.793721
            ],
            [
              120.368271,
              14.793763
            ]
          ],
          [
            [
              120.359902,
              14.793721
            ],
            [
              120.359945,
              14.793721
            ],
            [
              120.359945,
              14.79368
            ],
            [
              120.360031,
              14.79368
            ],
            [
              120.360031,
              14.793638
            ],
            [
              120.360074,
              14.793638
            ],
            [
              120.360074,
              14.793597
            ],
            [
              120.360117,
              14.793597
            ],
            [
              120.360117,
              14.793555
            ],
            [
              120.36016,
              14.793555
            ],
            [
              120.36016,
              14.793514
            ],
            [
              120.360203,
              14.793514
            ],
            [
              120.360203,
              14.793472
            ],
            [
              120.360289,
              14.793472
            ],
            [
              120.360289,
              14.793431
            ],
            [
              120.360417,
              14.793431
            ],
            [
              120.360417,
              14.793389
            ],
            [
              120.360546,
              14.793389
            ],
            [
              120.360546,
              14.793348
            ],
            [
              120.360675,
              14.793348
            ],
            [
              120.360675,
              14.793306
            ],
            [
              120.360804,
              14.793306
            ],
            [
              120.360804,
              14.793265
            ],
            [
              120.360889,
              14.793265
            ],
            [
              120.360889,
              14.793223
            ],
            [
              120.360932,
              14.793223
            ],
            [
              120.360932,
              14.793182
            ],
            [
              120.361018,
              14.793182
            ],
            [
              120.361018,
              14.79314
            ],
            [
              120.361061,
              14.79314
            ],
            [
              120.361061,
              14.793099
            ],
            [
              120.361104,
              14.793099
            ],
            [
              120.361104,
              14.793016
            ],
            [
              120.361147,
              14.793016
            ],
            [
              120.361147,
              14.792974
            ],
            [
              120.36119,
              14.792974
            ],
            [
              120.36119,
              14.792891
            ],
            [
              120.361233,
              14.792891
            ],
            [
              120.361233,
              14.792684
            ],
            [
              120.36119,
              14.792684
            ],
            [
              120.36119,
              14.792518
            ],
            [
              120.361147,
              14.792518
            ],
            [
              120.361147,
              14.792435
            ],
            [
              120.361061,
              14.792435
            ],
            [
              120.361061,
              14.792518
            ],
            [
              120.361018,
              14.792518
            ],
            [
              120.361018,
              14.792559
            ],
            [
              120.360975,
              14.792559
            ],
            [
              120.360975,
              14.792601
            ],
            [
              120.360847,
              14.792601
            ],
            [
              120.360847,
              14.792642
            ],
            [
              120.360804,
              14.792642
            ],
            [
              120.360804,
              14.792767
            ],
            [
              120.360761,
              14.792767
            ],
            [
              120.360761,
              14.792808
            ],
            [
              120.360675,
              14.792808
            ],
            [
              120.360675,
              14.79285
            ],
            [
              120.360589,
              14.79285
            ],
            [
              120.360589,
              14.792891
            ],
            [
              120.360503,
              14.792891
            ],
            [
              120.360503,
              14.792933
            ],
            [
              120.36046,
              14.792933
            ],
            [
              120.36046,
              14.792974
            ],
            [
              120.360417,
              14.792974
            ],
            [
              120.360417,
              14.793016
            ],
            [
              120.360374,
              14.793016
            ],
            [
              120.360374,
              14.793057
            ],
            [
              120.360332,
              14.793057
            ],
            [
              120.360332,
              14.793099
            ],
            [
              120.360289,
              14.793099
            ],
            [
              120.360289,
              14.79314
            ],
            [
              120.360246,
              14.79314
            ],
            [
              120.360246,
              14.793182
            ],
            [
              120.360203,
              14.793182
            ],
            [
              120.360203,
              14.793223
            ],
            [
              120.360117,
              14.793223
            ],
            [
              120.360117,
              14.793265
            ],
            [
              120.360074,
              14.793265
            ],
            [
              120.360074,
              14.793306
            ],
            [
              120.360031,
              14.793306
            ],
            [
              120.360031,
              14.793348
            ],
            [
              120.359988,
              14.793348
            ],
            [
              120.359988,
              14.793389
            ],
            [
              120.359945,
              14.793389
            ],
            [
              120.359945,
              14.793431
            ],
            [
              120.359902,
              14.793431
            ],
            [
              120.359902,
              14.793514
            ],
            [
              120.359859,
              14.793514
            ],
            [
              120.359859,
              14.79368
            ],
            [
              120.359902,
              14.79368
            ],
            [
              120.359902,
              14.793721
            ]
          ],
          [
            [
              120.359645,
              14.793016
            ],
            [
              120.359731,
              14.793016
            ],
            [
              120.359731,
              14.792974
            ],
            [
              120.359774,
              14.792974
            ],
            [
              120.359774,
              14.792933
            ],
            [
              120.359817,
              14.792933
            ],
            [
              120.359817,
              14.79285
            ],
            [
              120.359859,
              14.79285
            ],
            [
              120.359859,
              14.792808
            ],
            [
              120.359902,
              14.792808
            ],
            [
              120.359902,
              14.792476
            ],
            [
              120.359859,
              14.792476
            ],
            [
              120.359859,
              14.792352
            ],
            [
              120.359817,
              14.792352
            ],
            [
              120.359817,
              14.792186
            ],
            [
              120.359774,
              14.792186
            ],
            [
              120.359774,
              14.791895
            ],
            [
              120.359817,
              14.791895
            ],
            [
              120.359817,
              14.791729
            ],
            [
              120.359859,
              14.791729
            ],
            [
              120.359859,
              14.791605
            ],
            [
              120.359902,
              14.791605
            ],
            [
              120.359902,
              14.791148
            ],
            [
              120.359945,
              14.791148
            ],
            [
              120.359945,
              14.790982
            ],
            [
              120.359988,
              14.790982
            ],
            [
              120.359988,
              14.790858
            ],
            [
              120.360031,
              14.790858
            ],
            [
              120.360031,
              14.790609
            ],
            [
              120.359988,
              14.790609
            ],
            [
              120.359988,
              14.790568
            ],
            [
              120.359902,
              14.790568
            ],
            [
              120.359902,
              14.790526
            ],
            [
              120.359859,
              14.790526
            ],
            [
              120.359859,
              14.790568
            ],
            [
              120.359817,
              14.790568
            ],
            [
              120.359817,
              14.790609
            ],
            [
              120.359774,
              14.790609
            ],
            [
              120.359774,
              14.790692
            ],
            [
              120.359731,
              14.790692
            ],
            [
              120.359731,
              14.790817
            ],
            [
              120.359688,
              14.790817
            ],
            [
              120.359688,
              14.7909
            ],
            [
              120.359602,
              14.7909
            ],
            [
              120.359602,
              14.790858
            ],
            [
              120.359559,
              14.790858
            ],
            [
              120.359559,
              14.790817
            ],
            [
              120.359473,
              14.790817
            ],
            [
              120.359473,
              14.790775
            ],
            [
              120.35943,
              14.790775
            ],
            [
              120.35943,
              14.790817
            ],
            [
              120.359387,
              14.790817
            ],
            [
              120.359387,
              14.79119
            ],
            [
              120.35943,
              14.79119
            ],
            [
              120.35943,
              14.791563
            ],
            [
              120.359387,
              14.791563
            ],
            [
              120.359387,
              14.791812
            ],
            [
              120.359344,
              14.791812
            ],
            [
              120.359344,
              14.792103
            ],
            [
              120.359387,
              14.792103
            ],
            [
              120.359387,
              14.792269
            ],
            [
              120.35943,
              14.792269
            ],
            [
              120.35943,
              14.792435
            ],
            [
              120.359473,
              14.792435
            ],
            [
              120.359473,
              14.792518
            ],
            [
              120.359516,
              14.792518
            ],
            [
              120.359516,
              14.792642
            ],
            [
              120.359559,
              14.792642
            ],
            [
              120.359559,
              14.792725
            ],
            [
              120.359602,
              14.792725
            ],
            [
              120.359602,
              14.792974
            ],
            [
              120.359645,
              14.792974
            ],
            [
              120.359645,
              14.793016
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 14.7997905,
      "matchedAssetCentroidLongitude": 120.3626647
    },
    {
      "projectId": "PHL-S-003",
      "projectName": "Opus Solar Power Project",
      "countryCode": "PHL",
      "countryName": "Philippines",
      "technology": "solar",
      "claimedCapacityMw": 300.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Barangays Bacsil and Mumulaan, Municipality of Paoay",
      "provinceStateRegion": "Ilocos Norte",
      "latitude": 18.088064,
      "longitude": 120.486786,
      "sourcePrimaryUrl": "https://r1.emb.gov.ph/wp-content/uploads/2024/07/Project-Description-for-Scoping.pdf",
      "sourcePrimaryType": "Official Environmental Filing",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point from official project boundary table",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 50.05,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2017 Q4",
      "matchConfidence": 0.7475,
      "distanceKm": 4.198,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "3 direct connected substations within 0.4 km, 10 transmission lines, 8 credible substation-line bridges; max mapped voltage 230 kV.",
      "gridContextScore": 0.809,
      "gridMetadataScore": 0.83,
      "maxNearbyGridVoltageKv": 230.0,
      "nearestSiteSideGridDistanceKm": 0.403,
      "directConnectedSubstationCount": 3,
      "directConnectedTransmissionCount": 2,
      "matchedAssetSiteId": "GRW::SOLAR::PHL::solar_sea_2024q2_v1.geojson::603",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              120.485258,
              18.058151
            ],
            [
              120.484142,
              18.058028
            ],
            [
              120.483756,
              18.057906
            ],
            [
              120.482297,
              18.057783
            ],
            [
              120.482168,
              18.057661
            ],
            [
              120.482125,
              18.057131
            ],
            [
              120.482168,
              18.056355
            ],
            [
              120.482211,
              18.055621
            ],
            [
              120.48234,
              18.054397
            ],
            [
              120.482469,
              18.053785
            ],
            [
              120.482426,
              18.052153
            ],
            [
              120.482383,
              18.051418
            ],
            [
              120.48234,
              18.050317
            ],
            [
              120.482211,
              18.049541
            ],
            [
              120.482082,
              18.048807
            ],
            [
              120.481954,
              18.048236
            ],
            [
              120.481825,
              18.047787
            ],
            [
              120.481696,
              18.047379
            ],
            [
              120.481567,
              18.04693
            ],
            [
              120.481439,
              18.046236
            ],
            [
              120.481482,
              18.04591
            ],
            [
              120.481954,
              18.045787
            ],
            [
              120.482383,
              18.045747
            ],
            [
              120.483499,
              18.045706
            ],
            [
              120.483756,
              18.045828
            ],
            [
              120.484228,
              18.045951
            ],
            [
              120.484443,
              18.046073
            ],
            [
              120.484571,
              18.046318
            ],
            [
              120.4847,
              18.046807
            ],
            [
              120.484743,
              18.047256
            ],
            [
              120.484872,
              18.047501
            ],
            [
              120.485001,
              18.047868
            ],
            [
              120.485129,
              18.048154
            ],
            [
              120.485129,
              18.047828
            ],
            [
              120.485086,
              18.046971
            ],
            [
              120.485258,
              18.046848
            ],
            [
              120.485473,
              18.046726
            ],
            [
              120.48543,
              18.046155
            ],
            [
              120.485473,
              18.04591
            ],
            [
              120.48573,
              18.045787
            ],
            [
              120.486588,
              18.045665
            ],
            [
              120.48749,
              18.045624
            ],
            [
              120.48779,
              18.045747
            ],
            [
              120.488305,
              18.045787
            ],
            [
              120.488734,
              18.04591
            ],
            [
              120.48955,
              18.045869
            ],
            [
              120.489721,
              18.045991
            ],
            [
              120.48985,
              18.046195
            ],
            [
              120.489721,
              18.046481
            ],
            [
              120.489593,
              18.046807
            ],
            [
              120.489464,
              18.04746
            ],
            [
              120.489335,
              18.048072
            ],
            [
              120.489206,
              18.048644
            ],
            [
              120.489078,
              18.049092
            ],
            [
              120.488949,
              18.049337
            ],
            [
              120.48882,
              18.049909
            ],
            [
              120.488691,
              18.050276
            ],
            [
              120.488563,
              18.050561
            ],
            [
              120.488434,
              18.05101
            ],
            [
              120.488305,
              18.051418
            ],
            [
              120.488176,
              18.051622
            ],
            [
              120.488048,
              18.052234
            ],
            [
              120.487919,
              18.053091
            ],
            [
              120.48779,
              18.053295
            ],
            [
              120.487661,
              18.053703
            ],
            [
              120.487533,
              18.053907
            ],
            [
              120.487404,
              18.054478
            ],
            [
              120.487275,
              18.054846
            ],
            [
              120.487146,
              18.055417
            ],
            [
              120.486932,
              18.055539
            ],
            [
              120.486803,
              18.055743
            ],
            [
              120.486674,
              18.055866
            ],
            [
              120.486503,
              18.056111
            ],
            [
              120.486546,
              18.056845
            ],
            [
              120.486417,
              18.057579
            ],
            [
              120.486288,
              18.057947
            ],
            [
              120.486159,
              18.058069
            ],
            [
              120.485258,
              18.058151
            ]
          ],
          [
            [
              120.485044,
              18.051622
            ],
            [
              120.485129,
              18.051622
            ],
            [
              120.485129,
              18.051541
            ],
            [
              120.485044,
              18.051541
            ],
            [
              120.485044,
              18.051622
            ]
          ],
          [
            [
              120.485773,
              18.051173
            ],
            [
              120.485859,
              18.051173
            ],
            [
              120.485859,
              18.051133
            ],
            [
              120.485902,
              18.051133
            ],
            [
              120.485902,
              18.051051
            ],
            [
              120.485945,
              18.051051
            ],
            [
              120.485945,
              18.050806
            ],
            [
              120.485902,
              18.050806
            ],
            [
              120.485902,
              18.050684
            ],
            [
              120.485859,
              18.050684
            ],
            [
              120.485859,
              18.050521
            ],
            [
              120.485902,
              18.050521
            ],
            [
              120.485902,
              18.050439
            ],
            [
              120.485945,
              18.050439
            ],
            [
              120.485945,
              18.050398
            ],
            [
              120.485988,
              18.050398
            ],
            [
              120.485988,
              18.050235
            ],
            [
              120.485945,
              18.050235
            ],
            [
              120.485945,
              18.050072
            ],
            [
              120.485902,
              18.050072
            ],
            [
              120.485902,
              18.049786
            ],
            [
              120.485859,
              18.049786
            ],
            [
              120.485859,
              18.049705
            ],
            [
              120.485816,
              18.049705
            ],
            [
              120.485816,
              18.049664
            ],
            [
              120.485773,
              18.049664
            ],
            [
              120.485773,
              18.049582
            ],
            [
              120.48573,
              18.049582
            ],
            [
              120.48573,
              18.0495
            ],
            [
              120.485687,
              18.0495
            ],
            [
              120.485687,
              18.049174
            ],
            [
              120.485644,
              18.049174
            ],
            [
              120.485644,
              18.04897
            ],
            [
              120.485601,
              18.04897
            ],
            [
              120.485601,
              18.048929
            ],
            [
              120.485558,
              18.048929
            ],
            [
              120.485558,
              18.048848
            ],
            [
              120.485516,
              18.048848
            ],
            [
              120.485516,
              18.048807
            ],
            [
              120.485473,
              18.048807
            ],
            [
              120.485473,
              18.048766
            ],
            [
              120.48543,
              18.048766
            ],
            [
              120.48543,
              18.048725
            ],
            [
              120.485387,
              18.048725
            ],
            [
              120.485387,
              18.048848
            ],
            [
              120.48543,
              18.048848
            ],
            [
              120.48543,
              18.049011
            ],
            [
              120.485473,
              18.049011
            ],
            [
              120.485473,
              18.049092
            ],
            [
              120.485516,
              18.049092
            ],
            [
              120.485516,
              18.04999
            ],
            [
              120.485558,
              18.04999
            ],
            [
              120.485558,
              18.050235
            ],
            [
              120.485601,
              18.050235
            ],
            [
              120.485601,
              18.050521
            ],
            [
              120.485644,
              18.050521
            ],
            [
              120.485644,
              18.05101
            ],
            [
              120.485687,
              18.05101
            ],
            [
              120.485687,
              18.051092
            ],
            [
              120.48573,
              18.051092
            ],
            [
              120.48573,
              18.051133
            ],
            [
              120.485773,
              18.051133
            ],
            [
              120.485773,
              18.051173
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 18.0503255,
      "matchedAssetCentroidLongitude": 120.4856498
    },
    {
      "projectId": "PHL-W-ASEAN-007",
      "projectName": "San Miguel Bay Offshore",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "wind",
      "claimedCapacityMw": 1000.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "San Miguel Bay",
      "provinceStateRegion": "Camarines Sur and Camarines Norte",
      "latitude": 13.85,
      "longitude": 123.1,
      "sourcePrimaryUrl": "https://www.doe.gov.ph/awarded-offshore-wind-projects",
      "sourcePrimaryType": "Government Registry",
      "sourceConfidence": "high",
      "dataQualityFlags": "Coastal block representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "PHL-M-ASEAN-001",
      "projectName": "Terra Solar (with BESS)",
      "countryCode": "PHL",
      "countryName": "The Philippines",
      "technology": "mixed",
      "claimedCapacityMw": 1785.7,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Nueva Ecija and Bulacan",
      "provinceStateRegion": "Nueva Ecija and Bulacan",
      "latitude": 15.35,
      "longitude": 121.05,
      "sourcePrimaryUrl": "https://terrasolar.ph/",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative project-area point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "SGP-S-ASEAN-001",
      "projectName": "Kranji Reservoir Floating Solar",
      "countryCode": "SGP",
      "countryName": "Singapore",
      "technology": "solar",
      "claimedCapacityMw": 141.0,
      "claimedStatus": "construction",
      "claimedCod": null,
      "locationText": "Kranji Reservoir",
      "provinceStateRegion": "Singapore",
      "latitude": 1.43,
      "longitude": 103.73,
      "sourcePrimaryUrl": "https://www.pub.gov.sg/",
      "sourcePrimaryType": "Government Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 1.2,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2021 Q3",
      "matchConfidence": 0.6575,
      "distanceKm": 5.979,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::SGP::solar_sea_2024q2_v1.geojson::65",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.728232,
              1.376334
            ],
            [
              103.728232,
              1.376291
            ],
            [
              103.728189,
              1.376291
            ],
            [
              103.728189,
              1.376249
            ],
            [
              103.728147,
              1.376249
            ],
            [
              103.728147,
              1.376163
            ],
            [
              103.728189,
              1.376163
            ],
            [
              103.728189,
              1.375991
            ],
            [
              103.728147,
              1.375991
            ],
            [
              103.728147,
              1.375948
            ],
            [
              103.728104,
              1.375948
            ],
            [
              103.728104,
              1.375905
            ],
            [
              103.727932,
              1.375905
            ],
            [
              103.727932,
              1.375948
            ],
            [
              103.727889,
              1.375948
            ],
            [
              103.727889,
              1.375991
            ],
            [
              103.727846,
              1.375991
            ],
            [
              103.727846,
              1.375948
            ],
            [
              103.727803,
              1.375948
            ],
            [
              103.727803,
              1.375862
            ],
            [
              103.72776,
              1.375862
            ],
            [
              103.72776,
              1.375777
            ],
            [
              103.727717,
              1.375777
            ],
            [
              103.727717,
              1.375605
            ],
            [
              103.727674,
              1.375605
            ],
            [
              103.727674,
              1.375519
            ],
            [
              103.727632,
              1.375519
            ],
            [
              103.727632,
              1.375433
            ],
            [
              103.727589,
              1.375433
            ],
            [
              103.727589,
              1.375348
            ],
            [
              103.727546,
              1.375348
            ],
            [
              103.727546,
              1.375262
            ],
            [
              103.727503,
              1.375262
            ],
            [
              103.727503,
              1.375219
            ],
            [
              103.727417,
              1.375219
            ],
            [
              103.727417,
              1.375176
            ],
            [
              103.727159,
              1.375176
            ],
            [
              103.727159,
              1.375219
            ],
            [
              103.727117,
              1.375219
            ],
            [
              103.727117,
              1.375305
            ],
            [
              103.727074,
              1.375305
            ],
            [
              103.727074,
              1.375562
            ],
            [
              103.727117,
              1.375562
            ],
            [
              103.727117,
              1.375648
            ],
            [
              103.727159,
              1.375648
            ],
            [
              103.727159,
              1.375734
            ],
            [
              103.727117,
              1.375734
            ],
            [
              103.727117,
              1.37582
            ],
            [
              103.727159,
              1.37582
            ],
            [
              103.727159,
              1.375948
            ],
            [
              103.727202,
              1.375948
            ],
            [
              103.727202,
              1.376163
            ],
            [
              103.727245,
              1.376163
            ],
            [
              103.727245,
              1.37672
            ],
            [
              103.727202,
              1.37672
            ],
            [
              103.727202,
              1.376849
            ],
            [
              103.727159,
              1.376849
            ],
            [
              103.727159,
              1.376978
            ],
            [
              103.727202,
              1.376978
            ],
            [
              103.727202,
              1.377021
            ],
            [
              103.727288,
              1.377021
            ],
            [
              103.727288,
              1.377064
            ],
            [
              103.727331,
              1.377064
            ],
            [
              103.727331,
              1.37715
            ],
            [
              103.727374,
              1.37715
            ],
            [
              103.727374,
              1.377192
            ],
            [
              103.727503,
              1.377192
            ],
            [
              103.727503,
              1.377235
            ],
            [
              103.727717,
              1.377235
            ],
            [
              103.727717,
              1.377192
            ],
            [
              103.727846,
              1.377192
            ],
            [
              103.727846,
              1.37715
            ],
            [
              103.727889,
              1.37715
            ],
            [
              103.727889,
              1.377064
            ],
            [
              103.727932,
              1.377064
            ],
            [
              103.727932,
              1.376892
            ],
            [
              103.727975,
              1.376892
            ],
            [
              103.727975,
              1.376806
            ],
            [
              103.728061,
              1.376806
            ],
            [
              103.728061,
              1.376763
            ],
            [
              103.728147,
              1.376763
            ],
            [
              103.728147,
              1.37672
            ],
            [
              103.728447,
              1.37672
            ],
            [
              103.728447,
              1.376763
            ],
            [
              103.728576,
              1.376763
            ],
            [
              103.728576,
              1.376806
            ],
            [
              103.728662,
              1.376806
            ],
            [
              103.728662,
              1.376849
            ],
            [
              103.728704,
              1.376849
            ],
            [
              103.728704,
              1.376763
            ],
            [
              103.728747,
              1.376763
            ],
            [
              103.728747,
              1.376635
            ],
            [
              103.728704,
              1.376635
            ],
            [
              103.728704,
              1.376592
            ],
            [
              103.728576,
              1.376592
            ],
            [
              103.728576,
              1.376549
            ],
            [
              103.72849,
              1.376549
            ],
            [
              103.72849,
              1.376506
            ],
            [
              103.728404,
              1.376506
            ],
            [
              103.728404,
              1.376463
            ],
            [
              103.728361,
              1.376463
            ],
            [
              103.728361,
              1.37642
            ],
            [
              103.728318,
              1.37642
            ],
            [
              103.728318,
              1.376377
            ],
            [
              103.728275,
              1.376377
            ],
            [
              103.728275,
              1.376334
            ],
            [
              103.728232,
              1.376334
            ]
          ],
          [
            [
              103.727975,
              1.37612
            ],
            [
              103.728061,
              1.37612
            ],
            [
              103.728061,
              1.376163
            ],
            [
              103.728104,
              1.376163
            ],
            [
              103.728104,
              1.376291
            ],
            [
              103.727975,
              1.376291
            ],
            [
              103.727975,
              1.376206
            ],
            [
              103.727846,
              1.376206
            ],
            [
              103.727846,
              1.376163
            ],
            [
              103.727975,
              1.376163
            ],
            [
              103.727975,
              1.37612
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 1.3762722,
      "matchedAssetCentroidLongitude": 103.727841
    },
    {
      "projectId": "SGP-S-ASEAN-002",
      "projectName": "Lower Seletar Floating Solar",
      "countryCode": "SGP",
      "countryName": "Singapore",
      "technology": "solar",
      "claimedCapacityMw": 100.0,
      "claimedStatus": "announced",
      "claimedCod": null,
      "locationText": "Lower Seletar Reservoir",
      "provinceStateRegion": "Singapore",
      "latitude": 1.4,
      "longitude": 103.82,
      "sourcePrimaryUrl": "https://www.pub.gov.sg/",
      "sourcePrimaryType": "Government Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 2.71,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2024 Q2",
      "matchConfidence": 0.6575,
      "distanceKm": 10.777,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::SGP::solar_sea_2024q2_v1.geojson::3",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.864519,
              1.315134
            ],
            [
              103.865321,
              1.314499
            ],
            [
              103.864993,
              1.314085
            ],
            [
              103.865245,
              1.31389
            ],
            [
              103.865098,
              1.313684
            ],
            [
              103.865536,
              1.313357
            ],
            [
              103.864844,
              1.312558
            ],
            [
              103.864222,
              1.313076
            ],
            [
              103.863759,
              1.312519
            ],
            [
              103.862934,
              1.313118
            ],
            [
              103.862888,
              1.313174
            ],
            [
              103.862919,
              1.313233
            ],
            [
              103.86298,
              1.313311
            ],
            [
              103.863129,
              1.313195
            ],
            [
              103.86351,
              1.313686
            ],
            [
              103.863362,
              1.313801
            ],
            [
              103.864379,
              1.315112
            ],
            [
              103.864519,
              1.315134
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 1.3136979,
      "matchedAssetCentroidLongitude": 103.8641199
    },
    {
      "projectId": "SGP-S-ASEAN-003",
      "projectName": "Pandan Reservoir Floating Solar",
      "countryCode": "SGP",
      "countryName": "Singapore",
      "technology": "solar",
      "claimedCapacityMw": 55.0,
      "claimedStatus": "announced",
      "claimedCod": null,
      "locationText": "Pandan Reservoir",
      "provinceStateRegion": "Singapore",
      "latitude": 1.31,
      "longitude": 103.74,
      "sourcePrimaryUrl": "https://www.pub.gov.sg/",
      "sourcePrimaryType": "Government Website",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 2.29,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2019 Q2",
      "matchConfidence": 0.7475,
      "distanceKm": 3.018,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::SGP::solar_sea_2024q2_v1.geojson::9",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.722927,
              1.288103
            ],
            [
              103.723407,
              1.286581
            ],
            [
              103.723843,
              1.286734
            ],
            [
              103.723753,
              1.287013
            ],
            [
              103.725636,
              1.287609
            ],
            [
              103.72513,
              1.288579
            ],
            [
              103.725045,
              1.288556
            ],
            [
              103.724923,
              1.288763
            ],
            [
              103.724328,
              1.288563
            ],
            [
              103.724339,
              1.288529
            ],
            [
              103.722927,
              1.288103
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 1.2879211,
      "matchedAssetCentroidLongitude": 103.7242053
    },
    {
      "projectId": "SGP-S-001",
      "projectName": "Sembcorp Tengeh Floating Solar Farm",
      "countryCode": "SGP",
      "countryName": "Singapore",
      "technology": "solar",
      "claimedCapacityMw": 60.0,
      "claimedStatus": "operating",
      "claimedCod": "2021-07-14",
      "locationText": "Tengeh Reservoir",
      "provinceStateRegion": "West Region",
      "latitude": 1.3364,
      "longitude": 103.636,
      "sourcePrimaryUrl": "https://www.pub.gov.sg/public/Publications/Press-Releases/2021/Singapore-Unveils-One-of-the-World-Largest-Floating-Solar-Farms",
      "sourcePrimaryType": "Utility Press Release",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point for reservoir-scale floating system",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 2.85,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2021 Q1",
      "matchConfidence": 0.8725,
      "distanceKm": 1.563,
      "gridEvidenceClass": "power_infrastructure_nearby_but_ambiguous",
      "gridEvidenceReason": "max mapped voltage 500 kV; 4 substations, 33 transmission lines, 20 credible bridges, but no confirmed site-side connected candidate.",
      "gridContextScore": 0.311,
      "gridMetadataScore": 0.925,
      "maxNearbyGridVoltageKv": 500.0,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": 0,
      "directConnectedTransmissionCount": 0,
      "matchedAssetSiteId": "GRW::SOLAR::SGP::solar_sea_2024q2_v1.geojson::435",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.646736,
              1.347761
            ],
            [
              103.646693,
              1.347675
            ],
            [
              103.646607,
              1.347632
            ],
            [
              103.646564,
              1.347503
            ],
            [
              103.646479,
              1.347418
            ],
            [
              103.646436,
              1.347289
            ],
            [
              103.64635,
              1.347246
            ],
            [
              103.646307,
              1.34716
            ],
            [
              103.646221,
              1.347117
            ],
            [
              103.646178,
              1.347031
            ],
            [
              103.646092,
              1.346946
            ],
            [
              103.646049,
              1.34686
            ],
            [
              103.645964,
              1.346817
            ],
            [
              103.645921,
              1.346645
            ],
            [
              103.645835,
              1.34656
            ],
            [
              103.645792,
              1.346431
            ],
            [
              103.645706,
              1.346388
            ],
            [
              103.645663,
              1.346302
            ],
            [
              103.645577,
              1.346259
            ],
            [
              103.645535,
              1.346173
            ],
            [
              103.645449,
              1.346088
            ],
            [
              103.645406,
              1.346002
            ],
            [
              103.64532,
              1.345916
            ],
            [
              103.645277,
              1.34583
            ],
            [
              103.645191,
              1.345787
            ],
            [
              103.645148,
              1.345701
            ],
            [
              103.645062,
              1.345659
            ],
            [
              103.64502,
              1.345573
            ],
            [
              103.644934,
              1.34553
            ],
            [
              103.644891,
              1.345272
            ],
            [
              103.644805,
              1.34523
            ],
            [
              103.644762,
              1.345101
            ],
            [
              103.644762,
              1.344886
            ],
            [
              103.644805,
              1.3448
            ],
            [
              103.644934,
              1.344758
            ],
            [
              103.64502,
              1.344672
            ],
            [
              103.645105,
              1.344629
            ],
            [
              103.645148,
              1.344543
            ],
            [
              103.645234,
              1.3445
            ],
            [
              103.645277,
              1.344414
            ],
            [
              103.645535,
              1.344371
            ],
            [
              103.645577,
              1.344457
            ],
            [
              103.645663,
              1.3445
            ],
            [
              103.645706,
              1.344672
            ],
            [
              103.645792,
              1.344715
            ],
            [
              103.645835,
              1.344843
            ],
            [
              103.645921,
              1.344886
            ],
            [
              103.645964,
              1.345015
            ],
            [
              103.646049,
              1.345058
            ],
            [
              103.646092,
              1.345187
            ],
            [
              103.646178,
              1.34523
            ],
            [
              103.646221,
              1.345401
            ],
            [
              103.646307,
              1.345487
            ],
            [
              103.64635,
              1.345573
            ],
            [
              103.646436,
              1.345659
            ],
            [
              103.646479,
              1.345744
            ],
            [
              103.646564,
              1.34583
            ],
            [
              103.646607,
              1.345916
            ],
            [
              103.646693,
              1.346002
            ],
            [
              103.646779,
              1.346088
            ],
            [
              103.646865,
              1.34613
            ],
            [
              103.646908,
              1.346216
            ],
            [
              103.646994,
              1.346259
            ],
            [
              103.647037,
              1.346345
            ],
            [
              103.647122,
              1.346388
            ],
            [
              103.647165,
              1.346474
            ],
            [
              103.647251,
              1.346517
            ],
            [
              103.647294,
              1.346602
            ],
            [
              103.64738,
              1.346688
            ],
            [
              103.647423,
              1.346774
            ],
            [
              103.647509,
              1.346817
            ],
            [
              103.647552,
              1.346946
            ],
            [
              103.647637,
              1.347031
            ],
            [
              103.647594,
              1.347246
            ],
            [
              103.647466,
              1.347289
            ],
            [
              103.647423,
              1.347375
            ],
            [
              103.647294,
              1.347418
            ],
            [
              103.647251,
              1.347503
            ],
            [
              103.647122,
              1.347546
            ],
            [
              103.647037,
              1.347632
            ],
            [
              103.646908,
              1.347675
            ],
            [
              103.646822,
              1.347761
            ],
            [
              103.646736,
              1.347761
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 1.3461081,
      "matchedAssetCentroidLongitude": 103.6461682
    },
    {
      "projectId": "SGP-S-ASEAN-004",
      "projectName": "Sembcorp Tengeh Floating Solar Farm",
      "countryCode": "SGP",
      "countryName": "Singapore",
      "technology": "solar",
      "claimedCapacityMw": 60.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Tengeh Reservoir",
      "provinceStateRegion": "Singapore",
      "latitude": 1.3364,
      "longitude": 103.636,
      "sourcePrimaryUrl": "https://www.pub.gov.sg/public/Publications/Press-Releases/2021/Singapore-Unveils-One-of-the-World-Largest-Floating-Solar-Farms",
      "sourcePrimaryType": "Utility Press Release",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 1.75,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2018 Q3",
      "matchConfidence": 0.7475,
      "distanceKm": 1.544,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": "GRW::SOLAR::SGP::solar_sea_2024q2_v1.geojson::5",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              103.638957,
              1.350556
            ],
            [
              103.640766,
              1.349908
            ],
            [
              103.64035,
              1.348748
            ],
            [
              103.638541,
              1.349396
            ],
            [
              103.638957,
              1.350556
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 1.3498328,
      "matchedAssetCentroidLongitude": 103.6395141
    },
    {
      "projectId": "THA-S-ASEAN-001",
      "projectName": "Bhumibol Dam FPV 1",
      "countryCode": "THA",
      "countryName": "Thailand",
      "technology": "solar",
      "claimedCapacityMw": 158.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Bhumibol Dam Sam Ngao District",
      "provinceStateRegion": "Tak",
      "latitude": 17.24,
      "longitude": 98.97,
      "sourcePrimaryUrl": "https://solarquarter.com/2025/03/31/thailand-energy-egat-advances-bhumibol-dam-floating-solar-project-with-158-mw-capacity/",
      "sourcePrimaryType": "Industry News",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "THA-S-ASEAN-002",
      "projectName": "Saeng Pat Phalangngan",
      "countryCode": "THA",
      "countryName": "Thailand",
      "technology": "solar",
      "claimedCapacityMw": 77.0,
      "claimedStatus": "operating",
      "claimedCod": null,
      "locationText": "Uttaradit",
      "provinceStateRegion": "Uttaradit",
      "latitude": 17.5696,
      "longitude": 99.9402,
      "sourcePrimaryUrl": "https://www.findevcanada.ca/sites/default/files/2025-01/Solar%20and%20Solar%20BESS%20site%20information.pdf",
      "sourcePrimaryType": "Financing Document",
      "sourceConfidence": "high",
      "dataQualityFlags": "Exact site point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "THA-S-ASEAN-003",
      "projectName": "Sri Nakarin Dam FPV 1",
      "countryCode": "THA",
      "countryName": "Thailand",
      "technology": "solar",
      "claimedCapacityMw": 140.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Srinagarind Dam Si Sawat District",
      "provinceStateRegion": "Kanchanaburi",
      "latitude": 14.4,
      "longitude": 99.1,
      "sourcePrimaryUrl": "https://taiyangnews.info/tenders/thailand-280-mw-ac-floating-solar-tender",
      "sourcePrimaryType": "Industry News",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "THA-S-ASEAN-004",
      "projectName": "Srinagarind Dam FPV 3",
      "countryCode": "THA",
      "countryName": "Thailand",
      "technology": "solar",
      "claimedCapacityMw": 280.0,
      "claimedStatus": "pre-construction",
      "claimedCod": null,
      "locationText": "Srinagarind Dam Si Sawat District",
      "provinceStateRegion": "Kanchanaburi",
      "latitude": 14.4,
      "longitude": 99.1,
      "sourcePrimaryUrl": "https://asian-power.com/news/thailand-seeks-bids-280-mwac-floating-solar-project",
      "sourcePrimaryType": "Industry News",
      "sourceConfidence": "high",
      "dataQualityFlags": "Reservoir representative point",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": null,
      "gridEvidenceReason": null,
      "gridContextScore": null,
      "gridMetadataScore": null,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": null,
      "directConnectedTransmissionCount": null,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "VNM-S-002",
      "projectName": "Dau Tieng Solar Power Complex",
      "countryCode": "VNM",
      "countryName": "Vietnam",
      "technology": "solar",
      "claimedCapacityMw": 350.0,
      "claimedStatus": "operating",
      "claimedCod": "2025-01-13",
      "locationText": "Suoi Da Commune, Duong Minh Chau District",
      "provinceStateRegion": "Tay Ninh",
      "latitude": 11.45169,
      "longitude": 106.2132,
      "sourcePrimaryUrl": "https://data.opendevelopmentmekong.net/dataset/16fdd64a-86a9-46f9-a794-c0ef25d810e9/resource/9640d37d-53ca-42fb-83a0-04de89228f1d/download/mekong-power-generation.xlsx",
      "sourcePrimaryType": "Technical Database",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point for multi-phase complex",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 224.29,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2018 Q4",
      "matchConfidence": 0.6975,
      "distanceKm": 2.068,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "2 direct connected substations within 2.5 km, 15 transmission lines, 7 credible substation-line bridges; max mapped voltage 220 kV.",
      "gridContextScore": 0.643,
      "gridMetadataScore": 0.705,
      "maxNearbyGridVoltageKv": 220.0,
      "nearestSiteSideGridDistanceKm": 2.519,
      "directConnectedSubstationCount": 2,
      "directConnectedTransmissionCount": 1,
      "matchedAssetSiteId": "GRW::SOLAR::VNM::solar_sea_2024q2_v1.geojson::653",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              106.215348,
              11.46787
            ],
            [
              106.214147,
              11.467155
            ],
            [
              106.215477,
              11.466524
            ],
            [
              106.216207,
              11.465767
            ],
            [
              106.21685,
              11.464926
            ],
            [
              106.217451,
              11.462528
            ],
            [
              106.221056,
              11.461309
            ],
            [
              106.221743,
              11.460468
            ],
            [
              106.222472,
              11.457944
            ],
            [
              106.223116,
              11.456514
            ],
            [
              106.222472,
              11.455547
            ],
            [
              106.221743,
              11.454832
            ],
            [
              106.221056,
              11.454074
            ],
            [
              106.220283,
              11.453233
            ],
            [
              106.220627,
              11.451509
            ],
            [
              106.221271,
              11.450499
            ],
            [
              106.222429,
              11.449742
            ],
            [
              106.223545,
              11.449111
            ],
            [
              106.227751,
              11.448564
            ],
            [
              106.228394,
              11.447891
            ],
            [
              106.22921,
              11.447134
            ],
            [
              106.230025,
              11.446083
            ],
            [
              106.230884,
              11.445368
            ],
            [
              106.231699,
              11.444653
            ],
            [
              106.231227,
              11.443727
            ],
            [
              106.233501,
              11.441204
            ],
            [
              106.237321,
              11.441246
            ],
            [
              106.244531,
              11.441372
            ],
            [
              106.245346,
              11.440489
            ],
            [
              106.24599,
              11.439647
            ],
            [
              106.246676,
              11.43868
            ],
            [
              106.247578,
              11.438007
            ],
            [
              106.250067,
              11.437334
            ],
            [
              106.2535,
              11.437586
            ],
            [
              106.253028,
              11.439269
            ],
            [
              106.252255,
              11.439942
            ],
            [
              106.251526,
              11.440657
            ],
            [
              106.250753,
              11.441414
            ],
            [
              106.25011,
              11.442087
            ],
            [
              106.24938,
              11.442802
            ],
            [
              106.248651,
              11.443433
            ],
            [
              106.247449,
              11.444064
            ],
            [
              106.246548,
              11.444863
            ],
            [
              106.246076,
              11.446041
            ],
            [
              106.245432,
              11.447345
            ],
            [
              106.244659,
              11.448018
            ],
            [
              106.242084,
              11.448396
            ],
            [
              106.241226,
              11.449027
            ],
            [
              106.240282,
              11.449658
            ],
            [
              106.23908,
              11.450289
            ],
            [
              106.237965,
              11.45092
            ],
            [
              106.236892,
              11.451551
            ],
            [
              106.235948,
              11.452224
            ],
            [
              106.235003,
              11.452855
            ],
            [
              106.233802,
              11.453486
            ],
            [
              106.232471,
              11.454201
            ],
            [
              106.231656,
              11.455
            ],
            [
              106.230884,
              11.456346
            ],
            [
              106.229939,
              11.457019
            ],
            [
              106.228867,
              11.457692
            ],
            [
              106.22818,
              11.458449
            ],
            [
              106.227493,
              11.45929
            ],
            [
              106.226635,
              11.459963
            ],
            [
              106.225691,
              11.460594
            ],
            [
              106.225004,
              11.461225
            ],
            [
              106.224189,
              11.462066
            ],
            [
              106.223202,
              11.462697
            ],
            [
              106.221614,
              11.463412
            ],
            [
              106.220369,
              11.464043
            ],
            [
              106.219468,
              11.464758
            ],
            [
              106.218824,
              11.465641
            ],
            [
              106.218095,
              11.46644
            ],
            [
              106.217194,
              11.467239
            ],
            [
              106.215348,
              11.46787
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 11.452089,
      "matchedAssetCentroidLongitude": 106.2321732
    },
    {
      "projectId": "VNM-W-001",
      "projectName": "Dien Bien 1 Wind Power Plant",
      "countryCode": "VNM",
      "countryName": "Vietnam",
      "technology": "wind",
      "claimedCapacityMw": 175.0,
      "claimedStatus": "announced",
      "claimedCod": "2025-2030",
      "locationText": "Dien Bien Province",
      "provinceStateRegion": "Dien Bien",
      "latitude": 21.386,
      "longitude": 103.018,
      "sourcePrimaryUrl": "https://bcgenergy.com.vn/en/projects",
      "sourcePrimaryType": "Developer Website",
      "sourceConfidence": "medium",
      "dataQualityFlags": "Representative point; specific commune/district details not public",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": "no_credible_grid_evidence",
      "gridEvidenceReason": "No transmission-grade substation-line topology found in the local free-source context layers.",
      "gridContextScore": 0.043,
      "gridMetadataScore": 0.0,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": 0,
      "directConnectedTransmissionCount": 0,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "VNM-S-004",
      "projectName": "Hoa Hoi Solar Power Plant",
      "countryCode": "VNM",
      "countryName": "Vietnam",
      "technology": "solar",
      "claimedCapacityMw": 214.0,
      "claimedStatus": "operating",
      "claimedCod": "2025-01-13",
      "locationText": "Hoa Hoi Commune, Phu Hoa District",
      "provinceStateRegion": "Phu Yen",
      "latitude": 13.0489,
      "longitude": 109.1558,
      "sourcePrimaryUrl": "https://www.adb.org/projects/53166-001/main",
      "sourcePrimaryType": "Multilateral Bank Database",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point for operational plant",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 0.68,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2021 Q1",
      "matchConfidence": 0.66,
      "distanceKm": 4.086,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "2 direct connected substations within 0.1 km, 45 transmission lines, 17 credible substation-line bridges; max mapped voltage 220 kV.",
      "gridContextScore": 0.837,
      "gridMetadataScore": 0.78,
      "maxNearbyGridVoltageKv": 220.0,
      "nearestSiteSideGridDistanceKm": 0.139,
      "directConnectedSubstationCount": 2,
      "directConnectedTransmissionCount": 3,
      "matchedAssetSiteId": "GRW::SOLAR::VNM::solar_sea_2024q2_v1.geojson::300",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              109.137454,
              13.080482
            ],
            [
              109.137411,
              13.080482
            ],
            [
              109.137411,
              13.08044
            ],
            [
              109.137368,
              13.08044
            ],
            [
              109.137368,
              13.080314
            ],
            [
              109.137325,
              13.080314
            ],
            [
              109.137325,
              13.080231
            ],
            [
              109.137282,
              13.080231
            ],
            [
              109.137282,
              13.080189
            ],
            [
              109.137068,
              13.080189
            ],
            [
              109.137068,
              13.080231
            ],
            [
              109.136982,
              13.080231
            ],
            [
              109.136982,
              13.080273
            ],
            [
              109.136896,
              13.080273
            ],
            [
              109.136896,
              13.080314
            ],
            [
              109.136853,
              13.080314
            ],
            [
              109.136853,
              13.080356
            ],
            [
              109.13681,
              13.080356
            ],
            [
              109.13681,
              13.080398
            ],
            [
              109.136853,
              13.080398
            ],
            [
              109.136853,
              13.08044
            ],
            [
              109.13681,
              13.08044
            ],
            [
              109.13681,
              13.080482
            ],
            [
              109.136724,
              13.080482
            ],
            [
              109.136724,
              13.080523
            ],
            [
              109.136682,
              13.080523
            ],
            [
              109.136682,
              13.080607
            ],
            [
              109.136724,
              13.080607
            ],
            [
              109.136724,
              13.080732
            ],
            [
              109.136767,
              13.080732
            ],
            [
              109.136767,
              13.080774
            ],
            [
              109.13681,
              13.080774
            ],
            [
              109.13681,
              13.0809
            ],
            [
              109.136853,
              13.0809
            ],
            [
              109.136853,
              13.080983
            ],
            [
              109.136896,
              13.080983
            ],
            [
              109.136896,
              13.08115
            ],
            [
              109.136939,
              13.08115
            ],
            [
              109.136939,
              13.081192
            ],
            [
              109.136982,
              13.081192
            ],
            [
              109.136982,
              13.081234
            ],
            [
              109.137111,
              13.081234
            ],
            [
              109.137111,
              13.081276
            ],
            [
              109.137197,
              13.081276
            ],
            [
              109.137197,
              13.081318
            ],
            [
              109.137239,
              13.081318
            ],
            [
              109.137239,
              13.081359
            ],
            [
              109.137282,
              13.081359
            ],
            [
              109.137282,
              13.081401
            ],
            [
              109.137325,
              13.081401
            ],
            [
              109.137325,
              13.081568
            ],
            [
              109.137368,
              13.081568
            ],
            [
              109.137368,
              13.08161
            ],
            [
              109.137411,
              13.08161
            ],
            [
              109.137411,
              13.081652
            ],
            [
              109.137497,
              13.081652
            ],
            [
              109.137497,
              13.08161
            ],
            [
              109.13754,
              13.08161
            ],
            [
              109.13754,
              13.081568
            ],
            [
              109.137669,
              13.081568
            ],
            [
              109.137669,
              13.081527
            ],
            [
              109.137754,
              13.081527
            ],
            [
              109.137754,
              13.081485
            ],
            [
              109.137797,
              13.081485
            ],
            [
              109.137797,
              13.081443
            ],
            [
              109.13784,
              13.081443
            ],
            [
              109.13784,
              13.081234
            ],
            [
              109.137797,
              13.081234
            ],
            [
              109.137797,
              13.08115
            ],
            [
              109.137754,
              13.08115
            ],
            [
              109.137754,
              13.081067
            ],
            [
              109.137712,
              13.081067
            ],
            [
              109.137712,
              13.080983
            ],
            [
              109.137669,
              13.080983
            ],
            [
              109.137669,
              13.080858
            ],
            [
              109.137626,
              13.080858
            ],
            [
              109.137626,
              13.080732
            ],
            [
              109.137583,
              13.080732
            ],
            [
              109.137583,
              13.080649
            ],
            [
              109.13754,
              13.080649
            ],
            [
              109.13754,
              13.080565
            ],
            [
              109.137497,
              13.080565
            ],
            [
              109.137497,
              13.080523
            ],
            [
              109.137454,
              13.080523
            ],
            [
              109.137454,
              13.080482
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 13.0808956,
      "matchedAssetCentroidLongitude": 109.1372571
    },
    {
      "projectId": "VNM-W-002",
      "projectName": "Nam Bung Wind Power Plant",
      "countryCode": "VNM",
      "countryName": "Vietnam",
      "technology": "wind",
      "claimedCapacityMw": 200.0,
      "claimedStatus": "announced",
      "claimedCod": null,
      "locationText": "Nam Bung and Nam Lan Communes, Van Chan District",
      "provinceStateRegion": "Yen Bai",
      "latitude": 21.735,
      "longitude": 104.281,
      "sourcePrimaryUrl": "https://yenbai.gov.vn/",
      "sourcePrimaryType": "Provincial Planning Document",
      "sourceConfidence": "high",
      "dataQualityFlags": "Representative point; exact turbine layouts not public",
      "paperToPowerLabel": "claimed_not_observed",
      "observedCapacityMw": null,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": null,
      "matchConfidence": null,
      "distanceKm": null,
      "gridEvidenceClass": "no_credible_grid_evidence",
      "gridEvidenceReason": "No transmission-grade substation-line topology found in the local free-source context layers.",
      "gridContextScore": 0.043,
      "gridMetadataScore": 0.0,
      "maxNearbyGridVoltageKv": null,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": 0,
      "directConnectedTransmissionCount": 0,
      "matchedAssetSiteId": null,
      "matchedAssetGeometry": null,
      "matchedAssetCentroidLatitude": null,
      "matchedAssetCentroidLongitude": null
    },
    {
      "projectId": "VNM-S-001",
      "projectName": "Trungnam Solar Farm (Thuan Bac)",
      "countryCode": "VNM",
      "countryName": "Vietnam",
      "technology": "solar",
      "claimedCapacityMw": 204.0,
      "claimedStatus": "operating",
      "claimedCod": "2025-01-13",
      "locationText": "Phuoc Minh Commune, Thuan Bac District",
      "provinceStateRegion": "Ninh Thuan",
      "latitude": 11.68597,
      "longitude": 109.0268,
      "sourcePrimaryUrl": "https://data.opendevelopmentmekong.net/dataset/16fdd64a-86a9-46f9-a794-c0ef25d810e9/resource/9640d37d-53ca-42fb-83a0-04de89228f1d/download/mekong-power-generation.xlsx",
      "sourcePrimaryType": "Technical Database",
      "sourceConfidence": "medium",
      "dataQualityFlags": "Representative point; project name ambiguity within Trung Nam portfolio",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 0.72,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2019 Q3",
      "matchConfidence": 0.66,
      "distanceKm": 0.408,
      "gridEvidenceClass": "transmission_grade_connected",
      "gridEvidenceReason": "2 direct connected substations within 0.1 km, 28 transmission lines, 34 credible substation-line bridges; max mapped voltage 220 kV.",
      "gridContextScore": 0.912,
      "gridMetadataScore": 0.94,
      "maxNearbyGridVoltageKv": 220.0,
      "nearestSiteSideGridDistanceKm": 0.115,
      "directConnectedSubstationCount": 2,
      "directConnectedTransmissionCount": 3,
      "matchedAssetSiteId": "GRW::SOLAR::VNM::solar_sea_2024q2_v1.geojson::270",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              109.02463,
              11.688885
            ],
            [
              109.024715,
              11.688885
            ],
            [
              109.024715,
              11.688927
            ],
            [
              109.024887,
              11.688927
            ],
            [
              109.024887,
              11.689011
            ],
            [
              109.024973,
              11.689011
            ],
            [
              109.024973,
              11.689053
            ],
            [
              109.025102,
              11.689053
            ],
            [
              109.025102,
              11.688927
            ],
            [
              109.025145,
              11.688927
            ],
            [
              109.025145,
              11.688885
            ],
            [
              109.025102,
              11.688885
            ],
            [
              109.025102,
              11.688843
            ],
            [
              109.025059,
              11.688843
            ],
            [
              109.025059,
              11.688801
            ],
            [
              109.025016,
              11.688801
            ],
            [
              109.025016,
              11.688717
            ],
            [
              109.024973,
              11.688717
            ],
            [
              109.024973,
              11.688675
            ],
            [
              109.02493,
              11.688675
            ],
            [
              109.02493,
              11.688633
            ],
            [
              109.024887,
              11.688633
            ],
            [
              109.024887,
              11.688591
            ],
            [
              109.024844,
              11.688591
            ],
            [
              109.024844,
              11.688549
            ],
            [
              109.024801,
              11.688549
            ],
            [
              109.024801,
              11.688507
            ],
            [
              109.024758,
              11.688507
            ],
            [
              109.024758,
              11.688423
            ],
            [
              109.024672,
              11.688423
            ],
            [
              109.024672,
              11.688339
            ],
            [
              109.024587,
              11.688339
            ],
            [
              109.024587,
              11.688297
            ],
            [
              109.024501,
              11.688297
            ],
            [
              109.024501,
              11.688255
            ],
            [
              109.024415,
              11.688255
            ],
            [
              109.024415,
              11.688297
            ],
            [
              109.024329,
              11.688297
            ],
            [
              109.024329,
              11.688339
            ],
            [
              109.024243,
              11.688339
            ],
            [
              109.024243,
              11.688381
            ],
            [
              109.024158,
              11.688381
            ],
            [
              109.024158,
              11.688423
            ],
            [
              109.024072,
              11.688423
            ],
            [
              109.024072,
              11.688465
            ],
            [
              109.023986,
              11.688465
            ],
            [
              109.023986,
              11.688507
            ],
            [
              109.023943,
              11.688507
            ],
            [
              109.023943,
              11.688591
            ],
            [
              109.0239,
              11.688591
            ],
            [
              109.0239,
              11.688675
            ],
            [
              109.023814,
              11.688675
            ],
            [
              109.023814,
              11.688717
            ],
            [
              109.023728,
              11.688717
            ],
            [
              109.023728,
              11.688759
            ],
            [
              109.023685,
              11.688759
            ],
            [
              109.023685,
              11.688843
            ],
            [
              109.023643,
              11.688843
            ],
            [
              109.023643,
              11.688885
            ],
            [
              109.0236,
              11.688885
            ],
            [
              109.0236,
              11.688927
            ],
            [
              109.023643,
              11.688927
            ],
            [
              109.023643,
              11.689011
            ],
            [
              109.0239,
              11.689011
            ],
            [
              109.0239,
              11.689053
            ],
            [
              109.023943,
              11.689053
            ],
            [
              109.023943,
              11.689095
            ],
            [
              109.0239,
              11.689095
            ],
            [
              109.0239,
              11.689179
            ],
            [
              109.023986,
              11.689179
            ],
            [
              109.023986,
              11.689221
            ],
            [
              109.024158,
              11.689221
            ],
            [
              109.024158,
              11.689263
            ],
            [
              109.024372,
              11.689263
            ],
            [
              109.024372,
              11.689305
            ],
            [
              109.024544,
              11.689305
            ],
            [
              109.024544,
              11.689347
            ],
            [
              109.024587,
              11.689347
            ],
            [
              109.024587,
              11.689389
            ],
            [
              109.02463,
              11.689389
            ],
            [
              109.02463,
              11.689431
            ],
            [
              109.024844,
              11.689431
            ],
            [
              109.024844,
              11.689389
            ],
            [
              109.024887,
              11.689389
            ],
            [
              109.024887,
              11.689179
            ],
            [
              109.024844,
              11.689179
            ],
            [
              109.024844,
              11.689137
            ],
            [
              109.024801,
              11.689137
            ],
            [
              109.024801,
              11.689095
            ],
            [
              109.024715,
              11.689095
            ],
            [
              109.024715,
              11.688969
            ],
            [
              109.02463,
              11.688969
            ],
            [
              109.02463,
              11.688885
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 11.6888307,
      "matchedAssetCentroidLongitude": 109.0244551
    },
    {
      "projectId": "VNM-S-003",
      "projectName": "Xuan Thien Ea Sup Solar Power Complex",
      "countryCode": "VNM",
      "countryName": "Vietnam",
      "technology": "solar",
      "claimedCapacityMw": 600.0,
      "claimedStatus": "operating",
      "claimedCod": "2025-01-13",
      "locationText": "Ia Lop Commune, Ea Sup District",
      "provinceStateRegion": "Dak Lak",
      "latitude": 13.06619,
      "longitude": 107.88506,
      "sourcePrimaryUrl": "https://maps.apple.com/place?auid=921833422019915198",
      "sourcePrimaryType": "Reputable Map Database",
      "sourceConfidence": "medium",
      "dataQualityFlags": "Representative centroid for very large complex",
      "paperToPowerLabel": "observed_smaller_than_claimed",
      "observedCapacityMw": 1.94,
      "observedAssetCount": null,
      "observedFirstSeenQuarter": "2021 Q2",
      "matchConfidence": 0.66,
      "distanceKm": 2.16,
      "gridEvidenceClass": "power_infrastructure_nearby_but_ambiguous",
      "gridEvidenceReason": "max mapped voltage 500 kV; 0 substations, 5 transmission lines, 0 credible bridges, but no confirmed site-side connected candidate.",
      "gridContextScore": 0.069,
      "gridMetadataScore": 0.195,
      "maxNearbyGridVoltageKv": 500.0,
      "nearestSiteSideGridDistanceKm": null,
      "directConnectedSubstationCount": 0,
      "directConnectedTransmissionCount": 0,
      "matchedAssetSiteId": "GRW::SOLAR::VNM::solar_sea_2024q2_v1.geojson::231",
      "matchedAssetGeometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              107.891423,
              13.047414
            ],
            [
              107.891493,
              13.047538
            ],
            [
              107.891493,
              13.047539
            ],
            [
              107.891494,
              13.047539
            ],
            [
              107.892335,
              13.049029
            ],
            [
              107.892383,
              13.04917
            ],
            [
              107.892383,
              13.049259
            ],
            [
              107.892416,
              13.049541
            ],
            [
              107.892614,
              13.049651
            ],
            [
              107.892979,
              13.04941
            ],
            [
              107.893826,
              13.048595
            ],
            [
              107.89388,
              13.04835
            ],
            [
              107.893236,
              13.047759
            ],
            [
              107.892984,
              13.047832
            ],
            [
              107.892968,
              13.047911
            ],
            [
              107.892539,
              13.048041
            ],
            [
              107.892056,
              13.047362
            ],
            [
              107.891868,
              13.047168
            ],
            [
              107.891675,
              13.047247
            ],
            [
              107.891536,
              13.047247
            ],
            [
              107.891536,
              13.047303
            ],
            [
              107.891482,
              13.047325
            ],
            [
              107.891423,
              13.047414
            ]
          ]
        ]
      },
      "matchedAssetCentroidLatitude": 13.0480715,
      "matchedAssetCentroidLongitude": 107.8922619
    }
  ]
} as const satisfies {
  featureCards: readonly FeatureCard[]
  countrySummaries: readonly CountrySummary[]
  regionalLinks: readonly RegionalLink[]
  evidenceRows: readonly EvidenceRow[]
  caseStudies: readonly CaseStudy[]
  publicSources: readonly PublicSource[]
  registryMapProjects: readonly RegistryMapProject[]
}

export const featureCards = dataset.featureCards
export const countrySummaries = dataset.countrySummaries
export const regionalLinks = dataset.regionalLinks
export const evidenceRows = dataset.evidenceRows
export const caseStudies = dataset.caseStudies
export const publicSources = dataset.publicSources
export const registryMapProjects = dataset.registryMapProjects
