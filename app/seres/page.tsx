/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ser } from "@/models/Ser";
import { User } from "@/models/User";
import type { SerData } from "@/types/ser";

export const dynamic="force-dynamic";
const colors:Record<string,string>={Vampiro:"#c91f37",Bruja:"#52c7d9",Cazador:"#b7924b",Humano:"#d9cc52",Otro:"#8d55bd"};
type Props={searchParams:Promise<{tipo?:string;search?:string;page?:string}>};

export default async function SeresPage({searchParams}:Props){
  const q=await searchParams;
  const page=Math.max(1,Number(q.page)||1);
  const limit=8;
  const filter:Record<string,unknown>={};
  if(q.tipo)filter.tipo=q.tipo;
  if(q.search)filter.nombre_comun={$regex:q.search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),$options:"i"};
  let seres:SerData[]=[],total=0,error="";
  let favoriteIds=new Set<string>();
  const user=await currentUser();
  try{
    await connectDB();
    const[result,count,account]=await Promise.all([
      Ser.find(filter).sort({nombre_comun:1}).skip((page-1)*limit).limit(limit).lean(),
      Ser.countDocuments(filter),
      user?.rol==="user"?User.findById(user.id).select("favoritos").lean():null,
    ]);
    seres=JSON.parse(JSON.stringify(result));
    total=count;
    favoriteIds=new Set((account?.favoritos||[]).map(String));
  }catch(cause){error=cause instanceof Error?cause.message:"No se pudo cargar el archivo."}
  const pages=Math.max(1,Math.ceil(total/limit));
  const href=(targetPage:number)=>`/seres?${new URLSearchParams({...q,page:String(targetPage)}).toString()}`;

  return <section className="section">
    <div className="catalog-header"><div><p className="eyebrow">Archivo de personajes</p><h1 className="section-title" style={{textAlign:"left"}}>Archivo de <span>seres</span></h1><p className="lead">{total} personajes registrados en este universo.</p></div>{user?.rol==="admin"&&<Link className="button create-ser-button" href="/seres/nuevo">+ Agregar nuevo ser</Link>}</div>
    <form className="filters"><input className="field" name="search" defaultValue={q.search} placeholder="Buscar por nombre…"/><select className="field" name="tipo" defaultValue={q.tipo||""}><option value="">Todos los tipos</option>{["Vampiro","Bruja","Cazador","Humano","Otro"].map(type=><option key={type}>{type}</option>)}</select><button className="button">Buscar</button></form>
    {error?<div className="empty">{error}</div>:seres.length?<div className="cards">{seres.map(ser=><article className="card" style={{"--accent":colors[ser.tipo]} as React.CSSProperties} key={ser._id}><Link href={`/seres/${ser._id}`}><div className="card-image"><img src={ser.imagen||"/images/vampi.png"} alt={ser.nombre_comun}/></div><div className="card-body"><p className="tag">{ser.tipo}{ser.clase?` · ${ser.clase.replaceAll("_"," ")}`:""}</p><h2>{ser.nombre_comun}</h2>{ser.nombre_real&&<p>{ser.nombre_real}</p>}</div></Link>{user?.rol==="user"&&<FavoriteButton serId={ser._id} initialFavorite={favoriteIds.has(ser._id)} loggedIn/>}</article>)}</div>:<div className="empty">No se encontraron personajes con esos filtros.</div>}
    {pages>1&&<div className="pagination">{Array.from({length:pages},(_,index)=>index+1).map(item=><Link className={item===page?"active":""} href={href(item)} key={item}>{item}</Link>)}</div>}
  </section>;
}
