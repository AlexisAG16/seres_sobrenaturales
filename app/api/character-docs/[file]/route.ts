import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

const documents:Record<string,string>={
  "el-final-de-avenger-vampira":"el-final-de-avenger-vampira.docx",
};

export async function GET(_:Request,{params}:{params:Promise<{file:string}>}){
  if(!await requireUser())return NextResponse.json({message:"Debes iniciar sesión para descargar esta historia."},{status:401});
  const{file}=await params;
  const filename=documents[file];
  if(!filename)return NextResponse.json({message:"Documento no encontrado."},{status:404});
  try{
    const data=await readFile(path.join(process.cwd(),"storage","character-docs",filename));
    return new NextResponse(data,{headers:{
      "Content-Type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":`attachment; filename="${filename}"`,
      "Cache-Control":"private, no-store",
    }});
  }catch{
    return NextResponse.json({message:"Documento no disponible."},{status:404});
  }
}
