import { json } from '@sveltejs/kit';
import { buildPDF } from '$lib/print.mjs';
import { slugify } from '$lib/menu.mjs';
import { pdfPayload } from '$lib/pdf-payload.mjs';
export async function POST({request}) {
  try {
    const raw=await request.text();if(raw.length>100000)return json({error:'Brief too large'},{status:413});
    const brief=pdfPayload(JSON.parse(raw));const bytes=await buildPDF(brief);
    return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${slugify(brief.restaurant)}-print-proof.pdf"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  } catch(err) {return json({error:err instanceof Error?err.message:'Invalid request'},{status:400})}
}
