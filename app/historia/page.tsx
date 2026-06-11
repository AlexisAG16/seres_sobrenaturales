import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import DownloadDocumentButton from "@/components/DownloadDocumentButton";
import DownloadPresentationButton from "@/components/DownloadPresentationButton";

export const metadata={title:"Historia"};
export const dynamic="force-dynamic";

const documents=[
  {title:"Historia de los Vampiros",description:"Geografía europea, territorios de origen y las dos etapas del árbol genealógico vampírico.",image:"/images/historia/geografiavmp.png",file:"historia-vampiros",label:"Crónica de linajes"},
  {title:"Historia de las Brujas",description:"Orígenes, persecuciones, conocimiento arcano y genealogía de las órdenes de brujas.",image:"/images/historia/origenesb.png",file:"historia-brujas",label:"Crónica arcana"},
  {title:"Necromancia vs. Arcano",description:"La crónica completa de Mrs. Vampira y Manuela, desde 1849 hasta su enfrentamiento final.",image:"/images/historia/origenes.jpg",file:"necromancia-vs-arcano",label:"Crónica mayor"},
];

function DownloadIcon(){return <svg aria-hidden="true" viewBox="0 0 24 24" width="27" height="27"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/></svg>}

export default async function Historia(){
  const user=await currentUser();
  return <section className="section prose history-page">
    <p className="eyebrow">Orígenes y legado</p><h1>Historia del universo sobrenatural</h1>
    <p className="lead">{user?"Descarga cada crónica como documento Word o como una presentación PowerPoint ilustrada.":"Puedes conocer las crónicas disponibles. Inicia sesión para acceder a los documentos y presentaciones completas."}</p>
    {!user&&<div className="panel access-callout"><h2>Contenido para miembros</h2><p>Las historias completas, documentos Word y presentaciones están disponibles para usuarios registrados.</p><div className="admin-actions"><Link className="button" href="/login?next=/historia">Iniciar sesión</Link><Link className="button secondary" href="/registro">Crear cuenta</Link></div></div>}
    <div className="history-library">{documents.map(document=><article className="history-book" key={document.file}>
      <div className="history-cover"><Image src={document.image} fill sizes="(max-width: 900px) 100vw, 33vw" alt=""/><span>{document.label}</span></div>
      <div className="history-content"><h2>{document.title}</h2><p>{document.description}</p>
        {user?<div className="history-downloads"><DownloadDocumentButton file={document.file} title={document.title}/><DownloadPresentationButton file={document.file} title={document.title}/></div>:<Link className="download-word locked" href="/login?next=/historia"><DownloadIcon/><span><strong>Inicia sesión</strong><small>Para acceder y descargar</small></span></Link>}
      </div>
    </article>)}</div>
    <div className="panel history-note"><h2>Una colección en crecimiento</h2><p>Los documentos y presentaciones conservan las historias y genealogías del proyecto original con un diseño editorial propio.</p></div>
  </section>;
}
