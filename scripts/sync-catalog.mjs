import {readFile,writeFile} from 'node:fs/promises';
import {ORIGIN_URL,parseReferenceHtml} from '../src/lib/catalog.mjs';
// Optional offline catalog snapshot; does not download or mirror any third-party imagery.
const resp=await fetch(ORIGIN_URL);if(!resp.ok)throw Error(`Catalog HTTP ${resp.status}`);
const items=parseReferenceHtml(await resp.text());
await writeFile(new URL('../src/lib/catalog.snapshot.json',import.meta.url),JSON.stringify({updatedAt:new Date().toISOString(),items},null,2)+'\n');
console.log(`Saved ${items.length} attributed links. Artwork remains on original sites.`);
