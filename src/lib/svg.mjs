import {getStyle,formatPrice} from './menu.mjs';
import {composeMenu} from './layout.mjs';
const escape = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const label = (value, x, y, size, color, opts='') => `<text x="${x}" y="${Number(y.toFixed(2))}" font-size="${size}" fill="${color}" ${opts}>${escape(value)}</text>`;

export function buildSVG(brief, page = 0) {
  const style = getStyle(brief.styleId);
  const layout = composeMenu(brief);
  if (!Number.isInteger(page) || page < 0 || page >= layout.pages.length) throw new Error('Page outside layout');
  const w = layout.widthMM, h = layout.heightMM;const center=w/2;const footY=h-12;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" role="img" aria-label="Menu for ${escape(brief.restaurant)}">`;
  svg += `<rect width="${w}" height="${h}" fill="${style.paper}"/><rect x="10" y="10" width="${w-20}" height="${h-20}" fill="none" stroke="${style.accent}" stroke-width=".4"/>`;
  svg += label((brief.tagline || 'FOOD · PEOPLE · PLACE').toUpperCase(),center,28,3.2,style.accent,'text-anchor="middle" letter-spacing="1.3" font-family="sans-serif"');
  svg += label(String(brief.restaurant || 'YOUR RESTAURANT'),center,48,(String(brief.restaurant||'').length>28?7:String(brief.restaurant||'').length>20?9:12),style.ink,`text-anchor="middle" font-family="${escape(style.font)}" font-weight="bold"`);
  svg += `<path d="M${center-50} 54 H${center+50}" stroke="${style.accent}" stroke-width=".65"/>`;
  svg += label((brief.subtitle || 'THE MENU').toUpperCase(),center,65,3.4,style.ink,'text-anchor="middle" letter-spacing="1.4" font-family="sans-serif"');
  if (layout.columns === 2) svg += `<path d="M${center} 76 V${h-26}" stroke="${style.accent}" stroke-width=".19" opacity=".4"/>`;
  for (const row of layout.pages[page]) {
    const {item,x,width,sectionHeader} = row;
    let y = row.y;
    if (sectionHeader) {
      y += 3;
      for(const sectionLine of row.sectionLines){svg += label(sectionLine,x,y+4.15,4.15,style.accent,'font-family="Georgia,serif" font-weight="bold"');y+=5.1;}
      svg += `<path d="M${x} ${y+1.8} H${x+width}" stroke="${style.accent}" stroke-width=".28" opacity=".6"/>`;
      y+=2;
    }
    for (let i=0; i<row.titleLines.length; i++) {
      svg += label(row.titleLines[i],x,y+3.8,3.9,style.ink,'font-family="sans-serif" font-weight="bold"');
      if (i===0) svg += label(formatPrice(item.price,brief.currency), x+width, y+3.8,3.85,style.ink,'text-anchor="end" font-family="sans-serif" font-weight="bold"');
      y += 5.25;
    }
    for (const [key,fontSize,lineHeight,opacity] of [
      ['titleSecondaryLines',3.25,3.9,.88],
      ['descriptionLines',3.05,4.15,.78],
      ['descriptionSecondaryLines',2.8,3.65,.75],
      ['variantLines',2.65,3.4,.89],
      ['allergenLines',2.45,3.2,.75],
      ['dietaryLines',2.45,3.2,.75]
    ]) {
      for (const line of row[key]) {svg += label(line,x,y+fontSize,fontSize,style.ink,`font-family="sans-serif" opacity="${opacity}"`);y += lineHeight;}
    }
  }
  svg += `<path d="M${center-50} ${h-18} H${center+50}" stroke="${style.accent}" stroke-width=".4"/>`;
  svg += label(String(brief.footer || 'Please ask us about allergens · Prices subject to change.'),center,footY,2.65,style.ink,'text-anchor="middle" font-family="sans-serif"');
  svg += label(`${page+1} / ${layout.pages.length}`,w-17,footY,2.5,style.ink,'text-anchor="end" font-family="sans-serif"');
  return svg + '</svg>';
}
export function svgPageCount(brief){return composeMenu(brief).pages.length;}
