import { randomUUID } from "node:crypto";
import { mkdir,writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest,NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime="nodejs";

const allowed={
  image:{
    types:new Set(["image/jpeg","image/png","image/webp","image/gif"]),
    extensions:new Set([".jpg",".jpeg",".png",".webp",".gif"]),
    maxSize:12*1024*1024,
    directory:"images",
  },
  video:{
    types:new Set(["video/mp4","video/webm","video/quicktime"]),
    extensions:new Set([".mp4",".webm",".mov"]),
    maxSize:120*1024*1024,
    directory:"videos",
  },
  audio:{
    types:new Set(["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4","audio/x-m4a"]),
    extensions:new Set([".mp3",".wav",".ogg",".webm",".m4a"]),
    maxSize:5*1024*1024,
    directory:"audios",
  },
} as const;

export async function POST(request:NextRequest){
  if(!await requireAdmin())return NextResponse.json({message:"No autorizado."},{status:401});
  try{
    const form=await request.formData();
    const file=form.get("file");
    const kind=form.get("kind");
    if(!(file instanceof File)||(kind!=="image"&&kind!=="audio"&&kind!=="video"))return NextResponse.json({message:"Archivo o tipo de subida inválido."},{status:400});
    const config=allowed[kind],extension=path.extname(file.name).toLowerCase();
    if(!config.types.has(file.type as never)||!config.extensions.has(extension as never)){
      const message=kind==="image"?"Solo se permiten imágenes JPG, PNG, WEBP o GIF.":kind==="audio"?"Solo se permiten audios MP3, WAV, OGG, WEBM o M4A.":"Solo se permiten videos MP4, WEBM o MOV.";
      return NextResponse.json({message},{status:400});
    }
    if(file.size===0||file.size>config.maxSize)return NextResponse.json({message:`El archivo debe pesar menos de ${config.maxSize/(1024*1024)} MB.`},{status:400});
    const filename=`${Date.now()}-${randomUUID()}${extension}`;
    const directory=path.join(process.cwd(),"public","uploads",config.directory);
    await mkdir(directory,{recursive:true});
    await writeFile(path.join(directory,filename),Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({path:`/uploads/${config.directory}/${filename}`,name:file.name,size:file.size});
  }catch{
    return NextResponse.json({message:"No se pudo guardar el archivo."},{status:500});
  }
}
