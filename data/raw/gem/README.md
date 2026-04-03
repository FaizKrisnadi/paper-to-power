# GEM Raw Files

Drop downloaded Global Energy Monitor tracker CSV exports here.

Expected examples:

- solar tracker CSV export
- wind tracker CSV export

Current ingestion rules:

- CSV only
- file name must contain `solar` or `wind`
- records are filtered to Indonesia, Philippines, Singapore, Vietnam, and Malaysia

Run:

```bash
npm run ingest:gem
```
