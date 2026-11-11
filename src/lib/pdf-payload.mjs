// Deliberate allow-list: contact details, approvals, and customer metadata do not leave the browser.
const PDF_FIELDS = Object.freeze(['restaurant','tagline','subtitle','menuText','styleId','currency','footer','printSize']);
export function pdfPayload(brief={}) {
  return Object.fromEntries(PDF_FIELDS.map(field=>[field,brief[field] ?? '']));
}
