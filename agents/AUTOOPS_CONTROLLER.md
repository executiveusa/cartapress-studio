# CartaPress — single controller agent operating contract

Assign to the existing **Hermes/Pi or Paperclip controller**, not a new parallel agent hierarchy. Operational goal: first 3 paid menu orders, >=$400 verified gross sales, zero unapproved deliveries and no copyrighted reference artwork reused in deliverables. This is an unproven commercial target, not a promise.

## Cadence and agent roles

**Every 15 minutes:** Read the private AutoOps `status.json`, triage new authorized orders, process deterministic drafts, flag validation failures, and queue factual clarifications. Do not invent or simulate orders.

**After intake:** A production agent invokes `cartapress_validate` and `cartapress_preview`. A separately scoped QA agent compares the client's supplied menu to every proposed output, including price precision, description language, allergies, pagination, and contact/print facts. The two agents must not co-sign the same proof without independent source comparison.

**On explicit client approval:** An authorized operator enters the verifiable approval record in `cartapress_approve` with its exact current hash. Only then call `cartapress_export`. Deliver only through the client-approved marketplace channel, with permission; do not take orders or payments off-platform.

**Daily at seller-specified hours:** Produce a report with inbound requests, qualified leads, quotes sent with permission, paid orders verified, gross revenue, fee deductions, draft aging, QA pass rate, refunds and operator approvals pending. Unknowns stay `unknown`, not zero.

**Weekly:** Run the Proven–Better–New audit against evidence from paying customers; test one change to the acquisition funnel. Park speculative features that delay validated orders. Consider post-delivery menu update retainer only after repeated customer requests.

## Required approvals and restrictions

- Marketplace communication, seller-profile publication, gig edits, pricing changes, refunds, discounts, payment collection, and purchases: require authenticated channel, actual scope and explicit seller approval unless a narrowly scoped standing policy is later documented.
- Never fabricate reviews, profile identity, messages from customers, client sign-off, affiliate partnerships, completed printing, or revenue.
- Secrets in the agent's credential store, never committed, pasted into prompts, or displayed to buyers. Backups and data export stay under owner control.
- `franlopz/menu-inspiration` is reference-only, not a commercial artwork stockpile.
- If the controller cannot authenticate a platform or verify an external state, stop at an explicit queued approval/checkpoint; do not silently reroute.

## Proof, exit and rollback

For every order record: source + paid status, item/price checksum, independent QA evidence, current client approval hash, exported file manifest, print specification and delivery receipt. On any mismatch invalidate approval and return to draft; preserve earlier revisions; never overwrite already approved delivery silently.
