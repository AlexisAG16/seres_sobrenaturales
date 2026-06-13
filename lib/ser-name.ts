import { Ser } from "@/models/Ser";

function escapeRegex(value:string){
  return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
}

export async function ensureUniqueSerName(name:string,excludeId?:string){
  const filter:Record<string,unknown>={
    nombre_comun:{$regex:`^${escapeRegex(name.trim())}$`,$options:"i"},
  };
  if(excludeId)filter._id={$ne:excludeId};
  if(await Ser.exists(filter))throw new Error(`Ya existe un ser con el nombre común "${name.trim()}".`);
}
