# App store release gates

**ChatGPT:** Package `plugins/chatgpt`, install privately, test invocation and safety in a fresh chat, configure a hosted authenticated remote MCP if interactive tools are needed, provide privacy policy and support URLs, submit for OpenAI review. Only state "listed" after approval and live directory verification.

**Claude:** Package `plugins/claude` for local Claude Code/desktop use. For Claude.ai hosted connector, implement Streamable HTTP with per-user OAuth, access controls, rate limits, audit logs and HTTPS; security review and Anthropic Connectors Directory submission are separate. The included stdio `.mcp.json` is local-only.

**Operational gaps:** Stripe/account reconciliation, authenticated marketplace intake, reliable mail, qualified prospect data/consent handling, hosted order DB, durable queue, logs, support desk, abuse protections, domain, independent QA, and printer preflight. Never turn on ad payments or external posting until explicit authorization.
