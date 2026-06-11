import sanitizeHtml from "sanitize-html";
import { CLASSES_BY_TYPE,isSerType } from "@/lib/ser-options";
const clean=(value:unknown)=>typeof value==="string"?sanitizeHtml(value,{allowedTags:[],allowedAttributes:{}}).trim():"";
export function validateSer(input:Record<string,unknown>){
  const data={tipo:clean(input.tipo),clase:clean(input.clase),nombre_comun:clean(input.nombre_comun),nombre_real:clean(input.nombre_real),sexo:clean(input.sexo),pais_ciudad:clean(input.pais_ciudad),epoca_vida:clean(input.epoca_vida),padres:Array.isArray(input.padres)?input.padres.map(clean).filter(Boolean):[],poderes:Array.isArray(input.poderes)?input.poderes.map(clean).filter(Boolean):[],biografia:clean(input.biografia),mision:clean(input.mision),imagen:clean(input.imagen),audio:clean(input.audio),video:clean(input.video)};
  if(!data.nombre_comun)throw new Error("El nombre común es obligatorio.");
  if(!isSerType(data.tipo))throw new Error("El tipo no es válido.");
  if(data.tipo==="Humano")data.clase="";
  else if(!CLASSES_BY_TYPE[data.tipo].some(option=>option.value===data.clase))throw new Error("La clase es obligatoria y debe corresponder al tipo seleccionado.");
  if(data.sexo&&!["Masculino","Femenino","LGTBQ+"].includes(data.sexo))throw new Error("El sexo no es válido.");
  return data;
}
