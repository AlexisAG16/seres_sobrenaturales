import { NextResponse } from "next/server";import { currentUser } from "@/lib/auth";
export async function GET(){return NextResponse.json({user:await currentUser()})}
export async function DELETE(){const response=NextResponse.json({message:"Sesión cerrada"});response.cookies.delete("session");return response}
