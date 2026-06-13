/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import DeleteSerButton from "@/components/DeleteSerButton";
import DownloadCharacterStoryButton from "@/components/DownloadCharacterStoryButton";
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ser } from "@/models/Ser";
import type { SerData } from "@/types/ser";

export const dynamic = "force-dynamic";
const AVENGER_ID = "6946adcc416d4db5855474f3";

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  const user = await currentUser();
  await connectDB();
  const raw = await Ser.findById(id).lean();
  if (!raw) notFound();

  const ser: SerData = JSON.parse(JSON.stringify(raw));
  const facts = [
    ["Tipo", ser.tipo],
    ["Clase", ser.clase?.replaceAll("_", " ")],
    ["Nombre real", ser.nombre_real],
    ["Sexo", ser.sexo],
    ["Lugar", ser.pais_ciudad],
    ["Época", ser.epoca_vida],
    ["Padres", ser.padres?.join(", ")],
    ["Misión", ser.mision],
  ];
  const hasExclusiveContent = Boolean(ser.audio || ser.video || id === AVENGER_ID);
  const loginUrl = `/login?next=${encodeURIComponent(`/seres/${id}`)}`;

  return (
    <section className="section">
      <Link href="/seres">← Volver al archivo</Link>
      {user?.rol === "admin" && (
        <div className="admin-actions">
          <Link className="button" href={`/seres/${id}/editar`}>Editar</Link>
          <DeleteSerButton id={id} />
        </div>
      )}

      <div className="detail" style={{ marginTop: "2rem" }}>
        <img className="portrait" src={ser.imagen || "/images/vampi.png"} alt={ser.nombre_comun} />
        <article>
          <p className="eyebrow">{ser.tipo}</p>
          <h1 className="section-title" style={{ textAlign: "left" }}>{ser.nombre_comun}</h1>
          <div className="facts">
            {facts.filter(([, value]) => value).map(([label, value]) => (
              <div className="fact" key={label}><small>{label}</small>{value}</div>
            ))}
          </div>
          {ser.poderes?.length ? (
            <div className="powers-section">
              <h2>Poderes</h2>
              <ul className="powers-list">{ser.poderes.map((power) => <li key={power}>{power}</li>)}</ul>
            </div>
          ) : null}
        </article>
      </div>

      <article className="panel" style={{ marginTop: "2rem" }}>
        <h2>Biografía</h2>
        <p>{ser.biografia || "La biografía de este personaje todavía está por escribirse."}</p>
      </article>

      {!user && hasExclusiveContent && (
        <section className="panel access-callout character-access-callout">
          <p className="eyebrow">Contenido exclusivo</p>
          <h2>Descubre más sobre {ser.nombre_comun}</h2>
          <p>Los usuarios registrados pueden escuchar sus audios, ver sus videos y descargar documentos exclusivos.</p>
          <div className="admin-actions">
            <Link className="button" href={loginUrl}>Iniciar sesión</Link>
            <Link className="button secondary" href="/registro">Crear cuenta</Link>
          </div>
        </section>
      )}

      {user && ser.audio && (
        <section className="character-audio panel">
          <p className="eyebrow">Archivo de voz</p>
          <h2>La voz de {ser.nombre_comun}</h2>
          <audio controls preload="metadata">
            <source src={ser.audio} />
            Tu navegador no puede reproducir este audio.
          </audio>
        </section>
      )}

      {user && id === AVENGER_ID && (
        <section className="panel character-story-panel">
          <p className="eyebrow">Crónica exclusiva</p>
          <h2>El final de Avenger Vampira</h2>
          <p>Descubre las versiones que rodean el destino final de Avenger y la verdad detrás de su desaparición.</p>
          <DownloadCharacterStoryButton />
        </section>
      )}

      {user && ser.video && (
        <section className="character-video panel">
          <h2>Canción animada de {ser.nombre_comun}</h2>
          <video controls preload="metadata" poster={ser.imagen}>
            <source src={ser.video} type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
        </section>
      )}
    </section>
  );
}
