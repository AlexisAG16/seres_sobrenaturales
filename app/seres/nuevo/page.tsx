import { redirect } from "next/navigation";
import SerForm from "@/components/SerForm";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Nuevo() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/seres/nuevo");
  if (user.rol !== "admin") redirect("/seres");

  return (
    <section className="section">
      <p className="eyebrow">Administración</p>
      <h1>Crear personaje</h1>
      <SerForm />
    </section>
  );
}
