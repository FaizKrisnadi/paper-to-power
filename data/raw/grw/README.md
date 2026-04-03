# GRW Raw Files

Drop Global Renewables Watch GeoJSON exports here.

Expected examples:

- solar feature export
- wind feature export

Current ingestion rules:

- GeoJSON only
- file name must contain `solar` or `wind`
- records are filtered to Indonesia, Philippines, Singapore, Vietnam, and Malaysia

Run:

```bash
npm run ingest:grw
```
