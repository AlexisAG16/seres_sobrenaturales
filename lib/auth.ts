import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";
const key=()=>new TextEncoder().encode(process.env.JWT_SECRET||"development-only-secret-change-me");
export type SessionUser={id:string;username:string;rol:"user"|"admin"};
export async function createToken(user:SessionUser){return new SignJWT(user).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key())}
export async function currentUser(){const token=(await cookies()).get("session")?.value;if(!token)return null;try{const{payload}=await jwtVerify(token,key());if(typeof payload.id!=="string"||typeof payload.username!=="string"||(payload.rol!=="user"&&payload.rol!=="admin"))return null;return payload as unknown as SessionUser}catch{return null}}
export async function requireUser(){return currentUser()}
export async function requireAdmin(){const user=await currentUser();return user?.rol==="admin"?user:null}
export function sessionCookieOptions(request:NextRequest){
  const forwardedProtocol=request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  return {httpOnly:true,sameSite:"lax" as const,secure:forwardedProtocol==="https"||request.nextUrl.protocol==="https:",maxAge:604800,path:"/"};
}
