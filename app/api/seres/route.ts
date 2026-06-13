import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ensureUniqueSerName } from "@/lib/ser-name";
import { validateSer } from "@/lib/validation";
import { Ser } from "@/models/Ser";

export async function GET(request:NextRequest){
  if(!await requireUser())return NextResponse.json({message:"Debes iniciar sesión para consultar la información completa."},{status:401});
  try{
    await connectDB();
    const query=request.nextUrl.searchParams;
    const page=Math.max(1,Number(query.get("page"))||1);
    const limit=Math.min(50,Math.max(1,Number(query.get("limit"))||8));
    const tipo=query.get("tipo")||"";
    const search=query.get("search")?.trim()||"";
    const filter:Record<string,unknown>={};
    if(tipo)filter.tipo=tipo;
    if(search)filter.nombre_comun={$regex:search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),$options:"i"};
    const[data,totalItems]=await Promise.all([Ser.find(filter).sort({nombre_comun:1}).skip((page-1)*limit).limit(limit).lean(),Ser.countDocuments(filter)]);
    return NextResponse.json({data,meta:{totalItems,currentPage:page,totalPages:Math.max(1,Math.ceil(totalItems/limit)),itemsPerPage:limit}});
  }catch(error){
    return NextResponse.json({message:error instanceof Error?error.message:"Error interno"},{status:500});
  }
}

export async function POST(request:NextRequest){
  const user=await requireUser();
  if(!user)return NextResponse.json({message:"Debes iniciar sesión."},{status:401});
  if(user.rol!=="admin")return NextResponse.json({message:"Solo el administrador puede crear personajes."},{status:403});
  try{
    await connectDB();
    const data=validateSer(await request.json());
    await ensureUniqueSerName(data.nombre_comun);
    return NextResponse.json(await Ser.create(data),{status:201});
  }catch(error){
    const duplicate=(error as {code?:number}).code===11000;
    return NextResponse.json({message:duplicate?"Ya existe un ser con ese nombre común.":error instanceof Error?error.message:"Datos inválidos"},{status:duplicate?409:400});
  }
}
