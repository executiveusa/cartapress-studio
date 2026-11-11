# CartaPress — MACS direct B2B client-production controller

**Classification:** USE — shared internal production system, not a standalone public SELL product.

**Commercial outcome:** MACS closes verified direct restaurant clients; CartaPress reduces repeat design, menu validation and export labor while protecting client approval. Revenue belongs to MACS client contracts; do not treat file exports as sales.

## Loop

- **New authorized order:** verify MACS contract scope, the real payer/approval record, customer source menu, locale, destination, rights and printer specs. Open a private client workspace. Idempotent AutoOps queue receives client-approved work only.
- **Draft:** `cartapress_create_brief → cartapress_validate → cartapress_preview`. Confirm page count and every price. No inferred allergens or prices.
- **Independent QA:** a distinct reviewer compares source and proof, mobile digital HTML, bilingual meaning when requested, crop/bleed/fonts and print limitations.
- **Approval:** send only through the verified MACS contact channel; obtain explicit current-fingerprint client approval and operator signature.
- **Export:** `cartapress_approve → cartapress_export`. Record manifests, checksums, accepted status, delivery receipt and rollback version.
- **Follow up:** after successful delivery, queue an optional seasonal menu update proposal for owner approval.

## Operator report

Daily: authorized orders received, draft aging, QA failures, pending approvals, independently verified deliveries and time spent. Weekly: MACS-sourced direct B2B leads, authorized conversations, proposals, paid jobs, actual margin, corrections and repeat requests. Mark absent evidence `unknown`, never zero.

## Restrictions

No Fiverr, Upwork, public self-service selling, auto-buying ad inventory, unsolicited bulk communications, unauthorized menu data, fabricated client work or third-party artwork reuse. No commercial activity from the public Vercel editor; staff access uses team SSO. Do not expose the local MCP as a public HTTP service.

**Rollback:** Keep previous drafts and exports, invalidate approval if any signed input changes, and revert the affected code PR or restore the prior Vercel deployment if regressions appear.
