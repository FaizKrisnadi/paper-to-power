# Cloudflare production deployment

The existing Cloudflare Pages project is `paper-to-power`, serving `energy.faizkrisnadi.com` and `paper-to-power.pages.dev`.

On 7 October 2026, the project was connected to `FaizKrisnadi/paper-to-power`. It previously had no Git connection and served a direct-upload release, so GitHub pushes could not update production.

## Saved production configuration

- Repository: `FaizKrisnadi/paper-to-power`
- Production branch: `main`
- Automatic deployments: enabled
- Build command: `npm run build:web`
- Build output directory: `dist`
- Root directory: repository root
- Build watch paths: `*`
- Build system: version 3

The Cloudflare GitHub app is restricted to this repository. Cloudflare's Git integration builds and deploys pushes without a separate GitHub Actions workflow.

`build:web` compiles the committed frontend data snapshot. Before pushing changes to research inputs, regenerate the data and run the documented local validation workflow. A successful frontend build alone does not validate new research claims.

Verify the deployed commit in Cloudflare's Deployments tab and check the custom domain's explorer and release manifest after deployment. The Pages deployment history retains earlier releases for rollback.
