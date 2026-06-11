"use client";

import { FormEvent,useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CLASSES_BY_TYPE,SER_TYPES,type SerType } from "@/lib/ser-options";
import type { SerData } from "@/types/ser";

export default function SerForm({ser}:{ser?:SerData}){
  const router=useRouter();
  const[type,setType]=useState<SerType>((ser?.tipo as SerType)||"Vampiro");
  const[serClass,setSerClass]=useState(ser?.clase||"");
  const[commonName,setCommonName]=useState(ser?.nombre_comun||"");
  const[error,setError]=useState("");
  const[loading,setLoading]=useState(false);
  const[imageFile,setImageFile]=useState<File|null>(null);
  const[audioFile,setAudioFile]=useState<File|null>(null);
  const[videoFile,setVideoFile]=useState<File|null>(null);
  const classOptions=CLASSES_BY_TYPE[type];

  function changeType(nextType:SerType){
    setType(nextType);
    setSerClass("");
  }

  async function upload(file:File,kind:"image"|"audio"|"video"){
    const body=new FormData();
    body.set("file",file);
    body.set("kind",kind);
    const response=await fetch("/api/upload",{method:"POST",body});
    const data=await response.json();
    if(!response.ok)throw new Error(data.message||`No se pudo subir ${kind==="image"?"la imagen":"el video"}.`);
    return data.path as string;
  }

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setLoading(true);
    setError("");
    try{
      const form=new FormData(event.currentTarget);
      let imagePath=ser?.imagen||"";
      let audioPath=ser?.audio||"";
      let videoPath=ser?.video||"";
      if(imageFile){toast.info("Subiendo imagen…",{toastId:"upload-image"});imagePath=await upload(imageFile,"image");toast.dismiss("upload-image")}
      if(audioFile){toast.info("Subiendo audio…",{toastId:"upload-audio"});audioPath=await upload(audioFile,"audio");toast.dismiss("upload-audio")}
      if(videoFile){toast.info("Subiendo video…",{toastId:"upload-video"});videoPath=await upload(videoFile,"video");toast.dismiss("upload-video")}
      const payload={
        ...Object.fromEntries(form),
        tipo:type,
        clase:type==="Humano"?"":serClass,
        imagen:imagePath,
        audio:audioPath,
        video:videoPath,
        padres:String(form.get("padres")||"").split(",").map(x=>x.trim()).filter(Boolean),
        poderes:String(form.get("poderes")||"").split(",").map(x=>x.trim()).filter(Boolean),
      };
      const response=await fetch(ser?`/api/seres/${ser._id}`:"/api/seres",{method:ser?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await response.json();
      if(!response.ok){const message=data.message||"No se pudo guardar.";setError(message);toast.error(message);return}
      toast.success(ser?"Los datos del personaje fueron actualizados.":"El personaje fue creado correctamente.");
      router.push(`/seres/${data._id}`);
      router.refresh();
    }catch(cause){
      toast.dismiss("upload-image");
      toast.dismiss("upload-audio");
      toast.dismiss("upload-video");
      const message=cause instanceof Error?cause.message:"No se pudo guardar por un problema de conexión.";
      setError(message);
      toast.error(message);
    }finally{setLoading(false)}
  }

  return <form className="form panel" onSubmit={submit}>
    <div className="form-grid">
      <label>Nombre común<input className="field" name="nombre_comun" value={commonName} onChange={event=>setCommonName(event.target.value)} required/></label>
      <label>Nombre real<input className="field" name="nombre_real" defaultValue={ser?.nombre_real}/></label>
      <label>Tipo<select className="field" name="tipo" value={type} onChange={event=>changeType(event.target.value as SerType)} required>{SER_TYPES.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      <label>Clase
        <select className="field" name="clase" value={serClass} onChange={event=>setSerClass(event.target.value)} required={type!=="Humano"} disabled={type==="Humano"}>
          <option value="">{type==="Humano"?"Los humanos no tienen clase":"Selecciona una clase…"}</option>
          {classOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label>Sexo<select className="field" name="sexo" defaultValue={ser?.sexo||""}><option value="">Sin especificar</option>{["Masculino","Femenino","LGTBQ+"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>País o ciudad<input className="field" name="pais_ciudad" defaultValue={ser?.pais_ciudad}/></label>
      <label>Época de vida<input className="field" name="epoca_vida" defaultValue={ser?.epoca_vida}/></label>
      <label>Padres, separados por comas<input className="field" name="padres" defaultValue={ser?.padres?.join(", ")}/></label>
      <label>Poderes, separados por comas<input className="field" name="poderes" defaultValue={ser?.poderes?.join(", ")}/></label>
    </div>
    <label>Misión<textarea className="field" name="mision" defaultValue={ser?.mision}/></label>
    <label>Biografía<textarea className="field" name="biografia" defaultValue={ser?.biografia}/></label>
    <div className="attachments">
      <label>Imagen
        <input className="field file-field" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event=>setImageFile(event.target.files?.[0]||null)} required={!ser?.imagen}/>
        {ser?.imagen&&!imageFile&&<small className="current-file">Actual: {ser.imagen}</small>}
      </label>
      <label>Audio de voz (opcional)
        <input className="field file-field" name="audioFile" type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4" onChange={event=>setAudioFile(event.target.files?.[0]||null)}/>
        {ser?.audio&&!audioFile&&<small className="current-file">Actual: {ser.audio}</small>}
      </label>
      <label>{commonName.trim()?`Canción animada de ${commonName.trim()} (opcional)`:"Canción animada (opcional)"}
        <input className="field file-field" name="videoFile" type="file" accept="video/mp4,video/webm,video/quicktime" onChange={event=>setVideoFile(event.target.files?.[0]||null)}/>
        {ser?.video&&!videoFile&&<small className="current-file">Actual: {ser.video}</small>}
      </label>
      <p className="form-help">Solo la imagen es obligatoria. Audio y video son opcionales; al editar, los archivos actuales se conservan si no seleccionas otros.</p>
    </div>
    {error&&<p className="message error">{error}</p>}
    <button className="button" disabled={loading}>{loading?"Guardando…":ser?"Guardar cambios":"Crear personaje"}</button>
  </form>
}
