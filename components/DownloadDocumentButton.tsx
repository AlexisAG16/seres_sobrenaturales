"use client";

import { useState } from "react";
import { toast } from "react-toastify";

function DownloadIcon(){return <svg aria-hidden="true" viewBox="0 0 24 24" width="27" height="27"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/></svg>}

export default function DownloadDocumentButton({file,title}:{file:string;title:string}){
  const[loading,setLoading]=useState(false);
  async function download(){
    setLoading(true);
    try{
      const response=await fetch(`/api/downloads/${file}`);
      if(!response.ok)throw new Error((await response.json()).message||"No se pudo descargar.");
      const blob=await response.blob(),url=URL.createObjectURL(blob),link=document.createElement("a");
      link.href=url;
      link.download=`${file}.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`"${title}" se descargó correctamente.`);
    }catch(error){
      toast.error(error instanceof Error?error.message:"No se pudo descargar el documento.");
    }finally{setLoading(false)}
  }
  return <button className="download-word" type="button" onClick={download} disabled={loading}><DownloadIcon/><span><strong>{loading?"Preparando…":"Descargar Word"}</strong><small>Documento .docx</small></span></button>;
}
