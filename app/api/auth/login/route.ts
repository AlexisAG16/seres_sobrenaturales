import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createToken,sessionCookieOptions } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(request:NextRequest){
  await connectDB();
  const{username,password}=await request.json();
  const user=await User.findOne({username:String(username||"").toLowerCase().trim()});
  if(!user||!await bcrypt.compare(String(password||""),user.password)){
    return NextResponse.json({message:"Usuario o contraseña incorrectos."},{status:401});
  }
  const payload={id:String(user._id),username:user.username,rol:user.rol as "user"|"admin"};
  const response=NextResponse.json({user:payload});
  response.cookies.set("session",await createToken(payload),sessionCookieOptions(request));
  return response;
}
