import {mkdir,writeFile} from 'node:fs/promises';
import {buildSVG,svgPageCount} from '../src/lib/svg.mjs';
import {buildDigitalHtml} from '../src/lib/digital.mjs';
const root = new URL('../marketplace/samples/',import.meta.url);
await mkdir(root,{recursive:true});
const concepts=[
  {id:'01-cantina',restaurant:'Mar y Maíz',styleId:'cantina',currency:'MX$',tagline:'COCINA DE COSTA · HECHA CON AMOR',subtitle:'MENÚ DE LA CASA',footer:'Diseño conceptual · Restaurante ficticio · Precios ilustrativos',menuText:`BOTANAS\nGuacamole de la Casa | totopos crujientes, cilantro y limón | 120\nEsquites Dorados | elote tatemado, queso fresco y chile | 85\nTostada de Atún | aguacate, pepino y cebolla morada | 165\n\nTACOS\nTaco de Pescado | pescado a la plancha, repollo, salsa cremosa | 68\nCochinita al Pibil | achiote, cebolla morada, habanero | 65\nChampiñones al Ajillo | hongos, perejil, crema de chile | 58\n\nPOSTRES\nFlan de Café | caramelo, vainilla de Veracruz | 95\nPastel de Tres Leches | crema fresca, canela | 105`},
  {id:'02-bistro',restaurant:'Oak & Ember',styleId:'editorial',currency:'$',tagline:'NEIGHBORHOOD SUPPER CLUB',subtitle:'DINNER · FALL 2026',footer:'Concept design · Fictional restaurant · Illustrative prices',menuText:`TO BEGIN\nBurrata | heirloom tomato, toasted sourdough | 17\nCharred Broccolini | toasted almond, anchovy butter | 13\nSteak Tartare | dijon, cornichon, grilled brioche | 21\n\nTHE MAIN EVENT\nRoast Chicken | preserved lemon, crispy potatoes | 29\nSeared Trout | charred fennel, brown butter | 32\nWild Mushroom Pappardelle | parmesan, sage, cream | 27\nRibeye for Two | peppercorn jus, house fries | 86\n\nFINISH SWEET\nPear Frangipane | honey ice cream | 13\nDark Chocolate Pot de Crème | whipped crème fraîche | 12`},
  {id:'03-cafe',restaurant:'Little Fig Café',styleId:'botanical',currency:'$',tagline:'A GOOD DAY STARTS HERE',subtitle:'BRUNCH & COFFEE',footer:'Concept design · Fictional restaurant · Illustrative prices',menuText:`THE MORNING TABLE\nRicotta Toast | fresh figs, local honey | 14\nGarden Omelette | asparagus, spinach, chèvre | 16\nBreakfast Sandwich | egg, cheddar, brioche | 13\nChia & Coconut | seasonal berries, toasted seeds | 11\n\nCOFFEE BAR\nFlat White | double ristretto, silky milk | 5\nMatcha Latte | ceremonial green tea, oat milk | 6\nCold Brew | slow steeped, lightly sweetened | 5\n\nBAKERY\nAlmond Croissant | baked daily | 6\nLemon Olive Oil Cake | vanilla glaze | 7`}
];
for(const x of concepts){
  const brief={...x,portfolioSample:true};
  await writeFile(new URL(`${x.id}.json`,root),JSON.stringify(brief,null,2));
  for(let i=0;i<svgPageCount(brief);i++)await writeFile(new URL(`${x.id}-page-${i+1}.svg`,root),buildSVG(brief,i));
  await writeFile(new URL(`${x.id}.html`,root),buildDigitalHtml(brief));
}
console.log(`Generated ${concepts.length} original, clearly fictional portfolio concepts.`);
