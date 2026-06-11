import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ser } from "@/models/Ser";
import { User } from "@/models/User";

type Context={params:Promise<{id:string}>};

async function context({params}:Context){
  const user=await currentUser();
  const{id}=await params;
  if(!user)return {error:NextResponse.json({message:"Debes iniciar sesión."},{status:401})};
  if(user.rol!=="user")return {error:NextResponse.json({message:"Los favoritos son exclusivos para usuarios."},{status:403})};
  if(!isValidObjectId(id))return {error:NextResponse.json({message:"Personaje inválido."},{status:400})};
  await connectDB();
  if(!await Ser.exists({_id:id}))return {error:NextResponse.json({message:"El personaje no existe."},{status:404})};
  return {user,id};
}

export async function POST(_:Request,routeContext:Context){
  const result=await context(routeContext);
  if(result.error)return result.error;
  await User.updateOne({_id:result.user.id},{$addToSet:{favoritos:result.id}});
  return NextResponse.json({favorite:true});
}

export async function DELETE(_:Request,routeContext:Context){
  const result=await context(routeContext);
  if(result.error)return result.error;
  await User.updateOne({_id:result.user.id},{$pull:{favoritos:result.id}});
  return NextResponse.json({favorite:false});
}
