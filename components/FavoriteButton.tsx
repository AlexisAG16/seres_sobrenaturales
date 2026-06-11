"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function FavoriteButton({serId,initialFavorite=false,loggedIn=false}:{serId:string;initialFavorite?:boolean;loggedIn?:boolean}){
  const router=useRouter();
  const[favorite,setFavorite]=useState(initialFavorite);
  const[loading,setLoading]=useState(false);

  async function toggle(event:React.MouseEvent){
    event.preventDefault();
    event.stopPropagation();
    if(!loggedIn){toast.info("Inicia sesión para guardar tus seres favoritos.");return}
    setLoading(true);
    try{
      const response=await fetch(`/api/favoritos/${serId}`,{method:favorite?"DELETE":"POST"});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||"No se pudo actualizar tu lista.");
      setFavorite(!favorite);
      toast.success(favorite?"Eliminado de tus favoritos.":"Añadido a tus favoritos.");
      window.dispatchEvent(new Event("favorites-changed"));
      router.refresh();
    }catch(cause){toast.error(cause instanceof Error?cause.message:"No se pudo actualizar tu lista.")}
    finally{setLoading(false)}
  }

  return <button className={favorite?"favorite-button active":"favorite-button"} type="button" onClick={toggle} disabled={loading} aria-pressed={favorite} aria-label={favorite?"Quitar de favoritos":"Añadir a favoritos"}>
    <span aria-hidden="true">{favorite?"♥":"♡"}</span>{favorite?"Guardado":"Favorito"}
  </button>;
}
