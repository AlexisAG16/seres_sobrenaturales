import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createToken,sessionCookieOptions } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(request:NextRequest){
  try{
    await connectDB();
    const{username,password}=await request.json();
    const normalized=String(username||"").toLowerCase().trim();
    if(!/^[a-z0-9_-]{3,30}$/.test(normalized)||typeof password!=="string"||password.length<6){
      return NextResponse.json({message:"El usuario debe tener entre 3 y 30 caracteres (letras, números, guion o guion bajo) y la contraseña al menos 6."},{status:400});
    }
    const user=await User.create({username:normalized,password,rol:"user"});
    const payload={id:String(user._id),username:user.username,rol:user.rol as "user"|"admin"};
    const response=NextResponse.json({user:payload},{status:201});
    response.cookies.set("session",await createToken(payload),sessionCookieOptions(request));
    return response;
  }catch(cause){
    const error=cause as {code?:number;keyPattern?:Record<string,number>};
    if(error.code===11000&&error.keyPattern?.username){
      return NextResponse.json({message:"Ese nombre de usuario ya está ocupado."},{status:409});
    }
    console.error("Error al registrar usuario:",cause);
    return NextResponse.json({message:"No se pudo crear la cuenta por un error del servidor."},{status:500});
  }
}
