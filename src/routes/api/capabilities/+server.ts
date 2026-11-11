import { json } from '@sveltejs/kit';

export function GET() {
  return json({
    product: 'CartaPress / MACS',
    operatingMode: 'private_internal_client_production',
    access: 'Vercel team authentication required',
    locales: ['en', 'es-MX'],
    routes: { overview: ['/', '/es'], staffStudio: ['/studio', '/es/studio'] },
    service: 'Design tools supporting MACS direct business-to-business client work',
    publicSales: false,
    marketplaceSales: false,
    publicCheckout: false,
    directB2B: true,
    APIs: {
      catalog: { path: '/api/catalog', method: 'GET', purpose: 'attributed style references' },
      pdfProof: { path: '/api/export/pdf', method: 'POST', contentType: 'application/pdf', purpose: 'draft proof only; not CMYK preflight' }
    },
    agent: { protocol: 'local MCP over stdio', entry: 'mcp/server.mjs', role: 'approved client briefs, validation and approval-gated final export', remotePublicEndpoint: false },
    integrations: {
      chatGPT: 'private plugin; manual setup and runtime authorization still required',
      claude: 'local plugin with tested MCP handshake; desktop installation not verified',
      clientCRM: 'not connected',
      payments: 'managed outside this tool; not connected',
      campaignPublishing: 'drafts only'
    },
    safeguards: ['no unauthorized client uploads', 'verify client prices', 'require client approvals before final delivery', 'operator review for outbound communication']
  }, { headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
}
