import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {normalizeIntake,runOnce,processIntake} from '../ops/engine.mjs';
import {readFileSync} from 'node:fs';
const base=JSON.parse(readFileSync(new URL('../ops/example-order.json',import.meta.url),'utf8'));
test('valid intake advances to draft proof; repeated run remains idempotent',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'cartapress-ops-'));
 try{
  await mkdir(path.join(root,'inbox'));
  await writeFile(path.join(root,'inbox',base.orderId+'.json'),JSON.stringify(base));
  let result=await runOnce(root);assert.equal(result.counts.awaitingApproval,1);
  const state=JSON.parse(await readFile(path.join(root,'state',base.orderId+'.json')));
  assert.equal(state.revision,1);assert.equal(state.autoDeliveryAllowed,false);
  const files=await readdir(path.join(root,'proofs',base.orderId,'r1'));
  assert.ok(files.includes('page-1.svg'));assert.ok(files.includes('digital-menu.html'));
  result=await runOnce(root);assert.equal(result.results[0].unchanged,true);
  const next={...base,menuText:base.menuText.replace('3.50','3.75')};
  await writeFile(path.join(root,'inbox',base.orderId+'.json'),JSON.stringify(next));
  result=await runOnce(root);assert.equal(result.results[0].revision,2);
  const state2=JSON.parse(await readFile(path.join(root,'state',base.orderId+'.json')));
  assert.notEqual(state.contentHash,state2.contentHash);
 }finally{await rm(root,{force:true,recursive:true})}
});
test('missing prices cannot create approved/deliverable outputs',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'cartapress-bad-'));
 try {
  const bad={...base,orderId:'broken-001',menuText:'FOOD\nSandwich | Cheese | '};
  const state=await processIntake(bad,root);
  assert.equal(state.stage,'needs-client-correction');assert.equal(state.autoDeliveryAllowed,false);
  const list=await readdir(root);assert.ok(!list.includes('deliveries'));
 }finally{await rm(root,{force:true,recursive:true})}
});
test('protects against unsafe file names and unrecognized sources',()=>{
 assert.throws(()=>normalizeIntake({...base,orderId:'../../etc/passwd'}));
 assert.throws(()=>normalizeIntake({...base,channel:'unknown'}));
});
