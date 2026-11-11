#!/usr/bin/env node
import path from 'node:path';
import {runOnce} from './engine.mjs';
const opsDir=path.resolve(process.env.CARTAPRESS_OPS_DIR||'./private-operations');
const interval=Number(process.env.CARTAPRESS_POLL_SECONDS||'900');
const loop=process.argv.includes('--loop');
if(loop && (!Number.isInteger(interval)||interval<60||interval>86400))throw Error('Poll interval must be 60..86400 seconds');
async function cycle(){try{const result=await runOnce(opsDir);process.exitCode=0;console.log(JSON.stringify({at:result.generatedAt,counts:result.counts,opsDir}));}catch(e){console.error('CartaPress ops cycle failed:',e?.message||String(e));process.exitCode=1}}
await cycle();
if(loop){setInterval(cycle,interval*1000);}
