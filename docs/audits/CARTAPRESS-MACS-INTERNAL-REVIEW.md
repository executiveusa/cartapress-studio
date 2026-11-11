# CartaPress / MACS — internal-only Vibe Engineering design, trust and reduction review

**Decision:** Internal tool, not a public sales site.  
**Status:** CI-passing preview, pending production promotion and exact final revision smoke check.  
**Baseline:** `62dd1d3b6d431a25a0387402c762da65fcbbb818`; rollback by reverting PR #4 or redeploying the prior Vercel production deployment.  
**Method:** Vibe Engineering seven lenses, Heart & Soul, No-Slop, Subtraction Gauntlet, user-supplied Landing Page Director, Art of Reduction, ELI5 and Mobile Mission v2.

## Intent / standard / evidence

- **Human:** MACS account operator and designer; client input belongs to a directly contracted restaurant, not an anonymous public visitor.
- **Job:** Create a consistent, independently proofed print/digital menu from authoritative customer content without repeated design setup.
- **Commercial value:** Lower labor per paid B2B service delivery. The app neither bills customers nor sends outreach.
- **Proof:** CI, real preview route and asset response, locale SSR, actual staff workbench, MCP handshake, private access rules and QA acceptance before external delivery.
- **Protected:** original fal.ai tabletop photo, menu compiler, vector source, portable HTML, price preservation, approval fingerprints, Vercel/GitHub ownership, rollback and designer attribution rights.

## Seven-lens audit after reduction

| Lens | Violation found | Repair / evidence | Remaining gap |
|---|---|---|---|
| Human outcome | Marketplace/buyer page had too many competing jobs | One internal MACS home → staff editor; no public checkout | Verify actual client fulfillment with first paying B2B customer |
| Information | Marketing gallery, price cards and printing vendors distracted staff | Customer-facing promotional sections are not rendered in internal mode; staff sees only the menu workbench | Usability interview with actual operator |
| Interaction | Public checkout not connected yet old landing implied a purchase | Checkout removed from product scope; agent capability contract says no public sales | MACS CRM/payment process still separate |
| Visual | Hero alone did not prove the transformation | Preserved original fal.ai hero plus explicit list→menu specimen labeled fictional, never a claimed client result | Physical mobile viewport and print proof review |
| Motion | Marquee and non-essential effects on customer sales page | No new animation libraries; native page scroll, no autoplay | Reduced-motion runtime check not independently measured |
| Responsive/accessibility | Mobile type, hierarchy and localization incomplete | Distinct 390px private mobile preview; Spanish route and sample menu; deferred optional settings, touch-size adjustments | Full 320/360/375/390/430/768/1024/1440 interactive visual matrix incomplete |
| Trust/sovereignty | Public exposure and search indexing inconsistent with internal use | Vercel SSO now applies to **all** deployments; noindex headers and robots deny indexing; client records remain outside GitHub; private plugin v0.2 | Source repository itself remains public; exact Vercel team authorization must be maintained |

## Subtraction decisions

- **KEEP:** menu editor, original styles, real editable exports, sample preview, price data validation, print caveats, approval gates, bilingual language choice and original tabletop hero.
- **MERGE:** duplicate promotional messaging into one practical MACS operator instruction.
- **INFER:** Mexico locale / MX$ / Spanish sample; English default elsewhere.
- **DEFER:** advanced QR, print region, quantity and currency settings in accessible native disclosure.
- **MOVE:** service positioning and paid B2B funnel into `docs/GO_TO_MARKET_V2.md`, not the tool navigation.
- **REMOVE:** marketplace pricing/landing content, affiliate offers, unsupported popularity badges, public sales CTAs, decorative ticker, public SEO ambition.

Further removal would sacrifice real menu control, price verification or client approval.

## Plugin and agent verification

- ChatGPT private plugin v0.2.0 updated to MACS direct B2B; this **does not** verify a live remote MCP action.
- Claude repository plugin v0.2.0, skill updated; CI actually connects to local MCP, enumerates tools and calls catalog.
- `/api/capabilities` returns private operating state; API route not a remote agent service.
- The existing AutoOps controller remains local and cannot invent incoming orders or client approval.

## Release evidence

At review time the candidate branch CI `CartaPress checks` passes, including 26 baseline+integration+new privacy/business tests, Svelte checks, build and secret checks. Vercel preview returns HTTP 200 for `/`, `/es`, `/studio`, `/es/studio`, `/api/capabilities`, the versioned image and `/robots.txt`, with `es-MX` HTML on Spanish routes and noindex headers. Source no longer includes marketplace names in rendered portal and editor HTML. The private source remains GitHub-public; do not store customer data there.

**Scope-specific judgment:** The former paid-checkout P1 is now **NOT_APPLICABLE** because CartaPress has become internal B2B production software. The app is fit for operator pilot after CI, preview and security smoke; human-led client data/printing/approval is a separate proof gate. Do not claim a fully automated sales business, certified CMYK, public marketplace listing, or complete accessibility score.

## Next verified slice

Run one synthetic, customer-free Spanish menu from editor to draft files, compare every item and price, then verify independently approved output in the correct MACS workflow. Capture time-to-proof and failures. That demonstrates production value before building any additional orchestration.
