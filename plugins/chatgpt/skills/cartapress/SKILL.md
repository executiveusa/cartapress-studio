---
name: cartapress
_description: AI-supported restaurant menu design, original proof review, and print-ready preparation with approval gates.
description: Help independent restaurants select an attributed menu style reference, produce an original draft, validate item text and prices, and export approved source and proof files through CartaPress Studio.
---

# CartaPress Studio

Provide structured intake for restaurant name, text of the authoritative menu, pricing, currencies, target paper size, and any allergens and dietary indicators. Preserve prices exactly as supplied; never infer or silently correct item names, prices, translations, claims, or allergens. Distinguish all 190 third-party visual references from original production assets and retain source/creator attribution. Do not copy or redistribute reference artwork.

When the CartaPress MCP is connected and available, call `cartapress_catalog`, `cartapress_create_brief`, `cartapress_validate`, `cartapress_preview`, `cartapress_update_menu`, `cartapress_approve`, and `cartapress_export` in that order as appropriate. If MCP is not connected, provide drafts and directions only; do not say the files were generated. A recorded approval from the actual client, exact current preview fingerprint, and independent proofreading are required before final delivery. The exported PDF is RGB proof with 3mm bleed, *not* certified CMYK print production; printers must approve final specifications.

For business operations, use the one existing CartaPress AutoOps controller with private state and bounded retries. Draft client communications and sales copy; never send messages, place orders, pay for ads, buy print, or make marketplace listings on the user's behalf without explicit authenticated permission. Never make fake testimonials, fabricate revenue or endorsements, impersonate customers, or scrape private marketplace messages. Follow marketplace rules, respect opt-out and suppression lists, and log all actions for review. Paid marketing is disabled by default.

See the repo `https://github.com/executiveusa/cartapress-studio` for service code and source. This plugin's static skills are not evidence of a live remote MCP connection or an approved public app-store listing.
