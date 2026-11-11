# CartaPress / ICM workflows

## 01-intake
Input: qualified order, client-controlled menu content, price truth source, deadline, logos with rights. Output: structured `brief.json`; block if price/ownership missing.

## 02-creative
Input: up to 8 attributed references with creator and source; 1 of 5 original styles. Output: design recipe that captures general visual qualities, never third-party artwork.

## 03-production
Input: approved menu text and style recipe. Output: A4 or US Letter SVG pages, 300dpi PNG, standalone interactive HTML, vector RGB PDF proof with crop marks/bleed, structured JSON and manifest. Agent uses MCP for staged file operations.

## 04-qa
Independent source-of-truth comparison, overflow inspection, SVG integrity, PDF page count and printer preflight. Output: signed check, corrections or block. The preview hash must match approved menu facts and exact creative direction.

## 05-approval
No assumptions. Actual client approval record plus printer-specific requirements. Agent cannot sign on client's behalf. Output: approval reference and version lock.

## 06-delivery
Marketplace-approved channel, files and proof; capture receipt. No off-platform payment links before permission.

## 07-referrals
Optional, post-delivery only. Send a clearly labeled independent print provider link; use a tracked affiliate link only after signed approval. Preserve ownership of the restaurant's menu and data.

## Rollback
Revert a bad edit to the last confirmed `brief.json`; disable any export flow until QA recovers; no automatic delete. Revision records and source originals retained under customer retention agreement.
