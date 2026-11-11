# App store release gates

**ChatGPT:** Package `plugins/chatgpt`, install privately, test invocation and safety in a fresh chat, configure a hosted authenticated remote MCP if interactive tools are needed, provide privacy policy and support URLs, submit for OpenAI review. Only state "listed" after approval and live directory verification.

**Claude:** Package `plugins/claude` for local Claude Code/desktop use. For Claude.ai hosted connector, implement Streamable HTTP with per-user OAuth, access controls, rate limits, audit logs and HTTPS; security review and Anthropic Connectors Directory submission are separate. The included stdio `.mcp.json` is local-only.

**Operational gaps:** Stripe/account reconciliation, authenticated marketplace intake, reliable mail, qualified prospect data/consent handling, hosted order DB, durable queue, logs, support desk, abuse protections, domain, independent QA, and printer preflight. Never turn on ad payments or external posting until explicit authorization.

**Approval HMAC required:** On a private operator-owned machine run `CARTAPRESS_APPROVAL_KEY=<32+ character secret> node scripts/sign-approval.mjs <projectId> <previewHash> <clientApprovalRecordFile>`. Give the resulting signed receipt to the agent ONLY after authenticating the real client proof. The MCP worker may verify signatures using the environment secret but must not let an LLM read or generate that secret. Key isolation requires separate runtime permissions. Without the key or a valid signature, final approval and export are blocked.

**PDF privacy:** The public demo sends menu content and visual/size data to the server to render PDF; contact email and approval metadata are excluded from the request. The site discloses this before export.
