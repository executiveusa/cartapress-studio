import { parseMenu } from './menu.mjs';

// One source of truth for printable and on-screen vector pagination.
// All coordinates are millimetres measured from the top-left A4 trim edge.
// An item is either placed in full or moved intact to the next column/page.
const TOP = 77;
export function getPageSize(brief={}) {return brief.printSize==='Letter'?{name:'US Letter',widthMM:215.9,heightMM:279.4}:{name:'A4',widthMM:210,heightMM:297};}

export function wrapWords(value, limit = 40) {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const words = clean.split(' ');
  const lines = [];
  let line = '';
  for (let word of words) {
    while (word.length > limit) {
      if (line) { lines.push(line); line = ''; }
      lines.push(word.slice(0, limit));
      word = word.slice(limit);
    }
    if (!word) continue;
    if (!line) line = word;
    else if ((line + ' ' + word).length <= limit) line += ' ' + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

export function composeMenu(brief) {
  const items = parseMenu(brief.menuText);
  const size=getPageSize(brief);
  const BOTTOM=size.heightMM-26;
  const columns = items.length > 13 ? 2 : 1;
  const xPositions = columns === 1 ? [22] : [17, size.widthMM / 2 + 4];
  const widths = columns === 1 ? [size.widthMM-44] : [size.widthMM/2-21, size.widthMM/2-21];
  const pages = [[]];
  let column = 0, y = TOP, lastSection = '';
  const warnings = [];
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const titleMax = columns === 1 ? 65 : 27;
    const secondaryMax = columns === 1 ? 73 : 34;
    const descMax = columns === 1 ? 105 : 45;
    const entry = {
      index, item,
      sectionLines: wrapWords(item.section, columns===1?65:30),
      titleLines: wrapWords(item.title, titleMax),
      titleSecondaryLines: wrapWords(item.nameSecondary, secondaryMax),
      descriptionLines: wrapWords(item.description, descMax),
      descriptionSecondaryLines: wrapWords(item.descriptionSecondary, descMax),
      variantLines: wrapWords(item.variants?.length ? item.variants.map(v => `${v.label}: ${v.price}`).join(' · ') : '', descMax),
      allergenLines: wrapWords(item.allergens ? `Allergens: ${item.allergens}` : '', descMax),
      dietaryLines: wrapWords(item.dietary?.length ? item.dietary.join(' · ') : '', descMax)
    };
    const contentHeight = entry.titleLines.length * 5.25 +
      entry.titleSecondaryLines.length * 3.9 +
      entry.descriptionLines.length * 4.15 +
      entry.descriptionSecondaryLines.length * 3.65 +
      entry.variantLines.length * 3.4 + entry.allergenLines.length * 3.2 + entry.dietaryLines.length * 3.2 + 4;
    const position = () => {
      const sectionHeader = item.section !== lastSection;
      return { sectionHeader, height: contentHeight + (sectionHeader ? 3 + entry.sectionLines.length*5.1 + 2 : 0) };
    };
    let { sectionHeader, height } = position();
    if (y + height > BOTTOM) {
      column++;
      if (column >= columns) { pages.push([]); column = 0; }
      y = TOP;
      lastSection = '';
      ({ sectionHeader, height } = position());
    }
    if (y + height > BOTTOM) throw new Error(`Menu item ${index + 1} cannot fit on one page; shorten its content.`);
    pages.at(-1).push({ ...entry, x: xPositions[column], width: widths[column], y, column, sectionHeader, height });
    y += height;
    lastSection = item.section;
  }
  if (pages.length > 8) warnings.push('Long menu: consider a larger format or separate drinks menu.');
  return {pages, columns, itemCount:items.length, warnings, widthMM:size.widthMM, heightMM:size.heightMM, trim:size.name};
}
