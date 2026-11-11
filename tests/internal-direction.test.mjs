import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('English and Mexican Spanish internal portals and workbenches share components', async () => {
  const paths = ['src/routes/+page.svelte', 'src/routes/es/+page.svelte', 'src/routes/studio/+page.svelte', 'src/routes/es/studio/+page.svelte'];
  const sources = await Promise.all(paths.map(p => readFile(p,'utf8')));
  assert.ok(sources[0].includes('InternalHome'));
  assert.ok(sources[1].includes('InternalHome') && sources[1].includes('lang="es"'));
  assert.ok(sources[2].includes('internal={true}') && sources[2].includes('CartaLanding'));
  assert.ok(sources[3].includes('internal={true}') && sources[3].includes('lang="es"'));
});

test('Internal portals are not public selling experiences', async () => {
  const [home, studio] = await Promise.all([
    readFile('src/lib/InternalHome.svelte','utf8'),
    readFile('src/lib/CartaLanding.svelte','utf8')
  ]);
  assert.ok(home.includes('MACS'));
  assert.ok(home.includes('/studio') && home.includes('/es/studio'));
  assert.doesNotMatch(home,/Fiverr|Upwork|public checkout/i);
  assert.ok(studio.includes('{#if !internal}'));
});

test('Private deployment has indexing defenses in source', async () => {
  const [robots,hook,capabilities] = await Promise.all([
    readFile('static/robots.txt','utf8'),
    readFile('src/hooks.server.ts','utf8'),
    readFile('src/routes/api/capabilities/+server.ts','utf8')
  ]);
  assert.match(robots,/Disallow:\s*\//);
  assert.match(hook,/X-Robots-Tag/);
  assert.match(hook,/noindex/);
  assert.match(capabilities,/private_internal_client_production/);
  assert.match(capabilities,/publicCheckout:\s*false/);
  assert.match(capabilities,/marketplaceSales:\s*false/);
});

test('Marketing policy and agent roles are direct business-to-business only', async () => {
  const [policy,controller] = await Promise.all([
    readFile('agents/marketing/OPERATING_POLICY.md','utf8'),
    readFile('agents/AUTOOPS_CONTROLLER.md','utf8')
  ]);
  assert.match(policy,/direct business-to-business/i);
  assert.match(controller,/MACS direct B2B/);
  assert.match(controller,/client.*approv/i);
});
