# CartaPress integrations

- `chatgpt/`: portable OpenAI Agent Plugin, skills-first, suitable for private testing; submitting it for public directory review is a separate process.
- `claude/`: Claude Code-compatible plugin (`.claude-plugin/plugin.json`) and local stdio MCP configuration example. Replace absolute placeholders with the locally installed repository directory. Claude web/mobile require a secure public HTTPS remote MCP with user authentication, not this local stdio config.
- The actual MCP is the repo-root `mcp/server.mjs`, currently local stdio. Do not advertise it as a public remote connector. Its tools are approval-gated and are not marketplace ordering/payment actions.
- Neither app store listing is published. Do not claim installation, directory review approval, or sale.
- The private operations directory must be outside the public web root and source tree.
