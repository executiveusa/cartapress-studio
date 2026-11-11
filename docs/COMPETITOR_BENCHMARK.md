# CartaPress competition and proof plan — 2026-11-11

**Decision:** Sell a guided, original menu-design service; do not compete head-on with generic self-service menu tools before three paid orders validate demand.

| Alternative (source) | What exists | Where CartaPress is distinct now | What is **not** proven better |
|---|---|---|---|
| [PlateAI](https://github.com/arturayupov/PlateAI) (MIT) | AI copy, food images, two-column pagination, PDF, page composer | Curated 190-credit selection flow, staged client price approval, source SVG + portable HTML, explicit printer handoff | PlateAI already has richer layout and automated imagery; CartaPress server PDF untested |
| [MenuVision](https://github.com/ademczuk/MenuVision) (MIT) | Agent skill for PDF/photo/URL extraction and mobile HTML, bilingual fields, variants, allergen info | CartaPress accepts structured JSON and adds branded print proof + source vector + gig fulfillment workflow | Extraction from photos/PDF not integrated yet; no image-generation service |
| [Biztro](https://github.com/dkast/biztro) | Multitenant QR menu, editing, localization, sales tools | Focused human-accountable done-for-you menu deliveries without forcing restaurant SaaS adoption | Biztro is broader and further along in digital menu management |
| [MustHaveMenus](https://www.musthavemenus.com/content/affiliate) | Menu templates, digital and print services, affiliate referrals | Original studio design from owner-chosen visual direction and staged QA | No evidence of lower prices/better conversion than the incumbent |

## Measured engineering evidence

- **13/13** Node tests passed offline; including 100-row no-loss pagination, HTML markup escaping, 100 menu prices, and MenuVision JSON fields.
- **2/2** standalone HTML browser viewport tests passed on Chromium: desktop 1320px and mobile 390px; item search/filtering/empty state; no horizontal scroll.
- Three fictional sample menus created in original SVG, PNG, HTML. These are samples, not revenue or customer outcomes.
- **0** verified end-to-end paid orders, marketplace posts, affiliate referrals, GitHub code pushes or live deployment.
- SvelteKit build, server PDF, QR, photo import and physical printer proof remain **blocked/unverified**, not completed.

## Proof of superiority to establish after release

Measure completed-client outcomes against the last menu production experience, not against unsupported claims:

1. 100% matching of owner-approved dish names and prices in SVG, HTML and PDF (automated parity + independent review).
2. Zero missing items, clipped text or failed font glyphs in physical print proof at requested trim size.
3. At least 80% of gigs completed on-time; at most one studio-error correction round per order.
4. At least three paid completed orders in 30 days and positive contribution margin after time/fees.
5. At least one seller-controlled portfolio and one genuine buyer review with permission.

Keep comparisons labeled **hypotheses** until measured in the same buyer population with similar content volume. Do not use third-party inspiration art as marketing portfolio samples.
