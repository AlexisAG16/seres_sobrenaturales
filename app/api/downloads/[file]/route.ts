import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

const documents:Record<string,string>={
  "historia-vampiros":"historia-vampiros.docx",
  "historia-brujas":"historia-brujas.docx",
  "necromancia-vs-arcano":"necromancia-vs-arcano.docx",
};

export async function GET(_:Request,{params}:{params:Promise<{file:string}>}){
  if(!await requireUser())return NextResponse.json({message:"Debes iniciar sesión para descargar este documento."},{status:401});
  const{file}=await params,filename=documents[file];
  if(!filename)return NextResponse.json({message:"Documento no encontrado."},{status:404});
  try{
    const data=await readFile(path.join(process.cwd(),"storage","history-docs",filename));
    return new NextResponse(data,{
      headers:{
        "Content-Type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":`attachment; filename="${filename}"`,
        "Cache-Control":"private, no-store",
      },
    });
  }catch{
    return NextResponse.json({message:"Documento no disponible."},{status:404});
  }
}
