"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect,useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

type Favorite={_id:string;nombre_comun:string;nombre_real?:string;tipo:string;imagen?:string};

export default function FavoritesModal(){
  const pathname=usePathname();
  const[role,setRole]=useState<string|null>(null);
  const[open,setOpen]=useState(false);
  const[favorites,setFavorites]=useState<Favorite[]>([]);
  const[loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    try{
      const response=await fetch("/api/favoritos",{cache:"no-store"});
      const data=await response.json();
      setRole(data.user?.rol||null);
      setFavorites(data.favoritos||[]);
    }finally{setLoading(false)}
  }

  useEffect(()=>{load()},[pathname]);
  useEffect(()=>{
    const sync=()=>load();
    const clearSession=()=>{
      setRole(null);
      setFavorites([]);
      setOpen(false);
      setLoading(false);
    };
    window.addEventListener("session-changed",sync);
    window.addEventListener("session-closed",clearSession);
    window.addEventListener("favorites-changed",sync);
    window.addEventListener("focus",sync);
    return()=>{window.removeEventListener("session-changed",sync);window.removeEventListener("session-closed",clearSession);window.removeEventListener("favorites-changed",sync);window.removeEventListener("focus",sync)};
  },[]);
  useEffect(()=>{
    if(!open)return;
    load();
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    document.addEventListener("keydown",close);
    document.body.classList.add("modal-open");
    return()=>{document.removeEventListener("keydown",close);document.body.classList.remove("modal-open")};
  },[open]);

  if(role!=="user")return null;

  async function remove(id:string){
    const response=await fetch(`/api/favoritos/${id}`,{method:"DELETE"});
    if(!response.ok){toast.error("No se pudo quitar el favorito.");return}
    setFavorites(current=>current.filter(item=>item._id!==id));
    toast.success("Eliminado de tus favoritos.");
  }

  async function removeAll(){
    const confirmation=await Swal.fire({
      title:"¿Vaciar tus favoritos?",
      text:"Se quitarán todos los seres guardados de tu colección.",
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"Sí, quitar todos",
      cancelButtonText:"Cancelar",
      confirmButtonColor:"#94172b",
      background:"#151219",
      color:"#eee8de",
    });
    if(!confirmation.isConfirmed)return;
    const response=await fetch("/api/favoritos",{method:"DELETE"});
    if(!response.ok){toast.error("No se pudieron eliminar los favoritos.");return}
    setFavorites([]);
    toast.success("Tu lista de favoritos quedó vacía.");
  }

  return <>
    <button className="nav-favorites-button" type="button" onClick={()=>setOpen(true)}><span aria-hidden="true">♥</span> Favoritos <b>{favorites.length}</b></button>
    {open&&<div className="favorites-modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setOpen(false)}}>
      <section className="favorites-modal" role="dialog" aria-modal="true" aria-labelledby="favorites-title">
        <header><div><p className="eyebrow">Mi colección</p><h2 id="favorites-title">Seres favoritos</h2></div><div className="modal-header-actions">{favorites.length>0&&<button className="clear-favorites" type="button" onClick={removeAll}>Quitar todos</button>}<button className="modal-close" type="button" onClick={()=>setOpen(false)} aria-label="Cerrar favoritos">×</button></div></header>
        <div className="favorites-modal-body">{loading?<p className="modal-status">Cargando favoritos…</p>:favorites.length?<div className="modal-favorite-list">{favorites.map(favorite=><article key={favorite._id}><Link href={`/seres/${favorite._id}`} onClick={()=>setOpen(false)}><img src={favorite.imagen||"/images/vampi.png"} alt=""/><div><span className="tag">{favorite.tipo}</span><h3>{favorite.nombre_comun}</h3>{favorite.nombre_real&&<p>{favorite.nombre_real}</p>}</div></Link><button type="button" onClick={()=>remove(favorite._id)} aria-label={`Quitar a ${favorite.nombre_comun}`}>Quitar</button></article>)}</div>:<div className="empty"><p>Todavía no guardaste personajes favoritos.</p><Link className="button" href="/seres" onClick={()=>setOpen(false)}>Explorar el archivo</Link></div>}</div>
      </section>
    </div>}
  </>;
}
