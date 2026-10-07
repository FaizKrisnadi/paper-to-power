from . import build_site_context,build_frontend_exports,export_geospatial_layers,build_duckdb_warehouse,export_site_audit,validate_release

def main():
    build_site_context.main()
    build_frontend_exports.main()
    export_geospatial_layers.main()
    build_duckdb_warehouse.main()
    export_site_audit.main()
    validate_release.main()
if __name__=='__main__':main()
