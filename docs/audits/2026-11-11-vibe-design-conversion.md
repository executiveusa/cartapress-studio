# CartaPress Studio — Vibe Engineering Seven-Lens / Subtraction Audit

**Candidate:** PR #4, `feat/mx-localization-conversion-audit`  
**Baseline:** production main at `62dd1d3b6d431a25a0387402c762da65fcbbb818`  
**Mode:** brownfield; source and prior hero preserved.  
**Outcome:** a restaurant owner understands the offer within seconds and can make a useful menu draft without deciphering an AI workflow.  
**Audiences:** independent restaurant owners in English and Mexican Spanish; local/remote agents using documented interfaces.  
**Commercial goal:** qualified paid service requests, not website visits or download counts.  
**Current production:** https://cartapress-studio.vercel.app  
**Candidate preview:** GitHub PR #4 Vercel preview at matching SHA.  
**Content treatment:** rewrite with owner-delegated creative authority; preserve truthful business claims, price tiers, brand, export capabilities and attribution.  
**Proof standard:** checks + exact preview SSR/API + viewport/interaction inspection + separate reviewer + deployed confirmation.

## Audited against actual upstream standards

- `executiveusa/vibe-engineering/DESIGN.md`: intent, anti-default, clarity, premium-but-not-theater, proof.
- `docs/workflow-locker/ICM-DESIGN-SEVEN-LENS-PROMPT.md`: seven lenses, independent critique, target task.
- `factory/icm/template/shared/HEART_AND_SOUL_STANDARD.md`: progressive capability and owner control.
- `factory/icm/template/shared/NO_SLOP_STANDARD.md`: copy, UI, business and production truth.
- `factory/icm/template/shared/SUBTRACTION_GAUNTLET_STANDARD.md`: KEEP, MERGE, INFER, DEFER, MOVE, REMOVE.
- `docs/VIBE-SCORE.md`: six scored domains, 8.5 release threshold.
- User-supplied `website trust audit`, `MISSION_MOBILE_POLISH_V2`, `Landing Page Director`, `ELI5`, and `art-of-reduction` skill.

## Project truth and conversion contract

**The offer:** menu-design production for restaurants, with browser draft exports and a separate done-for-you fixed-scope service. Source catalog of 190 reference designs, five original visual directions and a local approval-gated MCP.  
**Never claim:** any actual paying customers, a "most popular" package, printer partnerships, successful client orders, a connected payment checkout, exact revenue uplift or an autonomous agent handling Upwork orders. None is verified.

**Primary visitor journey:** See photographed menus → understand example input/output → choose or explore style → try actual menu editor → receive draft export → request done-for-you service once intake/checkout is connected.  
**Current completed conversion:** draft export. **Commercial conversion:** NOT CONNECTED.  
**Agent journey:** GET `/api/capabilities` → inspect `/api/catalog` → optionally generate PDF proof via documented public-demo endpoint → for private projects use local stdio MCP with approval and isolated records. Do not publish unauthenticated MCP over HTTP.

## Seven lenses — findings, dispositions and proof

| Lens | Before | Repair in PR #4 | Remaining proof / gap |
|---|---|---|---|
| Human outcome | Marketing language preceded task; pain not explicit | Hero copy names stale prices, outdated look, time; CTA creates real draft | Real-owner task completion unobserved |
| Information/hierarchy | Ticker, gallery, editor, prices and print all compete | Decorative ticker replaced with before→after visual; one hero primary action | Page is still long; compare mobile scan with screenshots |
| Interaction/journey | Printer/QR controls exposed on first visit | Defer settings in native `details`; editor stays available; original approval gates untouched | No lead delivery or checkout; P1 for paid-offer funnel |
| Visual identity | Existing fal.ai photographic hero was strong | Retained hero; added physical menu specimen vs plain dish list (explicitly fictional) | No device screenshot comparison or real owner usability |
| Motion/emotion | Decorative ticker occupied attention | No new motion/dependency; native page scroll preserved | Reduced-motion browser proof outstanding |
| Responsive/accessibility | Small fixed metadata type and 320px unknown | Spanish SSR `lang=es-MX`, direct /es route, mobile form font floor; locale tap links | Keyboard and 320/360/375/390/430 viewport evidence outstanding |
| Trust/proof/ownership | "MOST REQUESTED", "POPULAR CHOICE" unsupported; package buttons looked transactional | Replaced popularity language with factual options; clarified no checkout; versioned source and rollback | License/rights handoff and printer color proof require contract + provider |

## Subtraction gauntlet ledger

- **KEEP:** original full-bleed fal.ai hero; actual SVG/PDF/HTML exports; five distinct original styles; 190 attributed references with artist links; language switch; price validation; print preflight and export warning; existing three package prices.
- **MERGE:** text-only "how it works" repeated after product with first visual demonstration; two hero action concepts resolved as primary draft and secondary inspiration gallery.
- **INFER:** default MX$ / Mexican example and printer region on `/es`; default USD and English sample on `/`.
- **DEFER:** print quantity, currency overrides, QR and optional email hidden inside discoverable native details; not deleted.
- **MOVE:** internal MCP operations and agent schemas into public, read-only `/api/capabilities` and `plugins/` documents; do not force restaurant owners to read agent instructions.
- **REMOVE:** decorative ticker/marquee; source-platform filter that added a decision; unproven package popularity claims; repeated, unhelpful "AI" wording.
- **Protected stopping quality:** do not reduce away prices, allergens, attribution, print limitations, failed download errors, approval signatures, ownership or editing controls.

## UI trust violations and severity

| Priority | Violation | Status |
|---|---|---|
| P1 commercial | Service package selected but no real payment or delivered inquiry | OPEN; honestly described on page |
| P1 verification | No complete multi-viewport browser/keyboard/reduced-motion run with screenshots and console | OPEN; do not claim mobile verified |
| P1 localization | Earlier Spanish route had English sample menu, styles and status messages | Addressed for major visible items; runtime messages need follow-up review |
| P2 copy | Unsupported "MOST REQUESTED" / "POPULAR CHOICE" | FIXED in branch |
| P2 hierarchy | Repeated steps and decorative ticker | Ticker removed, one tangible before→after sample |
| P2 usability | Printer options arrived before first preview | Deferred inside optional details |
| P2 product trust | Default example could look like real client work | Example labeled fictional |
| P2 plug-ins | ChatGPT plugin only known private; Claude only local package | Test manifests and real stdio `tools/list`; no public store claims |

## Evidence verified

- `/es` preview: HTTP 200, `<html lang="es-MX">`, localized title/description and alternate/canonical; Mexican example with MX$ prices.
- `/` preview: HTTP 200, English SSR metadata.
- `/api/catalog`: HTTP 200, 190 reference records at inspection time (remote CDN image-by-image visual rendering not all tested).
- `/api/capabilities`: HTTP 200, machine-readable API description and explicit no-checkout limitation.
- CI: `npm test`, `npm run check`, `npm run build` must pass on final head; intermediate pass is insufficient.
- ChatGPT: private plugin `plugins_6af48e6785b081919df82d60a1267132` exists, version 0.1.0; public listing and action execution not proven.
- Claude: skill + stdio config in repo; `tests/integrations.test.mjs` connects MCP client and queries live tools/catalog during CI. Does **not** prove Claude Desktop is installed or connected on an owner's device.

## Provisional Vibe score — not independent sign-off

Clarity 8.0; Reliability 7.5; Security 7.0; Maintainability 8.0; Taste 8.0; Ownership 8.5. Average **7.83/10** (provisional desk review, not measured UX). Threshold 8.5; actual independent design council and mobile/browser proof still required. **Review disposition: HOLD FOR FULL DESIGN CERTIFICATION**. This does not prohibit using the reviewed preview to collect feedback.

## Rollback

Revert the final PR #4 squash commit to restore prior production `62dd1d3b6d431a25a0387402c762da65fcbbb818` without altering the menu engine or MCP data. Vercel retains prior ready production deployment `dpl_CuhjpLemN5sFHVBtdUrVbD7cbvbL`.

## Next hardest truth

The site can demonstrate the product but does not yet take real paid orders. The highest-value next bounded slice is a verified lead/checkout handoff to an owner-controlled destination. Do not invent a contact or marketplace listing link.
