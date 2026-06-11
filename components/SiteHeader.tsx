"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import FavoritesModal from "@/components/FavoritesModal";

const links=[["/","Inicio"],["/seres","Archivo"],["/historia","Historia"],["/acerca","Acerca"],["/cuenta","Cuenta"]];

export default function SiteHeader(){
  const pathname=usePathname();
  const[open,setOpen]=useState(false);

  return <header className="site-header">
    <Link href="/" className="brand">Archivo <span>Sobrenatural</span></Link>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" aria-label={open?"Cerrar menú":"Abrir menú"} onClick={()=>setOpen(value=>!value)}>
      <span/><span/><span/>
    </button>
    <nav id="main-navigation" className={open?"main-nav open":"main-nav"} aria-label="Navegación principal">
      {links.map(([href,label])=>{
        const active=href==="/"?pathname===href:pathname.startsWith(href);
        return <Link key={href} href={href} className={active?"active":undefined} aria-current={active?"page":undefined} onClick={()=>setOpen(false)}>{label}</Link>;
      })}
      <FavoritesModal/>
    </nav>
  </header>;
}
