Portfolio asset provenance
==========================

- `public/images/story-walkman.png`: imagegen edit of the photograph supplied by Christopher Kim. Blue and silver body, orange headphones, and original composition preserved; SONY changed to STORY and the glass emptied for the interactive cassette. The application clips the photograph to the product silhouette.
- `public/images/cassette.png`: imagegen-created photographic cassette with a blank label. Company name and logo are live HTML over a bold company-colored paper label; the hubs rotate and the entire cassette changes on navigation.
- `public/images/databricks-logo.svg`: Simple Icons / react-icons, SiDatabricks.
- `public/images/amazon-logo.svg`: Font Awesome / react-icons, FaAmazon.
- `public/images/mercor-logo.svg`: https://www.mercor.com/images/m_logo.svg
- `public/images/fidelity-logo.ico`: https://digital.fidelity.com/ctgw/digital/prelogin/assets/favicon.ico
- `public/Christopher-Kim-Resume.pdf`: supplied by Christopher Kim.

The cassette source is 1536 × 1024 pixels. Shelf tapes render at full opacity without rotation, and labels remain live vector text/logo elements. A requested higher-resolution imagegen edit returned the same dimensions with a baked background, so it was not substituted for the cleaner original. The shelf detail view shows the original at a larger scale without stretching its pixels.

Company marks identify the organizations listed in the portfolio. Source icon licenses remain available in the installed react-icons package.

Local development uses the existing pnpm workspace. Build the portfolio with `pnpm --filter @workspace/personal-site build`. Run TypeScript checks with `pnpm --filter @workspace/personal-site typecheck` and the navigation tests with `node --test artifacts/personal-site/src/lib/player.test.ts` from the repository root (Node 24).
