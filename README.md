# CartaPress Studio

**An original SvelteKit menu-design app and agent-ready service operation.**

A service-first restaurant menu business: curate 190 credited visual references, help clients choose a direction, create an original draft from real menu content, and deliver editable files, PDF proofs and a print handoff. A local stdio MCP server automates the repetitive work without claiming to have obtained client approval, printed products or marketplace accounts.

## What works in source

- SvelteKit + Svelte 5 source for a responsive studio; category/search/source filtering and horizontal style reference carousel.
- Remote, explicitly attributed inspiration feed of 190 Dribbble/Behance/Canva cards from [franlopz/menu-inspiration](https://github.com/franlopz/menu-inspiration); no original files redistributed. Card links point to the originating designers.
- Five original design palettes, with editable restaurant facts and source-preserving prices; accepts the MenuVision structured JSON contract (secondary names, allergen codes, variants) as an alternative to pipe-separated text.
- A4 / US Letter SVG pages, vector RGB PDF proof with 3mm bleed and crop marks, 300dpi PNG, editable JSON, a portable searchable digital HTML menu, and a combined ZIP; optional QR SVG for a restaurant-owned public HTTPS URL.
- Three proposed service packages and printer handoff links. Actual subscriptions/referrals/orders are **not** connected.
- Local MCP tools for draft creation, validation, proof preview with immutable content fingerprint, correction, explicit approval evidence and file export; private on-disk workspaces.
- 13 passing offline Node tests (`npm test`) and browser-tested standalone digital sample at 1320px desktop and 390px mobile (`python tests/browser_smoke.py`).

**Not yet verified:** `npm install` (network DNS unavailable in local runtime), Svelte compiler/type checking, full Svelte browser run, the server PDF renderer, ZIP/QR flow, actual printer preflight, live upstream image loading, live deployment, GitHub upload (Composio GitHub connection returned 401), first marketplace listing, referrals, and payment. The execution environment used to build this archive has no outbound npm or GitHub source network. These are release gates, not accomplishments.

## Develop

```bash
npm install
npm run dev
# http://localhost:5173
npm test
npm run check
npm run build
```

Node.js 20.19+. Cloud installation needs outbound access to npm and GitHub. `npm run catalog:sync` creates `src/lib/catalog.snapshot.json` containing *links only* as an optional offline metadata snapshot. No image files or artwork are copied. The app currently loads upstream catalog via `/api/catalog` with a 1-hour server cache; if the upstream format or CDN access changes, a warning and source link appear.

## Run the local MCP

```bash
npm run mcp
```

Copy and adapt `mcp/claude-desktop-config.example.json` for Hermes, Claude Desktop, Paperclip, or any stdio MCP client that supports tool discovery. Set `CARTAPRESS_PROJECTS_DIR` to a private directory. Never expose the MCP over the internet without adding authentication, authorization, rate limits and structured audit logging. Design exports are gated behind an approval record; the app's self-service demo exports are not production sign-off.

Agent lifecycle: `cartapress_catalog` → `cartapress_create_brief` → `cartapress_validate` → `cartapress_preview` (returns content SHA256) → `cartapress_update_menu` (if necessary; invalidates approval) → independent proof and real client sign-off → `cartapress_approve` (matching preview hash) → `cartapress_export`. Printer colors/dimensions must be independently proofed.

## Export limitations

A4 and US Letter support with multi-column dynamic pagination: all items are carried to pages, not silently clipped. Vector SVG uses platform fonts and can be edited, but may need font substitution at a printer. PDF uses standard built-in PDF fonts and RGB fills, not an ICC-managed CMYK print file. It includes 3mm bleed/crop marks, but should be called a **print proof**, not a certified press-ready production file. Imported client logos, auto-layout overflow detection, image rights management, multi-format layout, e-commerce, marketplace APIs, and automated print ordering are future releases.

## Commercial positioning

Sell the **service**, not a generic AI tool: original custom typography, price and spelling checks, editable handoff, and print coordination. Full 30-day operating plan, marketplace drafts, QA gates, dependencies and revenue assumptions are in `docs/GO_TO_MARKET.md` and `docs/MARKETPLACE_GIGS.md`.

## Intellectual property

The CartaPress source is a new implementation; it does not copy code from the inspiration repo or other menu tools. This private-business starter intentionally has no blanket open-source license for its own code until the owner chooses a license. Every source artist retains their rights to their artwork; catalog references alone do not grant printing, resale, adaptation or portfolio rights. Do not use borrowed menu designs as actual deliverables or past-work samples.

## Verification snapshots

`marketplace/samples/` contains three fictional (not actual client) original menu concepts in editable SVG, PNG and portable HTML: Mar y Maíz, Oak & Ember and Little Fig Café. `demo-menu.html`, `demo-menu.png`, and `demo-digital-mobile.png` are functional design/proof examples. The HTML sample has been exercised in desktop and mobile Chromium. PDF and full SvelteKit tests remain pending until dependencies can be installed.

## AutoOps production worker (added 2026-11-11)

`npm run ops:once` processes private marketplace order intake into validation reports and **unapproved draft proofs**. `npm run ops:loop` repeats every 15 minutes when run as a supervised process. The engine uses no marketplace API credentials, is idempotent by payload, preserves previous revisions, and produces a private audit log. It never sends messages, processes payments, issues client approval, places print orders or claims a marketplace purchase. Real connected business operations require verified platform access and customer permission. See [ops/README.md](ops/README.md) and [agents/AUTOOPS_CONTROLLER.md](agents/AUTOOPS_CONTROLLER.md).

Run `npm run ops:smoke` for private queue checks. The unit suite now contains **16** tests. The sample systemd service is configuration only; it has not been installed on a VPS.

## GitHub publishing status

As of 2026-11-11 the available GitHub integration can modify existing accessible repos but cannot create a repository. The separate Composio GitHub OAuth account returned HTTP 401 on create. Consequently, the source is delivered as a Git-ready ZIP, not as a live GitHub repository or merged PR. Do not represent this archive as deployed or the service as running unattended.
