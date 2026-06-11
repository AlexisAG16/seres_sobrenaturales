import fs from "node:fs/promises";
import path from "node:path";
import PptxGenJS from "pptxgenjs";
import sanitizeHtml from "sanitize-html";

const root=process.cwd();
const output=path.join(root,"storage","history-presentations");
const historyImages=path.join(root,"public","images","historia");
const source=path.join(root,"..","VampinfosHTML","necroarcano.html");
const colors={bg:"09080B",panel:"171219",blood:"A7162B",red:"D22B48",violet:"CDA8F5",ink:"F1E9DF",muted:"B7ABB2"};

function baseDeck(title){
  const pptx=new PptxGenJS();
  pptx.layout="LAYOUT_WIDE";
  pptx.author="Vampire - Archivo Sobrenatural";
  pptx.subject="Historia del universo sobrenatural";
  pptx.title=title;
  pptx.company="Archivo Sobrenatural";
  pptx.lang="es-AR";
  pptx.theme={headFontFace:"Georgia",bodyFontFace:"Aptos",lang:"es-AR"};
  pptx.defineSlideMaster({
    title:"STORY",
    background:{color:colors.bg},
    objects:[
      {line:{x:.55,y:.42,w:.55,h:0,line:{color:colors.blood,width:3}}},
      {text:{text:"ARCHIVO SOBRENATURAL",options:{x:1.18,y:.24,w:4.5,h:.35,fontFace:"Aptos",fontSize:10,bold:true,color:colors.violet,charSpacing:2}}},
      {text:{text:"VAMPIRE",options:{x:11.4,y:7.05,w:1.25,h:.22,fontFace:"Aptos",fontSize:8,bold:true,color:"796E75",align:"right"}}},
    ],
    slideNumber:{x:12.65,y:7.04,w:.25,h:.2,color:"796E75",fontSize:8},
  });
  return pptx;
}

function addCover(pptx,{kicker,title,subtitle,image}){
  const slide=pptx.addSlide();
  slide.background={color:colors.bg};
  if(image){
    slide.addImage({path:image,x:7.45,y:0,w:5.88,h:7.5});
    slide.addShape(pptx.ShapeType.rect,{x:6.1,y:0,w:7.25,h:7.5,fill:{color:colors.bg,transparency:35},line:{transparency:100}});
  }
  slide.addShape(pptx.ShapeType.line,{x:.75,y:1.05,w:.7,h:0,line:{color:colors.red,width:4}});
  slide.addText(kicker.toUpperCase(),{x:1.65,y:.86,w:4.8,h:.35,fontFace:"Aptos",fontSize:12,bold:true,color:colors.violet,charSpacing:3});
  slide.addText(title,{x:.75,y:1.55,w:7.2,h:1.65,fontFace:"Georgia",fontSize:38,bold:true,color:colors.ink,breakLine:false,margin:0});
  slide.addText(subtitle,{x:.78,y:3.48,w:5.8,h:1.05,fontFace:"Aptos",fontSize:19,color:colors.muted,breakLine:false,margin:0,fit:"shrink"});
  slide.addText("CRÓNICAS DE UN UNIVERSO ORIGINAL",{x:.78,y:6.62,w:4.8,h:.35,fontFace:"Aptos",fontSize:10,bold:true,color:colors.red,charSpacing:2});
}

function addTextSlide(pptx,title,paragraphs,{kicker="CRÓNICA",image}={}){
  const slide=pptx.addSlide("STORY");
  slide.addText(kicker,{x:.75,y:.82,w:2.6,h:.3,fontFace:"Aptos",fontSize:10,bold:true,color:colors.red,charSpacing:2});
  slide.addText(title,{x:.75,y:1.2,w:image?6.7:11.8,h:.7,fontFace:"Georgia",fontSize:28,bold:true,color:colors.ink,margin:0,fit:"shrink"});
  slide.addShape(pptx.ShapeType.line,{x:.75,y:2.05,w:image?6.3:11.8,h:0,line:{color:"553241",width:1}});
  const body=paragraphs.map(text=>({text,options:{bullet:text.startsWith("•")?{indent:18}:undefined,breakLine:true}}));
  slide.addText(body,{x:.78,y:2.3,w:image?6.25:11.65,h:3.95,fontFace:"Aptos",fontSize:18,color:colors.muted,breakLine:false,margin:.06,paraSpaceAfterPt:12,valign:"top",fit:"shrink"});
  if(image){
    slide.addImage({path:image,x:7.45,y:1.15,w:5.15,h:5.55,sizing:"contain"});
    slide.addShape(pptx.ShapeType.rect,{x:7.45,y:1.15,w:5.15,h:5.55,fill:{transparency:100},line:{color:"68364A",width:1}});
  }
}

function addImageSlide(pptx,title,image,caption){
  const slide=pptx.addSlide("STORY");
  slide.addText(title,{x:.75,y:.82,w:11.7,h:.65,fontFace:"Georgia",fontSize:28,bold:true,color:colors.ink,margin:0});
  slide.addImage({path:image,x:.95,y:1.65,w:11.45,h:4.95,sizing:"contain"});
  slide.addText(caption,{x:1.2,y:6.65,w:10.9,h:.38,fontFace:"Aptos",fontSize:12,italic:true,color:colors.muted,align:"center",margin:0});
}

function addClosing(pptx,title,text){
  const slide=pptx.addSlide();
  slide.background={color:colors.bg};
  slide.addShape(pptx.ShapeType.line,{x:5.9,y:1.35,w:1.5,h:0,line:{color:colors.red,width:4}});
  slide.addText(title,{x:1.5,y:2.05,w:10.3,h:1,fontFace:"Georgia",fontSize:36,bold:true,color:colors.ink,align:"center",margin:0});
  slide.addText(text,{x:2.1,y:3.4,w:9.1,h:1.2,fontFace:"Aptos",fontSize:20,color:colors.muted,align:"center",valign:"mid",fit:"shrink"});
  slide.addText("ARCHIVO SOBRENATURAL · VAMPIRE",{x:3.8,y:6.4,w:5.7,h:.35,fontFace:"Aptos",fontSize:10,bold:true,color:colors.violet,align:"center",charSpacing:2});
}

function chunks(text,max=900){
  const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];
  const result=[];let current="";
  for(const sentence of sentences){if((current+" "+sentence).length>max&&current){result.push(current.trim());current=sentence}else current+=` ${sentence}`}
  if(current.trim())result.push(current.trim());
  return result;
}

async function vampires(){
  const pptx=baseDeck("Historia de los Vampiros");
  addCover(pptx,{kicker:"Crónica de linajes",title:"Historia de los Vampiros",subtitle:"Geografía, origen y genealogía del linaje vampírico",image:path.join(historyImages,"geografiavmp.png")});
  addTextSlide(pptx,"La sangre nace en el corazón de Europa",["Los vampiros del Archivo Sobrenatural nacen de una tradición europea atravesada por la sangre, la inmortalidad y los secretos familiares.","El origen del linaje se sitúa principalmente en Europa central y oriental. Rumania ocupa el centro de esta tradición, acompañada por Bulgaria, Hungría, Polonia, República Checa, Rusia y Ucrania."],{kicker:"ORIGEN",image:path.join(historyImages,"geografiavmp.png")});
  addTextSlide(pptx,"Siete territorios sostienen la leyenda",["• Bulgaria","• Hungría","• Polonia","• República Checa","• Rumania, territorio principal","• Rusia","• Ucrania"],{kicker:"GEOGRAFÍA"});
  addImageSlide(pptx,"La primera expansión del linaje",path.join(historyImages,"arbolv.png"),"Primera etapa del árbol genealógico vampírico.");
  addImageSlide(pptx,"La sangre continúa a través del tiempo",path.join(historyImages,"arbolv2.png"),"Segunda etapa del árbol genealógico vampírico.");
  addClosing(pptx,"El linaje permanece","Cada generación añade nuevos vínculos, secretos y destinos a una genealogía condenada a sobrevivir.");
  await pptx.writeFile({fileName:path.join(output,"historia-vampiros.pptx")});
}

async function witches(){
  const pptx=baseDeck("Historia de las Brujas");
  addCover(pptx,{kicker:"Crónica arcana",title:"Historia de las Brujas",subtitle:"Origen europeo, persecución y legado de la magia",image:path.join(historyImages,"origenesb.png")});
  addTextSlide(pptx,"La magia sobrevivió a quienes intentaron borrarla",["La historia de las brujas está marcada menos por un único lugar de nacimiento que por siglos de relatos, persecuciones, conocimiento oculto y transmisión familiar.","Los relatos se extienden por gran parte de Europa central y occidental. En muchas regiones se conserva más memoria de la cacería y la persecución que de los primeros orígenes de la magia."],{kicker:"ORÍGENES",image:path.join(historyImages,"origenesb.png")});
  addTextSlide(pptx,"El conocimiento arcano cambia con cada generación",["Las brujas del Archivo Sobrenatural practican magia blanca y oscura, elaboran pociones y transmiten sus capacidades mediante linajes.","Algunas prolongan su vida. Otras desarrollan poderes que superan los conocimientos de generaciones anteriores.","La herencia no es solo sangre: también es memoria, disciplina y elección."],{kicker:"LEGADO"});
  addImageSlide(pptx,"La genealogía revela el nacimiento de nuevas órdenes",path.join(historyImages,"arbolb.png"),"Árbol genealógico de las brujas y transmisión familiar de la magia.");
  addClosing(pptx,"La magia nunca desaparece","Cambia de manos, adopta nuevos nombres y espera a que una nueva heredera descubra su poder.");
  await pptx.writeFile({fileName:path.join(output,"historia-brujas.pptx")});
}

function extractBlocks(html){
  const matches=[...html.matchAll(/<(h2|h3|h4|p|li|cite)[^>]*>([\s\S]*?)<\/\1>/gi)];
  return matches.map(match=>({tag:match[1].toLowerCase(),text:sanitizeHtml(match[2],{allowedTags:[],allowedAttributes:{}}).replace(/\s+/g," ").trim()})).filter(block=>block.text&&block.text!=="FIN");
}

async function necromancy(){
  const pptx=baseDeck("Necromancia vs. Arcano");
  addCover(pptx,{kicker:"Crónica mayor",title:"Necromancia vs. Arcano",subtitle:"La historia de Mrs. Vampira y Manuela, la Bruja Suprema",image:path.join(historyImages,"origenes.jpg")});
  addTextSlide(pptx,"Dos mujeres unidas por una historia que terminaría en guerra",["Una historia de amistad, herencia, secretos familiares y venganza que comienza en el siglo XIX y enfrenta para siempre a la necromancia con el poder arcano."],{kicker:"1849 — EL ORIGEN",image:path.join(historyImages,"manuelareal.png")});
  const html=await fs.readFile(source,"utf8");
  const blocks=extractBlocks(html);
  let chapter="La crónica";let buffer=[];
  const flush=()=>{
    if(!buffer.length)return;
    const combined=buffer.join("\n\n");
    chunks(combined,1050).forEach((part,index)=>addTextSlide(pptx,index?`${chapter} · continuación`:chapter,[part],{kicker:"NECROMANCIA VS. ARCANO"}));
    buffer=[];
  };
  for(const block of blocks){
    if(["h2","h3","h4"].includes(block.tag)){flush();chapter=block.text.replace(" ,",",")}
    else buffer.push(block.tag==="li"?`• ${block.text}`:block.text);
  }
  flush();
  addClosing(pptx,"El final solo abrió una nueva herida","La historia de Mrs. Vampira y Manuela permanece como el punto de quiebre entre la necromancia y el poder arcano.");
  await pptx.writeFile({fileName:path.join(output,"necromancia-vs-arcano.pptx")});
}

await fs.mkdir(output,{recursive:true});
await vampires();
await witches();
await necromancy();
console.log(`Presentaciones generadas en ${output}`);
