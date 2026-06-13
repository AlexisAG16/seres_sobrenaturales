import { isValidObjectId } from "mongoose";
import { notFound, redirect } from "next/navigation";
import SerForm from "@/components/SerForm";
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ser } from "@/models/Ser";

export const dynamic = "force-dynamic";

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/seres/${id}/editar`)}`);
  if (user.rol !== "admin") redirect(`/seres/${id}`);
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const raw = await Ser.findById(id).lean();
  if (!raw) notFound();

  return (
    <section className="section">
      <p className="eyebrow">Administración</p>
      <h1>Editar personaje</h1>
      <SerForm ser={JSON.parse(JSON.stringify(raw))} />
    </section>
  );
}
