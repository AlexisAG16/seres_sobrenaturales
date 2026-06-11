import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import "@/models/Ser";

export const dynamic="force-dynamic";

export default async function AdminFavoritos(){
  const session=await currentUser();
  if(session?.rol!=="admin")redirect("/cuenta");
  await connectDB();
  const users=await User.find({rol:"user"}).select("username rol favoritos updatedAt").populate("favoritos","nombre_comun tipo").sort({username:1}).lean();
  return <section className="section">
    <div className="catalog-header"><div><p className="eyebrow">Preferencias de la audiencia</p><h1 className="section-title" style={{textAlign:"left"}}>Favoritos por usuario</h1><p className="lead">La lista refleja los personajes guardados actualmente por cada cuenta.</p></div><a className="button" href="/api/admin/favoritos/exportar">Descargar Excel</a></div>
    <div className="favorites-admin">
      {users.map(user=><article className="panel admin-favorite-user" key={String(user._id)}><header><div><h2>{user.username}</h2><span className="tag">{user.rol}</span></div><strong>{user.favoritos.length} favoritos</strong></header>{user.favoritos.length?<ul>{user.favoritos.map((favorite:any)=><li key={String(favorite._id)}><Link href={`/seres/${favorite._id}`}>{favorite.nombre_comun}</Link><span>{favorite.tipo}</span></li>)}</ul>:<p>Todavía no guardó personajes.</p>}</article>)}
    </div>
  </section>;
}
