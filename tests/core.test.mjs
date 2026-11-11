import assert from 'node:assert/strict';
import {test} from 'node:test';
import {parseMenu,validateBrief,SAMPLE_TEXT,STYLE_OPTIONS} from '../src/lib/menu.mjs';
import {buildSVG,svgPageCount} from '../src/lib/svg.mjs';
import {parseReferenceHtml} from '../src/lib/catalog.mjs';
test('sample has 8 items and categories',()=>{const a=parseMenu(SAMPLE_TEXT);assert.equal(a.length,8);assert.equal(new Set(a.map(x=>x.section)).size,3)});
test('refuse missing prices',()=>{const a=validateBrief({restaurant:'A',styleId:'editorial',menuText:'MAINS\nSoup | tomato'});assert.equal(a.ok,false);assert.match(a.issues.join(' '),/price/i)});
test('all styles create editable original svg',()=>{for(const s of STYLE_OPTIONS){const x=buildSVG({restaurant:'Test & Co',tagline:'Fresh',styleId:s.id,menuText:SAMPLE_TEXT,footer:'Thanks'});assert.match(x,/<svg/);assert.match(x,/Test &amp; Co/);assert.match(x,/Whipped Ricotta/);assert.equal(svgPageCount({menuText:SAMPLE_TEXT}),1)}});
test('SVG content escapes untrusted text',()=>{const x=buildSVG({restaurant:'<script>alert(1)</script>',styleId:'modern',menuText:'MEALS\nSoup | <img src=x> | 12'});assert.ok(!x.includes('<script>'));assert.ok(!x.includes('<img src=x>'))});
test('reference parser accepts exactly 190 safely attributed references',()=>{const rows=Array.from({length:190},(_,i)=>({num:i+1,cat:'mex',src:'Dribbble',title:'Demo',by:'Artist',href:'https://dribbble.com/shots/a',thumb:'https://cdn.dribbble.com/image.png',large:'https://cdn.dribbble.com/image.png'}));assert.equal(parseReferenceHtml(`<script>const ITEMS=${JSON.stringify(rows)};\nconst CATS={};</script>`).length,190)});
test('reference parser rejects untrusted image host',()=>{const rows=Array.from({length:190},(_,i)=>({num:i+1,href:'https://evil.example/x',thumb:'https://evil.example/x'}));assert.throws(()=>parseReferenceHtml(`const ITEMS=${JSON.stringify(rows)};\nconst CATS={};`))});
import {composeMenu,wrapWords} from '../src/lib/layout.mjs';
import {parseStructuredMenu,formatPrice} from '../src/lib/menu.mjs';
import {buildDigitalHtml} from '../src/lib/digital.mjs';
test('never silently drop 60 or 100 items when paging',()=>{
  for(const n of [25,60,100]){
    const txt=['ENTREES',...Array.from({length:n},(_,i)=>`Dish ${i+1} | roasted vegetables and citrus sauce | ${i+10}.00`)].join('\n');
    const l=composeMenu({menuText:txt});
    assert.equal(l.pages.flat().length,n);
    assert.equal(l.pages.flat().map(x=>x.item.title).join(','),Array.from({length:n},(_,i)=>`Dish ${i+1}`).join(','));
    assert.ok(l.pages.every(page=>page.every(row=>row.y+row.height<=271)));
    assert.equal(svgPageCount({menuText:txt}),l.pages.length);
    for(let i=0;i<l.pages.length;i++)assert.match(buildSVG({restaurant:'Test',styleId:'modern',menuText:txt},i),/<svg/);
  }
});
test('preserves bilingual MenuVision JSON, variant labels, allergens, and price punctuation',()=>{
 const data={restaurant:{name:'Café'},sections:[{title:'BEBIDAS',items:[{name:'Café con leche',name_secondary:'Coffee with milk',description:'Con avena',description_secondary:'Oat milk option',price:'3,90',allergens:'A G',dietary:['vegetarian'],variants:[{label:'grande',price:'4,90'}]}]}]};
 const items=parseStructuredMenu(data);
 assert.equal(items.length,1);assert.equal(items[0].price,'3,90');assert.equal(items[0].nameSecondary,'Coffee with milk');
 assert.equal(items[0].variants[0].price,'4,90');
 const html=buildDigitalHtml({restaurant:'Café',menuText:JSON.stringify(data),styleId:'cantina',currency:'€'});
 assert.match(html,/€3,90/);assert.match(html,/Coffee with milk/);assert.match(html,/Allergens: A G/);
});
test('portable digital HTML escapes source markup and retains all 100 prices',()=>{
 const menuText=['FOODS',...Array.from({length:100},(_,i)=>`Dish ${i+1} | description | ${i+1}`)].join('\n');
 const html=buildDigitalHtml({restaurant:'<img src=x onerror=alert(1)>',menuText,styleId:'modern',currency:'MXN'});
 assert.ok(!html.includes('<img src=x onerror=alert(1)>'));
 for(let i=1;i<=100;i++)assert.ok(html.includes(`MX$${i}`),`price ${i} missing`);
 assert.equal((html.match(/class="dish"/g)||[]).length,100);
});
test('validates package limits and preserves printed prices',()=>{
 const txt=['MAINS',...Array.from({length:26},(_,i)=>`Dish ${i} | fresh | ${i+1}`)].join('\n');
 assert.equal(validateBrief({restaurant:'Demo',styleId:'editorial',menuText:txt,package:'refresh'}).ok,false);
 assert.equal(formatPrice('MX$35','MXN'),'MX$35');assert.equal(formatPrice('35','MXN'),'MX$35');
 assert.equal(formatPrice('3,90','EUR'),'€3,90');
});
test('wraps unusually long text without deleting source characters',()=>{
 const phrase='Gorgeous seasonal vegetables with extra crispy potatoes';
 assert.equal(wrapWords(phrase,14).join(' '),phrase);
});
test('US Letter vectors use correct trim and keep footer inside sheet',()=>{
 const out=buildSVG({restaurant:'Letter Test',styleId:'modern',menuText:SAMPLE_TEXT,printSize:'Letter'});
 assert.match(out,/width="215\.9mm" height="279\.4mm"/);
 assert.match(out,/y="267\.4"[^>]*>Please ask us about allergens/);
 const l=composeMenu({menuText:SAMPLE_TEXT,printSize:'Letter'});
 assert.ok(l.pages.flat().every(row=>row.y+row.height<=279.4-26));
});

import {approvalFingerprint} from '../src/lib/approval.mjs';
test('approval fingerprint invalidates every material export setting',()=>{
 const base={restaurant:'Test',menuText:SAMPLE_TEXT,styleId:'editorial',printSize:'A4',currency:'USD',references:[{title:'Style',href:'https://dribbble.com/shots/a'}]};
 const hash=approvalFingerprint(base);
 for(const [k,v] of [['printSize','Letter'],['currency','MXN'],['menuText',SAMPLE_TEXT+'\nExtra | more | 15'],['references',[]],['styleId','noir']])
   assert.notEqual(approvalFingerprint({...base,[k]:v}),hash,`failed to capture ${k}`);
 assert.equal(approvalFingerprint({...base,status:'approved',updatedAt:'later',approval:{fake:true}}),hash);
});

test('preserves explicit currency symbols in unseparated source text',()=>{
 const rows=parseMenu('DRINKS\nCoffee €12\nTaco MX$39\nJuice £4,50\nTea 3');
 assert.deepEqual(rows.map(r=>r.price),['€12','MX$39','£4,50','3']);
 assert.deepEqual(rows.map(r=>r.title),['Coffee','Taco','Juice','Tea']);
});
