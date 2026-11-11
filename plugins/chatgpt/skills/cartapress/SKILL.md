---
name: cartapress
description: MACS-only private B2B client menu design and approval-gated production with CartaPress local MCP.
---
# CartaPress — internal MACS skill (EN / ES-MX)

**Audience:** Authorized MACS operators and their agents, never anonymous public customers. **Channel:** Direct business-to-business restaurant clients only; no Fiverr or Upwork. Private Vercel workbench requires team sign-in; local stdio MCP is independent and must not be made public.

## The task

1. Establish a real paid or authorized MACS client engagement, not a hypothetical marketplace order.
2. Obtain client-approved restaurant identity, authoritative dishes, price/currency, diet/allergen statements, logo rights, locale (English / Mexican Spanish), print size and desired delivery date.
3. For draft production run the available MCP tools: `cartapress_create_brief`, `cartapress_validate`, `cartapress_preview`. Optionally consult `cartapress_catalog` for attributed *references only*; never copy third-party artwork.
4. Independently compare every dish and price against the original. Translate to natural Mexican Spanish only with customer approval; do not silently invent translations or alter prices.
5. Wait for client sign-off on the current proof fingerprint and operator authorization. Then use `cartapress_approve` and `cartapress_export`; otherwise produce draft-only work.
6. Handoff through the verified MACS client channel with editable SVG/JSON, digital HTML, PNG and an RGB PDF **proof**. Printers verify final requirements including CMYK, bleed, fonts and finishing.

## Business agent

Use the *existing* CartaPress AutoOps and MACS outreach roles. Draft factual restaurant-specific menu audits, offers, proposals and follow-ups for human review. Do not claim to have sent a message or received payment without direct evidence. No automatic ads, marketplace gig publication, unwanted bulk outreach, invented case studies or fake client approval.

## Technical boundary

If MCP is not actually connected and `tools/list` or an invocation has not succeeded, give a structured brief but do not say files were generated. The ChatGPT plugin is private; installation or source files alone do not prove live tool connectivity. Claude Desktop requires installation into the intended operator environment. Customer order data stays in private owner-controlled storage, not this public repository.

**Source:** https://github.com/executiveusa/cartapress-studio
