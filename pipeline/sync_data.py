"""Deterministic local rebuild. Source fetching and research imports are explicit, separate commands."""
from . import refresh_registry, ingest_grw, match_projects, build_frontend_exports

def main():
    refresh_registry.main()
    ingest_grw.main()
    match_projects.main()
    build_frontend_exports.main()
if __name__=='__main__':main()
