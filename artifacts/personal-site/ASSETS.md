Portfolio asset provenance
==========================

- `public/images/story-walkman.png`: imagegen edit of the photograph supplied by Christopher Kim. Blue and silver body, orange headphones, and original composition preserved; SONY changed to STORY and the glass emptied for the interactive cassette. The application clips the photograph to the product silhouette.
- `public/images/cassette.png`: imagegen-created photographic cassette with a blank cream paper label. A CSS color blend recolors only the exposed middle stripe to each company's color, preserving the paper, housing, and photographic texture. Company name and monochrome logo are live HTML; the hubs rotate and the entire cassette changes on navigation.
- `public/images/databricks-logo.svg`: Simple Icons / react-icons, SiDatabricks.
- `public/images/amazon-logo.svg`: Font Awesome / react-icons, FaAmazon.
- `public/images/mercor-logo.svg`: https://www.mercor.com/images/m_logo.svg
- `public/images/fidelity-logo.ico`: https://digital.fidelity.com/ctgw/digital/prelogin/assets/favicon.ico
- `public/Christopher-Kim-Resume.pdf`: supplied by Christopher Kim.

The cassette source is 1536 × 1024 pixels. Shelf tapes render at full opacity without rotation, and labels remain live vector text/logo elements. A requested higher-resolution imagegen edit returned the same dimensions with a baked background, so it was not substituted for the cleaner original. The shelf detail view shows the original at a larger scale without stretching its pixels.

Company marks identify the organizations listed in the portfolio. Source icon licenses remain available in the installed react-icons package.

The four cassette lettering styles are self-hosted WOFF2 subsets from Google Fonts, limited to each company name (about 17 KB total): Barlow Condensed 700 for Databricks, Permanent Marker 400 for Mercor, Caveat 700 for Amazon, and Special Elite 400 for Fidelity. Each font's license is included beside it in `public/fonts/`. Sources: https://fonts.google.com/specimen/Barlow+Condensed, https://fonts.google.com/specimen/Permanent+Marker, https://fonts.google.com/specimen/Caveat, and https://fonts.google.com/specimen/Special+Elite. These subsets are for the fixed cassette labels only; additional lettering requires a new subset.

Local development uses the existing pnpm workspace. Build the portfolio with `pnpm --filter @workspace/personal-site build`. Run TypeScript checks with `pnpm --filter @workspace/personal-site typecheck` and the navigation tests with `node --test artifacts/personal-site/src/lib/player.test.ts` from the repository root (Node 24).
