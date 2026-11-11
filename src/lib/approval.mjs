import {createHash,createHmac,timingSafeEqual} from 'node:crypto';

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

// An external, operator-held secret makes a valid revision hash insufficient to self-approve.
// Keep the 32+ character key OUT of the MCP client's tools, working directory, logs and repo.
export function makeOperatorApprovalSignature(key,projectId,previewHash,clientApprovalRecord){
  if(typeof key!=='string'||key.length<32)throw Error('Operator approval key missing or too short (32 characters minimum).');
  if(!/^[a-z0-9-]{5,100}$/.test(String(projectId)))throw Error('Invalid project ID');
  if(!/^[a-f0-9]{64}$/.test(String(previewHash)))throw Error('Invalid SHA256 proof fingerprint');
  if(typeof clientApprovalRecord!=='string'||clientApprovalRecord.trim().length<8)throw Error('Client approval record required');
  const message=JSON.stringify([projectId,previewHash,clientApprovalRecord]);
  return createHmac('sha256',key).update(message).digest('hex');
}
export function verifyOperatorApprovalSignature(key,projectId,previewHash,clientApprovalRecord,signature){
  if(typeof signature!=='string'||!/^[a-f0-9]{64}$/.test(signature))return false;
  try {
    const expected=makeOperatorApprovalSignature(key,projectId,previewHash,clientApprovalRecord);
    return timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(signature,'hex'));
  }catch{return false}
}
