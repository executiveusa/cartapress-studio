import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {getStyle,validateBrief,formatPrice} from './menu.mjs';
import {composeMenu} from './layout.mjs';
const mm = n => n*72/25.4;
function hex(s) {const n=parseInt(String(s).slice(1),16);return rgb(((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255);}
function checkEncoding(text,font) {
  try {font.encodeText(String(text));} catch {throw new Error('Some menu characters are not supported by the PDF proof fonts. Use SVG or supply an appropriate licensed embedded font before printing.');}
}
export async function buildPDF(brief) {
  const v=validateBrief(brief);if(!v.ok)throw new Error(v.issues.join(' '));
  const layout=composeMenu(brief);const pdf=await PDFDocument.create();
  pdf.setCreator('CartaPress Studio');pdf.setTitle(`${brief.restaurant} menu — client proof`);
  const regular=await pdf.embedFont(StandardFonts.Helvetica);
  const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif=await pdf.embedFont(StandardFonts.TimesRomanBold);
  const style=getStyle(brief.styleId), paper=hex(style.paper), ink=hex(style.ink), accent=hex(style.accent);
  const w=layout.widthMM,h=layout.heightMM,center=w/2;const W=mm(w+6),H=mm(h+6); // 3mm bleed on every side
  for(let pageIndex=0;pageIndex<layout.pages.length;pageIndex++) {
    const page=pdf.addPage([W,H]);
    const yAt=top=>mm(h+6-3-top);
    const xAt=x=>mm(3+x);
    const line=(x1,y1,x2,y2,color,width=.4)=>page.drawLine({start:{x:xAt(x1),y:yAt(y1)},end:{x:xAt(x2),y:yAt(y2)},color,thickness:mm(width)});
    function text(str,x,top,size,font,color,align='left',maxWidth=180) {
      const value=String(str||'');checkEncoding(value,font);const pt=mm(size);
      const width=font.widthOfTextAtSize(value,pt);
      const available=mm(maxWidth);
      // Refit rather than drop characters. Severe contraction fails visibly.
      const scale=width>available?available/width:1;
      if(scale<.74)throw new Error(`Print proof line exceeds available width: ${value.slice(0,50)}`);
      const drawSize=pt*scale;
      const drawWidth=font.widthOfTextAtSize(value,drawSize);
      const origin=align==='center'?xAt(x)-drawWidth/2:align==='right'?xAt(x)-drawWidth:xAt(x);
      page.drawText(value,{x:origin,y:yAt(top),size:drawSize,font,color});
    }
    page.drawRectangle({x:0,y:0,width:W,height:H,color:paper});
    for(const [x1,y1,x2,y2] of [[10,10,w-10,10],[w-10,10,w-10,h-10],[w-10,h-10,10,h-10],[10,h-10,10,10]])line(x1,y1,x2,y2,accent);
    text((brief.tagline||'FOOD · PEOPLE · PLACE').toUpperCase(),center,28,3.2,regular,accent,'center',175);
    text(brief.restaurant,center,48,(String(brief.restaurant||'').length>28?7:String(brief.restaurant||'').length>20?9:12),serif,ink,'center',185);
    line(center-50,54,center+50,54,accent,.65);
    text((brief.subtitle||'THE MENU').toUpperCase(),center,65,3.4,regular,ink,'center',175);
    if(layout.columns===2)line(center,76,center,h-26,accent,.2);
    for(const row of layout.pages[pageIndex]) {
      let y=row.y;const {item,x,width,sectionHeader}=row;
      if(sectionHeader){y+=3;for(const sectionLine of row.sectionLines){text(sectionLine,x,y+4.15,4.15,serif,accent,'left',width);y+=5.1;}line(x,y+1.8,x+width,y+1.8,accent,.28);y+=2;}
      for(let i=0;i<row.titleLines.length;i++){
        text(row.titleLines[i],x,y+3.8,3.9,bold,ink,'left',width-18);
        if(i===0)text(formatPrice(item.price,brief.currency),x+width,y+3.8,3.85,bold,ink,'right',17);
        y+=5.25;
      }
      for(const [key,fontSize,lineHeight] of [
        ['titleSecondaryLines',3.25,3.9],['descriptionLines',3.05,4.15],['descriptionSecondaryLines',2.8,3.65],['variantLines',2.65,3.4],['allergenLines',2.45,3.2],['dietaryLines',2.45,3.2]
      ])for(const itemLine of row[key]){text(itemLine,x,y+fontSize,fontSize,regular,ink,'left',width);y+=lineHeight;}
    }
    line(center-50,h-18,center+50,h-18,accent,.4);
    text(String(brief.footer||'Please ask us about allergens · Prices subject to change.'),center,h-12,2.65,regular,ink,'center',175);
    text(`${pageIndex+1} / ${layout.pages.length}`,w-17,h-12,2.5,regular,ink,'right',16);
    // Crop marks: outside the A4 trim area, within the bleed zone.
    for(const x of [3,w+3])for(const y of [3,h+3]){
      const sx=x===3?-1:1, sy=y===3?-1:1;
      const px=mm(x),py=mm(y);
      page.drawLine({start:{x:px+mm(sx*.7),y:py},end:{x:px+mm(sx*2.5),y:py},thickness:.3,color:rgb(.15,.15,.15)});
      page.drawLine({start:{x:px,y:py+mm(sy*.7)},end:{x:px,y:py+mm(sy*2.5)},thickness:.3,color:rgb(.15,.15,.15)});
    }
  }
  return pdf.save();
}
