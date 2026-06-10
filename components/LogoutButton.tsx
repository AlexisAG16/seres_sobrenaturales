"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function LogoutButton(){const router=useRouter();return <button className="button secondary" onClick={async()=>{try{const response=await fetch("/api/auth/me",{method:"DELETE"});if(!response.ok)throw new Error();toast.info("Sesión cerrada correctamente.");router.refresh()}catch{toast.error("No se pudo cerrar la sesión.")}}}>Cerrar sesión</button>}
