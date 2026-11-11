#!/usr/bin/env node
// Run on an operator-controlled host/user AFTER verifying the real client's signed approval.
// Never expose CARTAPRESS_APPROVAL_KEY to the connected agent or its shell tools.
import {readFile} from 'node:fs/promises';
import {makeOperatorApprovalSignature} from '../src/lib/approval.mjs';
const [projectId,previewHash,recordFile]=process.argv.slice(2);
if(!projectId||!previewHash||!recordFile){console.error('Usage: CARTAPRESS_APPROVAL_KEY=... node scripts/sign-approval.mjs <projectId> <SHA256> <client-approval-record-file>');process.exit(2)}
const record=(await readFile(recordFile,'utf8')).trim();
const signature=makeOperatorApprovalSignature(process.env.CARTAPRESS_APPROVAL_KEY,projectId,previewHash,record);
console.log(JSON.stringify({projectId,previewHash,clientApprovalRecord:record,approvalSignature:signature},null,2));
