// Local-only, durable, idempotent intake-to-proof engine.
// No marketplace messages, charges, client approvals, publishing or print orders.
import {createHash} from 'node:crypto';
import {mkdir, readFile, rename, writeFile, readdir, open, appendFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {validateBrief, STYLE_OPTIONS} from '../src/lib/menu.mjs';
import {buildSVG, svgPageCount} from '../src/lib/svg.mjs';
import {buildDigitalHtml} from '../src/lib/digital.mjs';
import {approvalFingerprint} from '../src/lib/approval.mjs';

const cleanId = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,63}$/;
const ALLOWED_CHANNELS = ['fiverr','upwork','direct','partner','demo'];
const slug = s=>String(s).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,64);
const digest = v => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const json = v => JSON.stringify(v,null,2)+'\n';
async function atomic(file, content){
 await mkdir(path.dirname(file),{recursive:true,mode:0o700});
 const tmp=file+'.tmp-'+process.pid+'-'+Math.random().toString(36).slice(2);
 await writeFile(tmp,content,{mode:0o600});
 await rename(tmp,file);
}
export function normalizeIntake(raw){
 if (!raw || typeof raw!=='object'||Array.isArray(raw)) throw Error('Order must be an object');
 const id=String(raw.orderId||'');
 if(!cleanId.test(id))throw Error('Order ID must be 3-64 alphanumeric, dash or underscore characters');
 if(!ALLOWED_CHANNELS.includes(raw.channel))throw Error('Unknown intake channel');
 if(raw.sourceLink && (!/^https:\/\//.test(raw.sourceLink) || raw.sourceLink.length>2048))throw Error('Source link must be HTTPS');
 if(typeof raw.restaurant !== 'string'||raw.restaurant.length>200)throw Error('Invalid restaurant name');
 if(typeof raw.menuText !== 'string'||raw.menuText.length>100000)throw Error('Invalid menu text');
 if(!STYLE_OPTIONS.some(s=>s.id===raw.styleId))throw Error('Unrecognized style');
 if(raw.currency && String(raw.currency).length>12)throw Error('Currency is too long');
 if(raw.printSize && !['A4','Letter'].includes(raw.printSize))throw Error('Unsupported trim size');
 const brief={restaurant:raw.restaurant,menuText:raw.menuText,styleId:raw.styleId,currency:raw.currency||'$',printSize:raw.printSize||'Letter',tagline:raw.tagline||'',subtitle:raw.subtitle||'',footer:raw.footer||'',package:raw.package||'signature',references:Array.isArray(raw.references)?raw.references:[]};
 return {orderId:id,channel:raw.channel,sourceLink:raw.sourceLink||null,paymentEvidence:raw.paymentEvidence||null,brief};
}
export async function processIntake(intake,opsDir){
 const normalized=normalizeIntake(intake);
 const id=normalized.orderId;
 const rawHash=digest(normalized);
 const root=path.resolve(opsDir);
 const stateFile=path.join(root,'state',id+'.json');
 let old=null;
 try{old=JSON.parse(await readFile(stateFile,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
 if(old?.intakeHash===rawHash)return {...old,unchanged:true};
 const validation=validateBrief(normalized.brief);
 const priorRevision=old?.revision||0;
 const revision=priorRevision+1;
 const record={orderId:id,channel:normalized.channel,sourceLink:normalized.sourceLink,intakeHash:rawHash,revision,contentHash:approvalFingerprint(normalized.brief),paymentEvidencePresent:!!normalized.paymentEvidence,validation,stage:validation.ok?'awaiting-independent-qa-and-client-approval':'needs-client-correction',producedAt:new Date().toISOString(),previousContentHash:old?.contentHash||null,autoDeliveryAllowed:false,autoChargeAllowed:false};
 // Store source facts in a private directory; never commit an actual order to git.
 await atomic(path.join(root,'sources',id+'.json'),json(normalized));
 if(validation.ok){
  const proofDir=path.join(root,'proofs',id,'r'+revision);
  await mkdir(proofDir,{recursive:true,mode:0o700});
  const pages=svgPageCount(normalized.brief);
  if(pages>100)throw Error('Unusually large menu; manual review required');
  for(let i=0;i<pages;i++)await atomic(path.join(proofDir,`page-${i+1}.svg`),buildSVG(normalized.brief,i));
  await atomic(path.join(proofDir,'digital-menu.html'),buildDigitalHtml(normalized.brief));
  await atomic(path.join(proofDir,'proof.json'),json({orderId:id,revision,pages,contentHash:record.contentHash,status:'DRAFT NOT APPROVED',restrictions:['No automated external sending','No final export without client approval','No print ordering before vendor preflight']}));
  record.proofDirectory=proofDir;record.pages=pages;
 }
 await atomic(stateFile,json(record));
 await appendFile(path.join(root,'audit.jsonl'),JSON.stringify({orderId:id,event:'intake-processed',revision,stage:record.stage,intakeHash:rawHash,contentHash:record.contentHash,at:record.producedAt})+'\n',{mode:0o600});
 return record;
}
export async function runOnce(opsDir){
 const root=path.resolve(opsDir);
 for(const segment of ['inbox','state','sources','proofs'])await mkdir(path.join(root,segment),{recursive:true,mode:0o700});
 const lockPath=path.join(root,'.run.lock');
 let lock;
 try{lock=await open(lockPath,'wx',0o600)}catch(e){if(e.code==='EEXIST')throw Error('Another run holds the lock; inspect and manually clear stale locks after verifying no process is active');throw e}
 try{
  const names=(await readdir(path.join(root,'inbox'))).filter(n=>cleanId.test(n.slice(0,-5))&&n.endsWith('.json')).sort();
  const results=[];
  for(const name of names){
   try{
    const f=path.join(root,'inbox',name);
    const stats=await stat(f);
    if(stats.size>150000)throw Error('Intake exceeds 150k limit');
    const raw=JSON.parse(await readFile(f,'utf8'));
    if(raw.orderId+'.json'!==name)throw Error('File name and orderId mismatch');
    const result=await processIntake(raw,root);
    results.push({orderId:result.orderId,stage:result.stage,revision:result.revision,unchanged:!!result.unchanged});
   }catch(e){results.push({file:name,error:String(e.message||e)})}
  }
  const counts={processed:results.length,awaitingApproval:results.filter(x=>x.stage==='awaiting-independent-qa-and-client-approval').length,needsCorrection:results.filter(x=>x.stage==='needs-client-correction').length,failed:results.filter(x=>x.error).length};
  const report={generatedAt:new Date().toISOString(),counts,results,disclaimer:'Automated drafts only. No verified purchases, signed client approvals, outbound messages, deliveries, or printing.'};
  await atomic(path.join(root,'status.json'),json(report));
  await atomic(path.join(root,'status.md'),`# CartaPress operations status\n\nGenerated ${report.generatedAt}\n\n- Inbound: ${counts.processed}\n- Proofs awaiting QA and customer approval: ${counts.awaitingApproval}\n- Need corrections: ${counts.needsCorrection}\n- Failed: ${counts.failed}\n\nNo marketplace publishing, payments, messages, or print orders are performed by this worker.\n\n${results.map(r=>'- '+(r.orderId||r.file)+': '+(r.error||r.stage+(r.unchanged?' (unchanged)':''))).join('\n')}\n`);
  return report;
 }finally{await lock.close(); const {unlink}=await import('node:fs/promises');await unlink(lockPath)}
}
