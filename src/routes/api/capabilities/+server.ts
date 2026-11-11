import { json } from '@sveltejs/kit';

export function GET() {
  return json({
    name: 'CartaPress Studio',
    version: '0.2.0',
    locales: ['en', 'es-MX'],
    paths: { en: '/', 'es-MX': '/es' },
    service: 'Original restaurant menu design for print and digital',
    mode: 'self_service_demo',
    primaryAction: { label: 'Create a menu preview', path: '/#studio' },
    machineReadable: {
      catalog: { method: 'GET', path: '/api/catalog', auth: 'none', attribution: 'reference_only' },
      pdfProof: { method: 'POST', path: '/api/export/pdf', auth: 'none', input: 'public demo brief (no contact details)', output: 'application/pdf', maxBodyBytes: 100000 }
    },
    formats: ['SVG', 'PNG', 'PDF proof (RGB)', 'HTML', 'JSON', 'ZIP'],
    localAgent: { protocol: 'MCP over stdio', entry: 'mcp/server.mjs', transport: 'local_only', publicRemoteEndpoint: false },
    orderIntake: { enabled: false, paymentConnected: false, marketplaceOrdersConnected: false },
    approvals: 'MCP production export requires valid operator approval; browser exports are previews',
    caution: 'Do not submit personal customer data to public demo APIs. Price, allergen and print preflight verification remains required.'
  }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
