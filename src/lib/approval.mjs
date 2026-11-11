import {createHash} from 'node:crypto';

// Exact revision fingerprint for all content, pricing and physical output decisions.
// Mutable workflow bookkeeping (timestamps/status/approval) is intentionally omitted.
const SIGNED_FIELDS = [
  'restaurant', 'menuText', 'styleId', 'tagline', 'subtitle', 'footer',
  'currency', 'printSize', 'printRegion', 'printQty', 'siteURL',
  'package', 'references'
];
export function approvalFingerprint(brief={}) {
  const signed = Object.fromEntries(SIGNED_FIELDS.map(k => [k, brief[k] ?? null]));
  return createHash('sha256').update(JSON.stringify(signed)).digest('hex');
}
