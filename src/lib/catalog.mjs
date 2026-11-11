export const ORIGIN_URL='https://raw.githubusercontent.com/franlopz/menu-inspiration/main/index.html';
export const SOURCE_REPO='https://github.com/franlopz/menu-inspiration';
const allowed=['dribbble.com','www.behance.net','www.canva.com','cdn.dribbble.com','mir-s3-cdn-cf.behance.net','template.canva.com'];
function safeUrl(value){ try {const u=new URL(value); return u.protocol==='https:' && allowed.includes(u.hostname) ? u.href : null} catch{return null} }
export function parseReferenceHtml(html) {
  const match=String(html).match(/const ITEMS=(\[[\s\S]*?\]);\s*const CATS=/);
  if(!match) throw new Error('Upstream catalog format changed.');
  const raw=JSON.parse(match[1]);
  if(!Array.isArray(raw)||raw.length<100||raw.length>1000)throw new Error('Unexpected catalog size.');
  const results=raw.map((row,i)=>({num:Number(row.num)||i+1,cat:String(row.cat||''),source:String(row.src||''),title:String(row.title||'').slice(0,180),by:String(row.by||'').slice(0,140),href:safeUrl(row.href),thumb:safeUrl(row.thumb),large:safeUrl(row.large),note:String(row.note||'').slice(0,300)})).filter(x=>x.href&&x.thumb);
  if(results.length!==raw.length)throw new Error('Catalog references failed URL validation');
  return results;
}
