"use client";

import { useState } from "react";
import { toast } from "react-toastify";

function SlidesIcon(){return <svg aria-hidden="true" viewBox="0 0 24 24" width="27" height="27"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7v2h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v11h16V5H4Zm3 2h5a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2Zm0 4h10a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2Z"/></svg>}

export default function DownloadPresentationButton({file,title}:{file:string;title:string}){
  const[loading,setLoading]=useState(false);
  async function download(){
    setLoading(true);
    try{
      const response=await fetch(`/api/presentations/${file}`);
      if(!response.ok)throw new Error((await response.json()).message||"No se pudo descargar.");
      const blob=await response.blob(),url=URL.createObjectURL(blob),link=document.createElement("a");
      link.href=url;
      link.download=`${file}.pptx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`La presentación "${title}" se descargó correctamente.`);
    }catch(error){
      toast.error(error instanceof Error?error.message:"No se pudo descargar la presentación.");
    }finally{setLoading(false)}
  }
  return <button className="download-word download-presentation" type="button" onClick={download} disabled={loading}><SlidesIcon/><span><strong>{loading?"Preparando…":"Descargar PowerPoint"}</strong><small>Presentación .pptx</small></span></button>;
}
