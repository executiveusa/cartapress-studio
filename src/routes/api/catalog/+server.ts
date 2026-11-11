import { json } from '@sveltejs/kit';
import { ORIGIN_URL, parseReferenceHtml } from '$lib/catalog.mjs';
let cache: { items:any[]; expires:number }|null=null;
export async function GET({fetch}) {
  if(cache && Date.now()<cache.expires)return json({items:cache.items,total:cache.items.length,source:'live-upstream-cache'},{headers:{'Cache-Control':'public, s-maxage=600'}});
  try {
    const r=await fetch(ORIGIN_URL,{headers:{'Accept':'text/html'}});
    if(!r.ok)throw new Error(`Source HTTP ${r.status}`);
    const text=await r.text(); if(text.length>300000)throw new Error('Oversized upstream catalog');
    const items=parseReferenceHtml(text);
    cache={items,expires:Date.now()+60*60*1000};
    return json({items,total:items.length,source:'attributed-external-visual-references'},{headers:{'Cache-Control':'public, s-maxage=600'}});
  } catch(e){
    if(cache)return json({items:cache.items,total:cache.items.length,source:'stale-cached'},{headers:{'Cache-Control':'no-cache'}});
    return json({items:[],total:0,error:'Inspiration source temporarily unavailable. No external images have been copied.'},{status:503});
  }
}
