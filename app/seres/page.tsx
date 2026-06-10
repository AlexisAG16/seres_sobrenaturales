import Link from "next/link";import { connectDB } from "@/lib/db";import { currentUser } from "@/lib/auth";import { Ser } from "@/models/Ser";import type { SerData } from "@/types/ser";
export const dynamic="force-dynamic";
const colors:Record<string,string>={Vampiro:"#c91f37",Bruja:"#52c7d9",Cazador:"#b7924b",Humano:"#d9cc52",Otro:"#8d55bd"};
type Props={searchParams:Promise<{tipo?:string;search?:string;page?:string}>};
export default async function SeresPage({searchParams}:Props){
  const q=await searchParams,page=Math.max(1,Number(q.page)||1),limit=8,filter:Record<string,unknown>={};
  if(q.tipo)filter.tipo=q.tipo;if(q.search)filter.nombre_comun={$regex:q.search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),$options:"i"};
  let seres:SerData[]=[],total=0,error="";
  const user=await currentUser();
  try{await connectDB();const[result,count]=await Promise.all([Ser.find(filter).sort({nombre_comun:1}).skip((page-1)*limit).limit(limit).lean(),Ser.countDocuments(filter)]);seres=JSON.parse(JSON.stringify(result));total=count}catch(e){error=e instanceof Error?e.message:"No se pudo cargar el archivo."}
  const pages=Math.max(1,Math.ceil(total/limit)),href=(p:number)=>`/seres?${new URLSearchParams({...q,page:String(p)}).toString()}`;
  return <section className="section">
    <div className="catalog-header"><div><p className="eyebrow">Base de datos</p><h1 className="section-title" style={{textAlign:"left"}}>Archivo de <span>seres</span></h1><p className="lead">{total} personajes registrados en este universo.</p></div>{user?.rol==="admin"&&<Link className="button create-ser-button" href="/seres/nuevo">+ Agregar nuevo ser</Link>}</div>
    <form className="filters"><input className="field" name="search" defaultValue={q.search} placeholder="Buscar por nombre…"/><select className="field" name="tipo" defaultValue={q.tipo||""}><option value="">Todos los tipos</option>{["Vampiro","Bruja","Cazador","Humano","Otro"].map(x=><option key={x}>{x}</option>)}</select><button className="button">Buscar</button></form>
    {error?<div className="empty">{error} Configura las variables del archivo <code>.env.local</code>.</div>:seres.length?<div className="cards">{seres.map(ser=><Link className="card" style={{"--accent":colors[ser.tipo]} as React.CSSProperties} href={`/seres/${ser._id}`} key={ser._id}><div className="card-image"><img src={ser.imagen||"/images/vampi.png"} alt={ser.nombre_comun}/></div><div className="card-body"><p className="tag">{ser.tipo}{ser.clase?` · ${ser.clase.replaceAll("_"," ")}`:""}</p><h2>{ser.nombre_comun}</h2>{ser.nombre_real&&<p>{ser.nombre_real}</p>}</div></Link>)}</div>:<div className="empty">No se encontraron personajes con esos filtros.</div>}
    {pages>1&&<div className="pagination">{Array.from({length:pages},(_,i)=>i+1).map(p=><Link className={p===page?"active":""} href={href(p)} key={p}>{p}</Link>)}</div>}
  </section>
}
