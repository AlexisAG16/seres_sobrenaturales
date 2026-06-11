import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

const presentations:Record<string,string>={
  "historia-vampiros":"historia-vampiros.pptx",
  "historia-brujas":"historia-brujas.pptx",
  "necromancia-vs-arcano":"necromancia-vs-arcano.pptx",
};

export async function GET(_:Request,{params}:{params:Promise<{file:string}>}){
  if(!await requireUser())return NextResponse.json({message:"Debes iniciar sesión para descargar esta presentación."},{status:401});
  const{file}=await params;
  const filename=presentations[file];
  if(!filename)return NextResponse.json({message:"Presentación no encontrada."},{status:404});
  try{
    const data=await readFile(path.join(process.cwd(),"storage","history-presentations",filename));
    return new NextResponse(data,{headers:{
      "Content-Type":"application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition":`attachment; filename="${filename}"`,
      "Cache-Control":"private, no-store",
    }});
  }catch{
    return NextResponse.json({message:"Presentación no disponible."},{status:404});
  }
}
