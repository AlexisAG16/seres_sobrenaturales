import { NextRequest,NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ensureUniqueSerName } from "@/lib/ser-name";

export async function GET(request:NextRequest){
  const user=await requireUser();
  if(!user)return NextResponse.json({message:"Debes iniciar sesión."},{status:401});
  if(user.rol!=="admin")return NextResponse.json({message:"Solo el administrador puede validar nombres."},{status:403});
  const name=request.nextUrl.searchParams.get("name")?.trim()||"";
  const id=request.nextUrl.searchParams.get("id")||undefined;
  if(!name)return NextResponse.json({message:"El nombre común es obligatorio."},{status:400});
  try{
    await connectDB();
    await ensureUniqueSerName(name,id);
    return NextResponse.json({available:true});
  }catch(error){
    return NextResponse.json({available:false,message:error instanceof Error?error.message:"Ese nombre común no está disponible."},{status:409});
  }
}
