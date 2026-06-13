import { NextRequest,NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ensureUniqueSerName } from "@/lib/ser-name";
import { validateSer } from "@/lib/validation";
import { Ser } from "@/models/Ser";
import { User } from "@/models/User";

type Context={params:Promise<{id:string}>};

export async function GET(_:NextRequest,{params}:Context){
  if(!await requireUser())return NextResponse.json({message:"Debes iniciar sesión para consultar esta ficha."},{status:401});
  await connectDB();
  const{id}=await params;
  if(!isValidObjectId(id))return NextResponse.json({message:"Identificador inválido"},{status:400});
  const ser=await Ser.findById(id).lean();
  return ser?NextResponse.json(ser):NextResponse.json({message:"Ser no encontrado"},{status:404});
}

export async function PUT(request:NextRequest,{params}:Context){
  const user=await requireUser();
  if(!user)return NextResponse.json({message:"Debes iniciar sesión."},{status:401});
  if(user.rol!=="admin")return NextResponse.json({message:"Solo el administrador puede editar personajes."},{status:403});
  try{
    await connectDB();
    const{id}=await params;
    if(!isValidObjectId(id))return NextResponse.json({message:"Identificador inválido"},{status:400});
    const data=validateSer(await request.json());
    await ensureUniqueSerName(data.nombre_comun,id);
    const ser=await Ser.findByIdAndUpdate(id,data,{new:true,runValidators:true});
    return ser?NextResponse.json(ser):NextResponse.json({message:"Ser no encontrado"},{status:404});
  }catch(error){
    const duplicate=(error as {code?:number}).code===11000;
    return NextResponse.json({message:duplicate?"Ya existe un ser con ese nombre común.":error instanceof Error?error.message:"Datos inválidos"},{status:duplicate?409:400});
  }
}

export async function DELETE(_:NextRequest,{params}:Context){
  const user=await requireUser();
  if(!user)return NextResponse.json({message:"Debes iniciar sesión."},{status:401});
  if(user.rol!=="admin")return NextResponse.json({message:"Solo el administrador puede eliminar personajes."},{status:403});
  await connectDB();
  const{id}=await params;
  const ser=await Ser.findByIdAndDelete(id);
  if(ser)await User.updateMany({},{$pull:{favoritos:id}});
  return ser?NextResponse.json({message:"Ser eliminado"}):NextResponse.json({message:"Ser no encontrado"},{status:404});
}
