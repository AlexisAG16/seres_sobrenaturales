"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function DownloadCharacterStoryButton(){
  const[loading,setLoading]=useState(false);
  async function download(){
    setLoading(true);
    try{
      const response=await fetch("/api/character-docs/el-final-de-avenger-vampira");
      if(!response.ok)throw new Error((await response.json()).message||"No se pudo descargar.");
      const blob=await response.blob(),url=URL.createObjectURL(blob),link=document.createElement("a");
      link.href=url;
      link.download="el-final-de-avenger-vampira.docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("La historia final de Avenger Vampira se descargó correctamente.");
    }catch(error){
      toast.error(error instanceof Error?error.message:"No se pudo descargar la historia.");
    }finally{setLoading(false)}
  }
  return <button className="download-word character-story-download" type="button" onClick={download} disabled={loading}><span aria-hidden="true" className="story-download-icon">W</span><span><strong>{loading?"Preparando…":"Descargar El final de Avenger Vampira"}</strong><small>Historia completa en Word</small></span></button>;
}
