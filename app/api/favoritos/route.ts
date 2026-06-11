import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import "@/models/Ser";
import { User } from "@/models/User";

export async function GET(){
  const session=await currentUser();
  if(!session)return NextResponse.json({user:null,favoritos:[]});
  if(session.rol!=="user")return NextResponse.json({user:session,favoritos:[]});
  await connectDB();
  const account=await User.findById(session.id).select("favoritos").populate("favoritos","nombre_comun tipo imagen nombre_real").lean();
  return NextResponse.json({user:session,favoritos:account?.favoritos||[]});
}

export async function DELETE(){
  const session=await currentUser();
  if(!session)return NextResponse.json({message:"Debes iniciar sesión."},{status:401});
  if(session.rol!=="user")return NextResponse.json({message:"Los favoritos son exclusivos para usuarios."},{status:403});
  await connectDB();
  await User.updateOne({_id:session.id},{$set:{favoritos:[]}});
  return NextResponse.json({message:"Favoritos eliminados."});
}
