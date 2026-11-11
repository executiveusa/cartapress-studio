export const SAMPLE_TEXT = `SMALL PLATES\nWhipped Ricotta | lemon zest, wildflower honey | 12\nCrispy Artichokes | rosemary aioli | 14\nCharred Shishitos | flaky salt, lime | 10\n\nMAINS\nSeared Sea Bass | saffron broth, fennel | 32\nWild Mushroom Risotto | aged parmesan, thyme | 27\nSteak Frites | peppercorn butter, shoestring fries | 38\n\nSOMETHING SWEET\nOlive Oil Cake | vanilla cream, citrus | 12\nDark Chocolate Mousse | crème fraîche, sea salt | 13`;
export const STYLE_OPTIONS = [
  { id:'editorial', title:'The Editorial', label:'Understated, luxurious', paper:'#f7f2e8', ink:'#1e2924', accent:'#9a6b40', font:'Georgia, serif' },
  { id:'modern', title:'The Modernist', label:'Sharp, clean, contemporary', paper:'#ffffff', ink:'#191e1a', accent:'#ff6a44', font:'Arial, sans-serif' },
  { id:'cantina', title:'The Cantina', label:'Vibrant, spirited, bold', paper:'#fff0d7', ink:'#293c2b', accent:'#bc3c29', font:'Georgia, serif' },
  { id:'botanical', title:'The Botanical', label:'Fresh, earthy, seasonal', paper:'#f1f0e4', ink:'#244433', accent:'#718d5b', font:'Georgia, serif' },
  { id:'noir', title:'After Dark', label:'Cocktails & late-night rooms', paper:'#171e23', ink:'#f2ece1', accent:'#d7a96b', font:'Georgia, serif' }
];
export const CATEGORIES = { all:'All directions', mex:'Latin & Mexican', vintage:'Retro typography', photo:'Photo led', elegant:'Quiet luxury', boards:'Wall & TV boards', canva:'Canva inspiration' };
const priceRe = /^(.*?)\s+(?:MX\$|US\$|A\$|\$|€|£)?\s*(\d+(?:[.,]\d{1,2})?)\s*$/i;
const asText = value => value == null ? '' : String(value).trim();

// Matches the MenuVision structured contract without depending on that project at runtime.
// Source prices, variants, allergen codes and bilingual text remain authoritative strings.
export function parseStructuredMenu(input) {
  const data = typeof input === 'string' ? JSON.parse(input) : input;
  if (!data || !Array.isArray(data.sections)) throw new Error('Structured menus require a sections array.');
  const items = [];
  for (const section of data.sections) {
    if (!Array.isArray(section.items)) throw new Error('Each section requires an items array.');
    for (const row of section.items) {
      const variants = Array.isArray(row.variants) ? row.variants.map(v=>({label:asText(v.label),price:asText(v.price)})) : [];
      items.push({section:asText(section.title)||'MENU',title:asText(row.name),description:asText(row.description),price:asText(row.price),nameSecondary:asText(row.name_secondary),descriptionSecondary:asText(row.description_secondary),allergens:asText(row.allergens),dietary:Array.isArray(row.dietary)?row.dietary.map(asText):[],variants,code:asText(row.code),sectionSecondary:asText(section.title_secondary),category:asText(section.category)});
    }
  }
  return items;
}
export function parseMenu(input) {
  if(input && typeof input === 'object') return parseStructuredMenu(input);
  const text = asText(input);
  if (text.startsWith('{')) { try { return parseStructuredMenu(text); } catch { return []; } }
  let section = "CHEF'S SELECTION";
  const items = [];
  for(const line of text.split(/\r?\n/)) {
    const raw = line.trim(); if(!raw)continue;
    const heading = raw.match(/^#{1,3}\s+(.+)/);
    if (heading || (!raw.includes('|') && raw === raw.toLocaleUpperCase() && raw !== raw.toLocaleLowerCase() && raw.length<100 && !/\d/.test(raw))) {
      section = (heading ? heading[1] : raw).trim(); continue;
    }
    const parts = raw.split(/\s*\|\s*/);
    let [title='',description='',price='',nameSecondary='',descriptionSecondary='',allergens='',dietary=''] = parts;
    if(parts.length===1) {const match=title.match(priceRe);if(match){title=match[1];price=match[2];}}
    if(parts.length===2 && /^(?:MX\$|US\$|A\$|\$|€|£)?\s*\d+(?:[.,]\d{1,2})?$/i.test(description)){price=description;description='';}
    if(asText(title)) items.push({section,title:asText(title),description:asText(description),price:asText(price),nameSecondary:asText(nameSecondary),descriptionSecondary:asText(descriptionSecondary),allergens:asText(allergens),dietary:asText(dietary).split(',').map(x=>x.trim()).filter(Boolean),variants:[],code:''});
  }
  return items;
}
export function validateBrief(brief) {
  const issues=[];
  if(!asText(brief.restaurant)) issues.push('Restaurant name is required.');
  const items=parseMenu(brief.menuText);
  if(!items.length) issues.push('Add at least one valid menu item. Paste plain text or structured JSON.');
  items.forEach((it,index)=>{
    if(!it.title) issues.push(`Item ${index+1} has no name.`);
    if(!it.price) issues.push(`Item ${index+1} (${it.title}) needs a confirmed price.`);
    if(it.price.length>28) issues.push(`Item ${index+1} has an unusually long price label.`);
    if(!it.section) issues.push(`Item ${index+1} needs a category.`);
  });
  const maxByPackage={refresh:25,signature:60,launch:100};
  if(brief.package && maxByPackage[brief.package] && items.length>maxByPackage[brief.package])issues.push(`The ${brief.package} package is limited to ${maxByPackage[brief.package]} items.`);
  if(String(brief.footer||'').length>120)issues.push('Footer is longer than the verified print safe area; shorten or make a second information page.');
  if(String(brief.restaurant||'').length>36)issues.push('Restaurant name exceeds 36 characters; confirm a shorter display name.');
  if(items.length>100)issues.push('The first release supports at most 100 items. Split the order into menus.');
  if(!STYLE_OPTIONS.some(s=>s.id===brief.styleId)) issues.push('Choose a supported original design direction.');
  return {ok:issues.length===0,issues,items,itemCount:items.length,sourceReferences:Array.isArray(brief.references)?brief.references.map(x=>({title:x.title,artist:x.by,url:x.href})):[]};
}
export function slugify(s){return String(s||'menu').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)||'menu'}
export function getStyle(id){return STYLE_OPTIONS.find(s=>s.id===id)||STYLE_OPTIONS[0]}

// Formatting only: never converts or rounds a client's price.
export function formatPrice(value,currency='$') {
  const price=String(value??'').trim();
  if(!price) return '';
  if(/^(?:MX\$|US\$|A\$|[$€£¥₹]|R\$|CHF\s|kr\s)/i.test(price) || /^(?:mp|market(?: price)?|free|ask)$/i.test(price)) return price;
  const symbol={USD:'$',MXN:'MX$',EUR:'€',GBP:'£',JPY:'¥',CAD:'C$',AUD:'A$'}[String(currency).toUpperCase()] || String(currency||'');
  return `${symbol}${price}`;
}
