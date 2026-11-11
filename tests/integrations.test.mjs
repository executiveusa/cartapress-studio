import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { translate } from '../src/lib/i18n.mjs';

test('English and Mexican Spanish UI copy resolve deterministically', () => {
  assert.equal(translate('The studio', 'es'), 'Crea tu menú');
  assert.equal(translate('The studio', 'en'), 'The studio');
  assert.equal(translate('missing key', 'es'), 'missing key');
});

test('ChatGPT and Claude skill manifests contain valid identity and skills', async () => {
  const [chat, claude, chatSkill, claudeSkill] = await Promise.all([
    readFile('plugins/chatgpt/plugin.json', 'utf8'),
    readFile('plugins/claude/.claude-plugin/plugin.json', 'utf8'),
    readFile('plugins/chatgpt/skills/cartapress/SKILL.md', 'utf8'),
    readFile('plugins/claude/skills/cartapress/SKILL.md', 'utf8')
  ]);
  const a = JSON.parse(chat), b = JSON.parse(claude);
  assert.equal(a.name, 'cartapress-studio');
  assert.equal(b.name, 'cartapress-studio');
  assert.ok(chatSkill.length > 120 && claudeSkill.length > 120);
});

test('Claude-compatible MCP server responds to actual tools/list and catalog call', { timeout: 25000 }, async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'cartapress-mcp-check-'));
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['mcp/server.mjs'],
    cwd: process.cwd(),
    env: { ...process.env, CARTAPRESS_PROJECTS_DIR: dir }
  });
  const client = new Client({ name: 'cartapress-integration-test', version: '0.2.0' });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.ok(tools.some(t => t.name === 'cartapress_create_brief'));
    assert.ok(tools.some(t => t.name === 'cartapress_validate'));
    assert.ok(tools.some(t => t.name === 'cartapress_export'));
    const catalog = await client.callTool({ name: 'cartapress_catalog', arguments: {} });
    assert.ok(catalog.content?.some(c => c.type === 'text' && c.text.includes('styles')));
  } finally {
    await client.close().catch(() => {});
    await rm(dir, { recursive: true, force: true });
  }
});
