# CartaPress AutoOps — order queue and proof worker

**Scope:** The worker runs without marketplace credentials and automatically turns validated, previously submitted order information into **draft proofs**. It does not send client messages, charge money, accept work, approve work on a client's behalf, deliver final files, or place print orders. Existing `mcp/server.mjs` remains the production tool API; do not duplicate its role.

## Launch locally (zero credentials)

```
CARTAPRESS_OPS_DIR=/absolute/private/path npm run ops:once
CARTAPRESS_OPS_DIR=/absolute/private/path npm run ops:loop
```

Put one private JSON record per order in `$CARTAPRESS_OPS_DIR/inbox/<orderId>.json`, using `ops/example-order.json` as the schema. NEVER commit real customer data. The worker writes `state/<orderId>.json`, `sources/<orderId>.json`, `proofs/<orderId>/rN/`, `status.json`, `status.md` and append-only `audit.jsonl` to the *private* ops directory. Repeated runs with identical input are idempotent. Changing an item or price generates a new revision and invalidates the previous content hash. A lock prevents concurrent processes; if interrupted, manually check the process before clearing a stale `.run.lock`.

## What makes it operational (not yet fully connected)

1. **Lead acquisition / storefronts (not connected):** A seller-operated integration imports *authorized* Fiverr/Upwork client requests into the private inbox. Marketplace terms and account permissions are mandatory. Never scrape private chats or route marketplace orders to outside payment systems.
2. **Intake / payment:** The controller verifies the actual order status against the marketplace record, then creates source-preserving structured briefs. `paymentEvidence` in an input file is not verification on its own.
3. **Automatic production (implemented):** AutoOps checks the brief and creates SVG and self-contained digital HTML draft proofs, or marks missing content for correction.
4. **Independent QA (not connected):** A separate reviewer compares every name, price, allergen, language and layout to the authoritative menu. Store the review evidence outside the source tree.
5. **Client approval (existing MCP gate):** Human/client proof + current preview hash required by `cartapress_approve`; no automatic assumption of approval.
6. **Final export (existing MCP gate):** `cartapress_export` writes files locally after approval, followed by real printer preflight and authorized delivery.
7. **Bookkeeping (not connected):** Reconcile *verified* marketplace invoices, fees and paid-out funds. No fabricated revenue, orders or commission.

## Connection to a single existing orchestrator

Use **Hermes/Pi or Paperclip** as the controller with `agents/AUTOOPS_CONTROLLER.md` and `mcp/server.mjs`. Do not install a second orchestration stack. The controller can monitor status and propose approved messages through Composio, where marketplace tool access exists; send/publish/charge/print actions always require the seller's explicit authority and verified account scopes.

## Production safety

Run this worker under a dedicated unprivileged account with a private data volume, backups, read-only code, process monitoring and a pinned Node version. The sample service is a template, not evidence of an installed VPS worker. The queue and manifests are not sufficient authorization for final delivery. Before first real order: verify receipt, price facts, model licenses, client proof, print spec and delivery channel. Do not expose `private-operations/` as a static path.

## Operator proof

```
npm test
npm run ops:smoke
```

Results for the synthetic smoke test are written only to a temporary directory. `npm run check`, `npm run build`, live GitHub CI, and Vercel deployment remain independent release gates.
