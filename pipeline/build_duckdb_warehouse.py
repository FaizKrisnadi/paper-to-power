from __future__ import annotations

from pathlib import Path

from .geospatial_runtime import ensure_modules

ROOT = Path(__file__).resolve().parent.parent
GEOSPATIAL_DIR = ROOT / "data" / "processed" / "geospatial"
WAREHOUSE_PATH = GEOSPATIAL_DIR / "paper_to_power.duckdb"


def parquet_path(name: str) -> str:
    return str((GEOSPATIAL_DIR / f"{name}.parquet").resolve())


def has_column(con, relation: str, column_name: str) -> bool:
    rows = con.execute(f"DESCRIBE SELECT * FROM {relation}").fetchall()
    return any(row[0] == column_name for row in rows)


def main() -> None:
    ensure_modules(["duckdb"], module_name="pipeline.build_duckdb_warehouse")

    import duckdb

    GEOSPATIAL_DIR.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(WAREHOUSE_PATH))
    con.execute("INSTALL spatial")
    con.execute("LOAD spatial")
    con.execute("CREATE SCHEMA IF NOT EXISTS core")
    con.execute("CREATE SCHEMA IF NOT EXISTS marts")

    core_layers = {
        "project_registry_points": parquet_path("project_registry_points"),
        "observed_assets": parquet_path("observed_assets"),
        "matched_projects": parquet_path("matched_projects"),
        "matched_assets": parquet_path("matched_assets"),
        "match_links": parquet_path("match_links"),
        "context_roads": parquet_path("context_roads"),
        "context_settlements": parquet_path("context_settlements"),
        "context_substations": parquet_path("context_substations"),
        "context_transmission": parquet_path("context_transmission"),
        "context_landuse": parquet_path("context_landuse"),
        "site_context_features": parquet_path("site_context_features"),
        "context_graph_nodes": parquet_path("context_graph_nodes"),
        "context_graph_edges": parquet_path("context_graph_edges"),
    }

    for table_name, path in core_layers.items():
        if not Path(path).exists():
            continue
        con.execute(
            f"""
            CREATE OR REPLACE VIEW core.{table_name} AS
            SELECT * FROM read_parquet('{path}');
            """
        )

    if Path(core_layers["site_context_features"]).exists():
        context_score_expr = (
            "contextScore" if has_column(con, "core.site_context_features", "contextScore") else "NULL"
        )
        partial_context_expr = (
            "partialContextScore"
            if has_column(con, "core.site_context_features", "partialContextScore")
            else "NULL"
        )
        road_expr = "roadAccessScore" if has_column(con, "core.site_context_features", "roadAccessScore") else "NULL"
        settlement_expr = (
            "settlementProximityScore"
            if has_column(con, "core.site_context_features", "settlementProximityScore")
            else "NULL"
        )
        landuse_expr = (
            "landUseAdjacencyScore"
            if has_column(con, "core.site_context_features", "landUseAdjacencyScore")
            else "NULL"
        )
        substation_expr = (
            "substationAccessScore"
            if has_column(con, "core.site_context_features", "substationAccessScore")
            else "NULL"
        )
        transmission_expr = (
            "transmissionProxyScore"
            if has_column(con, "core.site_context_features", "transmissionProxyScore")
            else "NULL"
        )
        proximity_context_expr = (
            "proximityContextScore"
            if has_column(con, "core.site_context_features", "proximityContextScore")
            else "NULL"
        )
        graph_context_version_expr = (
            "graphContextScoreVersion"
            if has_column(con, "core.site_context_features", "graphContextScoreVersion")
            else "NULL"
        )
        graph_context_expr = (
            "graphContextScore"
            if has_column(con, "core.site_context_features", "graphContextScore")
            else "NULL"
        )
        graph_node_expr = "graphNodeCount" if has_column(con, "core.site_context_features", "graphNodeCount") else "NULL"
        graph_edge_expr = "graphEdgeCount" if has_column(con, "core.site_context_features", "graphEdgeCount") else "NULL"
        connected_substation_expr = (
            "connectedSubstationCount30km"
            if has_column(con, "core.site_context_features", "connectedSubstationCount30km")
            else "NULL"
        )
        connected_transmission_expr = (
            "connectedTransmissionCount20km"
            if has_column(con, "core.site_context_features", "connectedTransmissionCount20km")
            else "NULL"
        )
        grid_candidate_expr = (
            "gridConnectionCandidateCount"
            if has_column(con, "core.site_context_features", "gridConnectionCandidateCount")
            else "NULL"
        )
        connected_grid_expr = (
            "hasConnectedGridCandidate"
            if has_column(con, "core.site_context_features", "hasConnectedGridCandidate")
            else "NULL"
        )
        road_settlement_expr = (
            "roadSettlementSupportFlag"
            if has_column(con, "core.site_context_features", "roadSettlementSupportFlag")
            else "NULL"
        )
        graph_path_expr = (
            "graphGridPathSteps"
            if has_column(con, "core.site_context_features", "graphGridPathSteps")
            else "NULL"
        )
        connected_substation_distance_expr = (
            "nearestConnectedSubstationDistanceKm"
            if has_column(con, "core.site_context_features", "nearestConnectedSubstationDistanceKm")
            else "NULL"
        )
        bridge_count_expr = (
            "substationTransmissionBridgeCount"
            if has_column(con, "core.site_context_features", "substationTransmissionBridgeCount")
            else "NULL"
        )
        metadata_rich_substation_expr = (
            "metadataRichSubstationCount30km"
            if has_column(con, "core.site_context_features", "metadataRichSubstationCount30km")
            else "NULL"
        )
        direct_connected_substation_expr = (
            "directConnectedSubstationCount"
            if has_column(con, "core.site_context_features", "directConnectedSubstationCount")
            else "NULL"
        )
        direct_connected_transmission_expr = (
            "directConnectedTransmissionCount"
            if has_column(con, "core.site_context_features", "directConnectedTransmissionCount")
            else "NULL"
        )
        metadata_rich_transmission_expr = (
            "metadataRichTransmissionCount20km"
            if has_column(con, "core.site_context_features", "metadataRichTransmissionCount20km")
            else "NULL"
        )
        metadata_rich_bridge_expr = (
            "metadataRichBridgeCount"
            if has_column(con, "core.site_context_features", "metadataRichBridgeCount")
            else "NULL"
        )
        distribution_substation_expr = (
            "distributionSubstationCount30km"
            if has_column(con, "core.site_context_features", "distributionSubstationCount30km")
            else "NULL"
        )
        max_grid_voltage_expr = (
            "maxNearbyGridVoltageKv"
            if has_column(con, "core.site_context_features", "maxNearbyGridVoltageKv")
            else "NULL"
        )
        site_side_grid_distance_expr = (
            "nearestSiteSideGridDistanceKm"
            if has_column(con, "core.site_context_features", "nearestSiteSideGridDistanceKm")
            else "NULL"
        )
        grid_metadata_score_expr = (
            "gridMetadataScore"
            if has_column(con, "core.site_context_features", "gridMetadataScore")
            else "NULL"
        )
        grid_evidence_class_expr = (
            "gridEvidenceClass"
            if has_column(con, "core.site_context_features", "gridEvidenceClass")
            else "NULL"
        )
        grid_evidence_reason_expr = (
            "gridEvidenceReason"
            if has_column(con, "core.site_context_features", "gridEvidenceReason")
            else "NULL"
        )
        con.execute(
            f"""
            CREATE OR REPLACE VIEW core.site_context_features_compat AS
            SELECT
              projectId,
              contextScoreVersion,
              {context_score_expr} AS contextScore,
              {partial_context_expr} AS partialContextScore,
              {proximity_context_expr} AS proximityContextScore,
              {graph_context_version_expr} AS graphContextScoreVersion,
              {graph_context_expr} AS graphContextScore,
              nearbyObservedAssetCount5km,
              nearbySameTechAssetCount5km,
              {road_expr} AS roadAccessScore,
              {settlement_expr} AS settlementProximityScore,
              {landuse_expr} AS landUseAdjacencyScore,
              {substation_expr} AS substationAccessScore,
              {transmission_expr} AS transmissionProxyScore,
              {graph_node_expr} AS graphNodeCount,
              {graph_edge_expr} AS graphEdgeCount,
              {connected_substation_expr} AS connectedSubstationCount30km,
              {connected_transmission_expr} AS connectedTransmissionCount20km,
              {grid_candidate_expr} AS gridConnectionCandidateCount,
              {connected_grid_expr} AS hasConnectedGridCandidate,
              {road_settlement_expr} AS roadSettlementSupportFlag,
              {graph_path_expr} AS graphGridPathSteps,
              {connected_substation_distance_expr} AS nearestConnectedSubstationDistanceKm,
              {bridge_count_expr} AS substationTransmissionBridgeCount,
              {direct_connected_substation_expr} AS directConnectedSubstationCount,
              {direct_connected_transmission_expr} AS directConnectedTransmissionCount,
              {metadata_rich_substation_expr} AS metadataRichSubstationCount30km,
              {metadata_rich_transmission_expr} AS metadataRichTransmissionCount20km,
              {metadata_rich_bridge_expr} AS metadataRichBridgeCount,
              {distribution_substation_expr} AS distributionSubstationCount30km,
              {max_grid_voltage_expr} AS maxNearbyGridVoltageKv,
              {site_side_grid_distance_expr} AS nearestSiteSideGridDistanceKm,
              {grid_metadata_score_expr} AS gridMetadataScore,
              {grid_evidence_class_expr} AS gridEvidenceClass,
              {grid_evidence_reason_expr} AS gridEvidenceReason
            FROM core.site_context_features;
            """
        )
    else:
        con.execute(
            """
            CREATE OR REPLACE VIEW core.site_context_features_compat AS
            SELECT
              NULL::VARCHAR AS projectId,
              NULL::VARCHAR AS contextScoreVersion,
              NULL::DOUBLE AS contextScore,
              NULL::DOUBLE AS partialContextScore,
              NULL::DOUBLE AS proximityContextScore,
              NULL::VARCHAR AS graphContextScoreVersion,
              NULL::DOUBLE AS graphContextScore,
              NULL::INTEGER AS nearbyObservedAssetCount5km,
              NULL::INTEGER AS nearbySameTechAssetCount5km,
              NULL::DOUBLE AS roadAccessScore,
              NULL::DOUBLE AS settlementProximityScore,
              NULL::DOUBLE AS landUseAdjacencyScore,
              NULL::DOUBLE AS substationAccessScore,
              NULL::DOUBLE AS transmissionProxyScore,
              NULL::INTEGER AS graphNodeCount,
              NULL::INTEGER AS graphEdgeCount,
              NULL::INTEGER AS connectedSubstationCount30km,
              NULL::INTEGER AS connectedTransmissionCount20km,
              NULL::INTEGER AS gridConnectionCandidateCount,
              NULL::BOOLEAN AS hasConnectedGridCandidate,
              NULL::INTEGER AS roadSettlementSupportFlag,
              NULL::INTEGER AS graphGridPathSteps,
              NULL::DOUBLE AS nearestConnectedSubstationDistanceKm,
              NULL::INTEGER AS substationTransmissionBridgeCount,
              NULL::INTEGER AS directConnectedSubstationCount,
              NULL::INTEGER AS directConnectedTransmissionCount,
              NULL::INTEGER AS metadataRichSubstationCount30km,
              NULL::INTEGER AS metadataRichTransmissionCount20km,
              NULL::INTEGER AS metadataRichBridgeCount,
              NULL::INTEGER AS distributionSubstationCount30km,
              NULL::DOUBLE AS maxNearbyGridVoltageKv,
              NULL::DOUBLE AS nearestSiteSideGridDistanceKm,
              NULL::DOUBLE AS gridMetadataScore,
              NULL::VARCHAR AS gridEvidenceClass,
              NULL::VARCHAR AS gridEvidenceReason
            WHERE FALSE;
            """
        )

    con.execute(
        """
        CREATE OR REPLACE VIEW marts.site_audit AS
        SELECT
          p.projectId,
          p.projectName,
          p.countryCode,
          p.technology,
          p.claimedCapacityMw,
          p.claimedStatus,
          p.claimedCod,
          mp.paperToPowerLabel,
          mp.matchConfidence,
          mp.distanceKm,
          ma.observedFirstSeenQuarter,
          ma.estimatedCapacityProxyMw AS observedCapacityProxyMw,
          sc.contextScoreVersion,
          sc.contextScore,
          sc.partialContextScore,
          sc.proximityContextScore,
          sc.graphContextScoreVersion,
          sc.graphContextScore,
          sc.nearbyObservedAssetCount5km,
          sc.nearbySameTechAssetCount5km,
          sc.roadAccessScore,
          sc.settlementProximityScore,
          sc.landUseAdjacencyScore,
          sc.substationAccessScore,
          sc.transmissionProxyScore,
          sc.graphNodeCount,
          sc.graphEdgeCount,
          sc.connectedSubstationCount30km,
          sc.connectedTransmissionCount20km,
          sc.gridConnectionCandidateCount,
          sc.hasConnectedGridCandidate,
          sc.roadSettlementSupportFlag,
          sc.graphGridPathSteps,
          sc.nearestConnectedSubstationDistanceKm,
          sc.substationTransmissionBridgeCount,
          sc.directConnectedSubstationCount,
          sc.directConnectedTransmissionCount,
          sc.metadataRichSubstationCount30km,
          sc.metadataRichTransmissionCount20km,
          sc.metadataRichBridgeCount,
          sc.distributionSubstationCount30km,
          sc.maxNearbyGridVoltageKv,
          sc.nearestSiteSideGridDistanceKm,
          sc.gridMetadataScore,
          sc.gridEvidenceClass,
          sc.gridEvidenceReason,
          p.geometry
        FROM core.project_registry_points AS p
        LEFT JOIN core.matched_projects AS mp USING (projectId)
        LEFT JOIN core.matched_assets AS ma USING (projectId)
        LEFT JOIN core.site_context_features_compat AS sc USING (projectId);
        """
    )

    con.execute(
        """
        CREATE OR REPLACE VIEW marts.country_summary AS
        SELECT
          countryCode,
          technology,
          COUNT(*) AS projectCount,
          SUM(CASE WHEN paperToPowerLabel = 'claimed_not_observed' THEN 1 ELSE 0 END) AS notObservedCount,
          SUM(CASE WHEN paperToPowerLabel = 'observed_on_schedule' THEN 1 ELSE 0 END) AS onScheduleCount,
          SUM(CASE WHEN paperToPowerLabel = 'observed_smaller_than_claimed' THEN 1 ELSE 0 END) AS smallerThanClaimedCount,
          AVG(matchConfidence) AS avgMatchConfidence,
          AVG(contextScore) AS avgContextScore,
          AVG(graphContextScore) AS avgGraphContextScore
        FROM marts.site_audit
        GROUP BY 1, 2
        ORDER BY 1, 2;
        """
    )

    con.close()
    print(f"Wrote {WAREHOUSE_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
