#!/usr/bin/env node
// CartaPress agent MCP — local, deterministic, approval-gated outputs.
import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {ListToolsRequestSchema,CallToolRequestSchema} from '@modelcontextprotocol/sdk/types.js';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {validateBrief,parseMenu,STYLE_OPTIONS,slugify} from '../src/lib/menu.mjs';
import {buildSVG,svgPageCount} from '../src/lib/svg.mjs';
import {buildPDF} from '../src/lib/print.mjs';
import {buildDigitalHtml} from '../src/lib/digital.mjs';
import {composeMenu,getPageSize} from '../src/lib/layout.mjs';
import {approvalFingerprint} from '../src/lib/approval.mjs';
const fingerprint=approvalFingerprint;
const root=path.resolve(process.env.CARTAPRESS_PROJECTS_DIR||'./projects');
const reply=(data)=>({content:[{type:'text',text:JSON.stringify(data,null,2)}]});
const textField=(description,required=true)=>({type:'string',description});
const tools=[
 {name:'cartapress_catalog',description:'Describe the 190 attributed external visual references (not reusable artwork) and the five ORIGINAL production styles.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'cartapress_create_brief',description:'Create a private draft restaurant menu brief; never create real marketplace orders.',inputSchema:{type:'object',properties:{restaurant:textField('Restaurant name'),menuText:textField('Plain text menu: SECTION lines and Item | description | price'),styleId:{type:'string',enum:STYLE_OPTIONS.map(x=>x.id)},currency:{type:'string',description:'Display symbol like $, MX$, €, £ or ISO code'},printSize:{type:'string',enum:['A4','Letter'],description:'A4 or US Letter finished trim'},printRegion:{type:'string'},printQty:{type:'string'},siteURL:{type:'string'},tagline:{type:'string'},subtitle:{type:'string'},footer:{type:'string'},package:{type:'string',enum:['refresh','signature','launch']},references:{type:'array',items:{type:'object',properties:{title:{type:'string'},by:{type:'string'},href:{type:'string'}}}}},required:['restaurant','menuText','styleId'],additionalProperties:false}},
 {name:'cartapress_preview',description:'Generate editable proof SVG pages, digital HTML and source fingerprint before external approval; not a final deliverable.',inputSchema:{type:'object',properties:{projectId:textField('Local project ID')},required:['projectId'],additionalProperties:false}},
 {name:'cartapress_validate',description:'Read a draft, check required prices and produce actionable errors before design is approved.',inputSchema:{type:'object',properties:{projectId:textField('Local project ID')},required:['projectId'],additionalProperties:false}},
 {name:'cartapress_update_menu',description:'Replace draft menu with client-confirmed content, invalidating any previous approval.',inputSchema:{type:'object',properties:{projectId:textField('Local project ID'),menuText:textField('Corrected, client-confirmed menu text')},required:['projectId','menuText'],additionalProperties:false}},
 {name:'cartapress_approve',description:'Record explicit client approval of EVERY price and the final visual proof. Only call after external approval is documented.',inputSchema:{type:'object',properties:{projectId:{type:'string'},clientApprovalRecord:{type:'string',description:'An independently verifiable client approval record, not agent-generated'},previewHash:{type:'string',description:'The exact SHA256 fingerprint returned by cartapress_preview'},approved:{type:'boolean',description:'Must be true and supported by client proof'}},required:['projectId','clientApprovalRecord','previewHash','approved'],additionalProperties:false}},
 {name:'cartapress_export',description:'Export local SVG, 3mm-bleed RGB PDF proof, editable menu JSON, and manifest. Only approved briefs may export.',inputSchema:{type:'object',properties:{projectId:{type:'string'}},required:['projectId'],additionalProperties:false}},
 {name:'cartapress_print_routes',description:'Return verified print vendor and affiliate-application links, no active commission claim.',inputSchema:{type:'object',properties:{},additionalProperties:false}}
];
function fileFor(id){if(!/^[a-z0-9-]{5,100}$/.test(id))throw Error('Invalid project ID');return path.join(root,id,'brief.json')}
async function read(id){return JSON.parse(await readFile(fileFor(id),'utf8'))}
async function save(id,obj){await mkdir(path.dirname(fileFor(id)),{recursive:true});await writeFile(fileFor(id),JSON.stringify(obj,null,2)+'\n',{mode:0o600})}
const server=new Server({name:'cartapress-agent',version:'0.1.0'},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools}));
server.setRequestHandler(CallToolRequestSchema,async(req)=>{
 const {name,arguments:args={}}=req.params;
 try {
  if(name==='cartapress_catalog')return reply({referenceCount:190,referenceSource:'https://github.com/franlopz/menu-inspiration',note:'Gallery images remain hosted and copyrighted by their authors. No templates or rights are transferred.',styles:STYLE_OPTIONS});
  if(name==='cartapress_print_routes')return reply({partnershipStatus:'not-enrolled',disclosureRequired:true,options:[{name:'FedEx Office',type:'menu printing, upload your PDF',url:'https://www.office.fedex.com/default/menus.html'},{name:'MustHaveMenus',type:'affiliate application; publicly advertises 10% recurring on eligible sales',url:'https://www.musthavemenus.com/content/affiliate'},{name:'MOO',type:'print affiliate/reseller application',url:'https://www.moo.com/us/partner'}],warning:'Never place print orders or promise commissions without permission and confirmed agreements.'});
  if(name==='cartapress_create_brief'){
    const id=slugify(args.restaurant)+'-'+randomUUID().slice(0,8);const doc={...args,printSize:args.printSize||'A4',id,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),status:'draft',approval:null};await save(id,doc);
    return reply({projectId:id,status:'draft',validation:validateBrief(doc)});
  }
  if(name==='cartapress_validate') {const doc=await read(args.projectId);return reply({projectId:doc.id,status:doc.status,validation:validateBrief(doc),pageCount:composeMenu(doc).pages.length,contentHash:fingerprint(doc)})}
  if(name==='cartapress_preview'){const doc=await read(args.projectId);const v=validateBrief(doc);if(!v.ok)throw Error(v.issues.join(' '));const dir=path.join(path.dirname(fileFor(doc.id)),'preview');await mkdir(dir,{recursive:true});const count=svgPageCount(doc);const files=[];for(let i=0;i<count;i++){const fn=`draft-page-${i+1}.svg`;await writeFile(path.join(dir,fn),buildSVG(doc,i));files.push(fn)}await writeFile(path.join(dir,'digital-menu.html'),buildDigitalHtml(doc));files.push('digital-menu.html');const hash=fingerprint(doc);doc.previewHash=hash;doc.status='proof';await save(doc.id,doc);return reply({projectId:doc.id,status:doc.status,previewHash:hash,previewDirectory:dir,files,clientApprovalRequired:true,warning:'Draft proof only: confirm every price and verify printer requirements.'});}
  if(name==='cartapress_update_menu'){const doc=await read(args.projectId);if(doc.status==='exported')throw Error('Delivered project is frozen; create a new version');doc.menuText=String(args.menuText);doc.status='draft';doc.approval=null;doc.previewHash=null;doc.updatedAt=new Date().toISOString();await save(args.projectId,doc);return reply({projectId:doc.id,status:doc.status,validation:validateBrief(doc)})}
  if(name==='cartapress_approve'){
   const doc=await read(args.projectId);const v=validateBrief(doc);if(!v.ok)throw Error(v.issues.join(' '));
   if(doc.status!=='proof'||!doc.previewHash||doc.previewHash!==fingerprint(doc)||args.previewHash!==doc.previewHash)throw Error('An exact, current previewHash is required before client approval.');
   if(args.approved!==true||!String(args.clientApprovalRecord||'').trim()||String(args.clientApprovalRecord).length<8)throw Error('Actual client proof and explicit approval are required');
   doc.approval={record:args.clientApprovalRecord,approvedAt:new Date().toISOString(),pricesConfirmed:true,visualApproved:true,previewHash:doc.previewHash};doc.status='approved';doc.updatedAt=new Date().toISOString();await save(doc.id,doc);return reply({projectId:doc.id,status:doc.status});
  }
  if(name==='cartapress_export'){
   const doc=await read(args.projectId);if(doc.status!=='approved'||!doc.approval?.pricesConfirmed||doc.approval.previewHash!==fingerprint(doc))throw Error('Client approval gate is not satisfied for this exact revision');
   const base=path.dirname(fileFor(doc.id));const output=path.join(base,'output');await mkdir(output,{recursive:true});
   const files=[];
   for(let page=0;page<svgPageCount(doc);page++){const name=`menu-page-${String(page+1).padStart(2,'0')}.svg`;await writeFile(path.join(output,name),buildSVG(doc,page));files.push(name)}
   const bytes=await buildPDF(doc);await writeFile(path.join(output,'menu-print-proof.pdf'),bytes);files.push('menu-print-proof.pdf');
   await writeFile(path.join(output,'menu-data.json'),JSON.stringify(parseMenu(doc.menuText),null,2));files.push('menu-data.json');
   await writeFile(path.join(output,'digital-menu.html'),buildDigitalHtml(doc));files.push('digital-menu.html');
   await writeFile(path.join(output,'prepress.txt'),`${getPageSize(doc).name} ${getPageSize(doc).widthMM}x${getPageSize(doc).heightMM}mm trim, 3mm bleed; RGB PDF is a proof, not certified CMYK. Independently verify menu facts and printer specifications.\n`);files.push('prepress.txt');
   const manifest={projectId:doc.id,files,approval:doc.approval,contentHash:fingerprint(doc),warning:'RGB PDF proof, not guaranteed CMYK press-ready. Printer preflight required. References not licensed for reproduction.'};await writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));files.push('manifest.json');
   doc.status='exported';doc.updatedAt=new Date().toISOString();await save(doc.id,doc);return reply({projectId:doc.id,outputDirectory:output,files,printQA:'PENDING_EXTERNAL_PRINTER_PROOF'});
  }
  throw Error(`Unknown tool: ${name}`)
 } catch(e) {return {isError:true,content:[{type:'text',text:e instanceof Error?e.message:String(e)}]}}
});
await mkdir(root,{recursive:true});await server.connect(new StdioServerTransport());
