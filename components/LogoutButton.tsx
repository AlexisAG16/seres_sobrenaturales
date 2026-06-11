"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LogoutButton(){
  const router=useRouter();

  async function logout(){
    try{
      const response=await fetch("/api/auth/me",{method:"DELETE"});
      if(!response.ok)throw new Error();
      window.dispatchEvent(new Event("session-closed"));
      toast.info("Sesión cerrada correctamente.");
      router.refresh();
    }catch{
      toast.error("No se pudo cerrar la sesión.");
    }
  }

  return <button className="button secondary" onClick={logout}>Cerrar sesión</button>;
}
