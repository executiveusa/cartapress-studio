# Technical review / known release blockers

Code produced 2026-11-10. This is a source archive, **not** verified production software.

1. **Dependency and build check:** `npm install`, `npm run check`, `npm run build` were not possible in the no-network environment. Svelte compiler and dependencies absent. Mandatory before serving clients.
2. **API live feed:** `/api/catalog` reads and parses upstream HTML. All 190 ref metadata inspected via official GitHub connector at build planning, but runtime DNS, HTTP, CDN hotlinking, CORS and licensing remain outside proof. Upstream artist cards are public credited references, not commercial assets. Prefer durable snapshot of links after explicit rights review.
3. **Export:** `src/lib/print.mjs` is a PDF generator using pdf-lib, server tests require npm. Crop marks can extend into bleed; commercial printer should check printer specs. PDF uses RGB, lacks ICC CMYK output and full font embedding. Never advertise as certified print-ready.
4. **Svelte:** Svelte 5 legacy syntax requires compilation and responsive browser screenshot review. No production Lighthouse result yet.
5. **Preview parity:** CSS page preview, SVG export and PDF proof may not wrap text identically. Long titles/descriptions are now word-wrapped by shared SVG/PDF pagination, but font metrics and page overflow need full actual-render review before any paid orders.
6. **Data:** the editor keeps state in browser memory only; dedicated PDF endpoint temporarily receives menu content and returns a PDF but does not persist. Do not send personal contact email to that endpoint. MCP projects are local private JSON; add encryption/retention policy before real confidential client data.
7. **Marketplace:** no Fiverr/Upwork accounts or official integrations connected; no listing published, no orders and no customer messages sent. Platform rules, seller verification and design samples needed.
8. **Payment & printing:** no checkout, no printer API/affiliate ID, no qualified clicks, no commissions. Only public provider links.
9. **Security:** public PDF endpoint needs abuse protection before scale; robust upload/license validation, anti-SSRF checks and audit logs before accepting arbitrary files. Current app intentionally has no asset upload.
10. **MCP:** assumes current `@modelcontextprotocol/sdk` Server protocol is compatible with installed version; smoke test with actual compatible client. Approval proof is text provided by caller and must be independently verified, not self-attested by agent.

### First release gate
1. npm install/check/build/test with clean lockfile;
2. 190 card images load with creator/source link; test upstream failure fallback;
3. desktop and 375px mobile screenshot and keyboard gallery checks;
4. PDF/SVG/PNG/ZIP from a verified 60-item menu, compare every price;
5. printer preflight signed off or label explicitly as proof;
6. independent technical review and rollback branch;
7. then deploy and verify HTTPS response/asset downloads directly.
