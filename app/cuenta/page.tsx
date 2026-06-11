import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { currentUser } from "@/lib/auth";

export const dynamic="force-dynamic";

export default async function Cuenta(){
  const user=await currentUser();
  return <section className="section prose">
    <p className="eyebrow">Cuenta</p>
    <h1>{user?`Hola, ${user.username}`:"Acceso al archivo"}</h1>
    {user?<div className="panel"><p><strong>Usuario:</strong> {user.username}</p><p><strong>Rol:</strong> {user.rol}</p><div className="admin-actions">{user.rol==="admin"&&<><Link className="button" href="/seres/nuevo">Crear personaje</Link><Link className="button secondary" href="/admin/favoritos">Favoritos de usuarios</Link></>}<LogoutButton/></div></div>:<div className="actions"><Link className="button" href="/login">Iniciar sesión</Link><Link className="button secondary" href="/registro">Crear cuenta</Link></div>}
  </section>;
}
