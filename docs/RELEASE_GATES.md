# Release gates — do not claim production until all are verified

## G0: local/offline source proof — PASSED (partial)
- 13 Node unit tests pass. Tests cover structured JSON, price preservation, HTML sanitization, dynamic pagination without item dropping and gallery URL allow-list.
- Standalone HTML browser smoke pass in Chromium for desktop 1320 and mobile 390, category filter, search, empty state and no horizontal overflow.
- Three original fictional sample menu assets generated, no reference artwork reused.

## G1: dependency and SvelteKit proof — BLOCKED
- Install dependencies, commit package-lock.json, run `npm ci`, `npm run check`, `npm run build`, and `npm test` in clean environment. This runtime DNS prevents npm registry access; don't call the source artifact deployable yet.
- Run full browser tests of the actual SvelteKit page, lazy gallery, editor, export button and QR link.
- Source version consistency: `npm ci` must pin the same versions CI and Vercel deploy.

## G2: catalog and rights — UNVERIFIED LIVE
- Test every one of the 190 attributions and source URLs (80 Dribbble, 84 Behance, 26 Canva).
- Confirm external CDNs permit hotlinked display. Reference imagery is not licensed for resale, printing or seller portfolio. If any source denies image reuse/hotlink, replace with approved thumbnail or placeholder, retaining credit links.

## G3: production delivery — BLOCKED
- Run `buildPDF()` server-side on 8, 25, 60, 100 item sets in A4 and Letter; compare each item and price with client-approved source; do not silently substitute unsupported fonts.
- Test QR generation, PNG 300dpi pixel count, ZIP unpack integrity, and client-proof approval hash against the exact revision.
- Preflight at an actual commercial printer for each paper/trim profile; run physical readability and bleed inspection. RGB PDF is not certified CMYK.
- Independent design/engineering review and explicit approval on first client production file.

## G4: publishing, payment and marketplace — BLOCKED
- Composio GitHub account returned HTTP 401 Bad Credentials on create and lookup. Reconnect GitHub via Composio, then create private `executiveusa/cartapress-studio`, push, run CI and deploy preview with Vercel. No repository creation claimed.
- Confirm domain and brand clearance before registering a domain. Verify public HTTPS path and every download directly, on mobile and desktop.
- Publish one original Fiverr gig and one Upwork catalog listing only through verified seller-owned accounts and within platform rules. No account impersonation, artificial reviews or off-platform payment links.
- Enroll in an affiliate program before adding tracked referral links or promising commissions.

## Rollback
- Preserve source archive, latest owner-approved content, and last known good deployment. On a failed check, block `main`, retain PR, revert only the isolated change; never mutate a live customer's approved menu without new approval.

## G5: business AutoOps (new isolated slice) — LOCAL PASS / EXTERNAL BLOCKED
- 16 Node tests pass, including 3 queue tests for idempotent processing, revision invalidation, malformed input, and no unapproved deliveries.
- Private inbox watcher, draft proof renderer, audit JSONL, daily status report and one-worker lock implemented. A sample systemd service and Hermes/Pi controller contract included.
- No real marketplace integration, payment verification, client messaging, VPS worker installation, live job monitoring, or independent QA agent verification has been established. These are **not** claims of fully unattended business operation.
- Onboarding requires platform-authorized order intake, verified receipt events, a qualified independent reviewer, seller-controlled secrets, a private persistent volume, and production testing including backups/restore.
