"use client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function DeleteSerButton({id}:{id:string}){
  const router=useRouter();
  async function remove(){
    const result=await Swal.fire({
      title:"¿Eliminar este personaje?",
      text:"Esta acción es definitiva y no puede deshacerse.",
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Sí, eliminar",
      cancelButtonText:"Cancelar",
      confirmButtonColor:"#94172b",
      cancelButtonColor:"#4d3b50",
      background:"#151219",
      color:"#eee8de",
      reverseButtons:true,
      focusCancel:true,
    });
    if(!result.isConfirmed)return;
    try{
      const response=await fetch(`/api/seres/${id}`,{method:"DELETE"});
      if(!response.ok)throw new Error((await response.json()).message||"No se pudo eliminar.");
      toast.success("El personaje fue eliminado correctamente.");
      router.push("/seres");
      router.refresh();
    }catch(error){toast.error(error instanceof Error?error.message:"No se pudo eliminar el personaje.")}
  }
  return <button className="button secondary" onClick={remove}>Eliminar</button>;
}
