import { redirect } from "next/navigation";import { requireAdmin } from "@/lib/auth";import SerForm from "@/components/SerForm";
export const dynamic="force-dynamic";
export default async function Nuevo(){if(!await requireAdmin())redirect("/login");return <section className="section"><p className="eyebrow">Administración</p><h1>Crear personaje</h1><SerForm/></section>}
